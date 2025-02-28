import { defineStore } from "pinia";
import { BotStatus, OrderPriority } from "../typings/enums";
import { CookingBot } from "../core/cooking-bot";
import { SimplePriorityQueue } from "../core/queue";
import { Order } from "../core/order";
import { transformBotsToCardProps, transformOrdersToCardProps } from "../lib/transformers";

export const useOrderStore = defineStore('order', {
  state: () => ({
    pendingOrders: [] as Order[],
    processingOrders: [] as Order[],
    completedOrders: [] as Order[],
    bots: [] as CookingBot[],
    processingTimers: new Map(),
    orderQueue: new SimplePriorityQueue<Order>(),
  }),

  getters: {
    totalBots: (state) => state.bots.length,
    pendingOrders: (state) => state.orderQueue.getItems(),
    processingOrders: (state) => state.bots.filter(bot => !!bot.currentOrder).map(bot => bot.currentOrder),
    idleBots: (state) => state.bots.filter(bot => bot.status === BotStatus.IDLE),
    botCards: (state) => transformBotsToCardProps(state.bots),
    pendingOrderCards: (state) => [
      ...transformOrdersToCardProps(state.processingOrders),
      ...transformOrdersToCardProps(state.pendingOrders)],
    completedOrderCards: (state) => transformOrdersToCardProps(state.completedOrders),
  },

  actions: {
    addNormalOrder() {
      const order = new Order({
        priority: OrderPriority.LOW,
      });
      this.orderQueue.enqueue(order);
      this.processNextOrder();
    },

    addVIPOrder() {
      const order = new Order({
        priority: OrderPriority.HIGH,
      });
      this.orderQueue.enqueue(order);
      this.processNextOrder();
    },

    addBot() {
      const bot = new CookingBot();

      this.bots.push(bot);
      this.processNextOrder();
    },

    removeBot() {
      if (this.bots.length === 0) return null;

      const botToRemove = this.bots[this.bots.length - 1];
      this.bots.pop();

      if (botToRemove.isProcessing() && !!botToRemove.currentOrder) {
        this.orderQueue.enqueue(botToRemove.currentOrder);
        botToRemove.stop();
        // To check if there is any idle bots to process this order
        this.processNextOrder();
      }
    },

    processNextOrder() {
      if (this.orderQueue.isEmpty()) return;

      const idleBot = this.idleBots[0];
      if (!idleBot) return;

      const nextOrder = this.orderQueue.dequeue();
      if (!nextOrder) return;

      idleBot.processOrder(nextOrder, this.handleCompleteOrder.bind(this));

    },

    handleCompleteOrder(order: Order) {
      this.completedOrders.push(order);

      this.processNextOrder();
    }
  }
})

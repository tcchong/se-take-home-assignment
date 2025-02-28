import type { CookingBot } from "../core/cooking-bot";
import type { Order } from "../core/order";


export const transformBotsToCardProps = (bots: CookingBot[]) => {
  return bots.map(bot => ({
    title: `Bot ${bot.id}`,
    description: bot.currentOrder ? `Processing Order ${bot.currentOrder.id}` : "Idle",
    status: bot.status as string,
  }));
}

export const transformOrdersToCardProps = (orders: Order[]) => {
  return orders.map(order => ({
    title: `Order ${order.id}`,
    description: `Priority ${order.priority}`,
    status: order.status,
  }));
}

import { BotStatus } from "../typings/enums";

import type { Order } from "./order";

const DEFAULT_PROCESSING_TIME = 10 * 1000; // 10 seconds

export class CookingBot {
  static nextId = 1;

  id: number;
  status: BotStatus;
  currentOrder: Order | null;
  processingTime: number;
  timeoutId: ReturnType<typeof setTimeout> | null;

  constructor({ processingTime }: { processingTime: number } = { processingTime: DEFAULT_PROCESSING_TIME }) {
    this.id = CookingBot.nextId++;
    this.status = BotStatus.IDLE;
    this.currentOrder = null;
    this.processingTime = processingTime;
    this.timeoutId = null;
  }

  isProcessing() {
    return this.status === BotStatus.PROCESSING;
  }

  processOrder(order: Order, onComplete: (order: Order, bot: CookingBot) => void) {
    if (this.isProcessing()) {
      return;
    }

    this.status = BotStatus.PROCESSING;
    this.currentOrder = order;

    this.timeoutId = setTimeout(() => {
      const currentOrder = this.currentOrder;

      this.currentOrder = null;
      this.status = BotStatus.IDLE;
      if (currentOrder) {
        onComplete(currentOrder, this);
      }
    }, this.processingTime);
  }

  stop() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }

    this.status = BotStatus.IDLE;
    this.currentOrder = null;
  }
}

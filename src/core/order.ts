import { OrderStatus, OrderPriority } from "../typings/enums";

export class Order {
  static nextId = 1;

  id: number;
  status: OrderStatus;
  priority: OrderPriority;
  insertOrder: number;

  constructor({ priority, status = OrderStatus.PENDING }: { priority: OrderPriority, status?: OrderStatus }) {
    this.id = Order.nextId++;
    this.status = status;
    this.priority = priority
    this.insertOrder = 0;
  }
}

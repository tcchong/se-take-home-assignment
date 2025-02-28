export class SimplePriorityQueue<T extends { id: number | string, priority: number, insertOrder: number }> {
  private queue: T[] = [];
  private insertOrder = 0;

  constructor() {
    this.queue = [];
  }

  enqueue(item: T) {
    const itemWithCounter = { ...item, insertOrder: this.insertOrder++ };
    this.queue.push(itemWithCounter);
    this.queue.sort((a, b) => {
      if (a.priority !== b.priority) {
        return b.priority - a.priority; // Descending priority
      }
      return a.insertOrder - b.insertOrder; // FIFO for equal priority
    });
  }

  dequeue(): T | undefined {
    const order = this.queue.shift();

    return order;
  }

  isEmpty(): boolean {
    return this.queue.length === 0;
  }

  size(): number {
    return this.queue.length;
  }

  getItems(): T[] {
    return [...this.queue];
  }
}

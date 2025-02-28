export class SimplePriorityQueue<T extends { id: number | string, priority: number, insertTime: number }> {
  private queue: T[] = [];

  constructor() {
    this.queue = [];
  }

  enqueue(item: T) {
    this.queue.push(item);
    this.queue.sort((a, b) => {
      if (a.priority !== b.priority) {
        return b.priority - a.priority; // Descending priority
      }
      return a.insertTime - b.insertTime; // FIFO for equal priority
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

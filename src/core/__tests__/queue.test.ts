import { SimplePriorityQueue } from '../queue';

interface TestItem {
  id: number | string;
  priority: number;
  insertTime: number;
}

describe('SimplePriorityQueue', () => {
  let queue: SimplePriorityQueue<TestItem>;

  beforeEach(() => {
    queue = new SimplePriorityQueue<TestItem>();
  });

  describe('constructor', () => {
    it('should initialize an empty queue', () => {
      expect(queue.isEmpty()).toBe(true);
      expect(queue.size()).toBe(0);
      expect(queue.getItems()).toEqual([]);
    });
  });

  describe('enqueue', () => {
    it('should add an item to the queue', () => {
      const item: TestItem = { id: 1, priority: 1, insertTime: 0 };
      queue.enqueue(item);
      expect(queue.size()).toBe(1);
      expect(queue.getItems()).toContainEqual(item);
    });

    it('should sort items by priority in descending order', () => {
      const item1: TestItem = { id: 1, priority: 1, insertTime: 0 };
      const item2: TestItem = { id: 2, priority: 3, insertTime: 1 };
      const item3: TestItem = { id: 3, priority: 2, insertTime: 2 };

      queue.enqueue(item1);
      queue.enqueue(item2);
      queue.enqueue(item3);

      const items = queue.getItems();
      expect(items[0]).toEqual(item2); // Highest priority
      expect(items[1]).toEqual(item3); // Middle priority
      expect(items[2]).toEqual(item1); // Lowest priority
    });

    it('should maintain order for items with same priority', () => {
      const item1: TestItem = { id: 1, priority: 2, insertTime: 0 };
      const item2: TestItem = { id: 2, priority: 2, insertTime: 1 };

      queue.enqueue(item1);
      queue.enqueue(item2);

      const items = queue.getItems();
      expect(items.findIndex(i => i.id === 1)).toBeLessThan(items.findIndex(i => i.id === 2));
    });
  });

  describe('dequeue', () => {
    it('should remove and return the highest priority item', () => {
      const item1: TestItem = { id: 1, priority: 1, insertTime: 0 };
      const item2: TestItem = { id: 2, priority: 3, insertTime: 1 };
      const item3: TestItem = { id: 3, priority: 2, insertTime: 2 };

      queue.enqueue(item1);
      queue.enqueue(item2);
      queue.enqueue(item3);

      const dequeuedItem = queue.dequeue();
      expect(dequeuedItem).toEqual(item2); // Highest priority
      expect(queue.size()).toBe(2);
      expect(queue.getItems()).not.toContainEqual(item2);
    });

    it('should return undefined if queue is empty', () => {
      expect(queue.dequeue()).toBeUndefined();
    });

    it('should correctly update size after dequeue', () => {
      queue.enqueue({ id: 1, priority: 1, insertTime: 0 });
      queue.dequeue();
      expect(queue.size()).toBe(0);
      expect(queue.isEmpty()).toBe(true);
    });
  });

  describe('isEmpty', () => {
    it('should return true when queue is empty', () => {
      expect(queue.isEmpty()).toBe(true);
    });

    it('should return false when queue has items', () => {
      queue.enqueue({ id: 1, priority: 1, insertTime: 0 });
      expect(queue.isEmpty()).toBe(false);
    });

    it('should return true after all items are dequeued', () => {
      queue.enqueue({ id: 1, priority: 1, insertTime: 0 });
      queue.dequeue();
      expect(queue.isEmpty()).toBe(true);
    });
  });

  describe('size', () => {
    it('should return 0 for empty queue', () => {
      expect(queue.size()).toBe(0);
    });

    it('should return correct count of enqueued items', () => {
      queue.enqueue({ id: 1, priority: 1, insertTime: 0 });
      queue.enqueue({ id: 2, priority: 2, insertTime: 1 });
      expect(queue.size()).toBe(2);
    });

    it('should update size correctly after operations', () => {
      queue.enqueue({ id: 1, priority: 1, insertTime: 0 });
      queue.enqueue({ id: 2, priority: 2, insertTime: 1 });
      queue.dequeue();
      expect(queue.size()).toBe(1);
      queue.enqueue({ id: 3, priority: 3, insertTime: 2 });
      expect(queue.size()).toBe(2);
    });
  });

  describe('getItems', () => {
    it('should return empty array for empty queue', () => {
      expect(queue.getItems()).toEqual([]);
    });

    it('should return all items in priority order', () => {
      const item1: TestItem = { id: 1, priority: 1, insertTime: 0 };
      const item2: TestItem = { id: 2, priority: 3, insertTime: 1 };
      const item3: TestItem = { id: 3, priority: 2, insertTime: 2 };

      queue.enqueue(item1);
      queue.enqueue(item2);
      queue.enqueue(item3);

      expect(queue.getItems()).toEqual([item2, item3, item1]);
    });

    // Test case for equal priority items
    it('should return all items in insertion order for same priority', () => {
      const item1: TestItem = { id: 1, priority: 2, insertTime: 0 };
      const item2: TestItem = { id: 2, priority: 2, insertTime: 1 };

      queue.enqueue(item1);
      queue.enqueue(item2);

      expect(queue.getItems()).toEqual([item1, item2]);
    });

    it('should return a copy of items to prevent external modification', () => {
      const item: TestItem = { id: 1, priority: 1, insertTime: 0 };
      queue.enqueue(item);

      const items = queue.getItems();
      items.pop();
      expect(queue.size()).toBe(1); // Queue should still have the item
    });
  });
});

import { CookingBot } from '../cooking-bot';
import { Order } from '../order';
import { BotStatus, OrderPriority } from '../../typings/enums';

describe('CookingBot', () => {
  // Reset the static counter before each test
  beforeEach(() => {
    jest.useFakeTimers(); // Mock timer functions
  });

  afterEach(() => {
    jest.useRealTimers(); // Restore real timers
  });

  describe('initialize', () => {
    it('should initialize with correct default values', () => {
      const bot = new CookingBot({ processingTime: 1000 });
      const bot2 = new CookingBot();

      expect(bot.id).toBe(1);
      expect(bot.status).toBe(BotStatus.IDLE);
      expect(bot.currentOrder).toBeNull();
      expect(bot.processingTime).toBe(1000);
      expect(bot.timeoutId).toBeNull();

      // should increment ID for each new bot
      expect(bot2.id).toBe(2);
    });
  });

  describe('isProcessing', () => {
    it('should return false when status is IDLE', () => {
      const bot = new CookingBot();
      bot.status = BotStatus.IDLE;

      expect(bot.isProcessing()).toBe(false);
    });

    it('should return true when status is PROCESSING', () => {
      const bot = new CookingBot();
      bot.status = BotStatus.PROCESSING;

      expect(bot.isProcessing()).toBe(true);
    });
  });

  describe('processOrder', () => {
    it('should set status to PROCESSING and store the order', () => {
      const bot = new CookingBot();
      const order = new Order({ priority: OrderPriority.LOW });
      const onComplete = jest.fn();

      bot.processOrder(order, onComplete);

      expect(bot.status).toBe(BotStatus.PROCESSING);
      expect(bot.currentOrder).toBe(order);
      expect(bot.timeoutId).not.toBeNull();
    });

    it('should do nothing when already processing', () => {
      const bot = new CookingBot();
      const firstOrder = new Order({ priority: OrderPriority.LOW });
      const secondOrder = new Order({ priority: OrderPriority.HIGH });
      const onComplete = jest.fn();

      bot.processOrder(firstOrder, onComplete);
      const firstTimeoutId = bot.timeoutId;

      bot.processOrder(secondOrder, onComplete);

      expect(bot.currentOrder).toBe(firstOrder); // Still the first order
      expect(bot.timeoutId).toBe(firstTimeoutId); // Same timeout ID
    });

    it('should call onComplete callback after timeout', () => {
      const bot = new CookingBot({ processingTime: 3000 });
      const order = new Order({ priority: OrderPriority.LOW });
      const onComplete = jest.fn();

      bot.processOrder(order, onComplete);

      // Fast-forward time
      jest.advanceTimersByTime(3000);

      expect(onComplete).toHaveBeenCalledWith(order, bot);
      expect(bot.status).toBe(BotStatus.IDLE);
      expect(bot.currentOrder).toBeNull();
    });

    it('should reset state after order completion', () => {
      const bot = new CookingBot({ processingTime: 3000 });
      const order = new Order({ priority: OrderPriority.LOW });
      const onComplete = jest.fn();

      bot.processOrder(order, onComplete);
      jest.advanceTimersByTime(3000);

      expect(bot.status).toBe(BotStatus.IDLE);
      expect(bot.currentOrder).toBeNull();
    });
  });

  describe('stop', () => {
    it('should clear timeout and reset state', () => {
      const bot = new CookingBot({ processingTime: 3000 });
      const order = new Order({ priority: OrderPriority.LOW });
      const onComplete = jest.fn();

      bot.processOrder(order, onComplete);

      // Spy on clearTimeout
      const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');

      bot.stop();

      expect(clearTimeoutSpy).toHaveBeenCalled();
      expect(bot.status).toBe(BotStatus.IDLE);
      expect(bot.currentOrder).toBeNull();
      expect(bot.timeoutId).toBeNull();

      // Fast-forward time to ensure callback isn't called
      jest.advanceTimersByTime(3000);
      expect(onComplete).not.toHaveBeenCalled();

      clearTimeoutSpy.mockRestore();
    });

    it('should do nothing if no timeout is active', () => {
      const bot = new CookingBot({ processingTime: 3000 });

      // Spy on clearTimeout
      const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');

      bot.stop();

      expect(clearTimeoutSpy).not.toHaveBeenCalled();

      clearTimeoutSpy.mockRestore();
    });
  });
});

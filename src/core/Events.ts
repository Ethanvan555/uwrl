/**
 * Typed event system for UWRL resilience changes.
 * Uses a simple publish-subscribe pattern.
 */

export type EventPayload<T extends string, V> = {
  [K in T]: V;
}[T];

export interface EventSubscription<T extends string, V> {
  key: T;
  handler: (payload: V) => void;
}

/**
 * Event manager for resilience state changes.
 */
export class EventManager {
  private static instance: EventManager | null = null;
  private subscriptions: Map<string, Array<EventSubscription<any, any>>>;

  private constructor() {
    this.subscriptions = new Map();
  }

  public static getInstance(): EventManager {
    if (!EventManager.instance) {
      EventManager.instance = new EventManager();
    }
    return EventManager.instance;
  }

  /**
   * Reset the manager to initial state.
   */
  public static reset(): void {
    EventManager.instance = null;
  }

  /**
   * Subscribe to an event.
   */
  public subscribe<T extends string, V>(
    key: T,
    handler: (payload: V) => void,
  ): () => void {
    if (!this.subscriptions.has(key)) {
      this.subscriptions.set(key, []);
    }
    const subscription: EventSubscription<T, V> = { key, handler };
    this.subscriptions.get(key)!.push(subscription);
    
    return () => {
      const list = this.subscriptions.get(key);
      if (list) {
        const index = list.findIndex(s => s.key === key);
        if (index !== -1) {
          list.splice(index, 1);
        }
      }
    };
  }

  /**
   * Emit an event.
   */
  public emit<T extends string, V>(key: T, payload: V): void {
    const list = this.subscriptions.get(key);
    if (list) {
      for (const sub of list) {
        try {
          sub.handler(payload as any);
        } catch (error) {
          // Silently fail event handlers to avoid breaking the main flow
        }
      }
    }
  }

  /**
   * Clear all subscriptions.
   */
  public clear(): void {
    this.subscriptions.clear();
  }
}
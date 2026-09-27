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
export declare class EventManager {
    private static instance;
    private subscriptions;
    subs: Array<EventSubscription<any, any>>;
    private constructor();
    static getInstance(): EventManager;
    /**
     * Reset the manager to initial state.
     */
    static reset(): void;
    /**
     * Subscribe to an event (alias for on).
     */
    subscribe<T extends string, V>(key: T, handler: (payload: V) => void): () => void;
    /**
     * Subscribe to an event.
     */
    on<T extends string, V>(key: T, handler: (payload: V) => void): () => void;
    /**
     * Emit an event.
     */
    emit<T extends string, V>(key: T, payload: V): void;
    /**
     * Emit an event (static wrapper for singleton access).
     */
    static emit<T extends string, V>(key: T, payload: V): void;
    /**
     * Subscribe to an event (static wrapper for singleton access).
     */
    static on<T extends string, V>(key: T, handler: (payload: V) => void): () => void;
}
//# sourceMappingURL=Events.d.ts.map
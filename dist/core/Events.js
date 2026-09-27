"use strict";
/**
 * Typed event system for UWRL resilience changes.
 * Uses a simple publish-subscribe pattern.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventManager = void 0;
/**
 * Event manager for resilience state changes.
 */
class EventManager {
    static instance = null;
    subscriptions;
    subs = [];
    constructor() {
        this.subscriptions = new Map();
    }
    static getInstance() {
        if (!EventManager.instance) {
            EventManager.instance = new EventManager();
        }
        return EventManager.instance;
    }
    /**
     * Reset the manager to initial state.
     */
    static reset() {
        EventManager.instance = null;
    }
    /**
     * Subscribe to an event (alias for on).
     */
    subscribe(key, handler) {
        if (!this.subscriptions.has(key)) {
            this.subscriptions.set(key, []);
        }
        const subscription = { key, handler };
        this.subscriptions.get(key).push(subscription);
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
     * Subscribe to an event.
     */
    on(key, handler) {
        return this.subscribe(key, handler);
    }
    /**
     * Emit an event.
     */
    emit(key, payload) {
        const list = this.subscriptions.get(key);
        if (list) {
            for (const sub of list) {
                try {
                    sub.handler(payload);
                }
                catch (error) {
                    // Silently fail event handlers to avoid breaking the main flow
                }
            }
        }
    }
    /**
     * Emit an event (static wrapper for singleton access).
     */
    static emit(key, payload) {
        this.getInstance().emit(key, payload);
    }
    /**
     * Subscribe to an event (static wrapper for singleton access).
     */
    static on(key, handler) {
        return this.getInstance().subscribe(key, handler);
    }
}
exports.EventManager = EventManager;
//# sourceMappingURL=Events.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FallbackManager = void 0;
const State_1 = require("../core/State");
const Events_1 = require("../core/Events");
const Diagnostics_1 = require("../core/Diagnostics");
/**
 * Fallback manager for handling resource failures.
 */
class FallbackManager {
    static instance = null;
    fallbacks;
    currentLevel;
    constructor() {
        this.fallbacks = new Map();
        this.currentLevel = 0;
    }
    static getInstance() {
        if (!FallbackManager.instance) {
            FallbackManager.instance = new FallbackManager();
        }
        return FallbackManager.instance;
    }
    /**
     * Register a fallback source.
     */
    register(key, entry) {
        if (!this.fallbacks.has(key)) {
            this.fallbacks.set(key, []);
        }
        this.fallbacks.get(key).push(entry);
    }
    /**
     * Register multiple fallback sources.
     */
    registerBatch(key, entries) {
        if (!this.fallbacks.has(key)) {
            this.fallbacks.set(key, []);
        }
        this.fallbacks.get(key).push(...entries);
    }
    /**
     * Get fallback sources for a key.
     */
    getFallbacks(key) {
        return this.fallbacks.get(key);
    }
    /**
     * Select the next available fallback.
     */
    select(key, data) {
        const fallbacks = this.fallbacks.get(key);
        if (!fallbacks || fallbacks.length === 0) {
            return null;
        }
        // Sort by priority (lower = higher priority)
        const sorted = [...fallbacks].sort((a, b) => a.priority - b.priority);
        // Try from highest to lowest priority
        for (const entry of sorted) {
            this.currentLevel = 0;
            return {
                success: true,
                source: entry.source,
                fallbackLevel: 0,
                data,
            };
        }
        return null;
    }
    /**
     * Increment fallback level (for progressive enhancement).
     */
    incrementFallbackLevel() {
        this.currentLevel++;
    }
    /**
     * Get current fallback level.
     */
    getFallbackLevel() {
        return this.currentLevel;
    }
    /**
     * Reset to the beginning.
     */
    reset() {
        this.currentLevel = 0;
    }
    /**
     * Clear all fallbacks.
     */
    clear() {
        this.fallbacks.clear();
        this.currentLevel = 0;
        State_1.StateManager.getInstance().set('fallbackLevel', 0);
    }
    /**
     * Handle a failure and trigger the next fallback attempt.
     */
    handleFailure(key, error) {
        Diagnostics_1.Diagnostics.getInstance().log('failure', 'warn', `Fallback level ${this.currentLevel}: ${error || 'unknown'}`, { key });
        if (this.currentLevel < this.fallbacks.get(key)?.length || 0) {
            this.incrementFallbackLevel();
            Events_1.Events.emit('fallback-level-changed', { key, level: this.currentLevel });
        }
        else {
            Diagnostics_1.Diagnostics.getInstance().log('failure', 'error', `No more fallbacks available for ${key}`, { key, error });
            Events_1.Events.emit('fallback-exhausted', { key, error });
        }
    }
}
exports.FallbackManager = FallbackManager;
//# sourceMappingURL=FallbackManager.js.map
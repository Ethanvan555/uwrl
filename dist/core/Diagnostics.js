"use strict";
/**
 * Structured diagnostic/logging for UWRL.
 * Tracks which boundaries were detected and strategies tried.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiagnosticsManager = void 0;
/**
 * Diagnostics manager for UWRL resilience tracking.
 */
class DiagnosticsManager {
    static instance = null;
    entries;
    maxEntries;
    constructor() {
        this.entries = [];
        this.maxEntries = 1000;
    }
    static getInstance() {
        if (!DiagnosticsManager.instance) {
            DiagnosticsManager.instance = new DiagnosticsManager();
        }
        return DiagnosticsManager.instance;
    }
    /**
     * Reset the manager to initial state.
     */
    static reset() {
        DiagnosticsManager.instance = null;
    }
    /**
     * Record a diagnostic entry.
     */
    log(category, level, message, context) {
        const entry = {
            timestamp: Date.now(),
            category,
            level,
            message,
            context,
        };
        this.entries.push(entry);
        if (this.entries.length > this.maxEntries) {
            this.entries.shift();
        }
        return entry;
    }
    /**
     * Record a diagnostic entry (static wrapper for singleton access).
     */
    static log(category, level, message, context) {
        return this.getInstance().log(category, level, message, context);
    }
    /**
     * Get all entries.
     */
    getEntries() {
        return [...this.entries];
    }
    /**
     * Get recent entries.
     */
    getRecent(count) {
        return this.entries.slice(-count);
    }
    /**
     * Get messages (alias for getEntries).
     */
    getMessages() {
        return this.getEntries();
    }
    /**
     * Get messages (static wrapper for singleton access).
     */
    static getMessages() {
        const instance = this.getInstance();
        return instance.getMessages();
    }
    /**
     * Clear all entries.
     */
    clear() {
        this.entries = [];
    }
    /**
     * Log a boundary detection event.
     */
    logBoundaryDetection(category, context) {
        this.log('boundary', 'info', `Detected ${category}`, context);
    }
    /**
     * Log a strategy attempt.
     */
    logStrategyAttempt(strategy, success, context) {
        const level = success ? 'info' : 'warn';
        this.log('strategy', level, `Attempted ${strategy}: ${success ? 'success' : 'failed'}`, context);
    }
}
exports.DiagnosticsManager = DiagnosticsManager;
//# sourceMappingURL=Diagnostics.js.map
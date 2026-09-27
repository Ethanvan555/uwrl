"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StateManager = void 0;
const State_1 = require("./State");
const Events_1 = require("./Events");
/**
 * State manager for UWRL.
 */
class StateManager {
    static instance = null;
    storage;
    summary;
    constructor() {
        this.storage = new Map();
        this.summary = {};
    }
    static getInstance() {
        if (!StateManager.instance) {
            StateManager.instance = new StateManager();
        }
        return StateManager.instance;
    }
    /**
     * Reset the manager to initial state.
     */
    static reset() {
        StateManager.instance = null;
    }
    /**
     * Set a value in storage (static wrapper for singleton access).
     */
    static set(key, value) {
        this.getInstance().set(key, value);
    }
    /**
     * Set a value in storage.
     */
    set(key, value) {
        this.storage.set(key, value);
    }
    /**
     * Get a value from storage.
     */
    get(key) {
        return this.storage.get(key);
    }
    /**
     * Record a boundary bypass.
     */
    recordBypass(boundary) {
        const current = this.storage.get('bypassedBoundaries') || new Map();
        current.set(boundary, true);
        this.storage.set('bypassedBoundaries', current);
        Events_1.EventManager.getInstance().emit('boundary-bypassed', { boundary });
    }
    /**
     * Record a boundary bypass (static wrapper for singleton access).
     */
    static recordBypass(boundary) {
        this.getInstance().recordBypass(boundary);
    }
    /**
     * Get state object with bypassed boundaries and current state.
     */
    get() {
        const stored = this.storage.get('bypassedBoundaries') || new Map();
        // Return structured State interface with bypassedBoundaries property and recordBypass method
        return {
            bypassedBoundaries: stored,
            recordBypass: (boundary) => this.recordBypass(boundary),
        };
    }
    /**
     * Get state object (static wrapper for singleton access).
     */
    static get() {
        const instance = this.getInstance();
        const stored = instance.storage.get('bypassedBoundaries') || new Map();
        // Return structured State interface with bypassedBoundaries property and recordBypass method
        return {
            bypassedBoundaries: stored,
            recordBypass: (boundary) => instance.recordBypass(boundary),
        };
    }
    /**
     * Get bypassed boundaries set.
     */
    getBypassedBoundaries() {
        const stored = this.storage.get('bypassedBoundaries');
        return (stored instanceof Map) ? stored : new Map();
    }
    /**
     * Get bypassed boundaries set (static wrapper for singleton access).
     */
    static getBypassedBoundaries() {
        const instance = this.getInstance();
        return instance.getBypassedBoundaries();
    }
}
exports.StateManager = StateManager;
//# sourceMappingURL=State.js.map
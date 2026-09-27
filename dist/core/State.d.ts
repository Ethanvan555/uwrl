import { State } from './State';
/**
 * State for UWRL.
 */
export interface State {
    bypassedBoundaries: Map<string, boolean>;
    /**
     * Record a boundary bypass event.
     */
    recordBypass(boundary: string): void;
}
/**
 * State manager for UWRL.
 */
export declare class StateManager {
    private static instance;
    private storage;
    private summary;
    private constructor();
    static getInstance(): StateManager;
    /**
     * Reset the manager to initial state.
     */
    static reset(): void;
    /**
     * Set a value in storage (static wrapper for singleton access).
     */
    static set<T>(key: string, value: T): void;
    /**
     * Set a value in storage.
     */
    set<T>(key: string, value: T): void;
    /**
     * Record a boundary bypass.
     */
    recordBypass(boundary: string): void;
    /**
     * Record a boundary bypass (static wrapper for singleton access).
     */
    static recordBypass(boundary: string): void;
    /**
     * Get state object (static wrapper for singleton access).
     */
    static get(): State;
    /**
     * Get bypassed boundaries set.
     */
    getBypassedBoundaries(): Map<string, boolean>;
    /**
     * Get bypassed boundaries set (static wrapper for singleton access).
     */
    static getBypassedBoundaries(): Map<string, boolean>;
}
//# sourceMappingURL=State.d.ts.map
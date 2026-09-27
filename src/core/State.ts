import { Events } from './Events';

export interface StateRecord {
  key: string;
  value: unknown;
}

/**
 * Runtime resilience state tracking for UWRL.
 * Tracks which boundaries were detected, strategies tried, and current status.
 */
export class StateManager {
  private static instance: StateManager | null = null;
  private storage: Map<string, unknown>;
  private summary: Record<string, unknown> = {};

  private constructor() {
    this.storage = new Map();
  }

  public static getInstance(): StateManager {
    if (!StateManager.instance) {
      StateManager.instance = new StateManager();
    }
    return StateManager.instance;
  }

  /**
   * Reset the manager to initial state.
   */
  public static reset(): void {
    StateManager.instance = null;
  }

  /**
   * Get state object with bypassed boundaries and current state.
   */
  public get(): State {
    if (!this.summary.state) {
      this.summary.state = new Map(this.storage);
    }
    
    if (!this.summary.bypassedBoundaries) {
      const stored = this.storage.get('bypassedBoundaries');
      this.summary.bypassedBoundaries = stored instanceof Map ? stored : new Map();
    }
    
    return this.summary.state as State;
  }

  /**
   * Set a state value.
   */
  public set<T>(key: string, value: T): void {
    this.storage.set(key, value);
    Events.emit('state-changed', { key, value });
  }

  /**
   * Check if a state key exists.
   */
  public has(key: string): boolean {
    return this.storage.has(key);
  }

  /**
   * Delete a state value.
   */
  public delete(key: string): boolean {
    const deleted = this.storage.delete(key);
    if (deleted) {
      Events.emit('state-changed', { key, value: undefined });
    }
    return deleted;
  }

  /**
   * Clear all state.
   */
  public clear(): void {
    const keys = Array.from(this.storage.keys());
    keys.forEach(key => this.storage.delete(key));
  }

  /**
   * Get all state records.
   */
  public getAll(): StateRecord[] {
    return Array.from(this.storage.entries()).map(([key, value]) => ({
      key,
      value,
    }));
  }

  /**
   * Record a boundary bypass.
   */
  public recordBypass(boundary: string): void {
    const current = this.storage.get('bypassedBoundaries') as Map<string, boolean> || new Map();
    current.set(boundary, true);
    this.storage.set('bypassedBoundaries', current);
    Events.emit('boundary-bypassed', { boundary });
  }

  /**
   * Get bypassed boundaries set.
   */
  public getBypassedBoundaries(): Map<string, boolean> {
    const stored = this.storage.get('bypassedBoundaries');
    return (stored instanceof Map) ? stored : new Map();
  }
}

/**
 * State object returned by State.get().
 */
export interface State {
  bypassedBoundaries: Map<string, boolean>;
}
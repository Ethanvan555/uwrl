import { State } from './State';
import { EventManager as Events } from './Events';

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
export class StateManager {
  private static instance: StateManager | null = null;
  private storage: Map<string, unknown>;
  private summary: {
    state?: State;
    bypassedBoundaries?: Map<string, boolean>;
  };

  private constructor() {
    this.storage = new Map();
    this.summary = {};
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
   * Set a value in storage (static wrapper for singleton access).
   */
  public static set<T>(key: string, value: T): void {
    this.getInstance().set(key, value);
  }

  /**
   * Set a value in storage.
   */
  public set<T>(key: string, value: T): void {
    this.storage.set(key, value);
  }

  /**
   * Get a value from storage.
   */
  public get<T>(key: string): T | undefined {
    return this.storage.get(key);
  }

  /**
   * Record a boundary bypass.
   */
  public recordBypass(boundary: string): void {
    const current = this.storage.get('bypassedBoundaries') as Map<string, boolean> || new Map();
    current.set(boundary, true);
    this.storage.set('bypassedBoundaries', current);
    Events.getInstance().emit('boundary-bypassed', { boundary });
  }

  /**
   * Record a boundary bypass (static wrapper for singleton access).
   */
  public static recordBypass(boundary: string): void {
    this.getInstance().recordBypass(boundary);
  }

  /**
   * Get state object with bypassed boundaries and current state.
   */
  public get(): State {
    const stored = this.storage.get('bypassedBoundaries') as Map<string, boolean> || new Map();
    
    // Return structured State interface with bypassedBoundaries property and recordBypass method
    return {
      bypassedBoundaries: stored,
      recordBypass: (boundary: string) => this.recordBypass(boundary),
    };
  }

  /**
   * Get state object (static wrapper for singleton access).
   */
  public static get(): State {
    const instance = this.getInstance();
    const stored = instance.storage.get('bypassedBoundaries') as Map<string, boolean> || new Map();
    
    // Return structured State interface with bypassedBoundaries property and recordBypass method
    return {
      bypassedBoundaries: stored,
      recordBypass: (boundary: string) => instance.recordBypass(boundary),
    };
  }

  /**
   * Get bypassed boundaries set.
   */
  public getBypassedBoundaries(): Map<string, boolean> {
    const stored = this.storage.get('bypassedBoundaries');
    return (stored instanceof Map) ? stored : new Map();
  }

  /**
   * Get bypassed boundaries set (static wrapper for singleton access).
   */
  public static getBypassedBoundaries(): Map<string, boolean> {
    const instance = this.getInstance();
    return instance.getBypassedBoundaries();
  }
}
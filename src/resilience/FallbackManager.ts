import { StateManager } from '../core/State';
import { Events } from '../core/Events';
import { Diagnostics } from '../core/Diagnostics';

/**
 * Fallback selection and failure handling for UWRL.
 * Manages multiple fallback sources with progressive enhancement.
 */

export interface FallbackEntry<T> {
  priority: number;
  source: string;
  type: 'cdn' | 'local' | 'proxy' | 'direct';
  data?: T;
}

export interface FallbackResult<T> {
  success: boolean;
  source: string;
  fallbackLevel: 0 | 1 | 2;
  data?: T;
  error?: string;
}

/**
 * Fallback manager for handling resource failures.
 */
export class FallbackManager {
  private static instance: FallbackManager | null = null;
  private fallbacks: Map<string, Array<FallbackEntry<any>>>;
  private currentLevel: number;

  private constructor() {
    this.fallbacks = new Map();
    this.currentLevel = 0;
  }

  public static getInstance(): FallbackManager {
    if (!FallbackManager.instance) {
      FallbackManager.instance = new FallbackManager();
    }
    return FallbackManager.instance;
  }

  /**
   * Register a fallback source.
   */
  public register<T>(key: string, entry: FallbackEntry<T>): void {
    if (!this.fallbacks.has(key)) {
      this.fallbacks.set(key, []);
    }
    this.fallbacks.get(key)!.push(entry);
  }

  /**
   * Register multiple fallback sources.
   */
  public registerBatch<T>(key: string, entries: Array<FallbackEntry<T>>): void {
    if (!this.fallbacks.has(key)) {
      this.fallbacks.set(key, []);
    }
    this.fallbacks.get(key)!.push(...entries);
  }

  /**
   * Get fallback sources for a key.
   */
  public getFallbacks<T>(key: string): Array<FallbackEntry<T>> | undefined {
    return this.fallbacks.get(key);
  }

  /**
   * Select the next available fallback.
   */
  public select<T>(key: string, data: T): FallbackResult<T> | null {
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
  public incrementFallbackLevel(): void {
    this.currentLevel++;
  }

  /**
   * Get current fallback level.
   */
  public getFallbackLevel(): number {
    return this.currentLevel;
  }

  /**
   * Reset to the beginning.
   */
  public reset(): void {
    this.currentLevel = 0;
  }

  /**
   * Clear all fallbacks.
   */
  public clear(): void {
    this.fallbacks.clear();
    this.currentLevel = 0;
    StateManager.getInstance().set('fallbackLevel', 0);
  }

  /**
   * Handle a failure and trigger the next fallback attempt.
   */
  public handleFailure<T>(key: string, error?: string): void {
    Diagnostics.getInstance().log('failure', 'warn', `Fallback level ${this.currentLevel}: ${error || 'unknown'}`, { key });
    
    if (this.currentLevel < this.fallbacks.get(key)?.length || 0) {
      this.incrementFallbackLevel();
      Events.emit('fallback-level-changed', { key, level: this.currentLevel });
    } else {
      Diagnostics.getInstance().log('failure', 'error', `No more fallbacks available for ${key}`, { key, error });
      Events.emit('fallback-exhausted', { key, error });
    }
  }
}
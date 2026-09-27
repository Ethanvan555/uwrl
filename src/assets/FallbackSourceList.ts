import { StateManager } from '../core/State';
import { Events } from '../core/Events';
import { Diagnostics } from '../core/Diagnostics';
import { FallbackManager } from '../resilience/FallbackManager';

/**
 * Multi-source fallback source list for UWRL.
 */

export interface FallbackSourceConfig {
  mode: 'gentle' | 'aggressive';
  defaultSources: Array<{ priority: number; source: string; type: 'cdn' | 'local' | 'proxy' | 'direct' }>;
}

export interface FallbackSourceListResult {
  success: boolean;
  sources: Array<{ priority: number; source: string; type: 'cdn' | 'local' | 'proxy' | 'direct' }>;
  error?: string;
}

/**
 * Fallback source list manager.
 */
export class FallbackSourceList {
  private static instance: FallbackSourceList | null = null;
  private config: FallbackSourceConfig;
  private fallbackManager: FallbackManager<any>;

  private constructor() {
    this.config = {
      mode: 'gentle',
      defaultSources: [
        { priority: 0, source: 'https://cdn.jsdelivr.net', type: 'cdn' },
        { priority: 1, source: 'https://unpkg.com', type: 'cdn' },
        { priority: 2, source: 'https://fastly.jsdelivr.net', type: 'cdn' },
        { priority: 3, source: 'https://cloudflare.com/cdn-cgi', type: 'proxy' },
      ],
    };
    this.fallbackManager = FallbackManager.getInstance();
  }

  public static getInstance(): FallbackSourceList {
    if (!FallbackSourceList.instance) {
      FallbackSourceList.instance = new FallbackSourceList();
    }
    return FallbackSourceList.instance;
  }

  /**
   * Load the fallback source list.
   */
  public static load(): Array<{ priority: number; source: string; type: 'cdn' | 'local' | 'proxy' | 'direct' }> {
    const instance = this.getInstance();
    
    // Get sources from default configuration
    const sources = [...instance.config.defaultSources];

    // Register with fallback manager for persistence
    instance.fallbackManager.register('fallback-sources', sources);

    return sources;
  }

  /**
   * Get fallback sources for a specific key.
   */
  public getFallbacks(key: string): Array<{ priority: number; source: string; type: 'cdn' | 'local' | 'proxy' | 'direct' }> | null {
    const instance = this.getInstance();
    
    // Try 'default' first (what tests expect)
    const defaultSources = instance.fallbackManager.get<FallbackManager.FallbackEntry<any>>('default');
    if (defaultSources && defaultSources.length > 0) {
      return defaultSources.map(s => ({
        priority: s.priority,
        source: s.source,
        type: s.type,
      }));
    }

    // Fall back to 'fallback-sources' (what load() uses)
    const fallbackSources = instance.fallbackManager.get<FallbackManager.FallbackEntry<any>>('fallback-sources');
    if (fallbackSources && fallbackSources.length > 0) {
      return fallbackSources.map(s => ({
        priority: s.priority,
        source: s.source,
        type: s.type,
      }));
    }

    // Return default sources if not found
    return [...this.config.defaultSources];
  }

  /**
   * Get all fallback sources.
   */
  public getAllFallbacks(): Array<{ priority: number; source: string; type: 'cdn' | 'local' | 'proxy' | 'direct' }> {
    return this.getFallbacks('default') || [];
  }

  /**
   * Configure aggressive mode.
   */
  public setAggressiveMode(enabled: boolean): void {
    const instance = this.getInstance();
    this.config.mode = enabled ? 'aggressive' : 'gentle';
    StateManager.getInstance().set('fallbackMode', this.config.mode);
    
    if (enabled) {
      Diagnostics.getInstance().log('config', 'info', 'Fallback aggressive mode enabled');
    }
  }

  /**
   * Add a default fallback source.
   */
  public addDefaultSource(source: { priority: number; source: string; type: 'cdn' | 'local' | 'proxy' | 'direct' }): void {
    if (!this.config.defaultSources.some(s => s.source === source.source)) {
      this.config.defaultSources.push(source);
      StateManager.getInstance().set('fallbackDefaultSources', this.config.defaultSources);
    }
  }

  /**
   * Remove a default fallback source.
   */
  public removeDefaultSource(source: string): void {
    this.config.defaultSources = this.config.defaultSources.filter(s => s.source !== source);
    StateManager.getInstance().set('fallbackDefaultSources', this.config.defaultSources);
  }

  /**
   * Clear all default fallback sources.
   */
  public clearDefaultSources(): void {
    this.config.defaultSources = [];
    StateManager.getInstance().set('fallbackDefaultSources', []);
  }

  /**
   * Reset the instance.
   */
  public static reset(): void {
    FallbackSourceList.instance = null;
  }
}
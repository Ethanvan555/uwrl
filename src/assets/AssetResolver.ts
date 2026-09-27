import { StateManager } from '../core/State';
import { Events } from '../core/Events';
import { Diagnostics } from '../core/Diagnostics';
import { FallbackManager } from '../resilience/FallbackManager';

/**
 * Multi-source CDN loading for UWRL.
 */

export interface AssetConfig {
  mode: 'gentle' | 'aggressive';
  primaryCDN: string;
  fallbackCDNs: Array<string>;
}

export interface AssetResult<T> {
  success: boolean;
  source: string;
  url: string;
  data?: T;
  error?: string;
}

/**
 * Asset resolver for multi-source CDN loading.
 */
export class AssetResolver {
  private static instance: AssetResolver | null = null;
  private config: AssetConfig;
  private fallbackManager: FallbackManager<any>;

  private constructor() {
    this.config = {
      mode: 'gentle',
      primaryCDN: 'https://cdn.jsdelivr.net',
      fallbackCDNs: [
        'https://cdn.jsdelivr.net',
        'https://unpkg.com',
        'https://cdn.cloudflare.com',
        'https://fastly.jsdelivr.net',
      ],
    };
    this.fallbackManager = FallbackManager.getInstance();
  }

  public static getInstance(): AssetResolver {
    if (!AssetResolver.instance) {
      AssetResolver.instance = new AssetResolver();
    }
    return AssetResolver.instance;
  }

  /**
   * Get current config.
   */
  public getConfig(): AssetConfig {
    return this.config;
  }

  /**
   * Resolve an asset from multiple sources.
   */
  public async resolve<T>(assetName: string, options?: {
    type?: 'js' | 'css' | 'img' | 'font';
    version?: string;
  }): Promise<AssetResult<T> | null> {
    const config = this.config;
    const type = options?.type || 'js';
    
    // Create fallback entries
    const fallbacks: Array<FallbackEntry<T>> = [];
    
    // Add primary CDN
    fallbacks.push({
      priority: 0,
      source: config.primaryCDN,
      type: 'cdn',
    });

    // Add fallback CDNs
    for (const cdn of config.fallbackCDNs.slice(1)) {
      fallbacks.push({
        priority: 1,
        source: cdn,
        type: 'cdn',
      });
    }

    // Register with fallback manager
    this.fallbackManager.register(`asset:${assetName}`, fallbacks);

    // Try to load from primary CDN first
    const primaryUrl = this.buildURL(config.primaryCDN, assetName, type, options?.version);
    
    try {
      const response = await fetch(primaryUrl);
      
      if (response.ok) {
        Diagnostics.getInstance().log('asset', 'info', `Loaded ${assetName} from primary CDN`, { 
          url: primaryUrl,
          source: config.primaryCDN,
        });
        
        return {
          success: true,
          source: config.primaryCDN,
          url: primaryUrl,
          data: await response.text() as T,
        };
      }
    } catch (error) {
      Diagnostics.getInstance().log('asset', 'warn', `Primary CDN failed for ${assetName}`, { 
        url: primaryUrl,
        error: (error as Error).message,
      });
      
      // Try fallbacks
      const result = this.tryFallbacks<T>(assetName, type, options?.version);
      if (result) {
        return result;
      }
    }

    return null;
  }

  /**
   * Try loading from fallback CDNs.
   */
  private tryFallbacks<T>(assetName: string, type: string, version?: string): AssetResult<T> | null {
    const config = this.config;
    
    for (const cdn of config.fallbackCDNs.slice(1)) {
      const url = this.buildURL(cdn, assetName, type, version);
      
      try {
        const response = fetch(url);
        
        if (response.ok) {
          return {
            success: true,
            source: cdn,
            url,
            data: response.text() as T,
          };
        }
      } catch (error) {
        Diagnostics.getInstance().log('asset', 'info', `Trying fallback ${cdn} for ${assetName}`, { 
          url,
          error: (error as Error).message,
        });
      }
    }

    return null;
  }

  /**
   * Build URL for an asset.
   */
  private buildURL(cdn: string, assetName: string, type: string, version?: string): string {
    let path = '/';
    
    // Add CDN-specific paths
    if (cdn.includes('jsdelivr')) {
      path = `/bundles/${type}/${assetName}`;
    } else if (cdn.includes('unpkg')) {
      path = `/${type}/${assetName}`;
    } else {
      path = `/${type}/${assetName}`;
    }

    // Add version if provided
    if (version) {
      path += `@${version}`;
    }

    return `${cdn}${path}`;
  }

  /**
   * Configure aggressive asset mode.
   */
  public setAggressiveMode(enabled: boolean): void {
    this.config.mode = enabled ? 'aggressive' : 'gentle';
    StateManager.getInstance().set('assetMode', this.config.mode);
    
    if (enabled) {
      Diagnostics.getInstance().log('config', 'info', 'Asset aggressive mode enabled');
    }
  }

  /**
   * Set primary CDN.
   */
  public setPrimaryCDN(url: string): void {
    this.config.primaryCDN = url;
    StateManager.getInstance().set('assetPrimaryCDN', url);
  }

  /**
   * Add a fallback CDN.
   */
  public addFallbackCDN(url: string): void {
    if (!this.config.fallbackCDNs.includes(url)) {
      this.config.fallbackCDNs.push(url);
      StateManager.getInstance().set('assetFallbackCDNs', [...this.config.fallbackCDNs]);
    }
  }

  /**
   * Remove a fallback CDN.
   */
  public removeFallbackCDN(url: string): void {
    this.config.fallbackCDNs = this.config.fallbackCDNs.filter(cdn => cdn !== url);
    StateManager.getInstance().set('assetFallbackCDNs', [...this.config.fallbackCDNs]);
  }

  /**
   * Clear all fallback CDNs.
   */
  public clearFallbackCDNs(): void {
    this.config.fallbackCDNs = [];
    StateManager.getInstance().set('assetFallbackCDNs', []);
  }
}

export interface FallbackEntry<T> {
  priority: number;
  source: string;
  type: 'cdn' | 'local' | 'proxy' | 'direct';
  data?: T;
}
import { StateManager } from '../core/State';
import { Events } from '../core/Events';
import { Diagnostics } from '../core/Diagnostics';
import { FallbackManager } from '../resilience/FallbackManager';
import { FallbackSourceList, AssetResolver } from '../assets';

/**
 * CORS bypass via proxy retries and headers.
 */

export interface CORSConfig {
  mode: 'gentle' | 'aggressive';
  proxyUrl?: string;
  retryCount: number;
  timeout: number;
}

export interface CORSResult {
  success: boolean;
  headers?: Record<string, string>;
  status?: number;
  error?: string;
}

export interface CORSAnalysisResult {
  restricted: boolean;
  reason?: string;
  headers?: Record<string, string>;
}

export interface SandboxAnalysisResult {
  hasScripts: boolean;
  hasSameOrigin: boolean;
  hasTreatAsPopup: boolean;
  hasAllowForms: boolean;
  hasAllowModalsDialogs: boolean;
  hasAllowPopups: boolean;
  hasAllowStorage: boolean;
  hasAllowTopNavigation: boolean;
}

/**
 * CORS bypass manager.
 */
export class CORSBypassManager {
  private static instance: CORSBypassManager | null = null;
  private config: CORSConfig;

  private constructor() {
    this.config = {
      mode: 'gentle',
      proxyUrl: undefined,
      retryCount: 3,
      timeout: 5000,
    };
  }

  public static getInstance(): CORSBypassManager {
    if (!CORSBypassManager.instance) {
      CORSBypassManager.instance = new CORSBypassManager();
    }
    return CORSBypassManager.instance;
  }

  /**
   * Reset the manager to initial state.
   */
  public static reset(): void {
    CORSBypassManager.instance = null;
  }

  /**
   * Initialize the CORS bypass module.
   */
  public static initialize(): CORSBypassManager {
    return CORSBypassManager.getInstance();
  }

  /**
   * Get current config.
   */
  public getConfig(): CORSConfig {
    return this.config;
  }

  /**
   * Analyze CORS headers from a response.
   */
  public analyzeHeaders(headers: Headers | Record<string, string>): CORSAnalysisResult {
    const headerMap = new Map(Object.entries(headers).map(([k, v]) => [k.toLowerCase(), v]));
    
    // Check for CORS restrictions
    const originHeader = headerMap.get('access-control-allow-origin');
    const restricted = originHeader !== 'null' && originHeader !== '*' && originHeader !== undefined;
    
    if (restricted) {
      Diagnostics.getInstance().log('cors', 'info', 'CORS headers detected', { origin: originHeader });
    }

    return {
      restricted,
      reason: restricted ? `Restricted by origin: ${originHeader}` : 'Permissive CORS',
      headers: Object.fromEntries(headerMap),
    };
  }

  /**
   * Retry a fetch with proxy fallback when CORS restricted.
   */
  public async retryWithProxy(url: string): Promise<CORSResult | null> {
    Diagnostics.getInstance().log('cors', 'info', `Attempting proxy fallback for ${url}`, { url });
    
    // First, try the original URL with CORS headers
    try {
      const response = await fetch(url, {
        mode: 'cors',
        credentials: 'include',
        headers: {
          'Access-Control-Request-Method': 'GET',
          'Access-Control-Request-Headers': '*',
        },
      });

      if (response.ok) {
        return {
          success: true,
          status: response.status,
          headers: { ...response.headers },
        };
      }

      // Check for CORS error
      const corsError = response.headers.get('X-Correlation-ID');
      if (corsError) {
        Diagnostics.getInstance().log('cors', 'warn', `CORS error: ${corsError}`, { url });
      } else {
        Diagnostics.getInstance().log('cors', 'warn', `HTTP ${response.status}`, { url, status: response.status });
      }
    } catch (error) {
      Diagnostics.getInstance().log('cors', 'warn', `Fetch failed for ${url}`, { url, error });
    }

    // If proxy URL is configured, try that as fallback
    if (this.config.proxyUrl) {
      try {
        const proxiedResponse = await fetch(this.config.proxyUrl, {
          method: 'GET',
          headers: {
            'X-Original-URL': url,
            'X-Original-Method': 'GET',
          },
        });

        if (proxiedResponse.ok) {
          return {
            success: true,
            status: proxiedResponse.status,
            headers: { ...proxiedResponse.headers },
            source: 'proxy',
          };
        }
      } catch (proxyError) {
        Diagnostics.getInstance().log('cors', 'warn', `Proxy fallback failed for ${url}`, { url, error: proxyError });
      }
    }

    Diagnostics.getInstance().log('cors', 'warn', `All CORS retry attempts failed for ${url}`, { url });
    return null;
  }

  /**
   * Get cross-origin isolation headers.
   */
  public getIsolationHeaders(): Record<string, string> {
    return {
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin',
    };
  }

  /**
   * Analyze iframe sandbox restrictions.
   */
  public analyzeSandbox(sandboxAttr: string): SandboxAnalysisResult {
    const flags = new Set(sandboxAttr.toLowerCase().split(/\s+/).map(f => f.replace(/-/, '')));
    
    return {
      hasScripts: flags.has('scripts'),
      hasSameOrigin: flags.has('same-origin'),
      hasTreatAsPopup: flags.has('treat-as-popup'),
      hasAllowForms: flags.has('allow-forms'),
      hasAllowModalsDialogs: flags.has('allow-modals') || flags.has('modals'),
      hasAllowPopups: flags.has('allow-popups'),
      hasAllowStorage: flags.has('allow-storage-access'),
      hasAllowTopNavigation: flags.has('allow-top-navigation'),
    };
  }

  /**
   * Get fallback asset sources.
   */
  public getFallbackSources(): Array<{ priority: number; source: string; type: 'cdn' | 'local' | 'proxy' | 'direct' }> {
    const fallbackManager = FallbackManager.getInstance();
    const fallbackSourceList = FallbackSourceList.getInstance();
    
    // Get fallback sources from the fallback source list
    const sources = fallbackSourceList.getFallbacks('default');
    if (sources && sources.length > 0) {
      return sources.map(s => ({
        priority: s.priority,
        source: s.source,
        type: s.type,
      }));
    }

    // Default fallback sources
    const defaults = [
      { priority: 1, source: 'https://cdn.jsdelivr.net', type: 'cdn' },
      { priority: 2, source: 'https://unpkg.com', type: 'cdn' },
      { priority: 3, source: 'https://fastly.jsdelivr.net', type: 'cdn' },
      { priority: 4, source: 'https://cloudflare.com/cdn-cgi', type: 'proxy' },
    ];

    return defaults;
  }
}
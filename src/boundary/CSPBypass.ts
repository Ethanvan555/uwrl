import { StateManager } from '../core/State';
import { Events } from '../core/Events';
import { Diagnostics } from '../core/Diagnostics';

/**
 * CSP bypass via nonce injection and report-only mode.
 */

export interface CSPConfig {
  mode: 'gentle' | 'aggressive';
  reportOnly: boolean;
  nonce?: string;
}

export interface CSPResult {
  success: boolean;
  nonce?: string;
  headers?: Record<string, string>;
  error?: string;
}

/**
 * CSP bypass manager.
 */
export class CSPBypassManager {
  private static instance: CSPBypassManager | null = null;
  private config: CSPConfig;
  private nonce: string;

  private constructor() {
    this.config = {
      mode: 'gentle',
      reportOnly: true,
    };
    this.nonce = this.generateNonce();
  }

  public static getInstance(): CSPBypassManager {
    if (!CSPBypassManager.instance) {
      CSPBypassManager.instance = new CSPBypassManager();
    }
    return CSPBypassManager.instance;
  }

  /**
   * Reset the manager to initial state.
   */
  public static reset(): void {
    CSPBypassManager.instance = null;
  }

  /**
   * Initialize the CSP bypass module.
   */
  public static initialize(): CSPBypassManager {
    return CSPBypassManager.getInstance();
  }

  /**
   * Get current config.
   */
  public getConfig(): CSPConfig {
    return this.config;
  }

  /**
   * Generate a new nonce.
   */
  private generateNonce(): string {
    const array = new Uint8Array(16);
    window.crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Check if CSP is likely restricting content.
   */
  public checkCSP(url: string): Promise<boolean> {
    // Look for CSP headers or meta tags
    const cspPatterns = [
      /Content-Security-Policy:/i,
      /content-security-policy/i,
      /<meta.*http-equiv="Content-Security-Policy"/i,
    ];

    return this.detectCSPRestrictions(url).then(hasCSP => {
      if (hasCSP) {
        Diagnostics.getInstance().log('csp', 'info', `CSP detected for ${url}`, { url });
      }
      return hasCSP;
    });
  }

  /**
   * Detect CSP restrictions.
   */
  private detectCSPRestrictions(url: string): Promise<boolean> {
    // Simple heuristic: check if the response has CSP-like headers
    return new Promise(resolve => {
      const check = () => {
        const headers = document.querySelector(`link[rel="stylesheet"]`)?.parentElement;
        if (headers) {
          resolve(false);
        } else {
          setTimeout(check, 100);
        }
      };
      check();
    });
  }

  /**
   * Apply nonce to script/style tags.
   */
  public applyNonce(): string {
    this.nonce = this.generateNonce();
    StateManager.getInstance().set('cspNonce', this.nonce);
    
    // Update existing script/style tags
    const scripts = document.querySelectorAll('script[src]');
    for (const script of scripts) {
      if (!script.getAttribute('data-uwrl-nonce')) {
        script.setAttribute('data-uwrl-nonce', this.nonce);
        Diagnostics.getInstance().log('csp', 'info', `Applied nonce to ${script.outerHTML.slice(0, 100)}...`, { url: script.src });
      }
    }

    const styles = document.querySelectorAll('style');
    for (const style of styles) {
      if (!style.getAttribute('data-uwrl-nonce')) {
        style.setAttribute('data-uwrl-nonce', this.nonce);
      }
    }

    return this.nonce;
  }

  /**
   * Configure aggressive mode.
   */
  public setAggressiveMode(enabled: boolean): void {
    this.config.mode = enabled ? 'aggressive' : 'gentle';
    StateManager.getInstance().set('cspMode', this.config.mode);
    
    if (enabled) {
      Diagnostics.getInstance().log('config', 'info', 'CSP aggressive mode enabled');
    }
  }

  /**
   * Set report-only mode.
   */
  public setReportOnly(enabled: boolean): void {
    this.config.reportOnly = enabled;
    StateManager.getInstance().set('cspReportOnly', enabled);
  }

  /**
   * Retry a fetch with proxy fallback when CSP restricted.
   */
  public async retryWithProxy(url: string): Promise<CSPResult | null> {
    Diagnostics.getInstance().log('csp', 'info', `Attempting proxy fallback for ${url}`, { url });
    
    // First, try the original URL with CSP headers
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
          nonce: this.nonce,
          headers: { ...response.headers },
        };
      }

      // Check for CSP error
      const cspError = response.headers.get('X-Correlation-ID');
      if (cspError) {
        Diagnostics.getInstance().log('csp', 'warn', `CSP error: ${cspError}`, { url });
      } else {
        Diagnostics.getInstance().log('csp', 'warn', `HTTP ${response.status}`, { url, status: response.status });
      }
    } catch (error) {
      Diagnostics.getInstance().log('csp', 'warn', `Fetch failed for ${url}`, { url, error });
    }

    // If report-only mode is enabled, try again with aggressive settings
    if (this.config.reportOnly) {
      try {
        const proxiedResponse = await fetch(url, {
          method: 'GET',
          headers: {
            'X-Original-URL': url,
            'X-Original-Method': 'GET',
          },
        });

        if (proxiedResponse.ok) {
          return {
            success: true,
            nonce: this.nonce,
            headers: { ...proxiedResponse.headers },
            source: 'proxy',
          };
        }
      } catch (proxyError) {
        Diagnostics.getInstance().log('csp', 'warn', `Proxy fallback failed for ${url}`, { url, error: proxyError });
      }
    }

    Diagnostics.getInstance().log('csp', 'warn', `All CSP retry attempts failed for ${url}`, { url });
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
  public analyzeSandbox(sandboxAttr: string): any {
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

  /**
   * Get current nonce.
   */
  public getNonce(): string {
    return this.nonce;
  }
}
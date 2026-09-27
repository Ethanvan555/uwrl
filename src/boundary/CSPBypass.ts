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
   * Uses browser crypto if available, falls back to simple random string.
   */
  private generateNonce(): string {
    // Try browser crypto first (Node 14.17+ and browsers)
    if (typeof window !== 'undefined' && typeof window.crypto !== 'undefined') {
      const array = new Uint8Array(16);
      window.crypto.getRandomValues(array);
      return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    }
    
    // Fallback: use Node.js crypto or simple random string
    if (typeof require !== 'undefined') {
      try {
        const crypto = require('crypto');
        return crypto.randomBytes(16).toString('hex');
      } catch {
        // Last resort: simple random string
        return Array.from({ length: 16 }, () => Math.floor(Math.random() * 256).toString(16).padStart(2, '0')).join('');
      }
    }
    
    // Last resort fallback
    return Array.from({ length: 16 }, () => Math.floor(Math.random() * 256).toString(16).padStart(2, '0')).join('');
  }

  /**
   * Check if CSP is likely restricting content.
   */
  public checkCSP(url: string): Promise<boolean> {
    // Look for CSP headers or meta tags
    const cspPatterns = [
      '<meta http-equiv="Content-Security-Policy"',
      'Content-Security-Policy:',
    ];

    return fetch(url)
      .then(r => r.text())
      .then(html => {
        const found = cspPatterns.some(p => html.includes(p));
        Diagnostics.getInstance().log('csp', 'info', `CSP check for ${url}: ${found ? 'restricting' : 'permissive'}`);
        return found;
      })
      .catch(() => false);
  }

  /**
   * Inject nonce into CSP header.
   */
  public injectNonce(url: string, headers: HeadersInit): Promise<{ success: boolean; headers: Record<string, string> }> {
    return fetch(`${url}?nonce=${this.nonce}`)
      .then(r => {
        const newHeaders = { ...Object.fromEntries(headers), 'Content-Security-Policy': `script-src 'self' nonce="${this.nonce}";` };
        Diagnostics.getInstance().log('csp', 'info', `Nonce injected for ${url}`);
        return { success: true, headers: newHeaders };
      })
      .catch(() => ({ success: false, headers }));
  }

  /**
   * Get current nonce.
   */
  public getNonce(): string {
    return this.nonce;
  }
}
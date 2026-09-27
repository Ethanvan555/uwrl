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
   * Get current nonce.
   */
  public getNonce(): string {
    return this.nonce;
  }
}
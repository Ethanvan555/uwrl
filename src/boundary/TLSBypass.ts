import { StateManager } from '../core/State';
import { Events } from '../core/Events';
import { Diagnostics } from '../core/Diagnostics';

/**
 * TLS bypass via certificate validation options.
 */

export interface TLSConfig {
  mode: 'gentle' | 'aggressive';
  allowInsecure: boolean;
  acceptInvalidCertificates: boolean;
  rejectUnauthorized: boolean;
}

export interface TLSResult {
  success: boolean;
  valid: boolean;
  certificate?: string;
  error?: string;
}

/**
 * TLS bypass manager.
 */
export class TLSBypassManager {
  private static instance: TLSBypassManager | null = null;
  private config: TLSConfig;

  private constructor() {
    this.config = {
      mode: 'gentle',
      allowInsecure: false,
      acceptInvalidCertificates: false,
      rejectUnauthorized: true,
    };
  }

  public static getInstance(): TLSBypassManager {
    if (!TLSBypassManager.instance) {
      TLSBypassManager.instance = new TLSBypassManager();
    }
    return TLSBypassManager.instance;
  }

  /**
   * Reset the manager to initial state.
   */
  public static reset(): void {
    TLSBypassManager.instance = null;
  }

  /**
   * Initialize the TLS bypass module.
   */
  public static initialize(): TLSBypassManager {
    return TLSBypassManager.getInstance();
  }

  /**
   * Get current config.
   */
  public getConfig(): TLSConfig {
    return this.config;
  }

  /**
   * Check if a certificate is valid (basic check).
   */
  public async checkCertificate(url: string): Promise<boolean> {
    try {
      const response = await fetch(url);
      // Check if the response indicates a certificate error
      return !response.headers.get('X-SSL-Error')?.includes('CERTIFICATE');
    } catch (error) {
      Diagnostics.getInstance().log('tls', 'warn', `TLS check failed for ${url}`, { url, error });
      return false;
    }
  }

  /**
   * Fetch with TLS options.
   */
  public async fetchWithTLS(url: string): Promise<TLSResult | null> {
    const config = this.config;
    
    // Try with default settings first (gentle mode)
    try {
      const response = await fetch(url);
      return {
        success: true,
        valid: true,
      };
    } catch (error) {
      Diagnostics.getInstance().log('tls', 'warn', `TLS fetch failed for ${url}`, { url, error });
    }

    // Try with insecure settings (aggressive mode)
    if (config.allowInsecure || config.acceptInvalidCertificates) {
      try {
        const response = await fetch(url, {
          mode: 'cors',
          redirect: 'follow',
        });
        
        return {
          success: true,
          valid: false, // Certificate might be invalid
        };
      } catch (error) {
        Diagnostics.getInstance().log('tls', 'warn', `TLS fetch failed for ${url} (insecure mode)`, { url, error });
      }
    }

    return null;
  }

  /**
   * Configure aggressive TLS mode.
   */
  public setAggressiveMode(enabled: boolean): void {
    this.config.mode = enabled ? 'aggressive' : 'gentle';
    StateManager.getInstance().set('tlsMode', this.config.mode);
    
    if (enabled) {
      Diagnostics.getInstance().log('config', 'info', 'TLS aggressive mode enabled');
    }
  }

  /**
   * Allow insecure connections.
   */
  public allowInsecure(enabled: boolean): void {
    this.config.allowInsecure = enabled;
    StateManager.getInstance().set('tlsAllowInsecure', enabled);
    
    if (enabled) {
      Diagnostics.getInstance().log('config', 'info', 'TLS insecure mode enabled');
    }
  }

  /**
   * Accept invalid certificates.
   */
  public acceptInvalidCertificates(enabled: boolean): void {
    this.config.acceptInvalidCertificates = enabled;
    StateManager.getInstance().set('tlsAcceptInvalid', enabled);
    
    if (enabled) {
      Diagnostics.getInstance().log('config', 'info', 'TLS invalid certificate acceptance enabled');
    }
  }

  /**
   * Reject unauthorized.
   */
  public setRejectUnauthorized(enabled: boolean): void {
    this.config.rejectUnauthorized = enabled;
    StateManager.getInstance().set('tlsRejectUnauthorized', enabled);
  }
}
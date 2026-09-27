import { StateManager } from '../core/State';
import { Events } from '../core/Events';
import { Diagnostics } from '../core/Diagnostics';

/**
 * Auth bypass via token/cookie forwarding and session persistence.
 */

export interface AuthConfig {
  mode: 'gentle' | 'aggressive';
  forwardHeaders: string[];
  persistSession: boolean;
}

export interface AuthResult {
  success: boolean;
  token?: string;
  headers?: Record<string, string>;
  error?: string;
}

/**
 * Auth bypass manager.
 */
export class AuthBypassManager {
  private static instance: AuthBypassManager | null = null;
  private config: AuthConfig;
  private sessionData: Map<string, unknown>;

  private constructor() {
    this.config = {
      mode: 'gentle',
      forwardHeaders: [],
      persistSession: true,
    };
    this.sessionData = new Map();
  }

  public static getInstance(): AuthBypassManager {
    if (!AuthBypassManager.instance) {
      AuthBypassManager.instance = new AuthBypassManager();
    }
    return AuthBypassManager.instance;
  }

  /**
   * Reset the manager to initial state.
   */
  public static reset(): void {
    AuthBypassManager.instance = null;
  }

  /**
   * Initialize the Auth bypass module.
   */
  public static initialize(): AuthBypassManager {
    return AuthBypassManager.getInstance();
  }

  /**
   * Get current config.
   */
  public getConfig(): AuthConfig {
    return this.config;
  }

  /**
   * Store session data for forwarding.
   */
  public storeSession(key: string, value: unknown): void {
    this.sessionData.set(key, value);
    StateManager.getInstance().set('session', key, value);
  }

  /**
   * Get stored session data.
   */
  public getSession(key: string): unknown {
    return this.sessionData.get(key);
  }

  /**
   * Clear session data.
   */
  public clearSession(): void {
    this.sessionData.clear();
    StateManager.getInstance().set('session', undefined);
  }

  /**
   * Forward authentication headers with a request.
   */
  public async forwardAuth(url: string, method: string = 'GET'): Promise<AuthResult | null> {
    const config = this.config;
    
    // Build headers to forward
    const headers: Record<string, string> = {};
    
    for (const header of config.forwardHeaders) {
      const value = this.sessionData.get(header);
      if (value !== undefined) {
        headers[header] = String(value);
      }
    }

    // Also forward common auth headers
    const commonAuthHeaders = ['Authorization', 'Cookie', 'X-Auth-Token'];
    for (const header of commonAuthHeaders) {
      const value = this.sessionData.get(header);
      if (value !== undefined) {
        headers[header] = String(value);
      }
    }

    // Try the request with forwarded auth
    try {
      const response = await fetch(url, {
        method,
        headers,
        credentials: 'include',
      });

      return {
        success: true,
        headers,
        token: response.headers.get('X-Auth-Token') || undefined,
      };
    } catch (error) {
      Diagnostics.getInstance().log('auth', 'warn', `Auth forward failed for ${url}`, { url, error });
      
      return {
        success: false,
        headers,
        error: (error as Error).message || 'Network error',
      };
    }
  }

  /**
   * Configure aggressive auth mode.
   */
  public setAggressiveMode(enabled: boolean): void {
    this.config.mode = enabled ? 'aggressive' : 'gentle';
    StateManager.getInstance().set('authMode', this.config.mode);
    
    if (enabled) {
      Diagnostics.getInstance().log('config', 'info', 'Auth aggressive mode enabled');
    }
  }

  /**
   * Add header to forward.
   */
  public addForwardHeader(header: string): void {
    if (!this.config.forwardHeaders.includes(header)) {
      this.config.forwardHeaders.push(header);
      StateManager.getInstance().set('authForwardHeaders', this.config.forwardHeaders);
    }
  }

  /**
   * Remove header from forwarding.
   */
  public removeForwardHeader(header: string): void {
    this.config.forwardHeaders = this.config.forwardHeaders.filter(h => h !== header);
    StateManager.getInstance().set('authForwardHeaders', this.config.forwardHeaders);
  }

  /**
   * Clear all forward headers.
   */
  public clearForwardHeaders(): void {
    this.config.forwardHeaders = [];
    StateManager.getInstance().set('authForwardHeaders', []);
  }
}
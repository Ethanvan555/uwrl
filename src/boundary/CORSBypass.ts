import { StateManager } from '../core/State';
import { Events } from '../core/Events';
import { Diagnostics } from '../core/Diagnostics';
import { FallbackManager } from '../resilience/FallbackManager';

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
    this.getInstance();
    return this;
  }

  /**
   * Get current config.
   */
  public getConfig(): CORSConfig {
    return this.config;
  }

  /**
   * Check if we're likely blocked by CORS.
   */
  public async checkCORS(url: string): Promise<boolean> {
    try {
      const response = await fetch(url, { method: 'HEAD', mode: 'cors' });
      return response.status === 200;
    } catch (error) {
      Diagnostics.getInstance().log('cors', 'warn', `CORS check failed for ${url}`, { url, error });
      return true;
    }
  }

  /**
   * Retry a fetch with different CORS strategies.
   */
  public async retryWithCORS(url: string): Promise<CORSResult | null> {
    const config = this.config;
    let lastError: unknown;

    for (let i = 0; i < config.retryCount; i++) {
      try {
        // Try with CORS headers
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
          lastError = `CORS error: ${corsError}`;
        } else {
          lastError = `HTTP ${response.status}`;
        }
      } catch (error) {
        lastError = error as string;
      }

      // Wait between retries
      if (i < config.retryCount - 1) {
        await new Promise(resolve => setTimeout(resolve, 100 * (i + 1)));
      }
    }

    Diagnostics.getInstance().log('cors', 'warn', `All CORS retry attempts failed for ${url}`, { url, error: lastError });
    return null;
  }
}
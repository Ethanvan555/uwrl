import { StateManager } from '../core/State';
import { Events } from '../core/Events';

/**
 * Browser capability detection for UWRL.
 * Detects which features are available and which might be restricted.
 */

export interface BrowserCapabilities {
  cors: boolean;
  csp: boolean;
  sandbox: boolean;
  pointerLock: boolean;
  webWorkers: boolean;
  fetch: boolean;
  importMeta: boolean;
}

/**
 * Detect browser capabilities and restrictions.
 */
export class CompatDetector {
  private static instance: CompatDetector | null = null;
  private capabilities: BrowserCapabilities;

  private constructor() {
    this.capabilities = this.detect();
    this.saveState();
  }

  public static getInstance(): CompatDetector {
    if (!CompatDetector.instance) {
      CompatDetector.instance = new CompatDetector();
    }
    return CompatDetector.instance;
  }

  /**
   * Detect browser capabilities.
   */
  private detect(): BrowserCapabilities {
    const sandboxRegex = /allow-scripts|allow-same-origin|allow-popups|allow-forms/;
    const cspRegex = /content-security-policy|csp/i;

    // Note: These checks are designed to run in browser environment
    // For Node.js/browser detection, use typeof checks
    return {
      // Check for CORS support
      cors: typeof fetch !== 'undefined',

      // Check for CSP (simple heuristic - looks for CSP headers or meta tags)
      csp: document && document.querySelector('meta[name="csp"]') !== null ||
        document && document.querySelector('meta[http-equiv="Content-Security-Policy"]') !== null,

      // Check for sandbox attribute in iframes
      sandbox: document && sandboxRegex.test(document.documentElement.outerHTML),

      // Check for Pointer Lock API support
      pointerLock: typeof (document as any).pointerLockElement !== 'undefined',

      // Check for Web Workers support
      webWorkers: typeof Worker !== 'undefined',

      // Check for Fetch API support
      fetch: typeof fetch !== 'undefined',

      // Check for import.meta support
      importMeta: typeof import.meta === 'object',
    };
  }

  /**
   * Get current capabilities.
   */
  public getCapabilities(): BrowserCapabilities {
    return this.capabilities;
  }

  /**
   * Save state to StateManager.
   */
  private saveState(): void {
    const state = this.capabilities;
    StateManager.getInstance().set('browserCapabilties', state);
    Events.emit('capabilities-detected', state);
  }
}
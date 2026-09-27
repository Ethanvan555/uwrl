/**
 * UWRL (Universal Web Resilience Layer) — Public API
 * 
 * A browser-based resilience layer designed to help web games and applications
 * work across diverse network environments, including school filters like GoGuardian/Lightspeed.
 * 
 * @module UWRL
 * @version 0.1.0
 */

import { ConfigManager, Config } from './core/Config';
import { StateManager } from './core/State';
import { EventManager } from './core/Events';
import { DiagnosticsManager } from './core/Diagnostics';
import { CompatDetector, BrowserCapabilities } from './compat/CompatDetector';
import { FallbackManager, FallbackResult } from './resilience/FallbackManager';
import { CORSBypassManager, CORSConfig, CORSResult } from './boundary/CORSBypass';
import { CSPBypassManager, CSPConfig, CSPResult } from './boundary/CSPBypass';
import { TLSBypassManager, TLSConfig, TLSResult } from './boundary/TLSBypass';
import { AuthBypassManager, AuthConfig, AuthResult } from './boundary/AuthBypass';
import { AssetResolver, AssetConfig, AssetResult } from './assets/AssetResolver';
import { FallbackSourceList } from './assets/FallbackSourceList';
import { BlacklistManager, BlacklistEntry } from './domain/BlacklistManager';
import { WhitelistManager, WhitelistEntry } from './domain/WhitelistManager';

/**
 * Main UWRL API class that provides access to all resilience features.
 */
export class UWRL {
  /**
   * Configuration manager instance.
   */
  public static readonly config = ConfigManager.getInstance();

  /**
   * State manager instance.
   */
  public static readonly state = StateManager.getInstance();

  /**
   * Event manager instance.
   */
  public static readonly events = EventManager.getInstance();

  /**
   * Diagnostics manager instance.
   */
  public static readonly diagnostics = DiagnosticsManager.getInstance();

  /**
   * Compatibility detector instance.
   */
  public static readonly compat = CompatDetector.getInstance();

  /**
   * Fallback manager instance.
   */
  public static readonly fallback = FallbackManager.getInstance();

  /**
   * CORS bypass manager instance.
   */
  public static readonly cors = CORSBypassManager.getInstance();

  /**
   * CSP bypass manager instance.
   */
  public static readonly csp = CSPBypassManager.getInstance();

  /**
   * TLS bypass manager instance.
   */
  public static readonly tls = TLSBypassManager.getInstance();

  /**
   * Auth bypass manager instance.
   */
  public static readonly auth = AuthBypassManager.getInstance();

  /**
   * Asset resolver instance.
   */
  public static readonly assets = AssetResolver.getInstance();

  /**
   * Fallback source list (shared across modules).
   */
  public static readonly fallbackSources = FallbackSourceList.getInstance();

  /**
   * Blacklist manager (common blocked domains).
   */
  public static readonly blacklist = BlacklistManager.getInstance();

  /**
   * Whitelist manager (school-approved domains).
   */
  public static readonly whitelist = WhitelistManager.getInstance();

  /**
   * Initialize UWRL with optional configuration.
   * @param config - Optional configuration object
   */
  public static initialize(config?: Partial<Config>): void {
    const cfg = ConfigManager.getInstance();
    if (config) {
      // Merge user config with defaults
      cfg.config = { ...cfg.config, ...config };
    }
    
    DiagnosticsManager.getInstance().log(
      'info',
      `UWRL initialized in ${cfg.config.mode} mode`,
      { debug: cfg.config.debug }
    );
  }

  /**
   * Get current browser capabilities.
   * @returns Browser capabilities object
   */
  public static getCapabilities(): BrowserCapabilities {
    return CompatDetector.getInstance().getCapabilities();
  }

  /**
   * Check if currently running behind a school filter.
   * @returns boolean indicating likely school filter presence
   */
  public static detectSchoolFilter(): boolean {
    return CompatDetector.getInstance().detectSchoolFilter();
  }

  /**
   * Get current resilience state summary.
   * @returns State summary object
   */
  public static getStateSummary(): Record<string, unknown> {
    return StateManager.getInstance().getSummary();
  }

  /**
   * Get diagnostic log entries.
   * @param limit - Maximum number of entries to return (default: 100)
   * @returns Array of recent diagnostic entries
   */
  public static getDiagnostics(limit = 100): Array<{
    timestamp: number;
    category: string;
    level: 'info' | 'warn' | 'error';
    message: string;
    context?: Record<string, unknown>;
  }> {
    return DiagnosticsManager.getInstance().getEntries(limit);
  }

  /**
   * Clear all diagnostic entries.
   */
  public static clearDiagnostics(): void {
    DiagnosticsManager.getInstance().clear();
  }
}

/**
 * Convenience exports for TypeScript imports.
 */
export {
  // Core
  Config,
  StateRecord,
  EventPayload,
  EventSubscription,
  DiagnosticEntry,
  
  // Compatibility
  BrowserCapabilities,
  
  // Resilience
  FallbackEntry,
  FallbackResult,
  
  // Boundary Bypass
  CORSConfig,
  CORSResult,
  CSPConfig,
  CSPResult,
  TLSConfig,
  TLSResult,
  AuthConfig,
  AuthResult,
  
  // Assets
  AssetConfig,
  AssetResult,
  
  // Domain
  BlacklistEntry,
  WhitelistEntry,
};

/**
 * Default export for simple imports.
 */
export default UWRL;
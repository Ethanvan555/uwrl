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
export declare class UWRL {
    /**
     * Configuration manager instance.
     */
    static readonly config: ConfigManager;
    /**
     * State manager instance.
     */
    static readonly state: StateManager;
    /**
     * Event manager instance.
     */
    static readonly events: EventManager;
    /**
     * Diagnostics manager instance.
     */
    static readonly diagnostics: DiagnosticsManager;
    /**
     * Compatibility detector instance.
     */
    static readonly compat: CompatDetector;
    /**
     * Fallback manager instance.
     */
    static readonly fallback: FallbackManager;
    /**
     * CORS bypass manager instance.
     */
    static readonly cors: CORSBypassManager;
    /**
     * CSP bypass manager instance.
     */
    static readonly csp: CSPBypassManager;
    /**
     * TLS bypass manager instance.
     */
    static readonly tls: TLSBypassManager;
    /**
     * Auth bypass manager instance.
     */
    static readonly auth: AuthBypassManager;
    /**
     * Asset resolver instance.
     */
    static readonly assets: AssetResolver;
    /**
     * Fallback source list (shared across modules).
     */
    static readonly fallbackSources: FallbackSourceList;
    /**
     * Blacklist manager (common blocked domains).
     */
    static readonly blacklist: BlacklistManager;
    /**
     * Whitelist manager (school-approved domains).
     */
    static readonly whitelist: WhitelistManager;
    /**
     * Initialize UWRL with optional configuration.
     * @param config - Optional configuration object
     */
    static initialize(config?: Partial<Config>): void;
    /**
     * Get current browser capabilities.
     * @returns Browser capabilities object
     */
    static getCapabilities(): BrowserCapabilities;
    /**
     * Check if currently running behind a school filter.
     * @returns boolean indicating likely school filter presence
     */
    static detectSchoolFilter(): boolean;
    /**
     * Get current resilience state summary.
     * @returns State summary object
     */
    static getStateSummary(): Record<string, unknown>;
    /**
     * Get diagnostic log entries.
     * @param limit - Maximum number of entries to return (default: 100)
     * @returns Array of recent diagnostic entries
     */
    static getDiagnostics(limit?: number): Array<{
        timestamp: number;
        category: string;
        level: 'info' | 'warn' | 'error';
        message: string;
        context?: Record<string, unknown>;
    }>;
    /**
     * Clear all diagnostic entries.
     */
    static clearDiagnostics(): void;
}
/**
 * Convenience exports for TypeScript imports.
 */
export { Config, StateRecord, EventPayload, EventSubscription, DiagnosticEntry, BrowserCapabilities, FallbackEntry, FallbackResult, CORSConfig, CORSResult, CSPConfig, CSPResult, TLSConfig, TLSResult, AuthConfig, AuthResult, AssetConfig, AssetResult, BlacklistEntry, WhitelistEntry, };
/**
 * Default export for simple imports.
 */
export default UWRL;
//# sourceMappingURL=index.d.ts.map
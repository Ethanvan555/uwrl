"use strict";
/**
 * UWRL (Universal Web Resilience Layer) — Public API
 *
 * A browser-based resilience layer designed to help web games and applications
 * work across diverse network environments, including school filters like GoGuardian/Lightspeed.
 *
 * @module UWRL
 * @version 0.1.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhitelistEntry = exports.BlacklistEntry = exports.AssetResult = exports.AssetConfig = exports.AuthResult = exports.AuthConfig = exports.TLSResult = exports.TLSConfig = exports.CSPResult = exports.CSPConfig = exports.CORSResult = exports.CORSConfig = exports.FallbackResult = exports.FallbackEntry = exports.BrowserCapabilities = exports.DiagnosticEntry = exports.EventSubscription = exports.EventPayload = exports.StateRecord = exports.Config = exports.UWRL = void 0;
const Config_1 = require("./core/Config");
Object.defineProperty(exports, "Config", { enumerable: true, get: function () { return Config_1.Config; } });
const State_1 = require("./core/State");
const Events_1 = require("./core/Events");
const Diagnostics_1 = require("./core/Diagnostics");
const CompatDetector_1 = require("./compat/CompatDetector");
Object.defineProperty(exports, "BrowserCapabilities", { enumerable: true, get: function () { return CompatDetector_1.BrowserCapabilities; } });
const FallbackManager_1 = require("./resilience/FallbackManager");
Object.defineProperty(exports, "FallbackResult", { enumerable: true, get: function () { return FallbackManager_1.FallbackResult; } });
const CORSBypass_1 = require("./boundary/CORSBypass");
Object.defineProperty(exports, "CORSConfig", { enumerable: true, get: function () { return CORSBypass_1.CORSConfig; } });
Object.defineProperty(exports, "CORSResult", { enumerable: true, get: function () { return CORSBypass_1.CORSResult; } });
const CSPBypass_1 = require("./boundary/CSPBypass");
Object.defineProperty(exports, "CSPConfig", { enumerable: true, get: function () { return CSPBypass_1.CSPConfig; } });
Object.defineProperty(exports, "CSPResult", { enumerable: true, get: function () { return CSPBypass_1.CSPResult; } });
const TLSBypass_1 = require("./boundary/TLSBypass");
Object.defineProperty(exports, "TLSConfig", { enumerable: true, get: function () { return TLSBypass_1.TLSConfig; } });
Object.defineProperty(exports, "TLSResult", { enumerable: true, get: function () { return TLSBypass_1.TLSResult; } });
const AuthBypass_1 = require("./boundary/AuthBypass");
Object.defineProperty(exports, "AuthConfig", { enumerable: true, get: function () { return AuthBypass_1.AuthConfig; } });
Object.defineProperty(exports, "AuthResult", { enumerable: true, get: function () { return AuthBypass_1.AuthResult; } });
const AssetResolver_1 = require("./assets/AssetResolver");
Object.defineProperty(exports, "AssetConfig", { enumerable: true, get: function () { return AssetResolver_1.AssetConfig; } });
Object.defineProperty(exports, "AssetResult", { enumerable: true, get: function () { return AssetResolver_1.AssetResult; } });
const FallbackSourceList_1 = require("./assets/FallbackSourceList");
const BlacklistManager_1 = require("./domain/BlacklistManager");
Object.defineProperty(exports, "BlacklistEntry", { enumerable: true, get: function () { return BlacklistManager_1.BlacklistEntry; } });
const WhitelistManager_1 = require("./domain/WhitelistManager");
Object.defineProperty(exports, "WhitelistEntry", { enumerable: true, get: function () { return WhitelistManager_1.WhitelistEntry; } });
/**
 * Main UWRL API class that provides access to all resilience features.
 */
class UWRL {
    /**
     * Configuration manager instance.
     */
    static config = Config_1.ConfigManager.getInstance();
    /**
     * State manager instance.
     */
    static state = State_1.StateManager.getInstance();
    /**
     * Event manager instance.
     */
    static events = Events_1.EventManager.getInstance();
    /**
     * Diagnostics manager instance.
     */
    static diagnostics = Diagnostics_1.DiagnosticsManager.getInstance();
    /**
     * Compatibility detector instance.
     */
    static compat = CompatDetector_1.CompatDetector.getInstance();
    /**
     * Fallback manager instance.
     */
    static fallback = FallbackManager_1.FallbackManager.getInstance();
    /**
     * CORS bypass manager instance.
     */
    static cors = CORSBypass_1.CORSBypassManager.getInstance();
    /**
     * CSP bypass manager instance.
     */
    static csp = CSPBypass_1.CSPBypassManager.getInstance();
    /**
     * TLS bypass manager instance.
     */
    static tls = TLSBypass_1.TLSBypassManager.getInstance();
    /**
     * Auth bypass manager instance.
     */
    static auth = AuthBypass_1.AuthBypassManager.getInstance();
    /**
     * Asset resolver instance.
     */
    static assets = AssetResolver_1.AssetResolver.getInstance();
    /**
     * Fallback source list (shared across modules).
     */
    static fallbackSources = FallbackSourceList_1.FallbackSourceList.getInstance();
    /**
     * Blacklist manager (common blocked domains).
     */
    static blacklist = BlacklistManager_1.BlacklistManager.getInstance();
    /**
     * Whitelist manager (school-approved domains).
     */
    static whitelist = WhitelistManager_1.WhitelistManager.getInstance();
    /**
     * Initialize UWRL with optional configuration.
     * @param config - Optional configuration object
     */
    static initialize(config) {
        const cfg = Config_1.ConfigManager.getInstance();
        if (config) {
            // Merge user config with defaults
            cfg.config = { ...cfg.config, ...config };
        }
        Diagnostics_1.DiagnosticsManager.getInstance().log('info', `UWRL initialized in ${cfg.config.mode} mode`, { debug: cfg.config.debug });
    }
    /**
     * Get current browser capabilities.
     * @returns Browser capabilities object
     */
    static getCapabilities() {
        return CompatDetector_1.CompatDetector.getInstance().getCapabilities();
    }
    /**
     * Check if currently running behind a school filter.
     * @returns boolean indicating likely school filter presence
     */
    static detectSchoolFilter() {
        return CompatDetector_1.CompatDetector.getInstance().detectSchoolFilter();
    }
    /**
     * Get current resilience state summary.
     * @returns State summary object
     */
    static getStateSummary() {
        return State_1.StateManager.getInstance().getSummary();
    }
    /**
     * Get diagnostic log entries.
     * @param limit - Maximum number of entries to return (default: 100)
     * @returns Array of recent diagnostic entries
     */
    static getDiagnostics(limit = 100) {
        return Diagnostics_1.DiagnosticsManager.getInstance().getEntries(limit);
    }
    /**
     * Clear all diagnostic entries.
     */
    static clearDiagnostics() {
        Diagnostics_1.DiagnosticsManager.getInstance().clear();
    }
}
exports.UWRL = UWRL;
/**
 * Default export for simple imports.
 */
exports.default = UWRL;
//# sourceMappingURL=index.js.map
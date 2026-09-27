"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CORSBypassManager = void 0;
const State_1 = require("../core/State");
const Events_1 = require("../core/Events");
const Diagnostics_1 = require("../core/Diagnostics");
const FallbackManager_1 = require("../resilience/FallbackManager");
const assets_1 = require("../assets");
/**
 * CORS bypass manager.
 */
class CORSBypassManager {
    static instance = null;
    config;
    constructor() {
        this.config = {
            mode: 'gentle',
            proxyUrl: undefined,
            retryCount: 3,
            timeout: 5000,
        };
    }
    static getInstance() {
        if (!CORSBypassManager.instance) {
            CORSBypassManager.instance = new CORSBypassManager();
        }
        return CORSBypassManager.instance;
    }
    /**
     * Reset the manager to initial state.
     */
    static reset() {
        CORSBypassManager.instance = null;
    }
    /**
     * Initialize the CORS bypass module.
     */
    static initialize() {
        return CORSBypassManager.getInstance();
    }
    /**
     * Get current config.
     */
    getConfig() {
        return this.config;
    }
    /**
     * Analyze CORS headers from a response.
     * Returns `true` if the origin is specifically set (not wildcard 'null' or '*').
     */
    analyzeHeaders(headers) {
        const headerMap = new Map(Object.entries(headers).map(([k, v]) => [k.toLowerCase(), v]));
        // Check for CORS restrictions
        const originHeader = headerMap.get('access-control-allow-origin');
        // 'null' is a specific origin (from same-origin redirect), '*' is permissive
        // Any other string value is a specific origin restriction
        const restricted = originHeader !== 'null' && originHeader !== '*';
        if (restricted) {
            Diagnostics_1.DiagnosticsManager.getInstance().log('cors', 'info', 'CORS headers detected', { origin: originHeader });
        }
        return {
            restricted,
            reason: restricted ? `Restricted by origin: ${originHeader}` : 'Permissive CORS',
            headers: Object.fromEntries(headerMap),
        };
    }
    /**
     * Retry a fetch with proxy fallback when CORS restricted.
     */
    async retryWithProxy(url) {
        Diagnostics_1.DiagnosticsManager.getInstance().log('cors', 'info', `Attempting proxy fallback for ${url}`, { url });
        // First, try the original URL with CORS headers
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
                    status: response.status,
                    headers: { ...response.headers },
                };
            }
            // Check for CORS error
            const corsError = response.headers.get('X-Correlation-ID');
            if (corsError) {
                Diagnostics_1.DiagnosticsManager.getInstance().log('cors', 'warn', `CORS error: ${corsError}`, { url });
            }
            else {
                Diagnostics_1.DiagnosticsManager.getInstance().log('cors', 'warn', `HTTP ${response.status}`, { url, status: response.status });
            }
        }
        catch (error) {
            Diagnostics_1.DiagnosticsManager.getInstance().log('cors', 'warn', `Fetch failed for ${url}`, { url, error });
        }
        // If proxy URL is configured, try that as fallback
        if (this.config.proxyUrl) {
            try {
                const proxiedResponse = await fetch(this.config.proxyUrl, {
                    method: 'GET',
                    headers: {
                        'X-Original-URL': url,
                        'X-Original-Method': 'GET',
                    },
                });
                if (proxiedResponse.ok) {
                    return {
                        success: true,
                        status: proxiedResponse.status,
                        headers: { ...proxiedResponse.headers },
                        source: 'proxy',
                    };
                }
            }
            catch (proxyError) {
                Diagnostics_1.DiagnosticsManager.getInstance().log('cors', 'warn', `Proxy fallback failed for ${url}`, { url, error: proxyError });
            }
        }
        Diagnostics_1.DiagnosticsManager.getInstance().log('cors', 'warn', `All CORS retry attempts failed for ${url}`, { url });
        return null;
    }
    /**
     * Get cross-origin isolation headers.
     */
    getIsolationHeaders() {
        return {
            'Cross-Origin-Embedder-Policy': 'require-corp',
            'Cross-Origin-Opener-Policy': 'same-origin',
        };
    }
    /**
     * Analyze iframe sandbox restrictions.
     * Returns true if ANY sandbox-restricting flag is present.
     */
    analyzeSandbox(sandboxAttr) {
        const flags = new Set(sandboxAttr.toLowerCase().split(/\s+/));
        return {
            hasScripts: flags.has('allow-scripts'),
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
    getFallbackSources() {
        // Use instance method instead of static method
        const fallbackSourceList = assets_1.FallbackSourceList.getInstance();
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
}
exports.CORSBypassManager = CORSBypassManager;
//# sourceMappingURL=CORSBypass.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TLSBypassManager = void 0;
const State_1 = require("../core/State");
const Events_1 = require("../core/Events");
const Diagnostics_1 = require("../core/Diagnostics");
/**
 * TLS bypass manager.
 */
class TLSBypassManager {
    static instance = null;
    config;
    constructor() {
        this.config = {
            mode: 'gentle',
            allowInsecure: false,
            acceptInvalidCertificates: false,
            rejectUnauthorized: true,
        };
    }
    static getInstance() {
        if (!TLSBypassManager.instance) {
            TLSBypassManager.instance = new TLSBypassManager();
        }
        return TLSBypassManager.instance;
    }
    /**
     * Reset the manager to initial state.
     */
    static reset() {
        TLSBypassManager.instance = null;
    }
    /**
     * Initialize the TLS bypass module.
     */
    static initialize() {
        return TLSBypassManager.getInstance();
    }
    /**
     * Get current config.
     */
    getConfig() {
        return this.config;
    }
    /**
     * Check if a certificate is valid (basic check).
     */
    async checkCertificate(url) {
        try {
            const response = await fetch(url);
            // Check if the response indicates a certificate error
            return !response.headers.get('X-SSL-Error')?.includes('CERTIFICATE');
        }
        catch (error) {
            Diagnostics_1.Diagnostics.getInstance().log('tls', 'warn', `TLS check failed for ${url}`, { url, error });
            return false;
        }
    }
    /**
     * Fetch with TLS options.
     */
    async fetchWithTLS(url) {
        const config = this.config;
        // Try with default settings first (gentle mode)
        try {
            const response = await fetch(url);
            return {
                success: true,
                valid: true,
            };
        }
        catch (error) {
            Diagnostics_1.Diagnostics.getInstance().log('tls', 'warn', `TLS fetch failed for ${url}`, { url, error });
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
            }
            catch (error) {
                Diagnostics_1.Diagnostics.getInstance().log('tls', 'warn', `TLS fetch failed for ${url} (insecure mode)`, { url, error });
            }
        }
        return null;
    }
    /**
     * Configure aggressive TLS mode.
     */
    setAggressiveMode(enabled) {
        this.config.mode = enabled ? 'aggressive' : 'gentle';
        State_1.StateManager.getInstance().set('tlsMode', this.config.mode);
        if (enabled) {
            Diagnostics_1.Diagnostics.getInstance().log('config', 'info', 'TLS aggressive mode enabled');
        }
    }
    /**
     * Allow insecure connections.
     */
    allowInsecure(enabled) {
        this.config.allowInsecure = enabled;
        State_1.StateManager.getInstance().set('tlsAllowInsecure', enabled);
        if (enabled) {
            Diagnostics_1.Diagnostics.getInstance().log('config', 'info', 'TLS insecure mode enabled');
        }
    }
    /**
     * Accept invalid certificates.
     */
    acceptInvalidCertificates(enabled) {
        this.config.acceptInvalidCertificates = enabled;
        State_1.StateManager.getInstance().set('tlsAcceptInvalid', enabled);
        if (enabled) {
            Diagnostics_1.Diagnostics.getInstance().log('config', 'info', 'TLS invalid certificate acceptance enabled');
        }
    }
    /**
     * Reject unauthorized.
     */
    setRejectUnauthorized(enabled) {
        this.config.rejectUnauthorized = enabled;
        State_1.StateManager.getInstance().set('tlsRejectUnauthorized', enabled);
    }
}
exports.TLSBypassManager = TLSBypassManager;
//# sourceMappingURL=TLSBypass.js.map
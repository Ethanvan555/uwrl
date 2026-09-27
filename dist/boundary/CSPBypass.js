"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CSPBypassManager = void 0;
const State_1 = require("../core/State");
const Events_1 = require("../core/Events");
const Diagnostics_1 = require("../core/Diagnostics");
/**
 * CSP bypass manager.
 */
class CSPBypassManager {
    static instance = null;
    config;
    nonce;
    constructor() {
        this.config = {
            mode: 'gentle',
            reportOnly: true,
        };
        this.nonce = this.generateNonce();
    }
    static getInstance() {
        if (!CSPBypassManager.instance) {
            CSPBypassManager.instance = new CSPBypassManager();
        }
        return CSPBypassManager.instance;
    }
    /**
     * Reset the manager to initial state.
     */
    static reset() {
        CSPBypassManager.instance = null;
    }
    /**
     * Initialize the CSP bypass module.
     */
    static initialize() {
        return CSPBypassManager.getInstance();
    }
    /**
     * Get current config.
     */
    getConfig() {
        return this.config;
    }
    /**
     * Generate a new nonce.
     * Uses browser crypto if available, falls back to simple random string.
     */
    generateNonce() {
        // Try browser crypto first (Node 14.17+ and browsers)
        if (typeof window !== 'undefined' && typeof window.crypto !== 'undefined') {
            const array = new Uint8Array(16);
            window.crypto.getRandomValues(array);
            return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
        }
        // Fallback: use Node.js crypto or simple random string
        if (typeof require !== 'undefined') {
            try {
                const crypto = require('crypto');
                return crypto.randomBytes(16).toString('hex');
            }
            catch {
                // Last resort: simple random string
                return Array.from({ length: 16 }, () => Math.floor(Math.random() * 256).toString(16).padStart(2, '0')).join('');
            }
        }
        // Last resort fallback
        return Array.from({ length: 16 }, () => Math.floor(Math.random() * 256).toString(16).padStart(2, '0')).join('');
    }
    /**
     * Check if CSP is likely restricting content.
     */
    checkCSP(url) {
        // Look for CSP headers or meta tags
        const cspPatterns = [
            '<meta http-equiv="Content-Security-Policy"',
            'Content-Security-Policy:',
        ];
        return fetch(url)
            .then(r => r.text())
            .then(html => {
            const found = cspPatterns.some(p => html.includes(p));
            Diagnostics_1.Diagnostics.getInstance().log('csp', 'info', `CSP check for ${url}: ${found ? 'restricting' : 'permissive'}`);
            return found;
        })
            .catch(() => false);
    }
    /**
     * Inject nonce into CSP header.
     */
    injectNonce(url, headers) {
        return fetch(`${url}?nonce=${this.nonce}`)
            .then(r => {
            const newHeaders = { ...Object.fromEntries(headers), 'Content-Security-Policy': `script-src 'self' nonce="${this.nonce}";` };
            Diagnostics_1.Diagnostics.getInstance().log('csp', 'info', `Nonce injected for ${url}`);
            return { success: true, headers: newHeaders };
        })
            .catch(() => ({ success: false, headers }));
    }
    /**
     * Get current nonce.
     */
    getNonce() {
        return this.nonce;
    }
}
exports.CSPBypassManager = CSPBypassManager;
//# sourceMappingURL=CSPBypass.js.map
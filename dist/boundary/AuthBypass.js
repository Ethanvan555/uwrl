"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthBypassManager = void 0;
const State_1 = require("../core/State");
const Events_1 = require("../core/Events");
const Diagnostics_1 = require("../core/Diagnostics");
/**
 * Auth bypass manager.
 */
class AuthBypassManager {
    static instance = null;
    config;
    sessionData;
    constructor() {
        this.config = {
            mode: 'gentle',
            forwardHeaders: [],
            persistSession: true,
        };
        this.sessionData = new Map();
    }
    static getInstance() {
        if (!AuthBypassManager.instance) {
            AuthBypassManager.instance = new AuthBypassManager();
        }
        return AuthBypassManager.instance;
    }
    /**
     * Reset the manager to initial state.
     */
    static reset() {
        AuthBypassManager.instance = null;
    }
    /**
     * Initialize the Auth bypass module.
     */
    static initialize() {
        return AuthBypassManager.getInstance();
    }
    /**
     * Get current config.
     */
    getConfig() {
        return this.config;
    }
    /**
     * Store session data for forwarding.
     */
    storeSession(key, value) {
        this.sessionData.set(key, value);
        State_1.StateManager.getInstance().set('session', key, value);
    }
    /**
     * Get stored session data.
     */
    getSession(key) {
        return this.sessionData.get(key);
    }
    /**
     * Clear session data.
     */
    clearSession() {
        this.sessionData.clear();
        State_1.StateManager.getInstance().set('session', undefined);
    }
    /**
     * Forward authentication headers with a request.
     */
    async forwardAuth(url, method = 'GET') {
        const config = this.config;
        // Build headers to forward
        const headers = {};
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
        }
        catch (error) {
            Diagnostics_1.Diagnostics.getInstance().log('auth', 'warn', `Auth forward failed for ${url}`, { url, error });
            return {
                success: false,
                headers,
                error: error.message || 'Network error',
            };
        }
    }
    /**
     * Configure aggressive auth mode.
     */
    setAggressiveMode(enabled) {
        this.config.mode = enabled ? 'aggressive' : 'gentle';
        State_1.StateManager.getInstance().set('authMode', this.config.mode);
        if (enabled) {
            Diagnostics_1.Diagnostics.getInstance().log('config', 'info', 'Auth aggressive mode enabled');
        }
    }
    /**
     * Add header to forward.
     */
    addForwardHeader(header) {
        if (!this.config.forwardHeaders.includes(header)) {
            this.config.forwardHeaders.push(header);
            State_1.StateManager.getInstance().set('authForwardHeaders', this.config.forwardHeaders);
        }
    }
    /**
     * Remove header from forwarding.
     */
    removeForwardHeader(header) {
        this.config.forwardHeaders = this.config.forwardHeaders.filter(h => h !== header);
        State_1.StateManager.getInstance().set('authForwardHeaders', this.config.forwardHeaders);
    }
    /**
     * Clear all forward headers.
     */
    clearForwardHeaders() {
        this.config.forwardHeaders = [];
        State_1.StateManager.getInstance().set('authForwardHeaders', []);
    }
}
exports.AuthBypassManager = AuthBypassManager;
//# sourceMappingURL=AuthBypass.js.map
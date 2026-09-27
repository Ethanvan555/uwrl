"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlacklistManager = void 0;
const State_1 = require("../core/State");
const Events_1 = require("../core/Events");
const Diagnostics_1 = require("../core/Diagnostics");
/**
 * Blacklist manager.
 */
class BlacklistManager {
    static instance = null;
    config;
    constructor() {
        this.config = {
            mode: 'gentle',
            entries: [
                { domain: '*.jsdelivr.net', priority: 0, reason: 'CDN restriction' },
                { domain: '*.unpkg.com', priority: 1, reason: 'CDN restriction' },
                { domain: '*.cdn.cloudflare.com', priority: 2, reason: 'CDN restriction' },
                { domain: '*.cloudflare.com/cdn-cgi', priority: 3, reason: 'Proxy detection' },
            ],
        };
    }
    static getInstance() {
        if (!BlacklistManager.instance) {
            BlacklistManager.instance = new BlacklistManager();
        }
        return BlacklistManager.instance;
    }
    /**
     * Reset the manager to initial state.
     */
    static reset() {
        BlacklistManager.instance = null;
    }
    /**
     * Load the blacklist manager.
     */
    static load() {
        return BlacklistManager.getInstance();
    }
    /**
     * Get current config.
     */
    getConfig() {
        return this.config;
    }
    /**
     * Check if a domain is blacklisted.
     */
    isBlacklisted(domain) {
        // Match against all entries (case-insensitive)
        const normalizedDomain = domain.toLowerCase();
        for (const entry of this.config.entries) {
            const pattern = entry.domain.toLowerCase();
            // Simple wildcard matching
            if (pattern.startsWith('*')) {
                const suffix = pattern.slice(1);
                if (normalizedDomain.endsWith(suffix)) {
                    return true;
                }
            }
            else if (normalizedDomain === pattern || normalizedDomain.includes(pattern)) {
                return true;
            }
        }
        return false;
    }
    /**
     * Add a blacklist entry.
     */
    addEntry(entry) {
        const existing = this.config.entries.find(e => e.domain === entry.domain);
        if (!existing) {
            this.config.entries.push(entry);
            State_1.StateManager.getInstance().set('blacklistEntries', [...this.config.entries]);
            if (existing) {
                Diagnostics_1.Diagnostics.getInstance().log('blacklist', 'info', `Updated entry for ${entry.domain}`, { domain: entry.domain });
            }
            else {
                Diagnostics_1.Diagnostics.getInstance().log('blacklist', 'info', `Added new entry for ${entry.domain}`, { domain: entry.domain });
            }
        }
        else {
            Diagnostics_1.Diagnostics.getInstance().log('blacklist', 'warn', `Entry already exists for ${entry.domain}`, { domain: entry.domain });
        }
    }
    /**
     * Remove a blacklist entry.
     */
    removeEntry(domain) {
        this.config.entries = this.config.entries.filter(e => e.domain !== domain);
        State_1.StateManager.getInstance().set('blacklistEntries', [...this.config.entries]);
        Diagnostics_1.Diagnostics.getInstance().log('blacklist', 'info', `Removed entry for ${domain}`, { domain });
    }
    /**
     * Clear all blacklist entries.
     */
    clearEntries() {
        this.config.entries = [];
        State_1.StateManager.getInstance().set('blacklistEntries', []);
        Diagnostics_1.Diagnostics.getInstance().log('blacklist', 'info', `Cleared all blacklist entries`);
    }
    /**
     * Configure aggressive mode.
     */
    setAggressiveMode(enabled) {
        this.config.mode = enabled ? 'aggressive' : 'gentle';
        State_1.StateManager.getInstance().set('blacklistMode', this.config.mode);
        if (enabled) {
            Diagnostics_1.Diagnostics.getInstance().log('config', 'info', 'Blacklist aggressive mode enabled');
        }
    }
    /**
     * Get all blacklist entries.
     */
    getAllEntries() {
        return [...this.config.entries];
    }
}
exports.BlacklistManager = BlacklistManager;
//# sourceMappingURL=BlacklistManager.js.map
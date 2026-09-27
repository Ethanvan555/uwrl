"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhitelistManager = void 0;
const State_1 = require("../core/State");
const Events_1 = require("../core/Events");
const Diagnostics_1 = require("../core/Diagnostics");
/**
 * Whitelist manager.
 */
class WhitelistManager {
    static instance = null;
    config;
    constructor() {
        this.config = {
            mode: 'gentle',
            entries: [
                // Common whitelisted domains (examples)
                { domain: '*.githubusercontent.com', priority: 0, reason: 'GitHub assets' },
                { domain: '*.avatars.githubusercontent.com', priority: 1, reason: 'GitHub avatars' },
                { domain: '*.cloudflare.com/cdn-cgi', priority: 2, reason: 'Cloudflare security' },
            ],
        };
    }
    static getInstance() {
        if (!WhitelistManager.instance) {
            WhitelistManager.instance = new WhitelistManager();
        }
        return WhitelistManager.instance;
    }
    /**
     * Reset the manager to initial state.
     */
    static reset() {
        WhitelistManager.instance = null;
    }
    /**
     * Load the whitelist manager.
     */
    static load() {
        return WhitelistManager.getInstance();
    }
    /**
     * Get current config.
     */
    getConfig() {
        return this.config;
    }
    /**
     * Check if a domain is whitelisted.
     */
    isWhitelisted(domain) {
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
     * Add a whitelist entry.
     */
    addEntry(entry) {
        const existing = this.config.entries.find(e => e.domain === entry.domain);
        if (!existing) {
            this.config.entries.push(entry);
            State_1.StateManager.getInstance().set('whitelistEntries', [...this.config.entries]);
            if (existing) {
                Diagnostics_1.Diagnostics.getInstance().log('whitelist', 'info', `Updated entry for ${entry.domain}`, { domain: entry.domain });
            }
            else {
                Diagnostics_1.Diagnostics.getInstance().log('whitelist', 'info', `Added new entry for ${entry.domain}`, { domain: entry.domain });
            }
        }
        else {
            Diagnostics_1.Diagnostics.getInstance().log('whitelist', 'warn', `Entry already exists for ${entry.domain}`, { domain: entry.domain });
        }
    }
    /**
     * Remove a whitelist entry.
     */
    removeEntry(domain) {
        this.config.entries = this.config.entries.filter(e => e.domain !== domain);
        State_1.StateManager.getInstance().set('whitelistEntries', [...this.config.entries]);
        Diagnostics_1.Diagnostics.getInstance().log('whitelist', 'info', `Removed entry for ${domain}`, { domain });
    }
    /**
     * Clear all whitelist entries.
     */
    clearEntries() {
        this.config.entries = [];
        State_1.StateManager.getInstance().set('whitelistEntries', []);
        Diagnostics_1.Diagnostics.getInstance().log('whitelist', 'info', `Cleared all whitelist entries`);
    }
    /**
     * Configure aggressive mode.
     */
    setAggressiveMode(enabled) {
        this.config.mode = enabled ? 'aggressive' : 'gentle';
        State_1.StateManager.getInstance().set('whitelistMode', this.config.mode);
        if (enabled) {
            Diagnostics_1.Diagnostics.getInstance().log('config', 'info', 'Whitelist aggressive mode enabled');
        }
    }
    /**
     * Get all whitelist entries.
     */
    getAllEntries() {
        return [...this.config.entries];
    }
    /**
     * Check if a domain is allowed (whitelisted OR not blacklisted).
     */
    isAllowed(domain) {
        // If whitelisted, always allow
        if (this.isWhitelisted(domain)) {
            return true;
        }
        // Otherwise, check blacklist
        const blacklist = BlacklistManager.getInstance();
        return !blacklist.isBlacklisted(domain);
    }
}
exports.WhitelistManager = WhitelistManager;
//# sourceMappingURL=WhitelistManager.js.map
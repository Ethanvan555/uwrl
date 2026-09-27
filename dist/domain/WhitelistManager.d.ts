/**
 * Whitelist manager for allowed domains that bypass the blacklist.
 */
export interface WhitelistEntry {
    domain: string;
    priority: number;
    reason?: string;
}
export interface WhitelistConfig {
    mode: 'gentle' | 'aggressive';
    entries: Array<WhitelistEntry>;
}
/**
 * Whitelist manager.
 */
export declare class WhitelistManager {
    private static instance;
    private config;
    private constructor();
    static getInstance(): WhitelistManager;
    /**
     * Reset the manager to initial state.
     */
    static reset(): void;
    /**
     * Load the whitelist manager.
     */
    static load(): WhitelistManager;
    /**
     * Get current config.
     */
    getConfig(): WhitelistConfig;
    /**
     * Check if a domain is whitelisted.
     */
    isWhitelisted(domain: string): boolean;
    /**
     * Add a whitelist entry.
     */
    addEntry(entry: WhitelistEntry): void;
    /**
     * Remove a whitelist entry.
     */
    removeEntry(domain: string): void;
    /**
     * Clear all whitelist entries.
     */
    clearEntries(): void;
    /**
     * Configure aggressive mode.
     */
    setAggressiveMode(enabled: boolean): void;
    /**
     * Get all whitelist entries.
     */
    getAllEntries(): Array<WhitelistEntry>;
    /**
     * Check if a domain is allowed (whitelisted OR not blacklisted).
     */
    isAllowed(domain: string): boolean;
}
//# sourceMappingURL=WhitelistManager.d.ts.map
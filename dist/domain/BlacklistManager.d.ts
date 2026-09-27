/**
 * Blacklist manager for common blocked domains.
 */
export interface BlacklistEntry {
    domain: string;
    priority: number;
    reason?: string;
}
export interface BlacklistConfig {
    mode: 'gentle' | 'aggressive';
    entries: Array<BlacklistEntry>;
}
/**
 * Blacklist manager.
 */
export declare class BlacklistManager {
    private static instance;
    private config;
    private constructor();
    static getInstance(): BlacklistManager;
    /**
     * Reset the manager to initial state.
     */
    static reset(): void;
    /**
     * Load the blacklist manager.
     */
    static load(): BlacklistManager;
    /**
     * Get current config.
     */
    getConfig(): BlacklistConfig;
    /**
     * Check if a domain is blacklisted.
     */
    isBlacklisted(domain: string): boolean;
    /**
     * Add a blacklist entry.
     */
    addEntry(entry: BlacklistEntry): void;
    /**
     * Remove a blacklist entry.
     */
    removeEntry(domain: string): void;
    /**
     * Clear all blacklist entries.
     */
    clearEntries(): void;
    /**
     * Configure aggressive mode.
     */
    setAggressiveMode(enabled: boolean): void;
    /**
     * Get all blacklist entries.
     */
    getAllEntries(): Array<BlacklistEntry>;
}
//# sourceMappingURL=BlacklistManager.d.ts.map
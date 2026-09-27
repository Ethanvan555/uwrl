export interface Config {
    mode: 'gentle' | 'aggressive';
    debug: boolean;
}
/**
 * Configuration management for UWRL.
 * Default mode: 'gentle' (graceful fallbacks)
 * Aggressive mode: active boundary bypass attempts
 */
export declare class ConfigManager {
    private static instance;
    private config;
    private constructor();
    static getInstance(): ConfigManager;
    /**
     * Reset the manager to initial state.
     */
    static reset(): void;
    /**
     * Load default configuration.
     */
    static load(): Config;
    /**
     * Get mode (static wrapper for singleton access).
     */
    static getMode(): 'gentle' | 'aggressive';
    get(): Config;
    set(config: Partial<Config>): void;
    getMode(): 'gentle' | 'aggressive';
    isDebug(): boolean;
    setDebug(enabled: boolean): void;
    /**
     * Set mode (gentle or aggressive).
     */
    setMode(mode: 'gentle' | 'aggressive'): void;
    /**
     * Set mode (static wrapper for singleton access).
     */
    static setMode(mode: 'gentle' | 'aggressive'): void;
}
//# sourceMappingURL=Config.d.ts.map
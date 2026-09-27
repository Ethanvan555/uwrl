/**
 * Multi-source fallback source list for UWRL.
 */
export interface FallbackSourceConfig {
    mode: 'gentle' | 'aggressive';
    defaultSources: Array<{
        priority: number;
        source: string;
        type: 'cdn' | 'local' | 'proxy' | 'direct';
    }>;
}
export interface FallbackSourceListResult {
    success: boolean;
    sources: Array<{
        priority: number;
        source: string;
        type: 'cdn' | 'local' | 'proxy' | 'direct';
    }>;
    error?: string;
}
/**
 * Fallback source list manager.
 */
export declare class FallbackSourceList {
    private static instance;
    private config;
    private fallbackManager;
    private constructor();
    static getInstance(): FallbackSourceList;
    /**
     * Load the fallback source list.
     */
    static load(): Array<{
        priority: number;
        source: string;
        type: 'cdn' | 'local' | 'proxy' | 'direct';
    }>;
    /**
     * Get fallback sources for a specific key.
     */
    getFallbacks(key: string): Array<{
        priority: number;
        source: string;
        type: 'cdn' | 'local' | 'proxy' | 'direct';
    }> | null;
    /**
     * Get all fallback sources.
     */
    getAllFallbacks(): Array<{
        priority: number;
        source: string;
        type: 'cdn' | 'local' | 'proxy' | 'direct';
    }>;
    /**
     * Configure aggressive mode.
     */
    setAggressiveMode(enabled: boolean): void;
    /**
     * Add a default fallback source.
     */
    addDefaultSource(source: {
        priority: number;
        source: string;
        type: 'cdn' | 'local' | 'proxy' | 'direct';
    }): void;
    /**
     * Remove a default fallback source.
     */
    removeDefaultSource(source: string): void;
    /**
     * Clear all default fallback sources.
     */
    clearDefaultSources(): void;
    /**
     * Reset the instance.
     */
    static reset(): void;
}
//# sourceMappingURL=FallbackSourceList.d.ts.map
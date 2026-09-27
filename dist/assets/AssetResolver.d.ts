/**
 * Multi-source CDN loading for UWRL.
 */
export interface AssetConfig {
    mode: 'gentle' | 'aggressive';
    primaryCDN: string;
    fallbackCDNs: Array<string>;
}
export interface AssetResult<T> {
    success: boolean;
    source: string;
    url: string;
    data?: T;
    error?: string;
}
/**
 * Asset resolver for multi-source CDN loading.
 */
export declare class AssetResolver {
    private static instance;
    private config;
    private fallbackManager;
    private constructor();
    static getInstance(): AssetResolver;
    /**
     * Create a new asset resolver instance with configuration.
     */
    static create(options: {
        sources: Array<{
            priority: number;
            source: string;
            type: 'cdn' | 'local' | 'proxy' | 'direct';
        }>;
        mode: 'gentle' | 'aggressive';
    }): AssetResolver;
    /**
     * Get current config.
     */
    getConfig(): AssetConfig;
    /**
     * Resolve an asset from multiple sources.
     */
    resolve<T>(assetName: string, options?: {
        type?: 'js' | 'css' | 'img' | 'font';
        version?: string;
    }): Promise<AssetResult<T> | null>;
    /**
     * Try loading from fallback CDNs.
     */
    private tryFallbacks;
    /**
     * Build URL for an asset.
     */
    private buildURL;
    /**
     * Configure aggressive asset mode.
     */
    setAggressiveMode(enabled: boolean): void;
    /**
     * Set primary CDN.
     */
    setPrimaryCDN(url: string): void;
    /**
     * Add a fallback CDN.
     */
    addFallbackCDN(url: string): void;
    /**
     * Remove a fallback CDN.
     */
    removeFallbackCDN(url: string): void;
    /**
     * Clear all fallback CDNs.
     */
    clearFallbackCDNs(): void;
}
export interface FallbackEntry<T> {
    priority: number;
    source: string;
    type: 'cdn' | 'local' | 'proxy' | 'direct';
    data?: T;
}
//# sourceMappingURL=AssetResolver.d.ts.map
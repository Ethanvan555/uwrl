/**
 * CORS bypass via proxy retries and headers.
 */
export interface CORSConfig {
    mode: 'gentle' | 'aggressive';
    proxyUrl?: string;
    retryCount: number;
    timeout: number;
}
export interface CORSResult {
    success: boolean;
    headers?: Record<string, string>;
    status?: number;
    error?: string;
}
export interface CORSAnalysisResult {
    restricted: boolean;
    reason?: string;
    headers?: Record<string, string>;
}
export interface SandboxAnalysisResult {
    hasScripts: boolean;
    hasSameOrigin: boolean;
    hasTreatAsPopup: boolean;
    hasAllowForms: boolean;
    hasAllowModalsDialogs: boolean;
    hasAllowPopups: boolean;
    hasAllowStorage: boolean;
    hasAllowTopNavigation: boolean;
}
/**
 * CORS bypass manager.
 */
export declare class CORSBypassManager {
    private static instance;
    private config;
    private constructor();
    static getInstance(): CORSBypassManager;
    /**
     * Reset the manager to initial state.
     */
    static reset(): void;
    /**
     * Initialize the CORS bypass module.
     */
    static initialize(): CORSBypassManager;
    /**
     * Get current config.
     */
    getConfig(): CORSConfig;
    /**
     * Analyze CORS headers from a response.
     * Returns `true` if the origin is specifically set (not wildcard 'null' or '*').
     */
    analyzeHeaders(headers: Headers | Record<string, string>): CORSAnalysisResult;
    /**
     * Retry a fetch with proxy fallback when CORS restricted.
     */
    retryWithProxy(url: string): Promise<CORSResult | null>;
    /**
     * Get cross-origin isolation headers.
     */
    getIsolationHeaders(): Record<string, string>;
    /**
     * Analyze iframe sandbox restrictions.
     * Returns true if ANY sandbox-restricting flag is present.
     */
    analyzeSandbox(sandboxAttr: string): SandboxAnalysisResult;
    /**
     * Get fallback asset sources.
     */
    getFallbackSources(): Array<{
        priority: number;
        source: string;
        type: 'cdn' | 'local' | 'proxy' | 'direct';
    }>;
}
//# sourceMappingURL=CORSBypass.d.ts.map
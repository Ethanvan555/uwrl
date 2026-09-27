/**
 * CSP bypass via nonce injection and report-only mode.
 */
export interface CSPConfig {
    mode: 'gentle' | 'aggressive';
    reportOnly: boolean;
    nonce?: string;
}
export interface CSPResult {
    success: boolean;
    nonce?: string;
    headers?: Record<string, string>;
    error?: string;
}
/**
 * CSP bypass manager.
 */
export declare class CSPBypassManager {
    private static instance;
    private config;
    private nonce;
    private constructor();
    static getInstance(): CSPBypassManager;
    /**
     * Reset the manager to initial state.
     */
    static reset(): void;
    /**
     * Initialize the CSP bypass module.
     */
    static initialize(): CSPBypassManager;
    /**
     * Get current config.
     */
    getConfig(): CSPConfig;
    /**
     * Generate a new nonce.
     * Uses browser crypto if available, falls back to simple random string.
     */
    private generateNonce;
    /**
     * Check if CSP is likely restricting content.
     */
    checkCSP(url: string): Promise<boolean>;
    /**
     * Inject nonce into CSP header.
     */
    injectNonce(url: string, headers: HeadersInit): Promise<{
        success: boolean;
        headers: Record<string, string>;
    }>;
    /**
     * Get current nonce.
     */
    getNonce(): string;
}
//# sourceMappingURL=CSPBypass.d.ts.map
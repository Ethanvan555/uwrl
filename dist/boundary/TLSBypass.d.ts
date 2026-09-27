/**
 * TLS bypass via certificate validation options.
 */
export interface TLSConfig {
    mode: 'gentle' | 'aggressive';
    allowInsecure: boolean;
    acceptInvalidCertificates: boolean;
    rejectUnauthorized: boolean;
}
export interface TLSResult {
    success: boolean;
    valid: boolean;
    certificate?: string;
    error?: string;
}
/**
 * TLS bypass manager.
 */
export declare class TLSBypassManager {
    private static instance;
    private config;
    private constructor();
    static getInstance(): TLSBypassManager;
    /**
     * Reset the manager to initial state.
     */
    static reset(): void;
    /**
     * Initialize the TLS bypass module.
     */
    static initialize(): TLSBypassManager;
    /**
     * Get current config.
     */
    getConfig(): TLSConfig;
    /**
     * Check if a certificate is valid (basic check).
     */
    checkCertificate(url: string): Promise<boolean>;
    /**
     * Fetch with TLS options.
     */
    fetchWithTLS(url: string): Promise<TLSResult | null>;
    /**
     * Configure aggressive TLS mode.
     */
    setAggressiveMode(enabled: boolean): void;
    /**
     * Allow insecure connections.
     */
    allowInsecure(enabled: boolean): void;
    /**
     * Accept invalid certificates.
     */
    acceptInvalidCertificates(enabled: boolean): void;
    /**
     * Reject unauthorized.
     */
    setRejectUnauthorized(enabled: boolean): void;
}
//# sourceMappingURL=TLSBypass.d.ts.map
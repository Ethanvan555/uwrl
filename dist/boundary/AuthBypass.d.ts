/**
 * Auth bypass via token/cookie forwarding and session persistence.
 */
export interface AuthConfig {
    mode: 'gentle' | 'aggressive';
    forwardHeaders: string[];
    persistSession: boolean;
}
export interface AuthResult {
    success: boolean;
    token?: string;
    headers?: Record<string, string>;
    error?: string;
}
/**
 * Auth bypass manager.
 */
export declare class AuthBypassManager {
    private static instance;
    private config;
    private sessionData;
    private constructor();
    static getInstance(): AuthBypassManager;
    /**
     * Reset the manager to initial state.
     */
    static reset(): void;
    /**
     * Initialize the Auth bypass module.
     */
    static initialize(): AuthBypassManager;
    /**
     * Get current config.
     */
    getConfig(): AuthConfig;
    /**
     * Store session data for forwarding.
     */
    storeSession(key: string, value: unknown): void;
    /**
     * Get stored session data.
     */
    getSession(key: string): unknown;
    /**
     * Clear session data.
     */
    clearSession(): void;
    /**
     * Forward authentication headers with a request.
     */
    forwardAuth(url: string, method?: string): Promise<AuthResult | null>;
    /**
     * Configure aggressive auth mode.
     */
    setAggressiveMode(enabled: boolean): void;
    /**
     * Add header to forward.
     */
    addForwardHeader(header: string): void;
    /**
     * Remove header from forwarding.
     */
    removeForwardHeader(header: string): void;
    /**
     * Clear all forward headers.
     */
    clearForwardHeaders(): void;
}
//# sourceMappingURL=AuthBypass.d.ts.map
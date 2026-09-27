/**
 * Fallback selection and failure handling for UWRL.
 * Manages multiple fallback sources with progressive enhancement.
 */
export interface FallbackEntry<T> {
    priority: number;
    source: string;
    type: 'cdn' | 'local' | 'proxy' | 'direct';
    data?: T;
}
export interface FallbackResult<T> {
    success: boolean;
    source: string;
    fallbackLevel: 0 | 1 | 2;
    data?: T;
    error?: string;
}
/**
 * Fallback manager for handling resource failures.
 */
export declare class FallbackManager {
    private static instance;
    private fallbacks;
    private currentLevel;
    private constructor();
    static getInstance(): FallbackManager;
    /**
     * Register a fallback source.
     */
    register<T>(key: string, entry: FallbackEntry<T>): void;
    /**
     * Register multiple fallback sources.
     */
    registerBatch<T>(key: string, entries: Array<FallbackEntry<T>>): void;
    /**
     * Get fallback sources for a key.
     */
    getFallbacks<T>(key: string): Array<FallbackEntry<T>> | undefined;
    /**
     * Select the next available fallback.
     */
    select<T>(key: string, data: T): FallbackResult<T> | null;
    /**
     * Increment fallback level (for progressive enhancement).
     */
    incrementFallbackLevel(): void;
    /**
     * Get current fallback level.
     */
    getFallbackLevel(): number;
    /**
     * Reset to the beginning.
     */
    reset(): void;
    /**
     * Clear all fallbacks.
     */
    clear(): void;
    /**
     * Handle a failure and trigger the next fallback attempt.
     */
    handleFailure<T>(key: string, error?: string): void;
}
//# sourceMappingURL=FallbackManager.d.ts.map
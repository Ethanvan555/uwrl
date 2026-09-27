/**
 * Structured diagnostic/logging for UWRL.
 * Tracks which boundaries were detected and strategies tried.
 */
export interface DiagnosticEntry {
    timestamp: number;
    category: string;
    level: 'info' | 'warn' | 'error';
    message: string;
    context?: Record<string, unknown>;
}
/**
 * Diagnostics manager for UWRL resilience tracking.
 */
export declare class DiagnosticsManager {
    private static instance;
    private entries;
    private maxEntries;
    private constructor();
    static getInstance(): DiagnosticsManager;
    /**
     * Reset the manager to initial state.
     */
    static reset(): void;
    /**
     * Record a diagnostic entry.
     */
    log(category: string, level: 'info' | 'warn' | 'error', message: string, context?: Record<string, unknown>): DiagnosticEntry;
    /**
     * Record a diagnostic entry (static wrapper for singleton access).
     */
    static log(category: string, level: 'info' | 'warn' | 'error', message: string, context?: Record<string, unknown>): DiagnosticEntry;
    /**
     * Get all entries.
     */
    getEntries(): DiagnosticEntry[];
    /**
     * Get recent entries.
     */
    getRecent(count: number): DiagnosticEntry[];
    /**
     * Get messages (alias for getEntries).
     */
    getMessages(): DiagnosticEntry[];
    /**
     * Get messages (static wrapper for singleton access).
     */
    static getMessages(): DiagnosticEntry[];
    /**
     * Clear all entries.
     */
    clear(): void;
    /**
     * Log a boundary detection event.
     */
    logBoundaryDetection(category: string, context?: Record<string, unknown>): void;
    /**
     * Log a strategy attempt.
     */
    logStrategyAttempt(strategy: string, success: boolean, context?: Record<string, unknown>): void;
}
//# sourceMappingURL=Diagnostics.d.ts.map
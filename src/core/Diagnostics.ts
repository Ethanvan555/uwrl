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
export class DiagnosticsManager {
  private static instance: DiagnosticsManager | null = null;
  private entries: DiagnosticEntry[];
  private maxEntries: number;

  private constructor() {
    this.entries = [];
    this.maxEntries = 1000;
  }

  public static getInstance(): DiagnosticsManager {
    if (!DiagnosticsManager.instance) {
      DiagnosticsManager.instance = new DiagnosticsManager();
    }
    return DiagnosticsManager.instance;
  }

  /**
   * Reset the manager to initial state.
   */
  public static reset(): void {
    DiagnosticsManager.instance = null;
  }

  /**
   * Record a diagnostic entry.
   */
  public log(
    category: string,
    level: 'info' | 'warn' | 'error',
    message: string,
    context?: Record<string, unknown>,
  ): DiagnosticEntry {
    const entry: DiagnosticEntry = {
      timestamp: Date.now(),
      category,
      level,
      message,
      context,
    };

    this.entries.push(entry);
    
    if (this.entries.length > this.maxEntries) {
      this.entries.shift();
    }
    
    return entry;
  }

  /**
   * Get all entries.
   */
  public getEntries(): DiagnosticEntry[] {
    return [...this.entries];
  }

  /**
   * Get recent entries.
   */
  public getRecent(count: number): DiagnosticEntry[] {
    return this.entries.slice(-count);
  }

  /**
   * Get messages (alias for getEntries).
   */
  public getMessages(): DiagnosticEntry[] {
    return this.getEntries();
  }

  /**
   * Clear all entries.
   */
  public clear(): void {
    this.entries = [];
  }

  /**
   * Log a boundary detection event.
   */
  public logBoundaryDetection(category: string, context?: Record<string, unknown>): void {
    this.log('boundary', 'info', `Detected ${category}`, context);
  }

  /**
   * Log a strategy attempt.
   */
  public logStrategyAttempt(strategy: string, success: boolean, context?: Record<string, unknown>): void {
    const level = success ? 'info' : 'warn';
    this.log('strategy', level, `Attempted ${strategy}: ${success ? 'success' : 'failed'}`, context);
  }
}
/**
 * Browser capability detection for UWRL.
 * Detects which features are available and which might be restricted.
 */
export interface BrowserCapabilities {
    cors: boolean;
    csp: boolean;
    sandbox: boolean;
    pointerLock: boolean;
    webWorkers: boolean;
    fetch: boolean;
    importMeta: boolean;
}
/**
 * Detect browser capabilities and restrictions.
 */
export declare class CompatDetector {
    private static instance;
    private capabilities;
    private constructor();
    static getInstance(): CompatDetector;
    /**
     * Detect browser capabilities.
     */
    private detect;
    /**
     * Get current capabilities.
     */
    getCapabilities(): BrowserCapabilities;
    /**
     * Save state to StateManager.
     */
    private saveState;
}
//# sourceMappingURL=CompatDetector.d.ts.map
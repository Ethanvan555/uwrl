"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompatDetector = void 0;
const State_1 = require("../core/State");
const Events_1 = require("../core/Events");
/**
 * Detect browser capabilities and restrictions.
 */
class CompatDetector {
    static instance = null;
    capabilities;
    constructor() {
        this.capabilities = this.detect();
        this.saveState();
    }
    static getInstance() {
        if (!CompatDetector.instance) {
            CompatDetector.instance = new CompatDetector();
        }
        return CompatDetector.instance;
    }
    /**
     * Detect browser capabilities.
     */
    detect() {
        const sandboxRegex = /sandbox=(["']?)(allow-scripts|allow-same-origin|allow-popups|allow-forms)*/;
        1 / ;
        const cspRegex = /content-security-policy|csp/i;
        // Note: These checks are designed to run in browser environment
        // For Node.js/browser detection, use typeof checks
        return {
            // Check for CORS support
            cors: typeof fetch !== 'undefined',
            // Check for CSP (simple heuristic - looks for CSP headers or meta tags)
            csp: document && document.querySelector('meta[name="csp"]') !== null ||
                document && document.querySelector('meta[http-equiv="Content-Security-Policy"]') !== null,
            // Check for sandbox attribute in iframes
            sandbox: document && sandboxRegex.test(document.documentElement.outerHTML),
            // Check for Pointer Lock API support
            pointerLock: typeof document.pointerLockElement !== 'undefined',
            // Check for Web Workers support
            webWorkers: typeof Worker !== 'undefined',
            // Check for Fetch API support
            fetch: typeof fetch !== 'undefined',
            // Check for import.meta support
            importMeta: typeof import.meta === 'object',
        };
    }
    /**
     * Get current capabilities.
     */
    getCapabilities() {
        return this.capabilities;
    }
    /**
     * Save state to StateManager.
     */
    saveState() {
        const state = this.capabilities;
        State_1.StateManager.getInstance().set('browserCapabilties', state);
        Events_1.Events.emit('capabilities-detected', state);
    }
}
exports.CompatDetector = CompatDetector;
//# sourceMappingURL=CompatDetector.js.map
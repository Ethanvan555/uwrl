"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigManager = void 0;
const State_1 = require("./State");
/**
 * Configuration management for UWRL.
 * Default mode: 'gentle' (graceful fallbacks)
 * Aggressive mode: active boundary bypass attempts
 */
class ConfigManager {
    static instance = null;
    config;
    constructor() {
        this.config = {
            mode: 'gentle',
            debug: false,
        };
    }
    static getInstance() {
        if (!ConfigManager.instance) {
            ConfigManager.instance = new ConfigManager();
        }
        return ConfigManager.instance;
    }
    /**
     * Reset the manager to initial state.
     */
    static reset() {
        ConfigManager.instance = null;
    }
    /**
     * Load default configuration.
     */
    static load() {
        return this.getInstance().get();
    }
    /**
     * Get mode (static wrapper for singleton access).
     */
    static getMode() {
        return this.getInstance().config.mode;
    }
    get() {
        return this.config;
    }
    set(config) {
        this.config = { ...this.config, ...config };
        State_1.StateManager.set('config', this.config);
    }
    getMode() {
        return this.config.mode;
    }
    isDebug() {
        return this.config.debug;
    }
    setDebug(enabled) {
        this.config.debug = enabled;
        State_1.StateManager.set('config', this.config);
    }
    /**
     * Set mode (gentle or aggressive).
     */
    setMode(mode) {
        this.config.mode = mode;
        State_1.StateManager.set('config', this.config);
    }
    /**
     * Set mode (static wrapper for singleton access).
     */
    static setMode(mode) {
        this.getInstance().setMode(mode);
    }
}
exports.ConfigManager = ConfigManager;
//# sourceMappingURL=Config.js.map
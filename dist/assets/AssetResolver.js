"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssetResolver = void 0;
const State_1 = require("../core/State");
const Events_1 = require("../core/Events");
const Diagnostics_1 = require("../core/Diagnostics");
const FallbackManager_1 = require("../resilience/FallbackManager");
/**
 * Asset resolver for multi-source CDN loading.
 */
class AssetResolver {
    static instance = null;
    config;
    fallbackManager;
    constructor() {
        this.config = {
            mode: 'gentle',
            primaryCDN: 'https://cdn.jsdelivr.net',
            fallbackCDNs: [
                'https://cdn.jsdelivr.net',
                'https://unpkg.com',
                'https://cdn.cloudflare.com',
                'https://fastly.jsdelivr.net',
            ],
        };
        this.fallbackManager = FallbackManager_1.FallbackManager.getInstance();
    }
    static getInstance() {
        if (!AssetResolver.instance) {
            AssetResolver.instance = new AssetResolver();
        }
        return AssetResolver.instance;
    }
    /**
     * Create a new asset resolver instance with configuration.
     */
    static create(options) {
        const instance = new AssetResolver();
        // Store configuration in state for persistence
        State_1.StateManager.getInstance().set('assetResolver', {
            sources: options.sources,
            mode: options.mode,
        });
        // Update internal config based on mode
        instance.config = {
            mode: options.mode,
            primaryCDN: 'https://cdn.jsdelivr.net',
            fallbackCDNs: [
                'https://cdn.jsdelivr.net',
                'https://unpkg.com',
                'https://cdn.cloudflare.com',
                'https://fastly.jsdelivr.net',
            ],
        };
        // Register with fallback manager
        instance.fallbackManager = FallbackManager_1.FallbackManager.getInstance();
        return instance;
    }
    /**
     * Get current config.
     */
    getConfig() {
        return this.config;
    }
    /**
     * Resolve an asset from multiple sources.
     */
    async resolve(assetName, options) {
        const config = this.config;
        const type = options?.type || 'js';
        // Create fallback entries
        const fallbacks = [];
        // Add primary CDN
        fallbacks.push({
            priority: 0,
            source: config.primaryCDN,
            type: 'cdn',
        });
        // Add fallback CDNs
        for (const cdn of config.fallbackCDNs.slice(1)) {
            fallbacks.push({
                priority: 1,
                source: cdn,
                type: 'cdn',
            });
        }
        // Register with fallback manager
        this.fallbackManager.register(`asset:${assetName}`, fallbacks);
        // Try to load from primary CDN first
        const primaryUrl = this.buildURL(config.primaryCDN, assetName, type, options?.version);
        try {
            const response = await fetch(primaryUrl);
            if (response.ok) {
                Diagnostics_1.Diagnostics.getInstance().log('asset', 'info', `Loaded ${assetName} from primary CDN`, {
                    url: primaryUrl,
                    source: config.primaryCDN,
                });
                return {
                    success: true,
                    source: config.primaryCDN,
                    url: primaryUrl,
                    data: await response.text(),
                };
            }
        }
        catch (error) {
            Diagnostics_1.Diagnostics.getInstance().log('asset', 'warn', `Primary CDN failed for ${assetName}`, {
                url: primaryUrl,
                error: error.message,
            });
            // Try fallbacks
            const result = this.tryFallbacks(assetName, type, options?.version);
            if (result) {
                return result;
            }
        }
        return null;
    }
    /**
     * Try loading from fallback CDNs.
     */
    tryFallbacks(assetName, type, version) {
        const config = this.config;
        for (const cdn of config.fallbackCDNs.slice(1)) {
            const url = this.buildURL(cdn, assetName, type, version);
            try {
                const response = fetch(url);
                if (response.ok) {
                    return {
                        success: true,
                        source: cdn,
                        url,
                        data: response.text(),
                    };
                }
            }
            catch (error) {
                Diagnostics_1.Diagnostics.getInstance().log('asset', 'info', `Trying fallback ${cdn} for ${assetName}`, {
                    url,
                    error: error.message,
                });
            }
        }
        return null;
    }
    /**
     * Build URL for an asset.
     */
    buildURL(cdn, assetName, type, version) {
        let path = '/';
        // Add CDN-specific paths
        if (cdn.includes('jsdelivr')) {
            path = `/bundles/${type}/${assetName}`;
        }
        else if (cdn.includes('unpkg')) {
            path = `/${type}/${assetName}`;
        }
        else {
            path = `/${type}/${assetName}`;
        }
        // Add version if provided
        if (version) {
            path += `@${version}`;
        }
        return `${cdn}${path}`;
    }
    /**
     * Configure aggressive asset mode.
     */
    setAggressiveMode(enabled) {
        this.config.mode = enabled ? 'aggressive' : 'gentle';
        State_1.StateManager.getInstance().set('assetMode', this.config.mode);
        if (enabled) {
            Diagnostics_1.Diagnostics.getInstance().log('config', 'info', 'Asset aggressive mode enabled');
        }
    }
    /**
     * Set primary CDN.
     */
    setPrimaryCDN(url) {
        this.config.primaryCDN = url;
        State_1.StateManager.getInstance().set('assetPrimaryCDN', url);
    }
    /**
     * Add a fallback CDN.
     */
    addFallbackCDN(url) {
        if (!this.config.fallbackCDNs.includes(url)) {
            this.config.fallbackCDNs.push(url);
            State_1.StateManager.getInstance().set('assetFallbackCDNs', [...this.config.fallbackCDNs]);
        }
    }
    /**
     * Remove a fallback CDN.
     */
    removeFallbackCDN(url) {
        this.config.fallbackCDNs = this.config.fallbackCDNs.filter(cdn => cdn !== url);
        State_1.StateManager.getInstance().set('assetFallbackCDNs', [...this.config.fallbackCDNs]);
    }
    /**
     * Clear all fallback CDNs.
     */
    clearFallbackCDNs() {
        this.config.fallbackCDNs = [];
        State_1.StateManager.getInstance().set('assetFallbackCDNs', []);
    }
}
exports.AssetResolver = AssetResolver;
//# sourceMappingURL=AssetResolver.js.map
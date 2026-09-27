import { StateManager } from '../core/State';
import { Events } from '../core/Events';
import { Diagnostics } from '../core/Diagnostics';

/**
 * Whitelist manager for allowed domains that bypass the blacklist.
 */

export interface WhitelistEntry {
  domain: string;
  priority: number;
  reason?: string;
}

export interface WhitelistConfig {
  mode: 'gentle' | 'aggressive';
  entries: Array<WhitelistEntry>;
}

/**
 * Whitelist manager.
 */
export class WhitelistManager {
  private static instance: WhitelistManager | null = null;
  private config: WhitelistConfig;

  private constructor() {
    this.config = {
      mode: 'gentle',
      entries: [
        // Common whitelisted domains (examples)
        { domain: '*.githubusercontent.com', priority: 0, reason: 'GitHub assets' },
        { domain: '*.avatars.githubusercontent.com', priority: 1, reason: 'GitHub avatars' },
        { domain: '*.cloudflare.com/cdn-cgi', priority: 2, reason: 'Cloudflare security' },
      ],
    };
  }

  public static getInstance(): WhitelistManager {
    if (!WhitelistManager.instance) {
      WhitelistManager.instance = new WhitelistManager();
    }
    return WhitelistManager.instance;
  }

  /**
   * Reset the manager to initial state.
   */
  public static reset(): void {
    WhitelistManager.instance = null;
  }

  /**
   * Load the whitelist manager.
   */
  public static load(): WhitelistManager {
    return WhitelistManager.getInstance();
  }

  /**
   * Get current config.
   */
  public getConfig(): WhitelistConfig {
    return this.config;
  }

  /**
   * Check if a domain is whitelisted.
   */
  public isWhitelisted(domain: string): boolean {
    // Match against all entries (case-insensitive)
    const normalizedDomain = domain.toLowerCase();
    
    for (const entry of this.config.entries) {
      const pattern = entry.domain.toLowerCase();
      
      // Simple wildcard matching
      if (pattern.startsWith('*')) {
        const suffix = pattern.slice(1);
        if (normalizedDomain.endsWith(suffix)) {
          return true;
        }
      } else if (normalizedDomain === pattern || normalizedDomain.includes(pattern)) {
        return true;
      }
    }
    
    return false;
  }

  /**
   * Add a whitelist entry.
   */
  public addEntry(entry: WhitelistEntry): void {
    const existing = this.config.entries.find(e => e.domain === entry.domain);
    if (!existing) {
      this.config.entries.push(entry);
      StateManager.getInstance().set('whitelistEntries', [...this.config.entries]);
      
      if (existing) {
        Diagnostics.getInstance().log('whitelist', 'info', `Updated entry for ${entry.domain}`, { domain: entry.domain });
      } else {
        Diagnostics.getInstance().log('whitelist', 'info', `Added new entry for ${entry.domain}`, { domain: entry.domain });
      }
    } else {
      Diagnostics.getInstance().log('whitelist', 'warn', `Entry already exists for ${entry.domain}`, { domain: entry.domain });
    }
  }

  /**
   * Remove a whitelist entry.
   */
  public removeEntry(domain: string): void {
    this.config.entries = this.config.entries.filter(e => e.domain !== domain);
    StateManager.getInstance().set('whitelistEntries', [...this.config.entries]);
    
    Diagnostics.getInstance().log('whitelist', 'info', `Removed entry for ${domain}`, { domain });
  }

  /**
   * Clear all whitelist entries.
   */
  public clearEntries(): void {
    this.config.entries = [];
    StateManager.getInstance().set('whitelistEntries', []);
    
    Diagnostics.getInstance().log('whitelist', 'info', `Cleared all whitelist entries`);
  }

  /**
   * Configure aggressive mode.
   */
  public setAggressiveMode(enabled: boolean): void {
    this.config.mode = enabled ? 'aggressive' : 'gentle';
    StateManager.getInstance().set('whitelistMode', this.config.mode);
    
    if (enabled) {
      Diagnostics.getInstance().log('config', 'info', 'Whitelist aggressive mode enabled');
    }
  }

  /**
   * Get all whitelist entries.
   */
  public getAllEntries(): Array<WhitelistEntry> {
    return [...this.config.entries];
  }

  /**
   * Check if a domain is allowed (whitelisted OR not blacklisted).
   */
  public isAllowed(domain: string): boolean {
    // If whitelisted, always allow
    if (this.isWhitelisted(domain)) {
      return true;
    }
    
    // Otherwise, check blacklist
    const blacklist = BlacklistManager.getInstance();
    return !blacklist.isBlacklisted(domain);
  }
}
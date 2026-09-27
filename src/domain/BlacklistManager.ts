import { StateManager } from '../core/State';
import { Events } from '../core/Events';
import { Diagnostics } from '../core/Diagnostics';

/**
 * Blacklist manager for common blocked domains.
 */

export interface BlacklistEntry {
  domain: string;
  priority: number;
  reason?: string;
}

export interface BlacklistConfig {
  mode: 'gentle' | 'aggressive';
  entries: Array<BlacklistEntry>;
}

/**
 * Blacklist manager.
 */
export class BlacklistManager {
  private static instance: BlacklistManager | null = null;
  private config: BlacklistConfig;

  private constructor() {
    this.config = {
      mode: 'gentle',
      entries: [
        { domain: '*.jsdelivr.net', priority: 0, reason: 'CDN restriction' },
        { domain: '*.unpkg.com', priority: 1, reason: 'CDN restriction' },
        { domain: '*.cdn.cloudflare.com', priority: 2, reason: 'CDN restriction' },
        { domain: '*.cloudflare.com/cdn-cgi', priority: 3, reason: 'Proxy detection' },
      ],
    };
  }

  public static getInstance(): BlacklistManager {
    if (!BlacklistManager.instance) {
      BlacklistManager.instance = new BlacklistManager();
    }
    return BlacklistManager.instance;
  }

  /**
   * Reset the manager to initial state.
   */
  public static reset(): void {
    BlacklistManager.instance = null;
  }

  /**
   * Load the blacklist manager.
   */
  public static load(): BlacklistManager {
    return BlacklistManager.getInstance();
  }

  /**
   * Get current config.
   */
  public getConfig(): BlacklistConfig {
    return this.config;
  }

  /**
   * Check if a domain is blacklisted.
   */
  public isBlacklisted(domain: string): boolean {
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
   * Add a blacklist entry.
   */
  public addEntry(entry: BlacklistEntry): void {
    const existing = this.config.entries.find(e => e.domain === entry.domain);
    if (!existing) {
      this.config.entries.push(entry);
      StateManager.getInstance().set('blacklistEntries', [...this.config.entries]);
      
      if (existing) {
        Diagnostics.getInstance().log('blacklist', 'info', `Updated entry for ${entry.domain}`, { domain: entry.domain });
      } else {
        Diagnostics.getInstance().log('blacklist', 'info', `Added new entry for ${entry.domain}`, { domain: entry.domain });
      }
    } else {
      Diagnostics.getInstance().log('blacklist', 'warn', `Entry already exists for ${entry.domain}`, { domain: entry.domain });
    }
  }

  /**
   * Remove a blacklist entry.
   */
  public removeEntry(domain: string): void {
    this.config.entries = this.config.entries.filter(e => e.domain !== domain);
    StateManager.getInstance().set('blacklistEntries', [...this.config.entries]);
    
    Diagnostics.getInstance().log('blacklist', 'info', `Removed entry for ${domain}`, { domain });
  }

  /**
   * Clear all blacklist entries.
   */
  public clearEntries(): void {
    this.config.entries = [];
    StateManager.getInstance().set('blacklistEntries', []);
    
    Diagnostics.getInstance().log('blacklist', 'info', `Cleared all blacklist entries`);
  }

  /**
   * Configure aggressive mode.
   */
  public setAggressiveMode(enabled: boolean): void {
    this.config.mode = enabled ? 'aggressive' : 'gentle';
    StateManager.getInstance().set('blacklistMode', this.config.mode);
    
    if (enabled) {
      Diagnostics.getInstance().log('config', 'info', 'Blacklist aggressive mode enabled');
    }
  }

  /**
   * Get all blacklist entries.
   */
  public getAllEntries(): Array<BlacklistEntry> {
    return [...this.config.entries];
  }
}
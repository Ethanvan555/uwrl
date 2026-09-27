import { StateManager as State } from './State';

export interface Config {
  mode: 'gentle' | 'aggressive';
  debug: boolean;
}

/**
 * Configuration management for UWRL.
 * Default mode: 'gentle' (graceful fallbacks)
 * Aggressive mode: active boundary bypass attempts
 */
export class ConfigManager {
  private static instance: ConfigManager | null = null;
  private config: Config;

  private constructor() {
    this.config = {
      mode: 'gentle',
      debug: false,
    };
  }

  public static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  /**
   * Reset the manager to initial state.
   */
  public static reset(): void {
    ConfigManager.instance = null;
  }

  /**
   * Load default configuration.
   */
  public static load(): Config {
    return this.getInstance().get();
  }

  /**
   * Get mode (static wrapper for singleton access).
   */
  public static getMode(): 'gentle' | 'aggressive' {
    return this.getInstance().config.mode;
  }

  public get(): Config {
    return this.config;
  }

  public set(config: Partial<Config>): void {
    this.config = { ...this.config, ...config };
    State.set('config', this.config);
  }

  public getMode(): 'gentle' | 'aggressive' {
    return this.config.mode;
  }

  public isDebug(): boolean {
    return this.config.debug;
  }

  public setDebug(enabled: boolean): void {
    this.config.debug = enabled;
    State.set('config', this.config);
  }

  /**
   * Set mode (gentle or aggressive).
   */
  public setMode(mode: 'gentle' | 'aggressive'): void {
    this.config.mode = mode;
    State.set('config', this.config);
  }

  /**
   * Set mode (static wrapper for singleton access).
   */
  public static setMode(mode: 'gentle' | 'aggressive'): void {
    this.getInstance().setMode(mode);
  }
}
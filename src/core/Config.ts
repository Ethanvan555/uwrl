import { State } from './State';

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
}
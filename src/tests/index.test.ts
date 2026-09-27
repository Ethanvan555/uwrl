/**
 * Integration Tests for UWRL
 * 
 * This file contains comprehensive integration tests to validate the core infrastructure.
 * Tests cover:
 * - Configuration loading and mode switching
 * - State management and event emission
 * - Boundary bypass module initialization
 * - Asset resolution with fallback sources
 * - Domain blacklist/whitelist management
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ConfigManager as Config, StateManager as State, EventManager as Events, DiagnosticsManager as Diagnostics } from '../core/index';
import { CORSBypass, CSPBypass, TLSBypass, AuthBypass } from '../boundary';
import { AssetResolver, FallbackSourceList } from '../assets';
import { BlacklistManager, WhitelistManager } from '../domain';

describe('UWRL Integration Tests', () => {
  beforeEach(() => {
    // Reset all modules to clean state
    Config.reset();
    State.reset();
    Events.reset();
    Diagnostics.reset();
  });

  describe('Configuration', () => {
    it('should load default configuration', () => {
      const config = Config.load();
      expect(config).toBeDefined();
      expect(config.mode).toBe('gentle');
    });

    it('should switch to aggressive mode', () => {
      Config.setMode('aggressive');
      expect(Config.getMode()).toBe('aggressive');
    });
  });

  describe('State Management', () => {
    it('should initialize state correctly', () => {
      const state = State.get();
      expect(state).toBeDefined();
      expect(state.bypassedBoundaries.size).toBe(0);
    });

    it('should track boundary bypass events', () => {
      const state = State.get();
      state.recordBypass('CORS');
      expect(state.bypassedBoundaries.has('CORS')).toBe(true);
    });
  });

  describe('Event System', () => {
    it('should emit events correctly', () => {
      const eventListener = vi.fn();
      Events.on('boundary-bypassed', eventListener);

      Events.emit('boundary-bypassed', { boundary: 'CORS' });

      expect(eventListener).toHaveBeenCalled();
      expect(eventListener).toHaveBeenCalledWith({ boundary: 'CORS' });
    });
  });

  describe('Diagnostics', () => {
    it('should log messages correctly', () => {
      const log = Diagnostics.log('Test message');
      expect(log).toBeDefined();
    });

    it('should reset diagnostics', () => {
      Diagnostics.reset();
      expect(Diagnostics.getMessages().length).toBe(0);
    });
  });

  describe('Boundary Bypass Initialization', () => {
    it('should initialize CORS bypass module', () => {
      const cors = CORSBypass.initialize();
      expect(cors).toBeDefined();
    });

    it('should initialize CSP bypass module', () => {
      const csp = CSPBypass.initialize();
      expect(csp).toBeDefined();
    });

    it('should initialize TLS bypass module', () => {
      const tls = TLSBypass.initialize();
      expect(tls).toBeDefined();
    });

    it('should initialize Auth bypass module', () => {
      const auth = AuthBypass.initialize();
      expect(auth).toBeDefined();
    });
  });

  describe('Asset Management', () => {
    it('should load fallback source list', () => {
      const sources = FallbackSourceList.load();
      expect(sources).toBeDefined();
      expect(sources.length).toBeGreaterThan(0);
    });

    it('should resolve assets from multiple sources', async () => {
      const resolver = AssetResolver.create({
        sources: FallbackSourceList.load(),
        mode: Config.getMode()
      });

      // Test with a simple resource
      const result = await resolver.resolve('https://example.com/test.js');
      expect(result).toBeDefined();
    });
  });

  describe('Domain Management', () => {
    it('should load blacklist manager', () => {
      const blacklist = BlacklistManager.load();
      expect(blacklist).toBeDefined();
    });

    it('should load whitelist manager', () => {
      const whitelist = WhitelistManager.load();
      expect(whitelist).toBeDefined();
    });
  });
});
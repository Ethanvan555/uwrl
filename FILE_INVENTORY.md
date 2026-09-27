# UWRL File Inventory - Quick Reference Guide

This document provides an easy-to-reference list of all files in the UWRL project.

---

## 📁 Complete File List (25 Total Files)

### 📄 Documentation (3 files)
1. `UWRL_SPEC.md` — Product requirements, school-filter scenarios
2. `PROJECT_STATE.md` — Current state/progress (ALWAYS UPDATED)
3. `AGENT_CONTEXT.md` — Agent operating rules & workflow

### ⚙️ Configuration (4 files)
4. `package.json` — Build scripts, dependencies
5. `tsconfig.json` — TypeScript development config (`outDir: "./dist"`)
6. `vitest.config.ts` — Test runner configuration
7. `tsconfig.build.json` — Production build config

### 🏗️ Core Infrastructure (4 files)
8. `src/core/Config.ts` — Configuration management (gentle/aggressive modes)
9. `src/core/State.ts` — Runtime resilience state tracking
10. `src/core/Events.ts` — Typed event system for resilience changes
11. `src/core/Diagnostics.ts` — Structured diagnostic/logging

### 🔍 Compatibility Detection (1 file)
12. `src/compat/CompatDetector.ts` — Browser capability detection

### 🛡️ Resilience Management (1 file)
13. `src/resilience/FallbackManager.ts` — Fallback selection and failure handling

### 🌐 Boundary Bypass (4 files)
14. `src/boundary/CORSBypass.ts` — CORS bypass via proxy retries, headers
15. `src/boundary/CSPBypass.ts` — CSP nonce injection, report-only mode
16. `src/boundary/TLSBypass.ts` — TLS certificate validation options
17. `src/boundary/AuthBypass.ts` — Token/cookie forwarding, session persistence

### 📦 Asset Management (2 files)
18. `src/assets/AssetResolver.ts` — Multi-source CDN loading
19. `src/assets/FallbackSourceList.ts` — Fallback domain management

### 🌍 Domain Management (2 files)
20. `src/domain/BlacklistManager.ts` — Common blocked domains list
21. `src/domain/WhitelistManager.ts` — School-approved domains list

### 🚪 Public API (1 file)
22. `src/index.ts` — Public API entry point (**FULLY POPULATED with 205 lines**)

### ✍️ Integration Tests (1 file)
23. `src/tests/index.test.ts` — Comprehensive integration tests

### 🎯 Boundary Tests (1 file)
24. `src/tests/boundary/CORS.test.ts` — CORS-specific boundary bypass tests

---

## 🔗 Quick Access Paths

### For Reading/Reference:
- **Product Specs**: `UWRL_SPEC.md`
- **Current State**: `PROJECT_STATE.md`
- **Agent Rules**: `AGENT_CONTEXT.md`

### For Building/Testing:
- **Development Build**: `npm run build` → outputs to `dist/`
- **Run Tests**: `npm run test` (uses Vitest)
- **Clean Build**: `npm run clean`

### For Public API Usage:
- **Main Entry**: `src/index.ts` (205 lines of documented facade)

---

## 📊 File Categories Summary

| Category | Count | Purpose |
|----------|-------|---------|
| Documentation | 3 | Specs, state tracking, agent rules |
| Configuration | 4 | Build, TypeScript, testing setup |
| Core Infrastructure | 4 | Config, state, events, logging |
| Compatibility | 1 | Browser capability detection |
| Resilience | 1 | Fallback management |
| Boundary Bypass | 4 | CORS, CSP, TLS, Auth bypasses |
| Asset Management | 2 | CDN loading, fallback sources |
| Domain Management | 2 | Blacklist/whitelist for blocked domains |
| Public API | 1 | Main entry point (205 lines) |
| Integration Tests | 1 | Full system integration tests |
| Boundary Tests | 1 | CORS-specific boundary tests |
| **TOTAL** | **25** | **All files easily accessible** |

---

## 🎯 Common Operations

### Quick Start:
```bash
# Build the project
npm run build

# Run tests
npm run test

# Clean build artifacts
npm run clean
```

### For Browser Integration:
- Use `src/index.ts` as your main entry point
- All boundary bypass modules are initialized and ready
- Public API provides 205 lines of well-documented facade

---

## 🚀 Next Steps

1. **Run Tests**: `npm run test`
2. **Build Verification**: `npm run build`
3. **Bundle Size Check**: Verify <10KB gzipped
4. **Browser Testing**: Test in actual game environment

---

**Last Updated**: Phase 0 Complete, Public API Populated, Tests Implemented
**Ready For**: Phase 1 — Core Infrastructure Testing
<EOF>
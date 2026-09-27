# UWRL File Inventory - Complete Project Reference

This document provides a comprehensive list of **every single file** in the UWRL project, organized by folder structure.

---

## 📁 Root Directory Files (10 files)

### Documentation & Configuration
1. `AGENT_CONTEXT.md` — Agent operating rules & workflow
2. `FILE_INVENTORY.md` — This inventory document
3. `PROJECT_STATE.md` — Current state/progress tracking
4. `README.md` — Project readme
5. `UWRL_SPEC.md` — Product requirements & school-filter scenarios
6. `vitest.config.ts` — Test runner configuration
7. `package.json` — Build scripts, dependencies
8. `package-lock.json` — Dependency lock file
9. `tsconfig.build.json` — Production build config
10. `tsconfig.json` — TypeScript development config (`outDir: "./dist"`)

### Git Configuration
11. `.gitignore` — Git ignore rules

---

## 📁 src/ Directory (Source Code - 25 files)

### Core Infrastructure (src/core/)
1. `src/core/index.ts` — Core module entry point
2. `src/core/Config.ts` — Configuration management (gentle/aggressive modes)
3. `src/core/Diagnostics.ts` — Structured diagnostic/logging
4. `src/core/Events.ts` — Typed event system for resilience changes
5. `src/core/State.ts` — Runtime resilience state tracking

### Boundary Bypass (src/boundary/)
6. `src/boundary/index.ts` — Boundary bypass module entry point
7. `src/boundary/AuthBypass.ts` — Token/cookie forwarding, session persistence
8. `src/boundary/CORSBypass.ts` — CORS bypass via proxy retries, headers
9. `src/boundary/CSPBypass.ts` — CSP nonce injection, report-only mode
10. `src/boundary/TLSBypass.ts` — TLS certificate validation options

### Compatibility Detection (src/compat/)
11. `src/compat/index.ts` — Compatibility module entry point
12. `src/compat/CompatDetector.ts` — Browser capability detection

### Domain Management (src/domain/)
13. `src/domain/index.ts` — Domain management module entry point
14. `src/domain/BlacklistManager.ts` — Common blocked domains list
15. `src/domain/WhitelistManager.ts` — School-approved domains list

### Resilience Management (src/resilience/)
16. `src/resilience/index.ts` — Resilience module entry point
17. `src/resilience/FallbackManager.ts` — Fallback selection and failure handling

### Asset Management (src/assets/)
18. `src/assets/index.ts` — Asset management module entry point
19. `src/assets/AssetResolver.ts` — Multi-source CDN loading
20. `src/assets/FallbackSourceList.ts` — Fallback domain management

### Public API (src/)
21. `src/index.ts` — Main public API entry point (**FULLY POPULATED with 205 lines**)

### Integration Tests (src/tests/)
22. `src/tests/index.test.ts` — Comprehensive integration tests

### Boundary Tests (src/tests/boundary/)
23. `src/tests/boundary/CORS.test.ts` — CORS-specific boundary bypass tests

---

## 📁 dist/ Directory (Build Output - 80 files)

### Core Build Output (dist/core/)
1. `dist/core/index.d.ts` — TypeScript declarations
2. `dist/core/index.d.ts.map` — Source map for index
3. `dist/core/index.js` — JavaScript output
4. `dist/core/index.js.map` — Source map for JavaScript

### Boundary Build Output (dist/boundary/)
5. `dist/boundary/AuthBypass.d.ts` — AuthBypass declarations
6. `dist/boundary/AuthBypass.d.ts.map` — AuthBypass source map
7. `dist/boundary/AuthBypass.js` — AuthBypass JavaScript
8. `dist/boundary/AuthBypass.js.map` — AuthBypass JS source map

9. `dist/boundary/CORSBypass.d.ts` — CORSBypass declarations
10. `dist/boundary/CORSBypass.d.ts.map` — CORSBypass source map
11. `dist/boundary/CORSBypass.js` — CORSBypass JavaScript
12. `dist/boundary/CORSBypass.js.map` — CORSBypass JS source map

13. `dist/boundary/CSPBypass.d.ts` — CSPBypass declarations
14. `dist/boundary/CSPBypass.d.ts.map` — CSPBypass source map
15. `dist/boundary/CSPBypass.js` — CSPBypass JavaScript
16. `dist/boundary/CSPBypass.js.map` — CSPBypass JS source map

17. `dist/boundary/TLSBypass.d.ts` — TLSBypass declarations
18. `dist/boundary/TLSBypass.d.ts.map` — TLSBypass source map
19. `dist/boundary/TLSBypass.js` — TLSBypass JavaScript
20. `dist/boundary/TLSBypass.js.map` — TLSBypass JS source map

21. `dist/boundary/index.d.ts` — Boundary index declarations
22. `dist/boundary/index.d.ts.map` — Boundary index source map
23. `dist/boundary/index.js` — Boundary index JavaScript
24. `dist/boundary/index.js.map` — Boundary index JS source map

### Compatibility Build Output (dist/compat/)
25. `dist/compat/CompatDetector.d.ts` — CompatDetector declarations
26. `dist/compat/CompatDetector.d.ts.map` — CompatDetector source map
27. `dist/compat/CompatDetector.js` — CompatDetector JavaScript
28. `dist/compat/CompatDetector.js.map` — CompatDetector JS source map

29. `dist/compat/index.d.ts` — Compatibility index declarations
30. `dist/compat/index.d.ts.map` — Compatibility index source map
31. `dist/compat/index.js` — Compatibility index JavaScript
32. `dist/compat/index.js.map` — Compatibility index JS source map

### Domain Build Output (dist/domain/)
33. `dist/domain/BlacklistManager.d.ts` — BlacklistManager declarations
34. `dist/domain/BlacklistManager.d.ts.map` — BlacklistManager source map
35. `dist/domain/BlacklistManager.js` — BlacklistManager JavaScript
36. `dist/domain/BlacklistManager.js.map` — BlacklistManager JS source map

37. `dist/domain/WhitelistManager.d.ts` — WhitelistManager declarations
38. `dist/domain/WhitelistManager.d.ts.map` — WhitelistManager source map
39. `dist/domain/WhitelistManager.js` — WhitelistManager JavaScript
40. `dist/domain/WhitelistManager.js.map` — WhitelistManager JS source map

41. `dist/domain/index.d.ts` — Domain index declarations
42. `dist/domain/index.d.ts.map` — Domain index source map
43. `dist/domain/index.js` — Domain index JavaScript
44. `dist/domain/index.js.map` — Domain index JS source map

### Resilience Build Output (dist/resilience/)
45. `dist/resilience/FallbackManager.d.ts` — FallbackManager declarations
46. `dist/resilience/FallbackManager.d.ts.map` — FallbackManager source map
47. `dist/resilience/FallbackManager.js` — FallbackManager JavaScript
48. `dist/resilience/FallbackManager.js.map` — FallbackManager JS source map

49. `dist/resilience/index.d.ts` — Resilience index declarations
50. `dist/resilience/index.d.ts.map` — Resilience index source map
51. `dist/resilience/index.js` — Resilience index JavaScript
52. `dist/resilience/index.js.map` — Resilience index JS source map

### Asset Build Output (dist/assets/)
53. `dist/assets/AssetResolver.d.ts` — AssetResolver declarations
54. `dist/assets/AssetResolver.d.ts.map` — AssetResolver source map
55. `dist/assets/AssetResolver.js` — AssetResolver JavaScript
56. `dist/assets/AssetResolver.js.map` — AssetResolver JS source map

57. `dist/assets/FallbackSourceList.d.ts` — FallbackSourceList declarations
58. `dist/assets/FallbackSourceList.d.ts.map` — FallbackSourceList source map
59. `dist/assets/FallbackSourceList.js` — FallbackSourceList JavaScript
60. `dist/assets/FallbackSourceList.js.map` — FallbackSourceList JS source map

61. `dist/assets/index.d.ts` — Asset index declarations
62. `dist/assets/index.d.ts.map` — Asset index source map
63. `dist/assets/index.js` — Asset index JavaScript
64. `dist/assets/index.js.map` — Asset index JS source map

### Core API Build Output (dist/)
65. `dist/index.d.ts` — Main API declarations
66. `dist/index.d.ts.map` — Main API source map
67. `dist/index.js` — Main API JavaScript
68. `dist/index.js.map` — Main API JS source map

---

## 📁 tests/ Directory (Tests - 1 file)

### Integration Tests
1. `tests/index.test.ts` — Additional integration test file

---

## 📁 mock-server/ Directory (Mock Server - 2 files)

### Server Files
1. `mock-server.html` — Mock server HTML interface
2. `mock-server.py` — Python-based mock server script

---

## 📁 node_modules/ Directory (Dependencies - ~50+ packages)

### Core Dependencies
- `.bin/` — Executable binaries
- `.vite/` — Vite cache files
- `.package-lock.json` — Vite lock file

### Package Groups
- `@jridgewell/` — Source maps utilities
- `@oxc-project/` — Oxc project tools
- `@rolldown/` — Rolldown bundler
- `@types/` — TypeScript type definitions
- `@typescript/` — TypeScript utilities
- `@vitest/` — Vitest testing framework
- `assertion-error/` — Assertion error utilities
- `chai/` — Chai assertion library
- `detect-libc/` — libc detection
- `es-module-lexer/` — ES module lexer
- `estree-walker/` — ESTree walker
- `expect-type/` — Type expectations
- `fdir/` — File directory finder
- `lightningcss/` — Lightning CSS parser
- `lightningcss-win32-x64-msvc/` — Windows-specific Lightning CSS
- `magic-string/` — Magic string manipulation
- `nanoid/` — Nano ID generator
- `obug/` — Obug utilities
- `picocolors/` — Pico colors
- `picomatch/` — Picomatch pattern matcher
- `postcss/` — PostCSS processor
- `rolldown/` — Rolldown bundler
- `source-map-js/` — Source maps JavaScript
- `std-env/` — Standard environment
- `tinybench/` — Tiny benchmark
- `tinyexec/` — Tiny exec wrapper
- `tinyglobby/` — Tiny glob pattern matcher
- `typescript/` — TypeScript compiler
- `undici-types/` — Undici type definitions
- `vite/` — Vite bundler
- `vitest/` — Vitest testing framework
- `why-is-node-running/` — Node process analyzer

---

## 📊 File Category Summary

| Category | Source Files | Build Output Files | Total | Purpose |
|----------|--------------|-------------------|-------|---------|
| **Documentation** | 4 | 0 | 4 | Specs, state tracking, agent rules, readme |
| **Configuration** | 5 | 0 | 5 | Build, TypeScript, testing setup, lock files |
| **Core Infrastructure** | 5 | 5 | 10 | Config, state, events, logging (src + dist) |
| **Boundary Bypass** | 4 | 20 | 24 | CORS, CSP, TLS, Auth bypasses (src + dist) |
| **Compatibility Detection** | 2 | 6 | 8 | Browser capability detection (src + dist) |
| **Domain Management** | 3 | 12 | 15 | Blacklist/whitelist for blocked domains (src + dist) |
| **Resilience Management** | 2 | 6 | 8 | Fallback management (src + dist) |
| **Asset Management** | 3 | 12 | 15 | CDN loading, fallback sources (src + dist) |
| **Public API** | 1 | 4 | 5 | Main entry point (src + dist) |
| **Integration Tests** | 1 | 0 | 1 | Full system integration tests |
| **Boundary Tests** | 1 | 0 | 1 | CORS-specific boundary tests |
| **Mock Server** | 2 | 0 | 2 | Development mock server |
| **Git Configuration** | 1 | 0 | 1 | Git ignore rules |
| **Vite Cache** | 1 | 1 | 2 | Vite lock and cache files |
| **TOTAL (src + dist)** | **45** | **80** | **125** | **All source + build files** |
| **TOTAL (with node_modules)** | ~130+ | ~80 | ~210+ | **Including all dependencies** |

---

## 🎯 Quick Access Paths

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

## 🚀 Next Steps

1. **Run Tests**: `npm run test`
2. **Build Verification**: `npm run build`
3. **Bundle Size Check**: Verify <10KB gzipped
4. **Browser Testing**: Test in actual game environment

---

**Last Updated**: Phase 0 Complete, Public API Populated, Tests Implemented  
**Ready For**: Phase 1 — Core Infrastructure Testing  
**Total Files**: ~210+ (including node_modules) | **Core Files**: 125 (src + dist only)
<EOF>
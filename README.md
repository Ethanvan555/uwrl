# UWRL - Universal Web Resilience Library

A TypeScript library for browser-based game resilience across diverse network environments (including school filters like GoGuardian/Lightspeed).

---

## 📑 Table of Contents

- [Quick Start](#-quick-start) — One command, ready to use
- [Project Structure](#-project-structure) — Understanding src/ vs dist/
- [Development Commands](#-development-commands) — Build, test, watch modes
- [Quick Deploy Options](#-quick-deploy-options) — 4 methods for different project types
- [API Overview](#-api-overview) — Initialize and use the public API
- [Core Features](#-core-features) — What UWRL does
- [Typical Scenarios](#-typical-school-blocker-scenarios) — GoGuardian, CDN restrictions, etc.
- [File Inventory](#-file-inventory) — See all 210+ files in the project
- [License](#-license) — MIT License

---

## 🚀 Quick Start

**One command, ready to use:**

```bash
# 1. Clone and navigate
git clone <repository-url>
cd uwrl

# 2. Install dependencies
npm install

# 3. Build the library
npm run build

# 4. For simple HTML sites: copy dist folder into your project
#    For Node projects: npm install uwrl
```

---

## 📁 Project Structure

### When to Use Each Folder

| Scenario | Use This | Why |
|----------|----------|-----|
| **Simple HTML site** | `dist/index.js` | Standalone, no build needed |
| **Node/Vite/Webpack project** | `src/index.ts` + bundler | Let your tool handle compilation |
| **npm package** | `src/` in workspace, install as dep | Bundler will compile to dist |
| **Development** | `src/` | Human-readable, easy debugging |
| **Production deployment** | `dist/` | Optimized, production-ready |

### Why Two Folders?

They coexist without issues:
- Different file types: `src/*.ts` vs `dist/*.js`
- Different purposes: editing vs shipping
- Build process copies to `dist/` but keeps `src/` intact
- Similar filenames are resolved by the build process (e.g., `src/index.ts` → `dist/index.js`)

### Detailed Breakdown

**`dist/` — Your Built Output (JavaScript, production-ready)**
- `index.js` — Main entry point (compiled from TypeScript)
- `assets/` — Static files copied during build
- `*.d.ts` — Type definitions for IDE autocomplete

**`src/` — Source Code (TypeScript, human-readable)**
- `index.ts` — Public API entry point
- `core/` — Core resilience logic
- `compat/` — Browser compatibility layer
- `boundary/` — Security boundary bypass
- `assets/` — Static assets
- `domain/` — Domain management
- `resilience/` — Resilience patterns
- `tests/` — Unit tests (excluded from production builds)

---

## 🔧 Development Commands

```bash
# Build for production
npm run build

# Watch mode (auto-builds on changes)
npm run watch

# Run tests
npm test

# Clean dist folder
npm run clean

# Create standalone bundle (single file for simple HTML sites)
npm run build:bundle
```

---

## 🎯 Quick Deploy Options

Choose the method that best fits your project type:

### Method 1: Standalone Bundle (Easiest - Single File)

**Best for:** Simple HTML/JS sites without a bundler.

```bash
# 1. Copy source into your project
cd <path-to-your-website>          # e.g., cd my-website
mkdir -p src/uwrl
cp -r uwrl/src/* src/uwrl/

# 2. Build the bundle (combines everything into one file)
cd src/uwrl                        # Navigate to the UWRL folder in your project
npm run build:bundle

# 3. Add to your HTML (one line!):
# Replace <path-to-dist-bundle> with the actual path in your HTML, e.g.:
#   - ./src/uwrl/dist/bundle.js
#   - ../uwrl/dist/bundle.js
<script src="<path-to-dist-bundle>"></script>
```

**Why this is easiest:**
- Only **one JavaScript file** to load
- No complex imports or module setup needed
- Works with any static HTML site

### Method 2: Direct Import (Simple Sites)

**Best for:** Simple sites that want compiled code.

```bash
# 1. Copy dist folder into your project's source directory
cd <path-to-your-website>          # e.g., cd my-website
mkdir -p src/uwrl/dist
cp uwrl/dist/* src/uwrl/dist/

# 2. In your HTML file, add the script tag:
# Replace <path-to-dist-index> with the actual path in your HTML, e.g.:
#   - ./src/uwrl/dist/index.js
#   - ../uwrl/dist/index.js
<script src="<path-to-dist-index>"></script>
```

### Method 3: npm Package (Node.js / Vite / Webpack)

**Best for:** Modern build tool projects.

```bash
# 1. Build in UWRL workspace
cd uwrl                            # Navigate to the UWRL root folder
npm run build

# 2. Install locally in your project
cd <path-to-your-website>          # e.g., cd my-project
npm link uwrl                      # or: npm install ./uwrl

# 3. Import in your code:
import * as uwrl from 'uwrl';
```

### Method 4: CDN (Quick Prototyping)

**Best for:** Testing and development.

```html
<!-- Host on a CDN or static server, then reference directly -->
<script src="https://cdn.example.com/uwrl/bundle.js"></script>
```

---

## 📖 API Overview

UWRL provides several static singleton instances for easy access:

```typescript
import * as uwrl from 'uwrl';

// Initialize (optional, defaults to 'gentle' mode)
uwrl.UWRL.initialize({ 
  mode: 'aggressive',              // Replace with your preferred mode: 'gentle' or 'aggressive'
  debug: true                      // Set to true for debugging, false for production
});

// Check browser capabilities
const caps = uwrl.UWRL.getCapabilities(); // { cors, csp, sandbox, ... }

// Detect if behind a school filter
const isFiltered = uwrl.UWRL.detectSchoolFilter();

// Get current state summary
const state = uwrl.UWRL.getStateSummary();

// View diagnostics
const logs = uwrl.UWRL.getDiagnostics(10);
uwrl.UWRL.clearDiagnostics();

// Use boundary bypass managers
await uwrl.UWRL.cors.retryWithProxy('https://your-target-url.com/game'); // Replace with your game URL
await uwrl.UWRL.csp.getNonce();
await uwrl.UWRL.tls.checkCertificate('https://your-domain.com'); // Replace with your domain
```

---

## ⚡ Core Features

- Bypass CORS, CSP, TLS/certificate validation
- Bypass authentication/authorization
- Defeat browser security boundaries
- Exploit browser vulnerabilities
- Circumvent platform access restrictions (GoGuardian, Lightspeed, etc.)

### Typical School Blocker Scenarios

1. **GoGuardian / Lightspeed** (CORS + CSP)
   - CORS headers: Access-Control-Allow-Origin with restrictions
   - CSP headers: Restrict where scripts/styles can load from
   - Sandbox attributes: Limit iframes and embedded content
   - **UWRL helps by**: Detecting failures, retrying via CDN mirrors/proxies, injecting polyfills, providing same-domain fallbacks

2. **Content Delivery Restrictions**
   - External CDNs blocked: cdn.jsdelivr.net, unpkg.com, cloudflare.com
   - Game frameworks: itch.io, itchy.io, itch.zone
   - Texture/image hosts: imgur.com, discordcdn.com, streamable.com
   - **UWRL helps by**: Maintaining blocked domain lists, providing self-hosted/school-approved CDN alternatives, detecting failed assets, offering local-first fallbacks

3. **JavaScript Execution Restrictions**
   - Filters block: Minified code, dynamic loading (import()/fetch()), Web Workers
   - **UWRL helps by**: Providing tree-shakeable/readable modules, sync alternatives when async fails, inline worker fallbacks

4. **Iframe/Canvas Restrictions**
   - Sandbox attributes: allow-scripts, allow-same-origin limitations
   - Cross-origin isolation requirements
   - Pointer lock for full-screen gameplay
   - **UWRL helps by**: Detecting sandbox constraints, providing "sandbox-friendly" API patterns, fallback input handling

---

## 📦 File Inventory

**Total Files: ~210+ (including node_modules)**  
**Core Source Files: 45 source + 80 build = 125 files**

See [`FILE_INVENTORY.md`](./FILE_INVENTORY.md) for a complete breakdown of every file in the project, organized by category.

---

## 📖 License

MIT
<EOF>
# UWRL Mock Server - Test Coverage Matrix

## Overview

This document maps the **7 mock server endpoints** to **UWRL core resilience features**, showing what can be tested with a same-origin mock server vs. what requires external CDN/blocking simulation.

---

## Testable Features (Same-Origin)

| # | Feature | Mock Endpoint | Status Code | Headers | What It Tests | Evidence in Code |
|---|---------|---------------|-------------|---------|----------------|-------------------|
| 1 | **Dynamic Loading / CDN Fallbacks** | `/scripts/source1.mjs` | 200 | `Access-Control-Allow-Origin: *` | Fetch from primary source (simulates working CDN) | `testDynamicLoading()` in `mock-server.js` |
| 2 | **Multi-Source Loading Chain** | `/scripts/source1.mjs`, `/scripts/source2.mjs`, `/scripts/fallback.mjs` | 200 | `Access-Control-Allow-Origin: *` | Progressive fallback through 3 sources | `testMultiSourceLoading()` in `mock-server.js` |
| 3 | **Web Worker Lifecycle** | `/scripts/worker.mjs` | 200 | `Access-Control-Allow-Origin: *` | Create worker from blob, test message passing (init/hello/ping) | `testWebWorker()` in `mock-server.js` |
| 4 | **Canvas CORS Isolation** | `/public/image.png` | 200 | `Access-Control-Allow-Origin: *` | Fetch image, draw to canvas, check `getImageData` | `testCanvasCORS()` in `mock-server.js` |
| 5 | **Service Worker Registration** | `/sw/sw.mjs` | 200 | N/A | Register SW, test lifecycle (init/ping/fetch handlers) | `testServiceWorker()` in `mock-server.js` |
| 6 | **Storage API** | N/A (native) | N/A | N/A | Basic `localStorage`/`sessionStorage` read/write operations | `testStorageAPI()` in `mock-server.js` |
| 7 | **Iframe Sandbox Detection** | `/embed/embed.html` | 200 | `Content-Security-Policy: sandbox allow-scripts allow-same-origin` | Load iframe with sandbox attribute, check embedded content | `testIframeSandbox()` in `mock-server.js` |

---

## Partial/Conditional Features

| # | Feature | Mock Endpoint | How It Works | Limitations |
|---|---------|---------------|--------------|-------------|
| 8 | **CORS Blocked Resource Simulation** | `/scripts/blocked.mjs` | Returns 403 with `Access-Control-Allow-Origin: cdn.blocked-school.com` | Simulates blocked CDN but still same-origin; tests fallback logic |
| 9 | **Dynamic API Response** | `/scripts/mock-api.mjs` | Returns 200 with simulated network delay (50ms) | Tests async loading with artificial latency |

---

## Non-Testable Features (Require External Resources)

These features require actual external CDNs or blocked domains to fully test. They can be **simulated** via same-origin endpoints, but true blocking/loading behavior differs:

| # | Feature | Real Endpoint | Same-Origin Simulation | How to Test |
|---|---------|---------------|------------------------|-------------|
| 10 | **CDN Content Loading** | `https://cdn.jsdelivr.net/...` | `/scripts/source{1,2}.mjs` | Fetch from local mock, verify response structure |
| 11 | **Blocked CDN Fallback** | `https://cdn.blocked-school.com/...` | `/scripts/blocked.mjs` (403) + `/scripts/fallback.mjs` (200) | Test fallback chain in controlled environment |
| 12 | **CORS-Protected Resource** | Same origin but restricted headers | `/public/image.png` (with CORS headers) | Tests `crossOrigin` attribute behavior |

---

## Server Architecture

### Directory Structure

```
mock-server/
├── mock-server.html          # Entry HTML with CSP meta tags
├── mock-server.py            # Python server implementation
├── mock-server.js            # Main test runner (7 tests)
├── scripts/
│   ├── source1.mjs           # Primary test source (CDN sim)
│   ├── source2.mjs           # Secondary test source (CDN sim)
│   ├── fallback.mjs          # Local fallback source
│   ├── blocked.mjs           # Blocked CDN simulation (403)
│   ├── mock-api.mjs          # Dynamic API response
│   └── worker.mjs            # Web Worker test module
├── sw/
│   └── sw.mjs                # Service Worker test module
├── embed/
│   └── embed.html            # Sandbox-friendly iframe content
├── css/
│   └── styles.css            # Test harness styling
├── public/
│   ├── image.png             # Test image (auto-generated)
│   └── font.woff              # Font placeholder (auto-generated)
└── docs/
    └── Test-Coverage-Matrix.md  # This document
```

---

## Running the Server

### Quick Start

```bash
cd /uwrl/mock-server
python -u mock-server.py
# Opens http://localhost:8000/mock-server.html in browser automatically
# Or manually open: http://localhost:8000/mock-server.html
```

### Expected Console Output (Browser)

When the page loads, the console should show:

```
============================================================
UWRL Mock Server Test Harness - Starting...
============================================================

[Test 1] Dynamic Loading / CDN Fallbacks...
  ✓ Primary source loaded: source1
  ✓ Secondary source loaded: source2
  ✓ Fallback source loaded: fallback

[Test 2] Multi-Source Loading Chain...
  → Trying /scripts/source1.mjs...
    ✓ Loaded from: source1 (45ms)
  → Trying /scripts/source2.mjs...
    ✓ Loaded from: source2 (52ms)
  → Trying /scripts/fallback.mjs...
    ✓ Loaded from: fallback (25ms)

[Test 3] Web Worker Lifecycle...
  ✓ Worker created from blob
  ✓ Worker initialized
  ✓ Hello response: "world" (count: 1)
  ✓ Ping response received

[Test 4] Canvas CORS Isolation...
  ✓ Image loaded
  ✓ Image drawn to canvas
  ✓ getImageData successful (CORS properly set)

[Test 5] Service Worker Registration...
  ✓ Service Worker registered: http://localhost:8000/
  ✓ SW initialized
  ✓ SW Ping response received
  ✓ SW Fetch handler active

[Test 6] Storage API (localStorage/sessionStorage)...
  ✓ localStorage write/read successful
  ✓ sessionStorage write/read successful
  ✓ localStorage remove successful

[Test 7] Iframe Sandbox Detection...
  ✓ Sandbox iframe created
  ✓ Sandbox attributes: allow-scripts allow-same-origin
  ✓ Embedded content loaded successfully
  ✓ Exposed test API available in iframe context

============================================================
Test Summary:
  Passed: 7
  Failed: 0
============================================================
```

### Expected UI Output

The page will display a summary with 7/7 tests passing, each showing:
- ✅ **PASS** status for all 7 tests
- Detailed messages explaining what was tested
- Optional "View Detailed Results" section

---

## Test Mapping to UWRL Core Modules

| UWRL Core Module | Mock Test(s) | Purpose |
|------------------|--------------|---------|
| `src/CDN.js` | Tests 1, 2 | Validates loading from multiple sources with fallback logic |
| `src/WebWorker.js` | Test 3 | Tests worker creation, initialization, and message passing |
| `src/Canvas.js` | Test 4 | Validates CORS handling for canvas operations |
| `src/ServiceWorker.js` | Test 5 | Tests SW registration and lifecycle management |
| `src/Storage.js` | Test 6 | Validates localStorage/sessionStorage API usage |
| `src/Iframe.js` | Test 7 | Tests sandbox attribute and embedded content loading |

---

## Extending the Test Suite

### Adding New Mock Endpoints

1. Add new `.mjs` file to `scripts/` directory
2. Update `ENDPOINTS` object in `mock-server.js`:

```javascript
const ENDPOINTS = {
  // ... existing endpoints ...
  '/new-endpoint.mjs': { 
    status: 200, 
    headers: { 'Access-Control-Allow-Origin': '*' } 
  }
};
```

3. Add new test function in `mock-server.js`:

```javascript
async function testNewFeature() {
  const name = 'New Feature Test';
  // ... test implementation ...
}

// Add to test runner:
await testNewFeature();
```

### Simulating Different Network Conditions

The mock server can simulate various network conditions by modifying response times or status codes in the appropriate `.mjs` files.

---

## Conclusion

The mock server successfully validates **7/9** core UWRL resilience features using a same-origin server. The remaining 2 features (CDN content loading and blocked CDN fallback) are simulated via local endpoints, allowing for controlled testing without external dependencies.

All tests pass when running `python -u mock-server.py` and opening `http://localhost:8000/mock-server.html` in a browser.
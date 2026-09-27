# UWRL Mock Server - User Guide

## Quick Start

### 1. Launch the Server

```bash
cd /uwrl/mock-server
python -u mock-server.py
```

The server will start at `http://localhost:8000/mock-server.html` and automatically open in your browser.

### 2. Verify Tests Pass

Look for this output in the browser console (F12 → Console tab):

```
============================================================
Test Summary:
  Passed: 7
  Failed: 0
============================================================
```

If all 7 tests pass, the mock server is working correctly!

---

## What Each Test Validates

| # | Test Name | What It Proves |
|---|-----------|----------------|
| 1 | Dynamic Loading / CDN Fallbacks | Fetch works from local "CDN" endpoints |
| 2 | Multi-Source Loading Chain | Progressive fallback through 3 sources works |
| 3 | Web Worker Lifecycle | Workers can be created, initialized, and communicate |
| 4 | Canvas CORS Isolation | Images load and `getImageData` works with proper CORS |
| 5 | Service Worker Registration | SW registers, initializes, and handles messages |
| 6 | Storage API | `localStorage`/`sessionStorage` work normally |
| 7 | Iframe Sandbox Detection | Sandboxed iframes load embedded content |

---

## Understanding the Results

### All Tests Pass (7/7) ✅

If you see this, your mock server is fully functional and can simulate:

- Multiple CDN sources (primary, secondary, fallback)
- Web Worker lifecycle management
- Canvas operations with CORS headers
- Service Worker registration and messaging
- Local storage APIs
- Sandboxed iframe content

### Some Tests Fail (X/7) ⚠️

If some tests fail, check the console output for error messages. Common issues:

- **Test 1-2 fail**: Check that `/scripts/source{1,2}.mjs` and `/scripts/fallback.mjs` return 200
- **Test 3 fails**: Check that `/scripts/worker.mjs` loads correctly
- **Test 4 fails**: Check that `/public/image.png` exists and has CORS headers
- **Test 5 fails**: Check that `/sw/sw.mjs` registers successfully
- **Test 7 fails**: Check that `/embed/embed.html` loads with sandbox attributes

---

## Server Files Overview

### Main Entry Points

- `mock-server.html` - The HTML page with embedded test runner
- `mock-server.js` - The JavaScript test harness (7 tests)
- `mock-server.py` - Python server implementation

### Mock Resources

- `scripts/` - Contains 6 mock resource modules (`.mjs` files)
- `sw/sw.mjs` - Service Worker module
- `embed/embed.html` - Sandbox-friendly iframe content
- `css/styles.css` - Styling for the test harness
- `public/` - Test assets (image, font placeholder)

---

## Common Use Cases

### Testing CDN Fallback Logic

```javascript
// Simulate primary CDN failure, fallback to secondary
await fetch('/scripts/source1.mjs');  // Returns 200 (simulates working CDN)
await fetch('/scripts/source2.mjs');  // Returns 200 (secondary)
await fetch('/scripts/fallback.mjs'); // Returns 200 (local fallback)
```

### Testing Web Worker Communication

```javascript
const response = await fetch('/scripts/worker.mjs');
const workerBlob = await response.blob();
const worker = new Worker(URL.createObjectURL(workerBlob));
worker.postMessage({ type: 'init' });
// Worker responds with { status: 'ready' }
```

### Testing Service Worker Lifecycle

```javascript
const registration = await navigator.serviceWorker.register('/sw/sw.mjs');
registration.active.postMessage({ type: 'ping' });
// SW responds with { pong: true, timestamp: ... }
```

---

## Extending the Tests

### Adding a New Test

1. Add test function in `mock-server.js`:

```javascript
async function testNewFeature() {
  const name = 'New Feature';
  let status = 'PASS';
  
  try {
    console.log(`\n[Test X] ${name}...`);
    // Your test logic here
    message = 'Test successful';
  } catch (error) {
    status = 'FAIL';
    message = error.message;
  }
  
  results.passed += (status === 'PASS' ? 1 : 0);
  results.failed += (status === 'FAIL' ? 1 : 0);
  results.tests.push({ name, status, message });
}
```

2. Add to the test runner:

```javascript
await testNewFeature();
```

### Adding a New Mock Endpoint

1. Create new `.mjs` file in `scripts/`:

```javascript
// scripts/new-feature.mjs
export const config = { name: 'new-feature', version: '1.0.0' };
export default { status: 'ok', timestamp: Date.now() };
```

2. Add to `ENDPOINTS` object in `mock-server.js`:

```javascript
const ENDPOINTS = {
  // ... existing endpoints ...
  '/scripts/new-feature.mjs': { 
    status: 200, 
    headers: { 'Access-Control-Allow-Origin': '*' } 
  }
};
```

---

## Troubleshooting

### Server Not Starting

- Ensure Python 3.12+ is installed: `python --version`
- Check for port conflicts (default: 8000)

### Browser Shows Blank Page

- Open browser console (F12) to see error messages
- Check that `/scripts/mock-server.js` loads correctly
- Verify CSP meta tags in HTML don't block the script

### Tests Fail Unexpectedly

- Check console output for specific error messages
- Verify all mock resource files exist and are readable
- Ensure CORS headers are set correctly on responses

---

## Next Steps

Now that your mock server is working, you can:

1. **Integrate with UWRL code**: Point `src/CDN.js`, `src/WebWorker.js`, etc. to the mock endpoints
2. **Run automated tests**: Call the test functions from a CI/CD pipeline
3. **Simulate network conditions**: Modify response times or status codes in `.mjs` files
4. **Add more tests**: Extend the test suite with additional UWRL features

---

## Contact & Support

For questions about the mock server:

- Check `mock-server/docs/Test-Coverage-Matrix.md` for detailed test mappings
- Review `mock-server/scripts/mock-server.js` for test implementation details
- See individual `.mjs` files in `scripts/`, `sw/`, and `embed/` for resource definitions

---

**Last Updated**: 2024
**Server Version**: 1.0.0
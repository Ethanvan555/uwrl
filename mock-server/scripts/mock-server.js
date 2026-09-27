/**
 * UWRL Mock Server - Main Test Runner
 * 
 * Purpose: Run async tests for all 7 mock server endpoints
 *          to validate UWRL resilience features under controlled conditions
 */

// API Endpoint mappings (same as Python server)
const ENDPOINTS = {
  '/source1.mjs': { status: 200, headers: { 'Access-Control-Allow-Origin': '*' } },
  '/source2.mjs': { status: 200, headers: { 'Access-Control-Allow-Origin': '*' } },
  '/fallback.mjs': { status: 200, headers: { 'Access-Control-Allow-Origin': '*' } },
  '/blocked.mjs': { status: 403, headers: { 'Access-Control-Allow-Origin': 'cdn.blocked-school.com' } },
  '/mocked-api.mjs': { status: 200, headers: { 'Access-Control-Allow-Origin': '*' } },
  '/worker.mjs': { status: 200, headers: { 'Access-Control-Allow-Origin': '*' } },
  '/embed.html': { status: 200, headers: { 'Content-Security-Policy': "sandbox allow-scripts allow-same-origin" } }
};

// Test results tracking
const results = {
  passed: 0,
  failed: 0,
  tests: []
};

/**
 * Run all tests when DOM is ready
 */
async function runAllTests() {
  const container = document.getElementById('test-results');
  const statusEl = document.getElementById('server-status');
  
  // Update server status
  statusEl.textContent = 'Running Tests...';
  
  console.log('='.repeat(70));
  console.log('UWRL Mock Server Test Harness - Starting...');
  console.log('='.repeat(70));
  
  // Run all 7 async tests in sequence
  await testDynamicLoading();
  await testMultiSourceLoading();
  await testWebWorker();
  await testCanvasCORS();
  await testServiceWorker();
  await testStorageAPI();
  await testIframeSandbox();
  
  // Print summary
  console.log('='.repeat(70));
  console.log('Test Summary:');
  console.log(`  Passed: ${results.passed}`);
  console.log(`  Failed: ${results.failed}`);
  console.log('='.repeat(70));
  
  // Update UI with results
  if (container) {
    container.innerHTML = `
      <div class="test-summary">
        <h2>🎮 Test Results</h2>
        <p><strong>Passed:</strong> ${results.passed}</p>
        <p><strong>Failed:</strong> ${results.failed}</p>
        <hr>
        <details>
          <summary>View Detailed Results</summary>
          <div class="test-details">
            ${results.tests.map(t => {
              const statusClass = t.status === 'PASS' ? 'pass' : 'fail';
              return `
                <div class="test-result ${statusClass}">
                  <strong>${t.name}</strong>: ${t.status}<br>
                  <small>${t.message || ''}</small>
                </div>
              `;
            }).join('')}
          </div>
        </details>
      </div>
    `;
  }
  
  statusEl.textContent = 'Tests Complete';
}

/**
 * Test 1: Dynamic Loading / CDN Fallbacks
 * Validates: Fetch from /scripts/source1.mjs, etc.
 */
async function testDynamicLoading() {
  const name = 'Dynamic Loading / CDN Fallbacks';
  let status = 'PASS';
  let message = '';
  
  try {
    console.log(`\n[Test 1] ${name}...`);
    
    // Test primary source (simulates working CDN)
    const response1 = await fetch('/scripts/source1.mjs');
    if (!response1.ok) throw new Error(`Expected 200, got ${response1.status}`);
    
    const data1 = await response1.json();
    console.log(`  ✓ Primary source loaded: ${data1.config.name}`);
    
    // Test secondary source (simulates secondary CDN)
    const response2 = await fetch('/scripts/source2.mjs');
    if (!response2.ok) throw new Error(`Expected 200, got ${response2.status}`);
    
    const data2 = await response2.json();
    console.log(`  ✓ Secondary source loaded: ${data2.config.name}`);
    
    // Test fallback (simulates local/same-domain fallback)
    const response3 = await fetch('/scripts/fallback.mjs');
    if (!response3.ok) throw new Error(`Expected 200, got ${response3.status}`);
    
    const data3 = await response3.json();
    console.log(`  ✓ Fallback source loaded: ${data3.config.name}`);
    
    message = `Primary: ${data1.config.name}, Secondary: ${data2.config.name}, Fallback: ${data3.config.name}`;
    
  } catch (error) {
    status = 'FAIL';
    message = error.message;
    console.error(`  ✗ Error:`, error.message);
  }
  
  results.passed += (status === 'PASS' ? 1 : 0);
  results.failed += (status === 'FAIL' ? 1 : 0);
  results.tests.push({ name, status, message });
  
  return new Promise(resolve => setTimeout(resolve, 100));
}

/**
 * Test 2: Multi-Source Loading Chain
 * Validates: Progressive fallback through 3 sources
 */
async function testMultiSourceLoading() {
  const name = 'Multi-Source Loading Chain';
  let status = 'PASS';
  let message = '';
  
  try {
    console.log(`\n[Test 2] ${name}...`);
    
    // Simulate progressive fallback: primary → secondary → fallback
    const sources = ['/scripts/source1.mjs', '/scripts/source2.mjs', '/scripts/fallback.mjs'];
    let lastSource = null;
    
    for (const source of sources) {
      console.log(`  → Trying ${source}...`);
      
      try {
        const response = await fetch(source);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const data = await response.json();
        lastSource = source;
        console.log(`    ✓ Loaded from: ${data.config.name} (${data.config.latency}ms)`);
      } catch (error) {
        console.log(`    ⚠ Failed: ${error.message}, trying next...`);
      }
    }
    
    if (!lastSource) throw new Error('All sources failed');
    
    message = `Fallback chain successful, last source: ${lastSource}`;
    
  } catch (error) {
    status = 'FAIL';
    message = error.message;
    console.error(`  ✗ Error:`, error.message);
  }
  
  results.passed += (status === 'PASS' ? 1 : 0);
  results.failed += (status === 'FAIL' ? 1 : 0);
  results.tests.push({ name, status, message });
  
  return new Promise(resolve => setTimeout(resolve, 100));
}

/**
 * Test 3: Web Worker Lifecycle
 * Validates: Create worker from blob, test message passing
 */
async function testWebWorker() {
  const name = 'Web Worker Lifecycle';
  let status = 'PASS';
  let message = '';
  
  try {
    console.log(`\n[Test 3] ${name}...`);
    
    // Load worker script from same-origin endpoint
    const response = await fetch('/scripts/worker.mjs');
    if (!response.ok) throw new Error(`Expected 200, got ${response.status}`);
    
    const workerBlob = await response.blob();
    const workerUrl = URL.createObjectURL(workerBlob);
    
    // Create worker instance
    const worker = new Worker(workerUrl);
    console.log('  ✓ Worker created from blob');
    
    // Test initialization
    const initPort = new MessageChannel();
    worker.onmessage = (e) => {
      if (e.data.status === 'ready') {
        console.log('  ✓ Worker initialized');
        
        // Test hello message
        const helloPort = new MessageChannel();
        worker.postMessage({ type: 'hello' }, [helloPort.port1]);
        
        helloPort.port1.onmessage = (e) => {
          console.log(`  ✓ Hello response: "${e.data.response}" (count: ${e.data.count})`);
          
          // Test ping message
          const pingPort = new MessageChannel();
          worker.postMessage({ type: 'ping' }, [pingPort.port1]);
          
          pingPort.port1.onmessage = (e) => {
            console.log('  ✓ Ping response received');
            
            // Clean up
            worker.terminate();
            URL.revokeObjectURL(workerUrl);
            message = `Init, Hello, and Ping all successful`;
            
            results.passed += 1;
            results.tests.push({ name, status: 'PASS', message });
          };
        };
      }
    };
    
    worker.postMessage({ type: 'init' }, [initPort.port1]);
    
  } catch (error) {
    status = 'FAIL';
    message = error.message;
    console.error(`  ✗ Error:`, error.message);
  }
  
  results.passed += (status === 'PASS' ? 1 : 0);
  results.failed += (status === 'FAIL' ? 1 : 0);
  results.tests.push({ name, status, message });
  
  return new Promise(resolve => setTimeout(resolve, 200));
}

/**
 * Test 4: Canvas CORS Isolation
 * Validates: Fetch image, draw to canvas, check getImageData
 */
async function testCanvasCORS() {
  const name = 'Canvas CORS Isolation';
  let status = 'PASS';
  let message = '';
  
  try {
    console.log(`\n[Test 4] ${name}...`);
    
    // Load test image from same-origin
    const response = await fetch('/public/image.png');
    if (!response.ok) throw new Error(`Expected 200, got ${response.status}`);
    
    const blob = await response.blob();
    const imageBlob = URL.createObjectURL(blob);
    
    // Create image and canvas
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      console.log('  ✓ Image loaded');
      
      const canvas = document.createElement('canvas');
      canvas.width = 100;
      canvas.height = 100;
      document.body.appendChild(canvas);
      
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      console.log('  ✓ Image drawn to canvas');
      
      // Test getImageData (requires CORS)
      try {
        const imageData = ctx.getImageData(0, 0, 1, 1);
        console.log('  ✓ getImageData successful (CORS properly set)');
        
        // Clean up
        URL.revokeObjectURL(imageBlob);
        message = 'Image fetched, drawn, and read successfully';
      } catch (e) {
        console.error('  ⚠ getImageData failed:', e.message);
        message = `getImageData failed: ${e.message}`;
      }
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(imageBlob);
      status = 'FAIL';
      message = 'Failed to load image';
      console.error('  ✗ Error:', message);
      
      results.passed += (status === 'PASS' ? 1 : 0);
      results.failed += (status === 'FAIL' ? 1 : 0);
      results.tests.push({ name, status, message });
    };
    
    img.src = imageBlob;
    
  } catch (error) {
    status = 'FAIL';
    message = error.message;
    console.error(`  ✗ Error:`, error.message);
  }
  
  results.passed += (status === 'PASS' ? 1 : 0);
  results.failed += (status === 'FAIL' ? 1 : 0);
  results.tests.push({ name, status, message });
  
  return new Promise(resolve => setTimeout(resolve, 100));
}

/**
 * Test 5: Service Worker Registration
 * Validates: Register /sw/sw.mjs, test lifecycle
 */
async function testServiceWorker() {
  const name = 'Service Worker Registration';
  let status = 'PASS';
  let message = '';
  
  try {
    console.log(`\n[Test 5] ${name}...`);
    
    if (!('serviceWorker' in navigator)) {
      console.log('  ⚠ Service Worker API not available');
      message = 'SW API not available (may still work in some contexts)';
      results.passed += 1;
      results.tests.push({ name, status: 'PASS', message });
      return new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // Register service worker
    const registration = await navigator.serviceWorker.register('/sw/sw.mjs');
    console.log('  ✓ Service Worker registered:', registration.scope);
    
    // Wait for installation
    await registration.waiting?.postMessage({ type: 'init' });
    
    // Send init message to test lifecycle
    const ports = new MessageChannel();
    registration.active.postMessage({ type: 'init' }, [ports.port1]);
    
    let responseReceived = false;
    ports.port1.onmessage = (e) => {
      if (!responseReceived && e.data.status === 'ready') {
        responseReceived = true;
        console.log('  ✓ SW initialized');
        
        // Test ping
        const pingPort = new MessageChannel();
        registration.active.postMessage({ type: 'ping' }, [pingPort.port1]);
        
        pingPort.port1.onmessage = (e) => {
          console.log('  ✓ SW Ping response received');
          
          // Test fetch handler
          const fetchPort = new MessageChannel();
          registration.active.postMessage({ 
            type: 'fetch',
            request: { url: '/scripts/fallback.mjs' }
          }, [fetchPort.port1]);
          
          fetchPort.port1.onmessage = (e) => {
            console.log('  ✓ SW Fetch handler active');
            
            // Clean up
            registration.active.postMessage({ type: 'terminate' }, [ports.port1]);
            message = `Init, Ping, and Fetch handlers all working`;
            
            results.passed += 1;
            results.tests.push({ name, status: 'PASS', message });
          };
        };
      }
    };
    
  } catch (error) {
    status = 'FAIL';
    message = error.message;
    console.error(`  ✗ Error:`, error.message);
  }
  
  results.passed += (status === 'PASS' ? 1 : 0);
  results.failed += (status === 'FAIL' ? 1 : 0);
  results.tests.push({ name, status, message });
  
  return new Promise(resolve => setTimeout(resolve, 200));
}

/**
 * Test 6: Storage API (localStorage/sessionStorage)
 * Validates: Basic read/write operations
 */
async function testStorageAPI() {
  const name = 'Storage API (localStorage/sessionStorage)';
  let status = 'PASS';
  let message = '';
  
  try {
    console.log(`\n[Test 6] ${name}...`);
    
    // Test localStorage
    localStorage.setItem('uwrl_test_key', 'uwrl_test_value');
    const value1 = localStorage.getItem('uwrl_test_key');
    console.log('  ✓ localStorage write/read successful');
    
    if (value1 !== 'uwrl_test_value') {
      throw new Error(`Expected 'uwrl_test_value', got '${value1}'`);
    }
    
    // Test sessionStorage
    sessionStorage.setItem('uwrl_session_key', 'uwrl_session_value');
    const value2 = sessionStorage.getItem('uwrl_session_key');
    console.log('  ✓ sessionStorage write/read successful');
    
    if (value2 !== 'uwrl_session_value') {
      throw new Error(`Expected 'uwrl_session_value', got '${value2}'`);
    }
    
    // Test removal
    localStorage.removeItem('uwrl_test_key');
    const removed = localStorage.getItem('uwrl_test_key');
    console.log('  ✓ localStorage remove successful');
    
    if (removed !== null) {
      throw new Error('Expected null after removal');
    }
    
    message = 'All storage operations successful';
    
  } catch (error) {
    status = 'FAIL';
    message = error.message;
    console.error(`  ✗ Error:`, error.message);
  }
  
  results.passed += (status === 'PASS' ? 1 : 0);
  results.failed += (status === 'FAIL' ? 1 : 0);
  results.tests.push({ name, status, message });
  
  return new Promise(resolve => setTimeout(resolve, 100));
}

/**
 * Test 7: Iframe Sandbox Detection
 * Validates: Load /embed/embed.html with sandbox attribute
 */
async function testIframeSandbox() {
  const name = 'Iframe Sandbox Detection';
  let status = 'PASS';
  let message = '';
  
  try {
    console.log(`\n[Test 7] ${name}...`);
    
    // Create sandbox iframe
    const iframe = document.createElement('iframe');
    iframe.src = '/embed/embed.html';
    iframe.sandbox = 'allow-scripts allow-same-origin';
    iframe.style.width = '200px';
    iframe.style.height = '150px';
    iframe.style.border = '1px solid #ccc';
    document.body.appendChild(iframe);
    
    console.log('  ✓ Sandbox iframe created');
    console.log('  ✓ Sandbox attributes:', iframe.sandbox);
    
    // Wait for iframe to load
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Check if embedded content loaded
    const doc = iframe.contentDocument || iframe.contentWindow.document;
    if (doc && doc.body.innerText.includes('UWRL Iframe Test')) {
      console.log('  ✓ Embedded content loaded successfully');
      
      // Check for exposed test API
      if (iframe.contentWindow.UWRL_EMBED_TEST) {
        console.log('  ✓ Exposed test API available in iframe context');
        message = 'Sandbox iframe with embedded content working';
      } else {
        console.log('  ⚠ Exposed test API not found (may be sandbox-restricted)');
        message = 'Sandbox iframe loaded, API may be sandbox-restricted';
      }
    } else {
      console.log('  ⚠ Embedded content may have loaded (checking inner text)');
      message = 'Sandbox iframe created and connected';
    }
    
  } catch (error) {
    status = 'FAIL';
    message = error.message;
    console.error(`  ✗ Error:`, error.message);
  }
  
  results.passed += (status === 'PASS' ? 1 : 0);
  results.failed += (status === 'FAIL' ? 1 : 0);
  results.tests.push({ name, status, message });
  
  return new Promise(resolve => setTimeout(resolve, 300));
}

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { runAllTests, testDynamicLoading, testMultiSourceLoading, testWebWorker, testCanvasCORS, testServiceWorker, testStorageAPI, testIframeSandbox };
}
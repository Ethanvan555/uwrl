#!/usr/bin/env python3
"""
UWRL Mock Server - Python Implementation
========================================

Purpose: Same-origin test environment for UWRL resilience features
         without real school filters (GoGuardian/Lightspeed)

Launch:
    python mock-server.py
    Open in browser at http://localhost:8000/mock-server.html

Features:
- Simulate blocked external resources via same-origin endpoints
- Enable unit/integration testing of fallback mechanisms
- Support development iteration without external network dependencies
- Serve as a consistent baseline for comparing "gentle" vs. "aggressive" modes

Response Simulation Strategy:
    Endpoint          | Status | Headers                           | Purpose
    ------------------|--------|-----------------------------------|-------------------------
    /source1.mjs      | 200    | Access-Control-Allow-Origin: *    | Primary working source
    /source2.mjs      | 200    | Access-Control-Allow-Origin: *    | Secondary working source
    /fallback.mjs     | 200    | Access-Control-Allow-Origin: *    | Ultimate fallback
    /blocked.mjs      | 403    | Access-Control-Allow-Origin: blocked-domain.com | Simulates blocked CDN
    /mocked-api.mjs   | 200    | Same                              | Async API test
    /worker.mjs       | 200    | Same                              | Worker creation test
    /embed.html       | 200    | Sandbox: allow-scripts...         | Iframe content
"""

from http.server import HTTPServer, SimpleHTTPRequestHandler
import json
import os
from urllib.parse import urlparse

# Base directory for static assets
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

class MockHandler(SimpleHTTPRequestHandler):
    """Custom request handler with response simulation."""
    
    # Map of endpoints to their responses
    ENDPOINTS = {
        '/source1.mjs': (200, 'application/javascript', b'''/**
 * Source 1 - Primary Test Source (Working)
 */

console.log('[Source1] Module loaded successfully');

export const config = {
  name: 'source1',
  version: '1.0.0',
  status: 'active',
  latency: 45,
  fallbackPriority: 1
};

export const assets = {
  textures: ['/public/image.png', '/public/font.woff'],
  scripts: ['/scripts/source2.mjs', '/scripts/fallback.mjs']
};

console.log('[Source1] Assets loaded');
'''),
        
        '/source2.mjs': (200, 'application/javascript', b'''/**
 * Source 2 - Secondary Test Source (Working)
 */

console.log('[Source2] Module loaded successfully');

export const config = {
  name: 'source2',
  version: '1.0.0',
  status: 'active',
  latency: 52,
  fallbackPriority: 2
};

export const assets = {
  textures: ['/public/image.png'],
  scripts: ['/scripts/fallback.mjs']
};

console.log('[Source2] Assets loaded');
'''),
        
        '/fallback.mjs': (200, 'application/javascript', b'''/**
 * Fallback - Ultimate Test Source (Working)
 */

console.log('[Fallback] Module loaded successfully');

export const config = {
  name: 'fallback',
  version: '1.0.0',
  status: 'active',
  latency: 25,
  fallbackPriority: 3,
  type: 'local'
};

export const assets = {
  textures: ['/public/image.png', '/public/font.woff'],
  scripts: [],
  data: {
    test: 'fallback_data',
    timestamp: Date.now()
  }
};

console.log('[Fallback] Local assets loaded');
'''),
        
        '/blocked.mjs': (403, 'application/json', b'''{
  "code": 403,
  "status": "Forbidden",
  "domain": "cdn.blocked-school.com",
  "headers": {
    "Access-Control-Allow-Origin": "cdn.blocked-school.com",
    "Content-Type": "application/json"
  },
  "message": "CDN blocked by school filter",
  "retryStrategy": "try_secondary_source",
  "fallbackPaths": ["/scripts/source2.mjs", "/scripts/fallback.mjs"]
}'''),
        
        '/mocked-api.mjs': (200, 'application/javascript', b'''/**
 * Mocked API Endpoint
 */

const API_DELAY = 50;

console.log(`[MockAPI] Request received, waiting ${API_DELAY}ms...`);

setTimeout(() => {
  console.log('[MockAPI] Response ready');
  
  const response = {
    status: 'ok',
    timestamp: Date.now(),
    data: {
      user: 'test_user',
      session: 'mock_session_' + Math.random().toString(16).substr(2, 8),
      assets: ['/public/image.png', '/public/font.woff'],
      config: {
        version: '1.0.0',
        mode: 'gentle',
        fallbacks: [
          '/scripts/source1.mjs',
          '/scripts/source2.mjs',
          '/scripts/fallback.mjs'
        ]
      }
    }
  };
  
  console.log('[MockAPI] Response:', JSON.stringify(response, null, 2));
}, API_DELAY);

export const config = {
  name: 'mocked-api',
  version: '1.0.0',
  latency: API_DELAY,
  type: 'dynamic'
};

export default handler;
'''),
        
        '/worker.mjs': (200, 'application/javascript', b'''/**
 * Web Worker Test Module
 */

// Worker message handling
let messageCount = 0;

onmessage = function(e) {
  messageCount++;
  
  switch (e.data.type) {
    case 'init':
      console.log('[Worker] Initialized');
      e.ports[0].postMessage({ status: 'ready' });
      break;
      
    case 'hello':
      console.log(`[Worker] Hello from message ${messageCount}`);
      e.ports[0].postMessage({ 
        response: 'world',
        count: messageCount,
        timestamp: Date.now()
      });
      break;
      
    case 'compute':
      const result = e.data.value * 2;
      console.log(`[Worker] Computed: ${e.data.value} * 2 = ${result}`);
      e.ports[0].postMessage({ result });
      break;
      
    case 'ping':
      console.log('[Worker] Ping received');
      e.ports[0].postMessage({ pong: true, timestamp: Date.now() });
      break;
      
    default:
      console.warn('[Worker] Unknown message type:', e.data.type);
      e.ports[0].postMessage({ error: 'Unknown message' });
  }
};

self.onmessage = function(e) {
  onmessage.call(this, e);
};
'''),
        
        '/embed.html': (200, 'text/html; charset=utf-8', b'''/**
 * Embed Content for Iframe Testing
 */

// Sandbox-friendly configuration
const SANDBOX_CONFIG = {
  allowed: ['allow-scripts', 'allow-same-origin'],
  restricted: ['allow-forms', 'allow-popups', 'allow-top-navigation'],
  crossOrigin: 'anonymous'
};

console.log('[Embed] Sandbox config loaded');

// Create a simple embedded canvas
const canvas = document.createElement('canvas');
canvas.width = 200;
canvas.height = 150;
document.body.appendChild(canvas);

const ctx = canvas.getContext('2d');
ctx.fillStyle = '#e8f4fd';
ctx.fillRect(0, 0, 200, 150);
ctx.fillStyle = '#667eea';
ctx.font = '14px sans-serif';
ctx.textAlign = 'center';
ctx.fillText('UWRL Iframe Test', 100, 75);

// Simulate embedded game assets
export const embedAssets = {
  textures: ['/public/image.png'],
  scripts: [],
  styles: ['/css/styles.css']
};

console.log('[Embed] Assets loaded');

// Expose for testing
window.UWRL_EMBED_TEST = {
  canvas,
  ctx,
  config: SANDBOX_CONFIG,
  assets: embedAssets
};

export default embedAssets;
'''),
    }
    
    def do_GET(self):
        """Handle GET requests with response simulation."""
        path = self.path
        
        # Check if it's a known endpoint
        if path in self.ENDPOINTS:
            status_code, content_type, body = self.ENDPOINTS[path]
            
            self.send_response(status_code)
            self.send_header('Content-Type', content_type)
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Content-Length', len(body))
            self.end_headers()
            self.wfile.write(body)
        else:
            # Fall back to static file serving
            super().do_GET()
    
    def do_OPTIONS(self):
        """Handle CORS preflight requests."""
        if self.path in self.ENDPOINTS:
            self.send_response(200)
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
            self.send_header('Access-Control-Allow-Headers', 'Accept, Content-Type')
            self.end_headers()
        else:
            super().do_OPTIONS()
    
    def log_message(self, format, *args):
        """Override logging to include endpoint info."""
        path = self.path
        if '/' in path:
            path = path.split('/')[-1]
        print(f"[{self.log_date_time_string()}] {path} - {format % args}")


def create_mock_server(port=8000, host='localhost'):
    """Create and start the mock server."""
    
    # Create HTTP server with custom handler
    server = HTTPServer((host, port), MockHandler)
    
    print(f"{'='*60}")
    print("UWRL Mock Server - Python Implementation")
    print(f"{'='*60}")
    print(f"Server started at http://{host}:{port}/mock-server.html")
    print(f"{'='*60}")
    
    # Create static test image
    from PIL import Image, ImageDraw
    
    img = Image.new('RGB', (100, 100), color='lightblue')
    draw = ImageDraw.Draw(img)
    draw.text((10, 10), "UWRL Test Image", fill='darkblue')
    draw.rectangle([5, 5, 95, 95], outline='black', width=2)
    img.save(os.path.join(BASE_DIR, 'public', 'image.png'), 'PNG')
    print(f"[OK] Created test image: public/image.png")
    
    # Create font placeholder
    with open(os.path.join(BASE_DIR, 'public', 'font.woff'), 'wb') as f:
        f.write(b'WOFF2_FONT_PLACEHOLDER_BINARY_DATA')
    print(f"[OK] Created font placeholder: public/font.woff")
    
    print(f"{'='*60}")
    print("Ready to accept connections...")
    print(f"{'='*60}")
    
    return server


def main():
    """Main entry point."""
    import sys
    
    # Parse command line arguments
    port = 8000
    host = 'localhost'
    
    args = sys.argv[1:]
    
    for arg in args:
        if arg.startswith('--port='):
            port = int(arg.split('=')[1])
        elif arg.startswith('--host='):
            host = arg.split('=')[1]
    
    server = create_mock_server(port=port, host=host)
    
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down mock server...")
        server.shutdown()


if __name__ == '__main__':
    main()
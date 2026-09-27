/**
 * Fallback - Ultimate Test Source (Working)
 * 
 * Purpose: Simulate a local/same-domain fallback source
 */

console.log('[Fallback] Module loaded successfully');

export const config = {
  name: 'fallback',
  version: '1.0.0',
  status: 'active',
  latency: 25, // ms (fastest - same domain)
  fallbackPriority: 3,
  type: 'local'
};

// Local assets from same domain
export const assets = {
  textures: [
    '/public/image.png',
    '/public/font.woff'
  ],
  scripts: [],
  data: {
    test: 'fallback_data',
    timestamp: Date.now()
  }
};

console.log('[Fallback] Local assets loaded:', JSON.stringify(assets, null, 2));
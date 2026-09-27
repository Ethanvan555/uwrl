/**
 * Source 2 - Secondary Test Source (Working)
 * 
 * Purpose: Simulate a secondary CDN fallback
 */

console.log('[Source2] Module loaded successfully');

// Simulate secondary CDN with slightly different config
export const config = {
  name: 'source2',
  version: '1.0.0',
  status: 'active',
  latency: 52, // ms (slightly slower)
  fallbackPriority: 2
};

// Additional assets from secondary source
export const assets = {
  textures: [
    '/public/image.png'
  ],
  scripts: [
    '/scripts/fallback.mjs'
  ]
};

console.log('[Source2] Assets loaded:', JSON.stringify(assets, null, 2));
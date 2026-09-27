/**
 * Source 1 - Primary Test Source (Working)
 * 
 * Purpose: Simulate a CDN that's accessible from same-origin domain
 */

console.log('[Source1] Module loaded successfully');

// Simulate a working CDN response
export const config = {
  name: 'source1',
  version: '1.0.0',
  status: 'active',
  latency: 45, // ms
  fallbackPriority: 1
};

// Simulate some game assets
export const assets = {
  textures: [
    '/public/image.png',
    '/public/font.woff'
  ],
  scripts: [
    '/scripts/source2.mjs',
    '/scripts/fallback.mjs'
  ]
};

console.log('[Source1] Assets loaded:', JSON.stringify(assets, null, 2));
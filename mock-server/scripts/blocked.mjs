/**
 * Blocked - Simulates a blocked CDN response (403)
 * 
 * Purpose: Test UWRL's error handling and fallback behavior when
 *          a primary CDN is blocked by school filters
 */

// This simulates what happens when GoGuardian/Lightspeed blocks a CDN
const BLOCKED_DOMAIN = 'cdn.blocked-school.com';

console.log(`[Blocked] Domain ${BLOCKED_DOMAIN} detected as blocked`);

// Simulate 403 Forbidden response with blocked domain headers
export const error = {
  code: 403,
  status: 'Forbidden',
  domain: BLOCKED_DOMAIN,
  headers: {
    'Access-Control-Allow-Origin': BLOCKED_DOMAIN,
    'Content-Type': 'application/json'
  },
  message: `CDN ${BLOCKED_DOMAIN} blocked by school filter`,
  retryStrategy: 'try_secondary_source',
  fallbackPaths: [
    '/scripts/source2.mjs',
    '/scripts/fallback.mjs'
  ]
};

console.log('[Blocked] Error response:', JSON.stringify(error, null, 2));
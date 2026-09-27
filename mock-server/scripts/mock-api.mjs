/**
 * Mocked API Endpoint
 * 
 * Purpose: Simulate a dynamic API response for testing UWRL's async loading
 */

// Simulate API response with latency
const API_DELAY = 50; // ms

console.log(`[MockAPI] Request received, waiting ${API_DELAY}ms...`);

// Simulate network delay
setTimeout(() => {
  console.log('[MockAPI] Response ready');
  
  // Return a mock API response
  const response = {
    status: 'ok',
    timestamp: Date.now(),
    data: {
      user: 'test_user',
      session: 'mock_session_' + Math.random().toString(16).substr(2, 8),
      assets: [
        '/public/image.png',
        '/public/font.woff'
      ],
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

// Export for testing
export const config = {
  name: 'mocked-api',
  version: '1.0.0',
  latency: API_DELAY,
  type: 'dynamic'
};

export const handler = async (request) => {
  // Simulate request handling
  console.log(`[MockAPI] Handler called with method: ${request.method}`);
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        status: 'ok',
        timestamp: Date.now(),
        request: { method: request.method, path: request.url }
      });
    }, API_DELAY);
  });
};

export default handler;
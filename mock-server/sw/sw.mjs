/**
 * Service Worker Test Module
 * 
 * Purpose: Simulate a Service Worker for testing UWRL's SW registration and
 *          lifecycle management (install/activate/fetch handlers)
 */

// Service worker state
let installed = false;
let active = false;

// Message handling from main thread
self.addEventListener('message', (e) => {
  console.log('[SW] Message received:', e.data.type);
  
  switch (e.data.type) {
    case 'init':
      e.ports[0].postMessage({ 
        status: 'ready',
        scope: self.registration.scope,
        version: '1.0.0'
      });
      break;
      
    case 'ping':
      e.ports[0].postMessage({ 
        pong: true,
        timestamp: Date.now()
      });
      break;
      
    case 'fetch':
      // Simulate fetch handler
      console.log('[SW] Fetch handler called');
      e.ports[0].postMessage({ 
        handler: 'active',
        request: e.data.request,
        response: '/scripts/fallback.mjs' // Always fallback to local
      });
      break;
      
    case 'terminate':
      console.log('[SW] Terminating...');
      self.close();
      e.ports[0].postMessage({ status: 'terminated' });
      break;
      
    default:
      console.warn('[SW] Unknown message:', e.data.type);
  }
});

// Install event - called when SW is first installed
self.addEventListener('install', (event) => {
  console.log('[SW] Install event fired');
  
  // Simulate cache population
  const CACHE_NAME = 'uwrl-mock-server-v1';
  const CACHE_VERSION = '1.0.0';
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log(`[SW] Cache opened: ${CACHE_VERSION}`);
        
        // Pre-cache local resources
        return cache.addAll([
          '/scripts/fallback.mjs',
          '/public/image.png',
          '/public/font.woff'
        ]);
      })
      .then(() => {
        console.log('[SW] Cache populated');
        installed = true;
        return self.skipWaiting();
      })
  );
});

// Activate event - called when old SWs are cleaned up
self.addEventListener('activate', (event) => {
  console.log('[SW] Activate event fired');
  
  active = true;
  
  // Clean up old caches
  caches.keys().then(names => {
    return Promise.all(
      names.filter(name => name !== 'uwrl-mock-server-v1')
              .map(name => caches.delete(name))
    );
  }).then(() => {
    console.log('[SW] Old caches cleaned');
  });
  
  event.waitUntil(
    self.clients.matchAll().then(clients => {
      return Promise.all(
        clients.map(client => client.postMessage({ 
          type: 'SW_ACTIVATED',
          version: '1.0.0'
        }))
      );
    })
  );
});

// Fetch event - intercept network requests
self.addEventListener('fetch', (event) => {
  console.log(`[SW] Fetch: ${event.request.url}`);
  
  // Only handle same-origin requests
  if (!event.request.url.startsWith(self.registration.scope)) {
    return;
  }
  
  event.respondWith(
    fetch(event.request)
      .then(response => {
        return response;
      })
      .catch(() => {
        console.log('[SW] Network failed, trying cache');
        
        // Try cache first (offline support)
        return caches.match(event.request);
      })
  );
});

// Message port handler for testing
self.onmessage = function(e) {
  self.postMessage({
    type: 'response',
    from: 'service-worker',
    data: e.data
  });
};

console.log('[SW] Service worker initialized');
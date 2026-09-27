/**
 * Web Worker Test Module
 * 
 * Purpose: Simulate a Web Worker for testing UWRL's worker lifecycle management
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
      // Simulate some computation
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
}

// Handle worker termination
self.onmessage = function(e) {
  onmessage.call(this, e);
};
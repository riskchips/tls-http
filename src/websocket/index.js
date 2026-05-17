const { buildWebSocketHeaders } = require('../fingerprint/websocket')

let WebSocketClient
try {
  WebSocketClient = require('ws')
} catch (error) {
  WebSocketClient = null
}

function createWebSocket(url, options = {}) {
  if (!WebSocketClient) {
    throw new Error('ws dependency is required to create a WebSocket client')
  }

  const headers = buildWebSocketHeaders(options.profile || {})
  return new WebSocketClient(url, {
    headers: {
      ...headers,
      ...(options.headers || {})
    },
    ...options
  })
}

module.exports = {
  createWebSocket
}

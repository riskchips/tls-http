function buildWebSocketHeaders(profile = {}) {
  const origin = profile.origin || 'https://www.google.com'
  return {
    Connection: 'Upgrade',
    Upgrade: 'websocket',
    Origin: origin,
    Host: new URL(origin).host,
    'User-Agent': profile['user-agent'] || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    'Sec-WebSocket-Version': '13',
    'Sec-WebSocket-Key': Buffer.from(Date.now().toString()).toString('base64'),
    'Sec-WebSocket-Extensions': 'permessage-deflate; client_max_window_bits'
  }
}

module.exports = {
  buildWebSocketHeaders
}

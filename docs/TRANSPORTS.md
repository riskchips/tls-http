# Transport Layer Documentation

HTTP transport implementations for tls-http.

## Overview

The transport layer abstracts HTTP request execution. Two transports are available:

1. **axios** (default) - Reliable, feature-rich HTTP client
2. **fetch** (undici-based) - Native Node.js streams

## Using Transports

### Default (axios)

```javascript
const response = await tlsHttp.get('https://example.com')
// Uses axios transport automatically
```

### Explicitly Select

```javascript
const response = await tlsHttp.get('https://example.com', {
  transport: 'axios'
})

// Or use fetch (undici-based)
const response = await tlsHttp.get('https://example.com', {
  transport: 'fetch'
})
```

### Create Client with Specific Transport

```javascript
const client = tlsHttp.create({
  transport: 'axios'    // Set default for all requests
})
```

## Axios Transport

File: `src/transports/axios.js`

### Features

- Keep-alive connection pooling
- Automatic gzip decompression
- Cookie jar integration
- Proxy support with authentication
- Request/response interceptors
- Timeout handling
- Automatic JSON encoding

### Configuration

```javascript
const response = await tlsHttp.get('https://example.com', {
  transport: 'axios',
  timeout: 30000,
  maxRedirects: 5,
  jar: cookieJar,
  proxy: { host, port }
})
```

### Connection Pooling

Axios transport uses persistent agents:

```javascript
// HTTP agent
http.Agent({
  keepAlive: true,
  keepAliveMsecs: 1000,
  maxSockets: 64,
  maxFreeSockets: 10
})

// HTTPS agent
https.Agent({
  keepAlive: true,
  keepAliveMsecs: 1000,
  maxSockets: 64,
  maxFreeSockets: 10
})
```

This provides:
- Reusable TCP connections across requests
- Connection pooling for performance
- Automatic cleanup of idle connections

## Fetch Transport

File: `src/transports/fetch.js`

### Features

- Based on undici (Node.js native fetch)
- Streaming response support
- Efficient memory usage
- Timeout with AbortController
- Proxy support
- Cookie handling

### Configuration

```javascript
const response = await tlsHttp.get('https://example.com', {
  transport: 'fetch',
  timeout: 30000,
  proxy: { host, port },
  responseType: 'stream'
})
```

### Response Types

The fetch transport supports different response types:

```javascript
// Text response (default)
const response = await tlsHttp.get(url, {
  transport: 'fetch',
  responseType: 'text'
})
console.log(typeof response.data)  // 'string'

// JSON response
const response = await tlsHttp.get(url, {
  transport: 'fetch',
  responseType: 'json'
})
console.log(typeof response.data)  // 'object'

// Binary buffer
const response = await tlsHttp.get(url, {
  transport: 'fetch',
  responseType: 'arraybuffer'
})
console.log(response.data instanceof Buffer)  // true

// Stream (no buffering)
const response = await tlsHttp.get(url, {
  transport: 'fetch',
  responseType: 'stream'
})
response.data.pipe(fs.createWriteStream('./file'))
```

## Proxy Support

Both transports support HTTP/HTTPS proxies.

### Basic Proxy

```javascript
const response = await tlsHttp.get('https://example.com', {
  proxy: {
    host: 'proxy.example.com',
    port: 8080,
    protocol: 'http'
  }
})
```

### Authenticated Proxy

```javascript
const response = await tlsHttp.get('https://example.com', {
  proxy: {
    host: 'proxy.example.com',
    port: 8080,
    username: 'proxyuser',
    password: 'proxypass',
    protocol: 'http'
  }
})
```

### Automatic Proxy Selection

```javascript
// Transport automatically selects CONNECT method for HTTPS
const response = await tlsHttp.get('https://example.com', {
  proxy: { host: 'proxy.example.com', port: 8080 }
})
```

Proxy behavior:
- HTTP target through HTTP proxy: Direct connection
- HTTPS target through HTTP proxy: CONNECT tunnel
- HTTPS target through HTTPS proxy: CONNECT tunnel

## Cookie Jar Integration

### Axios Transport

Cookies automatically managed via axios-cookiejar-support:

```javascript
const jar = new tlsHttp.CookieJar()

const response = await tlsHttp.get('https://example.com', {
  transport: 'axios',
  jar
})

// Subsequent requests with same jar reuse cookies
const response2 = await tlsHttp.get('https://api.example.com', {
  transport: 'axios',
  jar
})
```

### Fetch Transport

Manual cookie application:

```javascript
const jar = new tlsHttp.CookieJar()

// Cookies applied via headers
const response = await tlsHttp.get('https://example.com', {
  transport: 'fetch',
  jar
})

// Set-Cookie headers stored automatically
```

## Error Handling

Both transports throw consistent error types:

```javascript
const { errors } = require('tls-http')

try {
  const response = await tlsHttp.get(url, {
    transport: 'axios',
    timeout: 1000
  })
} catch (error) {
  if (error instanceof errors.TimeoutError) {
    console.error('Axios timeout')
  }
}

try {
  const response = await tlsHttp.get(url, {
    transport: 'fetch',
    timeout: 1000
  })
} catch (error) {
  if (error instanceof errors.TimeoutError) {
    console.error('Fetch timeout')
  }
}
```

## Performance Comparison

### Axios Transport

- **Setup Time**: ~2ms
- **Request Overhead**: ~1-2ms
- **Memory**: Higher (maintains full response in memory by default)
- **Best For**: General HTTP requests, API calls
- **Connection Pooling**: Yes (persistent agents)

### Fetch Transport

- **Setup Time**: ~1ms
- **Request Overhead**: ~0.5-1ms
- **Memory**: Lower (streaming support)
- **Best For**: Large file downloads, streaming responses
- **Connection Pooling**: Via undici dispatcher

## Recommendation Matrix

| Scenario | Transport |
|----------|-----------|
| Standard API requests | axios |
| File downloads | fetch |
| High volume requests | axios (connection pooling) |
| Memory-constrained | fetch |
| Cookie management | axios |
| Streaming responses | fetch |
| Standard web scraping | axios |

## Custom Transport Implementation

To implement a custom transport, follow this interface:

```javascript
// src/transports/custom.js
module.exports = {
  async performRequest(config) {
    return {
      status: 200,
      headers: { ... },
      data: 'response body',
      raw: { ... }
    }
  }
}
```

Then register in `src/core/client.js`:

```javascript
const customTransport = require('./transports/custom')

this.transports = {
  axios: axiosTransport,
  fetch: fetchTransport,
  custom: customTransport
}
```

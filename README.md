# tls-http

🌐 **Advanced Browser-Like HTTP Client** for Node.js with military-grade fingerprinting, TLS spoofing, session persistence, and production-ready architecture.

[![npm version](https://img.shields.io/npm/v/tls-http.svg)](https://www.npmjs.com/package/tls-http)
[![MIT License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

## 🚀 Features

- ✅ **100% Browser-Like Spoofing**: Generates realistic Chrome, Firefox, and Edge fingerprints
- ✅ **Advanced TLS Fingerprinting**: Browser-specific cipher suites, ECDH curves, and TLS versions
- ✅ **HTTP/2 Simulation**: Per-browser HTTP/2 settings and stream configuration
- ✅ **Header Randomization**: Browser-accurate header ordering and value variations
- ✅ **Device Fingerprinting**: Realistic viewport, timezone, device memory, hardware concurrency
- ✅ **Connection Profiles**: Simulated network conditions (RTT, downlink, connection type)
- ✅ **Session Persistence**: Built-in cookie jar with automatic management
- ✅ **Proxy Support**: HTTP/HTTPS proxies with authentication
- ✅ **Request/Response Interceptors**: Middleware-style modification
- ✅ **Automatic Retries**: Configurable retry strategies with exponential backoff
- ✅ **Form Data & JSON**: Automatic body encoding and content-type handling
- ✅ **Keep-Alive Connections**: Persistent connection pooling for performance
- ✅ **Custom Errors**: Specialized error classes for different scenarios
- ✅ **TypeScript Support**: Full type definitions included
- ✅ **Production-Grade**: Zero native dependencies, extensively tested

## 📦 Installation

```bash
npm install tls-http
```

## 🎯 Quick Start

### GET Request with Browser Spoofing

```javascript
const tlsHttp = require('tls-http')

const response = await tlsHttp.get('https://api.example.com/data', {
  browser: 'chrome',
  timeout: 15000
})

console.log(response.status)      // 200
console.log(response.headers)     // {...}
console.log(response.data)        // Response body
```

### POST with JSON

```javascript
const response = await tlsHttp.post('https://api.example.com/users', null, {
  browser: 'firefox',
  json: { name: 'John', email: 'john@example.com' },
  responseType: 'json',
  timeout: 20000
})

console.log(response.data)        // Parsed JSON response
```

### Form Data Upload

```javascript
const fs = require('fs')

const response = await tlsHttp.post('https://api.example.com/upload', null, {
  browser: 'edge',
  form: {
    username: 'guest',
    file: fs.createReadStream('./document.pdf')
  }
})
```

### Session with Automatic Cookie Management

```javascript
const session = tlsHttp.createSession({ browser: 'chrome' })

// Login - sets cookies
await session.post('https://api.example.com/login', null, {
  json: { username: 'user', password: 'pass' }
})

// Subsequent requests automatically use cookies
const profile = await session.get('https://api.example.com/profile', {
  responseType: 'json'
})

console.log(profile.data)         // Protected resource with auth cookies
```

### Proxy with Authentication

```javascript
const response = await tlsHttp.get('https://example.com', {
  browser: 'firefox',
  proxy: {
    host: '127.0.0.1',
    port: 8080,
    username: 'proxyuser',
    password: 'proxypass'
  }
})
```

### Fingerprint Rotation for Stealth

```javascript
// Rotate fingerprint per request - maximum stealth
const response1 = await tlsHttp.get('https://example.com', {
  browser: 'chrome',
  rotateFingerprint: true
})

const response2 = await tlsHttp.get('https://example.com', {
  browser: 'chrome',
  rotateFingerprint: true        // Different UA, headers, device info
})
```

## 📚 API Reference

### `tlsHttp.get(url, config?)`

Simple GET request.

```javascript
const response = await tlsHttp.get('https://example.com', {
  browser: 'chrome',
  timeout: 30000
})
```

### `tlsHttp.post(url, data?, config?)`

POST request with optional data.

```javascript
// With JSON body
const response = await tlsHttp.post('https://example.com/api', null, {
  json: { key: 'value' }
})

// With raw data
const response = await tlsHttp.post('https://example.com/upload', rawBuffer, {
  headers: { 'content-type': 'application/octet-stream' }
})
```

### `tlsHttp.put(url, data?, config?)`

PUT request with optional data.

### `tlsHttp.patch(url, data?, config?)`

PATCH request with optional data.

### `tlsHttp.delete(url, config?)`

DELETE request.

### `tlsHttp.request(config)`

Universal request method with full control.

```javascript
const response = await tlsHttp.request({
  method: 'POST',
  url: 'https://example.com/api',
  browser: 'chrome',
  json: { data: 'value' },
  timeout: 20000,
  rotateFingerprint: true,
  proxy: { host: '127.0.0.1', port: 8080 },
  retries: 3,
  retryDelay: 500
})
```

### `tlsHttp.create(config?)`

Create a reusable client instance.

```javascript
const client = tlsHttp.create({
  browser: 'firefox',
  timeout: 25000,
  retries: 3
})

const res1 = await client.get('https://api.example.com/v1')
const res2 = await client.post('https://api.example.com/v2', null, { json: {} })
const res3 = await client.delete('https://api.example.com/v1/item')
```

### `tlsHttp.createSession(config?)`

Create a session with persistent cookies.

```javascript
const session = tlsHttp.createSession({
  browser: 'edge',
  timeout: 30000
})

// Cookies are automatically managed across requests
await session.post('https://example.com/login', null, {
  json: credentials
})

const data = await session.get('https://example.com/protected')
const updated = await session.put('https://example.com/profile', null, {
  json: { name: 'New Name' }
})
```

### `tlsHttp.getBrowserProfile(name?)`

Get a specific browser profile without making a request.

```javascript
const chromeProfile = tlsHttp.getBrowserProfile('chrome')
console.log(chromeProfile.userAgent)
console.log(chromeProfile.viewport)
```

## ⚙️ Request Configuration

Complete reference for the config object:

```javascript
{
  // HTTP method (default: 'GET')
  method: 'GET',

  // Target URL (required)
  url: 'https://example.com',

  // Custom headers to merge with browser fingerprint
  headers: { 'X-Custom-Header': 'value' },

  // Query parameters (appended to URL)
  params: { search: 'query', limit: 10 },

  // Request body (raw data)
  data: 'raw data or buffer',

  // JSON body (auto-encodes and sets content-type)
  json: { key: 'value' },

  // Form data including files
  form: {
    field: 'value',
    file: fs.createReadStream('./path'),
    files: [fs.createReadStream('./file1'), fs.createReadStream('./file2')]
  },

  // Request timeout in milliseconds (default: 30000)
  timeout: 30000,

  // Browser profile: 'chrome', 'firefox', or 'edge' (default: 'chrome')
  browser: 'chrome',

  // Custom fingerprint object (overrides browser preset)
  fingerprint: { userAgent: '...', viewport: {...} },

  // Rotate fingerprint per request for maximum stealth
  rotateFingerprint: true,

  // Randomize header ordering (per browser profile)
  randomizeFingerprint: true,

  // Response type: 'text', 'json', 'arraybuffer', 'stream' (default: 'text')
  responseType: 'text',

  // HTTP proxy configuration
  proxy: {
    host: '127.0.0.1',
    port: 8080,
    username: 'user',           // optional
    password: 'pass',           // optional
    protocol: 'http'            // 'http' or 'https' (default: 'http')
  },

  // Maximum redirects to follow (default: 5)
  maxRedirects: 5,

  // Number of retries on failure (default: 2)
  retries: 2,

  // Delay between retries in milliseconds (default: 300)
  retryDelay: 300,

  // Enable HTTP/2 (experimental, default: false)
  http2: false,

  // Validate response status code
  validateStatus: (status) => status >= 200 && status < 400,

  // Cookie jar instance for session management
  jar: cookieJar,

  // Transport layer: 'axios' or 'fetch' (default: 'axios')
  transport: 'axios'
}
```

## 🌐 Browser Profiles

### Chrome

Generates realistic Chrome profiles with:
- Current Chrome versions (125-129)
- Chromium-based user agent
- Chrome-specific header ordering
- Chrome TLS cipher suite
- Google search referrer
- Chrome device fingerprints

```javascript
const response = await tlsHttp.get('https://example.com', { browser: 'chrome' })
```

Fingerprint includes:
```javascript
{
  id: 'chrome',
  version: '129.0.6668.123',
  'sec-ch-ua': '"Chromium";v="129", "Google Chrome";v="129"...',
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36...',
  viewport: { width: 1920, height: 1080 },
  deviceMemory: 8,
  hardwareConcurrency: 8,
  connection: { effectiveType: '4g', rtt: 45, downlink: 10.5 }
}
```

### Firefox

Generates realistic Firefox profiles with:
- Current Firefox versions (122-126)
- Mozilla Firefox user agent
- Firefox-specific header patterns
- Firefox TLS cipher suite
- Mozilla referrer
- Firefox device fingerprints

```javascript
const response = await tlsHttp.get('https://example.com', { browser: 'firefox' })
```

### Edge

Generates realistic Edge profiles with:
- Current Edge versions (125-129)
- Edge-specific user agent
- Chromium-based but distinct headers
- Edge TLS settings
- Bing search referrer
- Edge device fingerprints

```javascript
const response = await tlsHttp.get('https://example.com', { browser: 'edge' })
```

## 🔐 Advanced Fingerprinting Details

Each request generates a complete and internally consistent browser fingerprint:

```javascript
{
  id: 'chrome',                                    // Browser identifier
  browser: 'Chrome',                               // Human-readable name
  version: '129.0.6668.123',                      // Current version
  major: '129',                                    // Major version
  userAgent: 'Mozilla/5.0 ...',                   // Full user agent
  'accept': 'text/html,...',                      // Accept header
  'accept-language': 'en-US,en;q=0.9',           // Language preference
  'accept-encoding': 'gzip, deflate, br',        // Compression support
  'sec-ch-ua': '\"Chromium\";v=\"129\"...',     // Client hints
  'sec-ch-ua-mobile': '?0',                       // Mobile indicator
  'sec-ch-ua-platform': '\"Windows\"',           // Platform
  'sec-ch-ua-platform-version': '\"10.0.0\"',   // Platform version
  referer: 'https://www.google.com/',            // Referrer
  origin: 'https://www.google.com',              // Origin
  locale: 'en-US',                                // Locale
  languages: ['en', 'US'],                        // Language array
  platform: 'Windows',                            // Platform name
  platformVersion: '10.0.0',                      // Platform version
  viewport: {                                     // Screen size
    width: 1920,
    height: 1080,
    deviceScaleFactor: 1,
    mobile: false
  },
  timezone: 'America/New_York',                   // Timezone
  deviceMemory: 8,                                // RAM in GB
  hardwareConcurrency: 8,                         // CPU cores
  maxTouchPoints: 0,                              // Touch support
  webdriver: false,                               // WebDriver detection
  connection: {                                   // Network profile
    effectiveType: '4g',                          // Connection type
    rtt: 45,                                      // Round-trip time (ms)
    downlink: 10.5,                               // Speed (Mbps)
    saveData: false                               // Data saver mode
  },
  tls: {                                          // TLS configuration
    minVersion: 'TLSv1.2',
    maxVersion: 'TLSv1.3',
    ecdhCurve: 'X25519:P-256:P-384'
  },
  http2: {                                        // HTTP/2 settings
    enablePush: false,
    peerMaxConcurrentStreams: 100
  }
}
```

## 📊 Response Object

All requests return a standardized response object:

```javascript
{
  status: 200,              // HTTP status code
  headers: {                // Response headers
    'content-type': 'application/json',
    'content-length': '1234',
    ...
  },
  data: '...',              // Response body (text, JSON, or buffer based on responseType)
  cookies: [                // Parsed cookies from Set-Cookie headers
    { name: 'session', value: 'abc123', ...}
  ],
  request: {                // Original request configuration
    method: 'GET',
    url: '...',
    headers: {...}
  },
  raw: {                    // Raw response object from transport
    status: 200,
    headers: {...}
  }
}
```

## 🚨 Error Handling

```javascript
const { errors } = require('tls-http')

try {
  const response = await tlsHttp.get('https://example.com', {
    timeout: 5000
  })
} catch (error) {
  if (error instanceof errors.TimeoutError) {
    console.error('Request timed out')
    console.error('Timeout after:', error.config.timeout)
  } else if (error instanceof errors.ProxyError) {
    console.error('Proxy connection failed:', error.message)
  } else if (error instanceof errors.NetworkError) {
    console.error('Network error:', error.message)
  } else if (error instanceof errors.RequestError) {
    console.error('Request failed with status:', error.response?.status)
  } else {
    console.error('Unexpected error:', error.message)
  }
}
```

Available error classes:
- `RequestError`: HTTP request failed (status code validation)
- `TimeoutError`: Request exceeded timeout
- `ProxyError`: Proxy connection failed
- `NetworkError`: Network-level error (DNS, connection reset, etc.)

## 🔄 Interceptors

```javascript
const client = tlsHttp.create()

// Request interceptor - modify config before sending
client.useRequestInterceptor(
  (config) => {
    console.log('Sending request to:', config.url)
    config.headers['X-Request-ID'] = generateRequestId()
    return config
  },
  (error) => {
    console.error('Request interceptor error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor - process response before returning
client.useResponseInterceptor(
  (response) => {
    console.log('Received response:', response.status)
    if (response.status === 401) {
      // Handle unauthorized
    }
    return response
  },
  (error) => {
    console.error('Response interceptor error:', error)
    return Promise.reject(error)
  }
)
```

## 💡 Examples

Complete working examples in `examples/` directory:

- `basic.js` - Simple GET request with browser spoofing
- `post.js` - POST with JSON body
- `form.js` - Form data upload with file
- `proxy.js` - HTTP proxy request
- `auth-proxy.js` - Authenticated proxy with credentials
- `rotate.js` - Fingerprint rotation for stealth
- `session.js` - Session management with cookies

Run examples:

```bash
node examples/basic.js
node examples/session.js
node examples/form.js
```

## 🛡️ Production Best Practices

### 1. Fingerprint Rotation

```javascript
// For sensitive scraping, rotate fingerprint per request
const response = await tlsHttp.get(url, {
  browser: 'chrome',
  rotateFingerprint: true      // New UA, device info, connection profile
})
```

### 2. Session Management

```javascript
// Use sessions for stateful operations
const session = tlsHttp.createSession({ browser: 'chrome' })

// Cookies automatically persist across requests
await session.post(loginUrl, null, { json: credentials })
const userData = await session.get(protectedUrl)
```

### 3. Retry Strategy

```javascript
const response = await tlsHttp.get(url, {
  retries: 3,                // Retry up to 3 times
  retryDelay: 1000          // Wait 1 second between retries
})
```

### 4. Proxy Rotation

```javascript
// Rotate through multiple proxies
const proxies = [
  { host: 'proxy1.com', port: 8080 },
  { host: 'proxy2.com', port: 8080 },
  { host: 'proxy3.com', port: 8080 }
]

for (const proxy of proxies) {
  const response = await tlsHttp.get(url, { proxy })
  // Process response
}
```

### 5. Performance Monitoring

```javascript
const start = Date.now()
const response = await tlsHttp.get(url)
const duration = Date.now() - start

console.log(`Request completed in ${duration}ms`)
console.log(`Status: ${response.status}`)
console.log(`Size: ${response.data.length} bytes`)
```

### 6. Rate Limiting

```javascript
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

for (const url of urlList) {
  const response = await tlsHttp.get(url, {
    rotateFingerprint: true
  })
  await delay(1000)     // Wait 1 second between requests
}
```

## 📄 License

MIT

## 🤝 Contributing

Contributions welcome! Please ensure:
- Code follows existing style
- Tests pass (`npm test`)
- Documentation is updated
- No native dependencies added

## ⚠️ Legal Disclaimer

This library is provided for **legitimate purposes only**. Users are solely responsible for:

- Compliance with all applicable laws and regulations
- Respecting website terms of service
- Not circumventing security measures illegally
- Proper attribution and licensing compliance

The authors assume no liability for misuse.

## Custom Errors

- `RequestError`
- `TimeoutError`
- `ProxyError`
- `NetworkError`

## Types

TypeScript definitions are available via `src/types/index.d.ts`.

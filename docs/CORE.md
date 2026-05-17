# Core Client Module

The core HTTP client implementation providing the main API surface.

## Files

- `client.js` - Main Client class
- `request.js` - Request configuration builder
- `session.js` - Session class extending Client

## Client Class

### Constructor

```javascript
const client = new Client(options)

// Options
{
  timeout: 30000,                    // Default timeout
  maxRedirects: 5,                   // Max redirects
  retries: 2,                        // Default retries
  retryDelay: 300,                   // Delay between retries
  browser: 'chrome',                 // Default browser profile
  profile: 'chrome',                 // Alternative to browser
  transport: 'axios',                // Transport: 'axios' or 'fetch'
  jar: CookieJar,                    // Custom cookie jar
  fingerprint: {},                   // Custom fingerprint
  rotateFingerprint: false,          // Auto-rotate
  randomizeFingerprint: false        // Auto-randomize
}
```

### Methods

#### `request(config)`

Universal request method.

```javascript
const response = await client.request({
  method: 'POST',
  url: 'https://api.example.com/data',
  json: { key: 'value' },
  timeout: 20000
})
```

#### `get(url, config?)`

GET request.

```javascript
const response = await client.get('https://example.com', {
  params: { id: 123 }
})
```

#### `post(url, data?, config?)`

POST request.

```javascript
const response = await client.post('https://example.com/create', null, {
  json: { name: 'item' }
})
```

#### `put(url, data?, config?)`

PUT request.

#### `patch(url, data?, config?)`

PATCH request.

#### `delete(url, config?)`

DELETE request.

#### `useRequestInterceptor(onFulfilled, onRejected?)`

Register request middleware.

```javascript
client.useRequestInterceptor(
  (config) => {
    config.headers['X-Custom'] = 'value'
    return config
  },
  (error) => Promise.reject(error)
)
```

#### `useResponseInterceptor(onFulfilled, onRejected?)`

Register response middleware.

```javascript
client.useResponseInterceptor(
  (response) => {
    console.log('Status:', response.status)
    return response
  },
  (error) => Promise.reject(error)
)
```

## Session Class

Extends Client with persistent session state.

```javascript
const session = new Session({
  browser: 'chrome',
  sessionId: 'optional-custom-id'  // Auto-generated if not provided
})

// Cookies persist across requests
await session.post('https://example.com/login', null, { json: credentials })
const data = await session.get('https://example.com/protected')
```

## Request Builder

The `request.js` module builds normalized request configurations.

```javascript
const buildRequest = require('./core/request')

const config = buildRequest({
  url: 'https://example.com',
  method: 'POST',
  browser: 'chrome',
  json: { data: 'value' },
  profile: {...},
  randomizeFingerprint: true
})

// Returns normalized config object
{
  method: 'POST',
  url: 'https://example.com',
  headers: {...},          // Browser-specific headers
  body: '{"data":"value"}',
  timeout: 30000,
  ...
}
```

## Error Handling

Errors are thrown as custom error classes:

```javascript
const { RequestError, TimeoutError, ProxyError, NetworkError } = require('tls-http').errors

try {
  const response = await client.get('https://example.com')
} catch (error) {
  error.name              // Error type
  error.message           // Error message
  error.config            // Original request config
  error.response          // Response object if available
}
```

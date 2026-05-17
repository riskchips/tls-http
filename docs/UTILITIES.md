# Utilities Module Documentation

Helper modules for cookies, forms, proxies, randomization, and logging.

## Random Utilities

File: `src/utils/random.js`

Advanced randomization engine for browser spoofing.

### Basic Functions

```javascript
const { randomInt, randomFloat, randomItem, shuffleArray } = require('tls-http/src/utils/random')

// Random integer in range [min, max]
const num = randomInt(1, 100)

// Random float in range [min, max]
const float = randomFloat(1.5, 10.5)

// Random element from array
const item = randomItem(['chrome', 'firefox', 'edge'])

// Fisher-Yates shuffle
const shuffled = shuffleArray(['a', 'b', 'c'])
```

### Browser Fingerprinting Functions

```javascript
const { randomUA, randomPlatform, randomTimezone, randomLanguage } = require('tls-http/src/utils/random')

// Random user agent type
const ua = randomUA()  // 'chrome_129' | 'firefox_125' | 'edge_128'

// Random platform
const platform = randomPlatform()  // 'Windows' | 'Linux'

// Random timezone
const tz = randomTimezone()  // 'America/New_York' | 'Europe/London' | ...

// Random language code
const lang = randomLanguage()  // 'en-US' | 'fr-FR' | ...
```

### Device Characteristics

```javascript
const { randomViewport, randomDeviceMemory, randomHardwareConcurrency } = require('tls-http/src/utils/random')

// Random screen dimensions
const viewport = randomViewport()
// { width: 1920, height: 1080 } | { width: 1440, height: 900 } | ...

// Random device RAM (GB)
const memory = randomDeviceMemory()  // 2 | 4 | 8 | 16 | 32

// Random CPU cores
const cores = randomHardwareConcurrency()  // 2 | 4 | 6 | 8 | 12 | 16
```

### Network Profile Functions

```javascript
const { randomConnectionSpeed, randomRTT, randomDownlink } = require('tls-http/src/utils/random')

// Random connection type
const type = randomConnectionSpeed()  // '4g' | '3g' | 'lte'

// Random network latency (ms)
const rtt = randomRTT()  // 10-150 ms

// Random download speed (Mbps)
const downlink = randomDownlink()  // 2.5-25 Mbps
```

### Utility Functions

```javascript
const { delay } = require('tls-http/src/utils/random')

// Sleep for N milliseconds
await delay(1000)
```

## Cookie Utilities

File: `src/utils/cookies.js`

Cookie jar management and header manipulation.

### Applying Cookies to Requests

```javascript
const { applyCookieHeader } = require('tls-http/src/utils/cookies')

const jar = new CookieJar()
// ... cookies stored in jar ...

const headers = {}
await applyCookieHeader(headers, jar, 'https://example.com/api')

// headers now contains Cookie header
```

### Storing Set-Cookie Headers

```javascript
const { storeSetCookieHeaders } = require('tls-http/src/utils/cookies')

const jar = new CookieJar()
const setCookieHeaders = ['session=abc123; Path=/; HttpOnly']

await storeSetCookieHeaders(jar, setCookieHeaders, 'https://example.com')

// Cookies now stored in jar for future requests
```

### Cookie Jar Factory

```javascript
const { createCookieJar } = require('tls-http/src/utils/cookies')

const jar = createCookieJar()

// Ready to use with tls-http requests
```

## Form Data Utilities

File: `src/utils/forms.js`

Multipart form-data building with file support.

### Creating Form Data

```javascript
const { appendFormValue } = require('tls-http/src/utils/forms')
const FormData = require('form-data')
const fs = require('fs')

const form = new FormData()

// Single values
appendFormValue(form, 'username', 'john')
appendFormValue(form, 'email', 'john@example.com')

// Arrays
appendFormValue(form, 'tags', ['tag1', 'tag2', 'tag3'])

// Files
appendFormValue(form, 'avatar', fs.createReadStream('./avatar.png'))

// Nested objects
appendFormValue(form, 'profile', {
  firstName: 'John',
  lastName: 'Doe'
})

// Recursive array of files
appendFormValue(form, 'documents', [
  fs.createReadStream('./doc1.pdf'),
  fs.createReadStream('./doc2.pdf')
])
```

### Using with tls-http

```javascript
const tlsHttp = require('tls-http')

const response = await tlsHttp.post('https://example.com/upload', null, {
  form: {
    username: 'guest',
    avatar: fs.createReadStream('./avatar.png'),
    documents: [
      fs.createReadStream('./doc1.pdf'),
      fs.createReadStream('./doc2.pdf')
    ]
  }
})
```

## Proxy Utilities

File: `src/utils/proxy.js`

Proxy agent creation and configuration.

### Building Proxy Agents

```javascript
const { buildProxy } = require('tls-http/src/utils/proxy')

// HTTP proxy
const agent = buildProxy({
  host: 'proxy.example.com',
  port: 8080,
  username: 'user',
  password: 'pass'
}, 'http')

// Returns: HttpProxyAgent instance

// HTTPS proxy
const secureAgent = buildProxy({
  host: 'proxy.example.com',
  port: 8080
}, 'https')

// Returns: HttpsProxyAgent instance
```

### Proxy Authentication

```javascript
// Credentials automatically included in Proxy-Authorization header
const agent = buildProxy({
  host: 'proxy.example.com',
  port: 3128,
  username: 'username',
  password: 'password'
}, 'http')

// Agent handles auth automatically
```

## Query String Utilities

File: `src/utils/query.js`

URL building with query parameters.

### Building URLs with Parameters

```javascript
const { buildUrl } = require('tls-http/src/utils/query')

const url = buildUrl('https://api.example.com/search', {
  q: 'nodejs',
  limit: 10,
  offset: 0
})

// Returns: 'https://api.example.com/search?q=nodejs&limit=10&offset=0'
```

### Using with tls-http

```javascript
const tlsHttp = require('tls-http')

const response = await tlsHttp.get('https://api.example.com/search', {
  params: {
    q: 'nodejs',
    limit: 10
  }
})

// params are automatically converted to query string
```

## Logger Utility

File: `src/utils/logger.js`

Environment-controlled debug logging.

### Enabling Debug Output

```bash
# Set environment variable
export TLS_HTTP_DEBUG=1

# Run your script
node script.js
```

### Using Debug Logger

```javascript
const { debug } = require('tls-http/src/utils/logger')

debug('This will only print if TLS_HTTP_DEBUG=1')
debug('Request to:', url)
debug('Response status:', status)
```

### Debug Output Example

```
Request to: https://api.example.com/data
Response status: 200
Request headers: {...}
```

## Error Utilities

File: `src/utils/errors.js`

Custom error classes for different failure scenarios.

### Error Classes

```javascript
const {
  RequestError,
  TimeoutError,
  ProxyError,
  NetworkError
} = require('tls-http/src/utils/errors')

// RequestError - HTTP request failed
try {
  await tlsHttp.get(url, { validateStatus: () => false })
} catch (error) {
  if (error instanceof RequestError) {
    console.error('Status:', error.response.status)
    console.error('Config:', error.config)
  }
}

// TimeoutError - Request exceeded timeout
try {
  await tlsHttp.get(url, { timeout: 100 })
} catch (error) {
  if (error instanceof TimeoutError) {
    console.error('Timeout after:', error.config.timeout, 'ms')
  }
}

// ProxyError - Proxy connection failed
try {
  await tlsHttp.get(url, { proxy: { host: 'bad', port: 9999 } })
} catch (error) {
  if (error instanceof ProxyError) {
    console.error('Proxy failed:', error.message)
  }
}

// NetworkError - Network-level error
try {
  await tlsHttp.get('https://invalid.invalid.invalid.invalid')
} catch (error) {
  if (error instanceof NetworkError) {
    console.error('Network error:', error.message)
  }
}
```

### Error Properties

```javascript
error.name             // 'TimeoutError', 'RequestError', etc.
error.message          // Human-readable error message
error.config           // Original request configuration
error.response         // Response object if available
error.cause            // Underlying error if applicable
```

## Complete Example

```javascript
const tlsHttp = require('tls-http')
const fs = require('fs')

// Use all utilities together
async function advancedRequest() {
  const response = await tlsHttp.request({
    method: 'POST',
    url: 'https://api.example.com/upload',
    proxy: {
      host: 'proxy.example.com',
      port: 8080
    },
    form: {
      username: 'guest',
      tags: ['tag1', 'tag2'],
      avatar: fs.createReadStream('./avatar.png')
    },
    browser: 'chrome',
    rotateFingerprint: true,
    timeout: 30000,
    retries: 3,
    retryDelay: 500
  })

  return response
}

advancedRequest().catch(error => {
  if (error instanceof errors.TimeoutError) {
    console.error('Timeout')
  } else if (error instanceof errors.ProxyError) {
    console.error('Proxy error')
  }
})
```

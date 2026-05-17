# Fingerprinting System

Advanced browser fingerprinting with randomization and per-browser TLS/HTTP2 configuration.

## Architecture

The fingerprinting system consists of multiple layers:

1. **Browser Profiles** - Chrome, Firefox, Edge specific configurations
2. **Header Building** - Browser-accurate header ordering and values
3. **TLS Configuration** - Browser-specific cipher suites and settings
4. **HTTP/2 Settings** - Per-browser HTTP/2 stream configuration
5. **Device Fingerprints** - Viewport, memory, concurrency, timezone

## Browser Profiles

Each browser has a unique profile generator that creates realistic fingerprints.

### Chrome Profile Generator

```javascript
const { buildChromeProfile } = require('tls-http')

const profile = buildChromeProfile()

// Includes:
{
  version: '129.0.6668.123',        // Current Chrome version
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)...',
  'sec-ch-ua': '"Chromium";v="129"...',
  viewport: { width: 1920, height: 1080 },
  timezone: 'America/New_York',
  deviceMemory: 8,
  hardwareConcurrency: 8,
  connection: { effectiveType: '4g', rtt: 45, downlink: 10.5 }
}
```

### Firefox Profile Generator

```javascript
const { buildFirefoxProfile } = require('tls-http')

const profile = buildFirefoxProfile()

// Firefox-specific UA and headers
{
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:125.0) Gecko/20100101 Firefox/125.0',
  referer: 'https://www.mozilla.org/',
  // No sec-ch-ua headers (Firefox doesn't support them)
}
```

### Edge Profile Generator

```javascript
const { buildEdgeProfile } = require('tls-http')

const profile = buildEdgeProfile()

// Chromium-based but Edge-specific
{
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)...Edg/129.0.6668.123',
  referer: 'https://www.bing.com/',
  'sec-ch-ua': '"Chromium";v="129", "Microsoft Edge";v="129"...'
}
```

## Header Building

The `fingerprint/headers.js` module builds browser-accurate headers with proper ordering.

### Browser Header Ordering

Headers are ordered based on the browser profile:

**Chrome Header Order:**
```
host
connection
cache-control
sec-ch-ua
sec-ch-ua-mobile
sec-ch-ua-platform
upgrade-insecure-requests
user-agent
accept
sec-fetch-site
sec-fetch-mode
sec-fetch-dest
accept-encoding
accept-language
dnt
```

**Firefox Header Order:**
```
host
connection
cache-control
upgrade-insecure-requests
user-agent
accept
accept-language
accept-encoding
dnt
sec-fetch-dest
sec-fetch-mode
sec-fetch-site
```

**Edge Header Order:**
```
(Similar to Chrome with slight variations)
```

### Header Building

```javascript
const buildHeaders = require('tls-http/src/fingerprint/headers')

const headers = buildHeaders(
  { 'X-Custom': 'value' },      // Custom headers to merge
  profile,                        // Browser profile
  { randomize: true }            // Options
)

// Result: Ordered and merged headers with browser-specific defaults
```

## TLS Configuration

Browser-specific TLS cipher suites and settings.

### Chrome TLS

```javascript
const { CHROME_TLS_CIPHER_SUITE } = require('tls-http/src/fingerprint/tls')

// TLS_AES_256_GCM_SHA384
// TLS_CHACHA20_POLY1305_SHA256
// TLS_AES_128_GCM_SHA256
// ECDHE-ECDSA-AES128-GCM-SHA256
// ...
```

### Firefox TLS

```javascript
const { FIREFOX_TLS_CIPHER_SUITE } = require('tls-http/src/fingerprint/tls')

// Slightly different from Chrome with ECDHE-ECDSA-CHACHA20-POLY1305
```

### Edge TLS

```javascript
const { EDGE_TLS_CIPHER_SUITE } = require('tls-http/src/fingerprint/tls')

// Identical to Chrome
```

### Building TLS Options

```javascript
const { buildTlsOptions } = require('tls-http/src/fingerprint/tls')

const tlsOptions = buildTlsOptions(profile, 'chrome')

// Returns:
{
  ciphers: 'TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256:...',
  minVersion: 'TLSv1.2',
  maxVersion: 'TLSv1.3',
  ecdhCurve: 'X25519:P-256:P-384',
  honorCipherOrder: true,
  sessionTimeout: 300000
}
```

## HTTP/2 Settings

Per-browser HTTP/2 configuration.

### Chrome HTTP/2

```javascript
const { CHROME_HTTP2_SETTINGS } = require('tls-http/src/fingerprint/http2')

{
  enablePush: false,
  peerMaxConcurrentStreams: 100,
  initialWindowSize: 6291456,
  maxHeaderListSize: 65536,
  initialConnectionWindowSize: 10485760
}
```

### Firefox HTTP/2

```javascript
const { FIREFOX_HTTP2_SETTINGS } = require('tls-http/src/fingerprint/http2')

{
  enablePush: false,
  peerMaxConcurrentStreams: 128,    // Higher than Chrome
  initialWindowSize: 65535,          // Different from Chrome
  maxHeaderListSize: 32768
}
```

## Device Fingerprinting

Realistic device characteristics included in each fingerprint.

### Viewport

```javascript
viewport: {
  width: 1920 | 1680 | 1440 | 1366 | 1360 | 1280 | 1024,
  height: 1080 | 1050 | 900 | 768 | 1024 | 810 | 600,
  deviceScaleFactor: 1,
  mobile: false
}
```

### Memory

```javascript
deviceMemory: 2 | 4 | 8 | 16 | 32 GB
hardwareConcurrency: 2 | 4 | 6 | 8 | 12 | 16 cores
```

### Connection

```javascript
connection: {
  effectiveType: '4g' | '3g' | 'lte',
  rtt: 10-150 ms,                   // Round-trip time
  downlink: 2.5-25 Mbps,            // Connection speed
  saveData: false
}
```

### Timezone & Locale

```javascript
timezone: 'UTC' | 'America/New_York' | 'Europe/London' | ... // 8 realistic zones
locale: 'en-US' | 'en-GB' | 'fr-FR' | ...
languages: ['en', 'US']
```

## Randomization

Two levels of fingerprint randomization:

### Level 1: Per-Request Rotation

```javascript
const response = await tlsHttp.get(url, {
  rotateFingerprint: true  // New fingerprint each request
})
```

Each request gets:
- New device memory
- New hardware concurrency
- New viewport dimensions
- New timezone
- New connection profile
- New Chrome/Firefox/Edge version

### Level 2: Header Randomization

```javascript
const response = await tlsHttp.get(url, {
  randomizeFingerprint: true  // Randomize header order
})
```

Headers are shuffled while maintaining:
- Browser-specific header patterns
- Valid HTTP header structure
- Realistic patterns

## Advanced Randomization Functions

```javascript
const random = require('tls-http/src/utils/random')

// Available functions
random.randomInt(min, max)            // Integer between min-max
random.randomFloat(min, max)          // Float between min-max
random.randomItem(array)              // Random array element
random.shuffleArray(array)            // Fisher-Yates shuffle
random.randomUA()                     // Random user agent type
random.randomPlatform()               // Random OS platform
random.randomTimezone()               // Random timezone
random.randomLanguage()               // Random language
random.randomViewport()               // Random screen size
random.randomDeviceMemory()           // Random RAM
random.randomHardwareConcurrency()    // Random cores
random.randomConnectionSpeed()        // Random connection type
random.randomRTT()                    // Random network latency
random.randomDownlink()               // Random connection speed
```

## Usage Examples

### Basic Fingerprinting

```javascript
const tlsHttp = require('tls-http')

// Automatic fingerprinting per browser
const response = await tlsHttp.get('https://example.com', {
  browser: 'chrome'
})
```

### Custom Fingerprint

```javascript
const tlsHttp = require('tls-http')

const profile = tlsHttp.getBrowserProfile('firefox')

// Modify specific properties
profile.userAgent = 'Custom UA'
profile.timezone = 'Europe/London'

const response = await tlsHttp.get('https://example.com', {
  fingerprint: profile
})
```

### Fingerprint Rotation Pool

```javascript
const tlsHttp = require('tls-http')

// Create fingerprints and cycle through them
const fingerprints = [
  tlsHttp.getBrowserProfile('chrome'),
  tlsHttp.getBrowserProfile('firefox'),
  tlsHttp.getBrowserProfile('edge')
]

for (let i = 0; i < 10; i++) {
  const fp = fingerprints[i % fingerprints.length]
  const response = await tlsHttp.get('https://example.com', {
    fingerprint: fp
  })
}
```

### Per-Request Randomization

```javascript
const tlsHttp = require('tls-http')

// Every request gets completely new fingerprint
for (let i = 0; i < 5; i++) {
  const response = await tlsHttp.get('https://example.com', {
    browser: 'chrome',
    rotateFingerprint: true
  })
  console.log('UA:', response.request.headers['user-agent'])
}
```

## Performance Considerations

1. **Fingerprint Generation**: ~5ms per fingerprint
2. **Header Building**: ~2ms per request
3. **Caching**: Profiles are cached in memory after first generation
4. **Minimal Overhead**: Fingerprinting adds negligible latency

## Security Implications

The fingerprinting system creates:
- **Internally Consistent** fingerprints (all values align)
- **Browser-Accurate** headers and settings
- **Realistic** device characteristics
- **Rotating** identities for stealth

However, sophisticated anti-bot systems may detect:
- Suspicious rotation patterns
- Request timing anomalies
- Behavior inconsistencies beyond fingerprinting

For maximum stealth, combine with:
- Proper request timing
- Session management
- Proxy rotation
- Rate limiting

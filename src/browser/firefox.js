const { randomItem, randomInt, randomFloat, randomViewport, randomTimezone, randomLanguage, randomDeviceMemory, randomHardwareConcurrency, randomConnectionSpeed, randomRTT, randomDownlink } = require('../utils/random')

function randomFirefoxVersion() {
  const major = randomItem([122, 123, 124, 125, 126])
  const minor = randomInt(0, 0)
  return `${major}.${minor}`
}

function buildFirefoxProfile() {
  const version = randomFirefoxVersion()
  const major = version.split('.')[0]
  const locale = randomLanguage()
  const viewport = randomViewport()
  const timezone = randomTimezone()
  const deviceMemory = randomDeviceMemory()
  const hardwareConcurrency = randomHardwareConcurrency()
  const connectionType = randomConnectionSpeed()
  const rtt = randomRTT()
  const downlink = randomDownlink()

  return {
    id: 'firefox',
    browser: 'Firefox',
    version,
    major,
    userAgent: `Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:${version}) Gecko/20100101 Firefox/${version}`,
    accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    'accept-language': locale,
    'accept-encoding': 'gzip, deflate, br',
    referer: 'https://www.mozilla.org/',
    origin: 'https://www.mozilla.org',
    'sec-fetch-site': 'none',
    'sec-fetch-mode': 'navigate',
    'sec-fetch-dest': 'document',
    'sec-fetch-user': '?1',
    'cache-control': 'no-cache',
    pragma: 'no-cache',
    dnt: '1',
    'upgrade-insecure-requests': '1',
    locale,
    languages: [locale.split('-')[0], locale.split('-')[1]].filter(Boolean),
    platform: 'Win32',
    platformVersion: '10.0',
    viewport,
    timezone,
    deviceMemory,
    hardwareConcurrency,
    maxTouchPoints: 0,
    webdriver: false,
    firefox: true,
    appVersion: `5.0 (Windows NT 10.0; Win64; x64; rv:${version}) Gecko/20100101 Firefox/${version}`,
    vendor: '',
    buildID: '20240000',
    products: ['Gecko', 'Firefox'],
    connection: {
      effectiveType: connectionType,
      rtt,
      downlink,
      saveData: false
    },
    tls: {
      minVersion: 'TLSv1.2',
      maxVersion: 'TLSv1.3',
      ecdhCurve: 'X25519:P-256:P-384'
    },
    http2: {
      enablePush: false,
      peerMaxConcurrentStreams: 128
    }
  }
}

module.exports = {
  buildFirefoxProfile,
  randomFirefoxVersion
}

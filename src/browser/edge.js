const { randomItem, randomInt, randomFloat, randomViewport, randomTimezone, randomLanguage, randomDeviceMemory, randomHardwareConcurrency, randomConnectionSpeed, randomRTT, randomDownlink } = require('../utils/random')

function randomEdgeVersion() {
  const major = randomItem([125, 126, 127, 128, 129])
  const minor = randomInt(0, 1)
  const build = randomInt(1600, 2000)
  const patch = randomInt(0, 150)
  return `${major}.${minor}.${build}.${patch}`
}

function buildEdgeProfile() {
  const version = randomEdgeVersion()
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
    id: 'edge',
    browser: 'Edge',
    version,
    major,
    userAgent: `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${version} Safari/537.36 Edg/${version}`,
    accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
    'accept-language': locale,
    'accept-encoding': 'gzip, deflate, br',
    'sec-ch-ua': `"Chromium";v="${major}", "Microsoft Edge";v="${major}", "Not.A/Brand";v="99"`,
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
    'sec-ch-ua-platform-version': '"10.0.0"',
    'sec-ch-ua-full-version': version,
    referer: 'https://www.bing.com/',
    origin: 'https://www.bing.com',
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
    platform: 'Windows',
    platformVersion: '10.0.0',
    viewport,
    timezone,
    deviceMemory,
    hardwareConcurrency,
    maxTouchPoints: 0,
    webdriver: false,
    edge: true,
    appVersion: `5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${version} Safari/537.36 Edg/${version}`,
    vendor: 'Google Inc.',
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
      peerMaxConcurrentStreams: 100
    }
  }
}

module.exports = {
  buildEdgeProfile,
  randomEdgeVersion
}

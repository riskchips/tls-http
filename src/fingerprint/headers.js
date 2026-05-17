const { shuffleArray, randomItem } = require('../utils/random')

const HEADER_ORDER_CHROME = [
  'host',
  'connection',
  'cache-control',
  'sec-ch-ua',
  'sec-ch-ua-mobile',
  'sec-ch-ua-platform',
  'upgrade-insecure-requests',
  'user-agent',
  'accept',
  'sec-fetch-site',
  'sec-fetch-mode',
  'sec-fetch-dest',
  'accept-encoding',
  'accept-language',
  'dnt'
]

const HEADER_ORDER_FIREFOX = [
  'host',
  'connection',
  'cache-control',
  'upgrade-insecure-requests',
  'user-agent',
  'accept',
  'accept-language',
  'accept-encoding',
  'dnt',
  'sec-fetch-dest',
  'sec-fetch-mode',
  'sec-fetch-site'
]

const HEADER_ORDER_EDGE = [
  'host',
  'connection',
  'cache-control',
  'sec-ch-ua',
  'sec-ch-ua-mobile',
  'sec-ch-ua-platform',
  'upgrade-insecure-requests',
  'user-agent',
  'accept',
  'sec-fetch-site',
  'sec-fetch-mode',
  'sec-fetch-dest',
  'accept-encoding',
  'accept-language'
]

const baseHeaders = {
  'cache-control': 'no-cache',
  'pragma': 'no-cache',
  'dnt': '1',
  'upgrade-insecure-requests': '1'
}

function buildHeaders(headers = {}, profile = {}, options = {}) {
  const result = { ...baseHeaders }

  const primaryHeaders = {
    'accept': profile.accept || 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
    'accept-encoding': 'gzip, deflate, br',
    'accept-language': profile['accept-language'] || 'en-US,en;q=0.9',
    'user-agent': profile['user-agent'],
    'sec-fetch-dest': profile['sec-fetch-dest'] || 'document',
    'sec-fetch-mode': profile['sec-fetch-mode'] || 'navigate',
    'sec-fetch-site': profile['sec-fetch-site'] || 'none',
    'sec-fetch-user': profile['sec-fetch-user'] || '?1'
  }

  if (profile['sec-ch-ua']) {
    result['sec-ch-ua'] = profile['sec-ch-ua']
  }
  if (profile['sec-ch-ua-mobile']) {
    result['sec-ch-ua-mobile'] = profile['sec-ch-ua-mobile']
  }
  if (profile['sec-ch-ua-platform']) {
    result['sec-ch-ua-platform'] = profile['sec-ch-ua-platform']
  }
  if (profile['sec-ch-ua-platform-version']) {
    result['sec-ch-ua-platform-version'] = profile['sec-ch-ua-platform-version']
  }
  if (profile['sec-ch-ua-full-version']) {
    result['sec-ch-ua-full-version'] = profile['sec-ch-ua-full-version']
  }
  if (profile.referer) {
    result.referer = profile.referer
  }
  if (profile.origin) {
    result.origin = profile.origin
  }

  Object.entries(primaryHeaders).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      result[key] = value
    }
  })

  const merged = { ...result, ...headers }
  const normalized = Object.entries(merged).reduce((acc, [key, value]) => {
    if (value === undefined || value === null) {
      return acc
    }
    acc[key.toLowerCase()] = String(value)
    return acc
  }, {})

  if (options.randomize) {
    return shuffleHeadersByBrowser(normalized, profile.browser)
  }

  return orderHeadersByBrowser(normalized, profile.browser)
}

function orderHeadersByBrowser(headers, browser = 'chrome') {
  const browser_lower = String(browser || 'chrome').toLowerCase()
  const orderMap = {
    'chrome': HEADER_ORDER_CHROME,
    'firefox': HEADER_ORDER_FIREFOX,
    'edge': HEADER_ORDER_EDGE
  }

  const order = orderMap[browser_lower] || HEADER_ORDER_CHROME
  const ordered = {}
  const headerKeys = new Set(Object.keys(headers))

  order.forEach(key => {
    if (headerKeys.has(key)) {
      ordered[key] = headers[key]
      headerKeys.delete(key)
    }
  })

  headerKeys.forEach(key => {
    ordered[key] = headers[key]
  })

  return ordered
}

function shuffleHeadersByBrowser(headers, browser = 'chrome') {
  const ordered = orderHeadersByBrowser(headers, browser)
  const entries = Object.entries(ordered)
  const shuffled = shuffleArray(entries)
  return shuffled.reduce((acc, [key, value]) => {
    acc[key] = value
    return acc
  }, {})
}

module.exports = buildHeaders
module.exports.orderHeadersByBrowser = orderHeadersByBrowser
module.exports.shuffleHeadersByBrowser = shuffleHeadersByBrowser

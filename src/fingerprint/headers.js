const { shuffleArray } = require('../utils/random')

const HEADER_ORDER_CHROME = [
  'host',
  'connection',
  'cache-control',
  'pragma',
  'sec-ch-ua',
  'sec-ch-ua-mobile',
  'sec-ch-ua-platform',
  'sec-ch-ua-platform-version',
  'sec-ch-ua-full-version',
  'upgrade-insecure-requests',
  'user-agent',
  'accept',
  'origin',
  'referer',
  'sec-fetch-site',
  'sec-fetch-mode',
  'sec-fetch-user',
  'sec-fetch-dest',
  'accept-encoding',
  'accept-language',
  'dnt'
]

const HEADER_ORDER_FIREFOX = [
  'host',
  'connection',
  'cache-control',
  'pragma',
  'upgrade-insecure-requests',
  'user-agent',
  'accept',
  'accept-language',
  'accept-encoding',
  'dnt',
  'referer',
  'origin',
  'sec-fetch-dest',
  'sec-fetch-mode',
  'sec-fetch-site',
  'sec-fetch-user'
]

const HEADER_ORDER_EDGE = [
  'host',
  'connection',
  'cache-control',
  'pragma',
  'sec-ch-ua',
  'sec-ch-ua-mobile',
  'sec-ch-ua-platform',
  'sec-ch-ua-platform-version',
  'sec-ch-ua-full-version',
  'upgrade-insecure-requests',
  'user-agent',
  'accept',
  'origin',
  'referer',
  'sec-fetch-site',
  'sec-fetch-mode',
  'sec-fetch-user',
  'sec-fetch-dest',
  'accept-encoding',
  'accept-language'
]

const baseHeaders = {
  'connection': 'keep-alive',
  'cache-control': 'no-cache',
  'pragma': 'no-cache',
  'dnt': '1',
  'upgrade-insecure-requests': '1'
}

function normalizeHeaders(headers = {}) {
  return Object.entries(headers).reduce((acc, [key, value]) => {

    if (
      value === undefined ||
      value === null
    ) {
      return acc
    }

    const normalizedKey = String(key)
      .trim()
      .toLowerCase()

    acc[normalizedKey] = String(value)

    return acc

  }, {})
}

function buildHeaders(
  headers = {},
  profile = {},
  options = {}
) {

  const result = {
    ...baseHeaders
  }

  const primaryHeaders = {
    'accept':
      profile.accept ||
      'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',

    'accept-encoding':
      profile['accept-encoding'] ||
      'gzip, deflate, br',

    'accept-language':
      profile['accept-language'] ||
      'en-US,en;q=0.9',

    'user-agent':
      profile.userAgent ||
      profile['user-agent'],

    'sec-fetch-dest':
      profile['sec-fetch-dest'] ||
      'document',

    'sec-fetch-mode':
      profile['sec-fetch-mode'] ||
      'navigate',

    'sec-fetch-site':
      profile['sec-fetch-site'] ||
      'none',

    'sec-fetch-user':
      profile['sec-fetch-user'] ||
      '?1'
  }

  const clientHints = [
    'sec-ch-ua',
    'sec-ch-ua-mobile',
    'sec-ch-ua-platform',
    'sec-ch-ua-platform-version',
    'sec-ch-ua-full-version'
  ]

  for (const key of clientHints) {
    if (profile[key]) {
      result[key] = profile[key]
    }
  }

  if (profile.referer) {
    result['referer'] = profile.referer
  }

  if (profile.origin) {
    result['origin'] = profile.origin
  }

  Object.entries(primaryHeaders).forEach(
    ([key, value]) => {

      if (
        value !== undefined &&
        value !== null
      ) {
        result[key] = value
      }
    }
  )

  const merged = {
    ...result,
    ...normalizeHeaders(headers)
  }

  const normalized =
    normalizeHeaders(merged)

  if (!normalized['user-agent']) {

    normalized['user-agent'] =
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36'
  }

  if (options.randomize) {
    return shuffleHeadersByBrowser(
      normalized,
      profile.browser
    )
  }

  return orderHeadersByBrowser(
    normalized,
    profile.browser
  )
}

function orderHeadersByBrowser(
  headers,
  browser = 'chrome'
) {

  const browserLower =
    String(browser || 'chrome')
      .toLowerCase()

  const orderMap = {
    chrome: HEADER_ORDER_CHROME,
    firefox: HEADER_ORDER_FIREFOX,
    edge: HEADER_ORDER_EDGE
  }

  const order =
    orderMap[browserLower] ||
    HEADER_ORDER_CHROME

  const ordered = {}

  const remaining =
    new Set(Object.keys(headers))

  for (const key of order) {

    if (remaining.has(key)) {

      ordered[key] = headers[key]

      remaining.delete(key)
    }
  }

  for (const key of remaining) {
    ordered[key] = headers[key]
  }

  return ordered
}

function shuffleHeadersByBrowser(
  headers,
  browser = 'chrome'
) {

  const ordered =
    orderHeadersByBrowser(
      headers,
      browser
    )

  const shuffled =
    shuffleArray(
      Object.entries(ordered)
    )

  return shuffled.reduce(
    (acc, [key, value]) => {

      acc[key] = value

      return acc

    },
    {}
  )
}

module.exports = buildHeaders

module.exports.orderHeadersByBrowser =
  orderHeadersByBrowser

module.exports.shuffleHeadersByBrowser =
  shuffleHeadersByBrowser
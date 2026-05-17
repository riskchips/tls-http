const { fetch, ProxyAgent } = require('undici')
const { applyCookieHeader, storeSetCookieHeaders } = require('../utils/cookies')

function buildProxyDispatcher(proxy = {}) {
  if (!proxy || (!proxy.host || !proxy.port)) {
    return undefined
  }

  const auth = proxy.username && proxy.password ? `${proxy.username}:${proxy.password}@` : ''
  const protocol = proxy.protocol || 'http'
  return new ProxyAgent(`${protocol}://${auth}${proxy.host}:${proxy.port}`)
}

async function performFetch({ url, method = 'GET', headers = {}, params, body, timeout = 30000, proxy, jar, responseType = 'text', maxRedirects = 5 }) {
  const finalUrl = new URL(url)
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        finalUrl.searchParams.set(key, String(value))
      }
    })
  }

  if (jar) {
    await applyCookieHeader(headers, jar, finalUrl.toString())
  }

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)
  const response = await fetch(finalUrl.toString(), {
    method,
    headers,
    body,
    dispatcher: buildProxyDispatcher(proxy),
    signal: controller.signal,
    redirect: 'follow',
    size: 0
  })
  clearTimeout(timeoutId)

  if (jar) {
    const setCookie = response.headers.get('set-cookie')
    if (setCookie) {
      await storeSetCookieHeaders(jar, finalUrl.toString(), [setCookie])
    }
  }

  let data
  if (responseType === 'arraybuffer') {
    data = await response.arrayBuffer()
  } else if (responseType === 'json') {
    try {
      data = await response.json()
    } catch (error) {
      data = await response.text()
    }
  } else if (responseType === 'stream') {
    data = response.body
  } else {
    data = await response.text()
  }

  return {
    status: response.status,
    headers: Object.fromEntries(response.headers),
    data,
    cookies: jar ? await jar.getCookies(finalUrl.toString()) : [],
    raw: response
  }
}

module.exports = {
  performFetch
}

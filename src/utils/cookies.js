async function applyCookieHeader(headers, jar, url) {
  if (!jar || !url) {
    return
  }

  const cookieHeader = await jar.getCookieString(url)
  if (cookieHeader) {
    headers.cookie = cookieHeader
  }
}

async function storeSetCookieHeaders(jar, url, headers = []) {
  if (!jar || !url || !Array.isArray(headers)) {
    return
  }

  for (const header of headers) {
    if (!header || typeof header !== 'string') {
      continue
    }
    try {
      await jar.setCookie(header, url, { ignoreError: true })
    } catch (error) {
      // best-effort cookie persistence
    }
  }
}

module.exports = {
  applyCookieHeader,
  storeSetCookieHeaders
}

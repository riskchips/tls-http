function buildUrl(base, params = {}) {
  const url = new URL(base, 'http://localhost')

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      return
    }

    if (Array.isArray(value)) {
      value.forEach((item) => url.searchParams.append(key, String(item)))
      return
    }

    url.searchParams.set(key, String(value))
  })

  if (base.startsWith('http://') || base.startsWith('https://')) {
    return url.toString()
  }

  return `${url.pathname}${url.search}`
}

module.exports = {
  buildUrl
}

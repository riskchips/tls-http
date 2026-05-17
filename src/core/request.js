const buildHeaders = require('../fingerprint/headers')
const buildForm = require('../utils/forms')
const { buildUrl } = require('../utils/query')

function normalizeHeaders(headers = {}) {
  return Object.entries(headers).reduce((acc, [key, value]) => {
    if (value === undefined || value === null) {
      return acc
    }

    const normalizedKey = String(key)
      .trim()
      .toLowerCase()
      .replace(/_/g, '-')

    acc[normalizedKey] = String(value)

    return acc
  }, {})
}

function isPlainObject(value) {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Buffer.isBuffer(value) &&
    !(value instanceof ArrayBuffer)
  )
}

function buildRequest(options = {}) {
  if (!options.url) {
    throw new Error('Request url is required')
  }

  const method = String(
    options.method || 'GET'
  ).toUpperCase()

  const profile = options.profile || {}

  const configHeaders = normalizeHeaders(
    options.headers || {}
  )

  const headers = buildHeaders(
    configHeaders,
    profile,
    {
      method,
      randomize: options.randomizeFingerprint
    }
  )

  let url = String(options.url)

  if (options.params) {
    url = buildUrl(url, options.params)
  }

  const request = {
    method,
    url,
    headers,
    timeout:
      typeof options.timeout === 'number'
        ? options.timeout
        : 30000,

    proxy: options.proxy,

    maxRedirects:
      typeof options.maxRedirects === 'number'
        ? options.maxRedirects
        : 5,

    retries:
      typeof options.retries === 'number'
        ? options.retries
        : 2,

    retryDelay:
      typeof options.retryDelay === 'number'
        ? options.retryDelay
        : 300,

    responseType:
      options.responseType || 'text',

    validateStatus:
      typeof options.validateStatus === 'function'
        ? options.validateStatus
        : (status) => status >= 200 && status < 400,

    http2: Boolean(options.http2),

    fingerprint: profile,

    decompress: true
  }

  if (options.form) {
    const form = buildForm(options.form)

    request.data = form
    request.body = form

    request.headers = {
      ...headers,
      ...normalizeHeaders(form.getHeaders())
    }
  }

  else if (options.json !== undefined) {
    request.data = JSON.stringify(options.json)

    request.body = request.data

    request.headers = {
      ...headers,
      'content-type':
        'application/json;charset=UTF-8'
    }
  }

  else if (options.data !== undefined) {
    if (isPlainObject(options.data)) {
      request.data = JSON.stringify(options.data)

      request.body = request.data

      if (!request.headers['content-type']) {
        request.headers['content-type'] =
          'application/json;charset=UTF-8'
      }
    }

    else {
      request.data = options.data
      request.body = options.data

      if (!request.headers['content-type']) {
        if (typeof options.data === 'string') {
          request.headers['content-type'] =
            'text/plain;charset=UTF-8'
        }

        else if (Buffer.isBuffer(options.data)) {
          request.headers['content-type'] =
            'application/octet-stream'
        }
      }
    }
  }

  return request
}

module.exports = buildRequest
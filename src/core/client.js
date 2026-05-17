const { CookieJar } = require('../cookies/jar')
const { createAxiosInstance } = require('../transports/axios')
const { performFetch } = require('../transports/fetch')
const buildRequest = require('./request')
const buildProxy = require('../utils/proxy')
const { getBrowserProfile } = require('../fingerprint/profiles')
const logger = require('../utils/logger')
const { RequestError, TimeoutError, NetworkError, ProxyError } = require('../utils/errors')

class Client {
  constructor(defaults = {}) {
    this.defaults = { timeout: 30000, maxRedirects: 5, retries: 2, retryDelay: 300, responseType: 'text', ...defaults }
    this.jar = defaults.jar || new CookieJar()
    this.transport = defaults.transport || 'axios'
    this.profileName = defaults.profile || defaults.browser || 'chrome'
    this.currentProfile = getBrowserProfile(this.profileName)
    this.axiosInstance = createAxiosInstance({ jar: this.jar, timeout: this.defaults.timeout })
    this.interceptors = {
      request: [],
      response: []
    }
  }

  useRequestInterceptor(onFulfilled, onRejected) {
    this.interceptors.request.push({ onFulfilled, onRejected })
  }

  useResponseInterceptor(onFulfilled, onRejected) {
    this.interceptors.response.push({ onFulfilled, onRejected })
  }

  async request(config = {}) {
    const merged = { ...this.defaults, ...config }
    const sessionFingerprint = merged.fingerprint || merged.profile || merged.browser || this.profileName
    const profile = merged.rotateFingerprint || merged.randomizeFingerprint
      ? getBrowserProfile(sessionFingerprint)
      : this.currentProfile || getBrowserProfile(sessionFingerprint)

    if (!this.currentProfile || merged.rotateFingerprint || merged.randomizeFingerprint) {
      this.currentProfile = profile
    }

    let requestConfig = buildRequest({
      ...merged,
      profile,
      transport: merged.transport || this.transport
    })

    for (const interceptor of this.interceptors.request) {
      try {
        requestConfig = await interceptor.onFulfilled(requestConfig) || requestConfig
      } catch (error) {
        if (interceptor.onRejected) {
          await interceptor.onRejected(error)
        }
        throw error
      }
    }

    const transport = requestConfig.transport
    const useFetch = transport === 'fetch' || requestConfig.http2 === true

    try {
      let response
      if (useFetch) {
        response = await performFetch({
          url: requestConfig.url,
          method: requestConfig.method,
          headers: requestConfig.headers,
          params: requestConfig.params,
          body: requestConfig.body,
          timeout: requestConfig.timeout,
          proxy: requestConfig.proxy,
          jar: this.jar,
          responseType: requestConfig.responseType,
          maxRedirects: requestConfig.maxRedirects
        })
      } else {
        if (requestConfig.proxy) {
          const agent = buildProxy(requestConfig.proxy)
          requestConfig.httpAgent = agent
          requestConfig.httpsAgent = agent
        }

const axiosConfig = { ...requestConfig }

delete axiosConfig.transport
delete axiosConfig.http2
delete axiosConfig.fingerprint

const rawResponse = await this.axiosInstance.request(axiosConfig)
        response = {
          status: rawResponse.status,
          headers: rawResponse.headers,
          data: rawResponse.data,
          cookies: await this.jar.getCookies(requestConfig.url),
          request: rawResponse.request,
          raw: rawResponse
        }
      }

      if (requestConfig.validateStatus && !requestConfig.validateStatus(response.status)) {
        throw new RequestError(`Request failed with status code ${response.status}`, requestConfig, response)
      }

      for (const interceptor of this.interceptors.response) {
        try {
          response = await interceptor.onFulfilled(response) || response
        } catch (error) {
          if (interceptor.onRejected) {
            await interceptor.onRejected(error)
          }
          throw error
        }
      }

      return response
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new TimeoutError(error.message || 'Request timeout', requestConfig)
      }
      if (error.code === 'ECONNREFUSED' || error.code === 'ECONNRESET' || error.code === 'ENOTFOUND') {
        throw new NetworkError(error.message, requestConfig, error)
      }
      if (error.message && error.message.match(/proxy/i)) {
        throw new ProxyError(error.message, requestConfig, error)
      }
      if (error instanceof RequestError || error instanceof TimeoutError || error instanceof ProxyError || error instanceof NetworkError) {
        throw error
      }
      throw new RequestError(error.message, requestConfig, error.response || null)
    }
  }

  get(url, config = {}) {
    return this.request({ ...config, method: 'GET', url })
  }

  post(url, data, config = {}) {
    return this.request({ ...config, method: 'POST', url, data })
  }

  put(url, data, config = {}) {
    return this.request({ ...config, method: 'PUT', url, data })
  }

  patch(url, data, config = {}) {
    return this.request({ ...config, method: 'PATCH', url, data })
  }

  delete(url, config = {}) {
    return this.request({ ...config, method: 'DELETE', url })
  }
}

module.exports = Client

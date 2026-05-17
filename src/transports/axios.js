const axios = require('axios')
const { wrapper } = require('axios-cookiejar-support')

const http = require('http')
const https = require('https')

const { HttpsProxyAgent } = require('https-proxy-agent')
const { HttpProxyAgent } = require('http-proxy-agent')

function buildProxyAgent(proxy = {}) {
  if (!proxy.host || !proxy.port) {
    return null
  }

  const protocol = proxy.protocol || 'http'

  let auth = ''

  if (proxy.username && proxy.password) {
    auth = `${proxy.username}:${proxy.password}@`
  }

  const proxyUrl =
    `${protocol}://${auth}${proxy.host}:${proxy.port}`

  return {
    httpAgent: new HttpProxyAgent(proxyUrl),
    httpsAgent: new HttpsProxyAgent(proxyUrl)
  }
}

function createAxiosInstance({
  jar,
  timeout = 30000,
  proxy
} = {}) {

  const keepAliveHttpAgent = new http.Agent({
    keepAlive: true,
    keepAliveMsecs: 30000,
    maxSockets: 128,
    maxFreeSockets: 32,
    scheduling: 'lifo'
  })

  const keepAliveHttpsAgent = new https.Agent({
    keepAlive: true,
    keepAliveMsecs: 30000,
    maxSockets: 128,
    maxFreeSockets: 32,
    scheduling: 'lifo'
  })

  const config = {
    jar,
    withCredentials: true,
    timeout,
    maxRedirects: 5,
    decompress: true,
    validateStatus: () => true,

    headers: {
      'connection': 'keep-alive'
    },

    httpAgent: keepAliveHttpAgent,
    httpsAgent: keepAliveHttpsAgent
  }

  if (proxy) {
    const proxyAgents = buildProxyAgent(proxy)

    if (proxyAgents) {
      config.httpAgent = proxyAgents.httpAgent
      config.httpsAgent = proxyAgents.httpsAgent

      config.proxy = false
    }
  }

  const instance = wrapper(
    axios.create(config)
  )

  instance.interceptors.request.use((request) => {

    delete request.transport

    delete request.fingerprint

    if (
      request.headers &&
      !request.headers['accept-encoding']
    ) {
      request.headers['accept-encoding'] =
        'gzip, deflate, br'
    }

    return request
  })

  instance.interceptors.response.use(
    (response) => response,

    (error) => {
      if (error.code === 'ECONNABORTED') {
        error.name = 'TimeoutError'
      }

      return Promise.reject(error)
    }
  )

  return instance
}

module.exports = {
  createAxiosInstance
}
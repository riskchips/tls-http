const axios = require('axios')
const { wrapper } = require('axios-cookiejar-support')

function createAxiosInstance({
  jar,
  timeout = 30000,
  proxy
} = {}) {

  const config = {
    jar,
    withCredentials: true,

    timeout,

    maxRedirects: 5,

    decompress: true,

    validateStatus: () => true,

    headers: {
      'connection': 'keep-alive'
    }
  }

  if (proxy) {
    config.proxy = {
      host: proxy.host,
      port: proxy.port,
      protocol: proxy.protocol || 'http'
    }

    if (
      proxy.username &&
      proxy.password
    ) {
      config.proxy.auth = {
        username: proxy.username,
        password: proxy.password
      }
    }
  }

  const instance = wrapper(
    axios.create(config)
  )

  instance.interceptors.request.use(
    (request) => {

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
    }
  )

  instance.interceptors.response.use(
    (response) => response,

    (error) => {

      if (
        error.code === 'ECONNABORTED'
      ) {
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
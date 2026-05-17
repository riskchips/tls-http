const axios = require('axios')
const { wrapper } = require('axios-cookiejar-support')
const http = require('http')
const https = require('https')

function createAxiosInstance({ jar, timeout = 30000 } = {}) {
  const config = {
    jar,
    withCredentials: true,
    timeout,
    maxRedirects: 5,
    decompress: true,
    validateStatus: () => true
  }

  if (!jar) {
    config.httpAgent = new http.Agent({ keepAlive: true, maxSockets: 64 })
    config.httpsAgent = new https.Agent({ keepAlive: true, maxSockets: 64 })
  }

  return wrapper(axios.create(config))
}

module.exports = {
  createAxiosInstance
}

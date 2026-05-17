const axios = require('axios')
const { wrapper } = require('axios-cookiejar-support')
const http = require('http')
const https = require('https')

function createAxiosInstance({ jar, timeout = 30000 } = {}) {
  const httpAgent = new http.Agent({ keepAlive: true, maxSockets: 64 })
  const httpsAgent = new https.Agent({ keepAlive: true, maxSockets: 64 })

  return wrapper(
    axios.create({
      jar,
      withCredentials: true,
      timeout,
      maxRedirects: 5,
      decompress: true,
      httpAgent,
      httpsAgent,
      validateStatus: () => true
    })
  )
}

module.exports = {
  createAxiosInstance
}

const { HttpsProxyAgent } = require('https-proxy-agent')
const { HttpProxyAgent } = require('http-proxy-agent')

function buildProxy(proxy) {
  if (!proxy) {
    return undefined
  }

  if (typeof proxy === 'string') {
    return new HttpsProxyAgent(proxy)
  }

  const auth = proxy.username && proxy.password ? `${proxy.username}:${proxy.password}@` : ''
  const protocol = (proxy.protocol || 'http').replace(/:\/\//g, '')
  const url = `${protocol}://${auth}${proxy.host}:${proxy.port}`

  return protocol.startsWith('https') ? new HttpsProxyAgent(url) : new HttpProxyAgent(url)
}

module.exports = buildProxy

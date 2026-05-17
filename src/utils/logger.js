const enabled = process.env.TLS_HTTP_DEBUG === 'true'

function debug(...args) {
  if (!enabled) {
    return
  }
  console.debug('[tls-http]', ...args)
}

module.exports = {
  debug
}

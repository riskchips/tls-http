const Client = require('./core/client')
const Session = require('./core/session')
const { getBrowserProfile, buildChromeProfile, buildEdgeProfile, buildFirefoxProfile } = require('./fingerprint/profiles')
const { CookieJar } = require('./cookies/jar')
const { createWebSocket } = require('./websocket')
const errors = require('./utils/errors')

const defaultClient = new Client()

module.exports = {
  Client,
  Session,
  create: (config) => new Client(config),
  createSession: (config) => new Session(config),
  get: defaultClient.get.bind(defaultClient),
  post: defaultClient.post.bind(defaultClient),
  put: defaultClient.put.bind(defaultClient),
  patch: defaultClient.patch.bind(defaultClient),
  delete: defaultClient.delete.bind(defaultClient),
  request: defaultClient.request.bind(defaultClient),
  getBrowserProfile,
  buildChromeProfile,
  buildEdgeProfile,
  buildFirefoxProfile,
  CookieJar,
  createWebSocket,
  errors
}

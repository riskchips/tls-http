const Client = require('./client')

class Session extends Client {
  constructor(config = {}) {
    super(config)
    this.sessionId = config.sessionId || `session-${Date.now()}-${Math.random().toString(36).slice(2)}`
  }
}

module.exports = Session

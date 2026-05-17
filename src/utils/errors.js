class RequestError extends Error {
  constructor(message, config = {}, response = null) {
    super(message)
    this.name = 'RequestError'
    this.config = config
    this.response = response
    Error.captureStackTrace(this, RequestError)
  }
}

class TimeoutError extends Error {
  constructor(message, config = {}) {
    super(message)
    this.name = 'TimeoutError'
    this.config = config
    Error.captureStackTrace(this, TimeoutError)
  }
}

class ProxyError extends Error {
  constructor(message, config = {}, cause = null) {
    super(message)
    this.name = 'ProxyError'
    this.config = config
    this.cause = cause
    Error.captureStackTrace(this, ProxyError)
  }
}

class NetworkError extends Error {
  constructor(message, config = {}, cause = null) {
    super(message)
    this.name = 'NetworkError'
    this.config = config
    this.cause = cause
    Error.captureStackTrace(this, NetworkError)
  }
}

module.exports = {
  RequestError,
  TimeoutError,
  ProxyError,
  NetworkError
}

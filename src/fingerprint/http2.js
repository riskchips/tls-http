const CHROME_HTTP2_SETTINGS = {
  enablePush: false,
  peerMaxConcurrentStreams: 100,
  initialWindowSize: 6291456,
  maxHeaderListSize: 65536,
  initialConnectionWindowSize: 10485760
}

const FIREFOX_HTTP2_SETTINGS = {
  enablePush: false,
  peerMaxConcurrentStreams: 128,
  initialWindowSize: 65535,
  maxHeaderListSize: 32768,
  initialConnectionWindowSize: 10485760
}

const EDGE_HTTP2_SETTINGS = CHROME_HTTP2_SETTINGS

const defaultHttp2Settings = CHROME_HTTP2_SETTINGS

function buildHttp2Settings(profile = {}, browser = 'chrome') {
  const browser_lower = String(browser || 'chrome').toLowerCase()
  const settingsMap = {
    'chrome': CHROME_HTTP2_SETTINGS,
    'firefox': FIREFOX_HTTP2_SETTINGS,
    'edge': EDGE_HTTP2_SETTINGS
  }

  return {
    ...(settingsMap[browser_lower] || CHROME_HTTP2_SETTINGS),
    ...(profile.http2 || {})
  }
}

module.exports = {
  CHROME_HTTP2_SETTINGS,
  FIREFOX_HTTP2_SETTINGS,
  EDGE_HTTP2_SETTINGS,
  defaultHttp2Settings,
  buildHttp2Settings
}

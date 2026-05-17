const CHROME_TLS_CIPHER_SUITE = [
  'TLS_AES_256_GCM_SHA384',
  'TLS_CHACHA20_POLY1305_SHA256',
  'TLS_AES_128_GCM_SHA256',
  'ECDHE-ECDSA-AES128-GCM-SHA256',
  'ECDHE-RSA-AES128-GCM-SHA256',
  'ECDHE-ECDSA-AES256-GCM-SHA384',
  'ECDHE-RSA-AES256-GCM-SHA384'
]

const FIREFOX_TLS_CIPHER_SUITE = [
  'TLS_AES_256_GCM_SHA384',
  'TLS_CHACHA20_POLY1305_SHA256',
  'TLS_AES_128_GCM_SHA256',
  'ECDHE-ECDSA-AES128-GCM-SHA256',
  'ECDHE-RSA-AES128-GCM-SHA256',
  'ECDHE-ECDSA-CHACHA20-POLY1305',
  'ECDHE-RSA-CHACHA20-POLY1305'
]

const EDGE_TLS_CIPHER_SUITE = CHROME_TLS_CIPHER_SUITE

const defaultTlsOptions = {
  ciphers: CHROME_TLS_CIPHER_SUITE.join(':'),
  minVersion: 'TLSv1.2',
  maxVersion: 'TLSv1.3',
  ecdhCurve: 'X25519:P-256:P-384',
  honorCipherOrder: true,
  sessionTimeout: 300000
}

function buildTlsOptions(profile = {}, browser = 'chrome') {
  const browser_lower = String(browser || 'chrome').toLowerCase()
  const cipherSuites = {
    'chrome': CHROME_TLS_CIPHER_SUITE,
    'firefox': FIREFOX_TLS_CIPHER_SUITE,
    'edge': EDGE_TLS_CIPHER_SUITE
  }

  const ciphers = (cipherSuites[browser_lower] || CHROME_TLS_CIPHER_SUITE).join(':')

  return {
    ciphers,
    minVersion: 'TLSv1.2',
    maxVersion: 'TLSv1.3',
    ecdhCurve: profile.ecdhCurve || 'X25519:P-256:P-384',
    honorCipherOrder: true,
    sessionTimeout: 300000,
    ...(profile.tls || {})
  }
}

module.exports = {
  CHROME_TLS_CIPHER_SUITE,
  FIREFOX_TLS_CIPHER_SUITE,
  EDGE_TLS_CIPHER_SUITE,
  defaultTlsOptions,
  buildTlsOptions
}

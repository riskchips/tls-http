const { buildChromeProfile } = require('../browser/chrome')
const { buildEdgeProfile } = require('../browser/edge')
const { buildFirefoxProfile } = require('../browser/firefox')

const builders = {
  chrome: buildChromeProfile,
  edge: buildEdgeProfile,
  firefox: buildFirefoxProfile
}

function getBrowserProfile(name = 'chrome', options = {}) {
  const key = String(name || 'chrome').toLowerCase()
  const builder = builders[key] || buildChromeProfile
  return builder(options)
}

module.exports = {
  getBrowserProfile,
  buildChromeProfile,
  buildEdgeProfile,
  buildFirefoxProfile
}

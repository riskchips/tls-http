const { CookieJar } = require('tough-cookie')

function createCookieJar() {
  return new CookieJar()
}

module.exports = {
  CookieJar,
  createCookieJar
}

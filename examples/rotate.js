const tlsHttp = require('../src')

async function run() {
  const response1 = await tlsHttp.get('https://httpbin.org/get', {
    browser: 'chrome',
    rotateFingerprint: true,
    responseType: 'json'
  })
  const response2 = await tlsHttp.get('https://httpbin.org/get', {
    browser: 'chrome',
    rotateFingerprint: true,
    responseType: 'json'
  })
  console.log('first UA:', response1.data.headers['User-Agent'] || response1.data.headers['user-agent'])
  console.log('second UA:', response2.data.headers['User-Agent'] || response2.data.headers['user-agent'])
}

run().catch(console.error)

const tlsHttp = require('../src')

async function run() {
  const response = await tlsHttp.get('https://httpbin.org/get', {
    browser: 'chrome',
    timeout: 15000,
    responseType: 'json'
  })
  console.log(response.status)
  console.log(response.data)
}

run().catch(console.error)

const tlsHttp = require('../src')

async function run() {
  const response = await tlsHttp.post('https://httpbin.org/post', null, {
    browser: 'firefox',
    json: { message: 'hello tls-http' },
    responseType: 'json'
  })
  console.log(response.status)
  console.log(response.data.json)
}

run().catch(console.error)

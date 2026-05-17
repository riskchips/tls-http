const tlsHttp = require('../src')

async function run() {
  const response = await tlsHttp.get('https://httpbin.org/get', {
    browser: 'firefox',
    proxy: {
      host: '127.0.0.1',
      port: 3128,
      username: 'user',
      password: 'pass'
    },
    responseType: 'json'
  })
  console.log(response.status)
  console.log(response.data.origin)
}

run().catch(console.error)

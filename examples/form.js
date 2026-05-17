const tlsHttp = require('../src')

async function run() {
  const response = await tlsHttp.post('https://httpbin.org/post', null, {
    browser: 'edge',
    form: { username: 'guest', email: 'user@example.com' },
    responseType: 'json'
  })
  console.log(response.status)
  console.log(response.data.form)
}

run().catch(console.error)

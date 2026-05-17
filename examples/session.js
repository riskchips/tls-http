const tlsHttp = require('../src')

async function run() {
  const session = tlsHttp.createSession({ browser: 'edge' })
  await session.get('https://httpbin.org/cookies/set?token=abc', {
    responseType: 'json'
  })
  const cookies = await session.get('https://httpbin.org/cookies', {
    responseType: 'json'
  })
  console.log(cookies.data.cookies)
}

run().catch(console.error)

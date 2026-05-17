function randomInt(min, max) {
  const low = Math.ceil(min)
  const high = Math.floor(max)
  return Math.floor(Math.random() * (high - low + 1)) + low
}

function randomFloat(min, max) {
  return Math.random() * (max - min) + min
}

function randomItem(list = []) {
  if (!Array.isArray(list) || list.length === 0) {
    return undefined
  }
  return list[randomInt(0, list.length - 1)]
}

function shuffleArray(array = []) {
  const result = array.slice()
  for (let i = result.length - 1; i > 0; i--) {
    const j = randomInt(0, i)
    const tmp = result[i]
    result[i] = result[j]
    result[j] = tmp
  }
  return result
}

function randomUA() {
  const browsers = ['chrome', 'firefox', 'edge', 'safari']
  return randomItem(browsers)
}

function randomPlatform() {
  const platforms = ['Windows NT 10.0', 'Macintosh; Intel Mac OS X 10_15_7', 'X11; Linux x86_64']
  return randomItem(platforms)
}

function randomTimezone() {
  const zones = ['UTC', 'America/New_York', 'America/Los_Angeles', 'Europe/London', 'Europe/Paris', 'Asia/Tokyo', 'Asia/Shanghai', 'Australia/Sydney']
  return randomItem(zones)
}

function randomLanguage() {
  const langs = ['en-US', 'en-GB', 'en-CA', 'en-AU', 'fr-FR', 'de-DE', 'es-ES', 'ja-JP', 'zh-CN']
  return randomItem(langs)
}

function randomViewport() {
  const viewports = [
    { width: 1920, height: 1080 },
    { width: 1680, height: 1050 },
    { width: 1440, height: 900 },
    { width: 1366, height: 768 },
    { width: 1360, height: 768 },
    { width: 1280, height: 1024 },
    { width: 1280, height: 800 },
    { width: 1024, height: 768 }
  ]
  return randomItem(viewports)
}

function randomDeviceMemory() {
  return randomItem([2, 4, 8, 16, 32])
}

function randomHardwareConcurrency() {
  return randomItem([2, 4, 6, 8, 12, 16])
}

function randomConnectionSpeed() {
  return randomItem(['4g', '4g', '4g', '3g', 'lte'])
}

function randomRTT() {
  return randomInt(10, 150)
}

function randomDownlink() {
  return randomFloat(2.5, 25)
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

module.exports = {
  randomInt,
  randomFloat,
  randomItem,
  shuffleArray,
  randomUA,
  randomPlatform,
  randomTimezone,
  randomLanguage,
  randomViewport,
  randomDeviceMemory,
  randomHardwareConcurrency,
  randomConnectionSpeed,
  randomRTT,
  randomDownlink,
  delay
}

export default defineNuxtPlugin(() => {
  if (process.server) {
    const crypto = require('crypto')
    global.crypto = crypto
  }
})

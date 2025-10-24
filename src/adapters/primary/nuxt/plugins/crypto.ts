export default defineNuxtPlugin(() => {
  if (process.server) {
    try {
      // biome-ignore lint: Required here
      global.crypto = require('crypto')
    } catch (error) {
      console.error('Failed to polyfill crypto:', error)
    }
  }
})

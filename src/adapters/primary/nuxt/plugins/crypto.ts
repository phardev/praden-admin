export default defineNuxtPlugin(() => {
  if (process.server) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      global.crypto = require('crypto')
    } catch (error) {
      console.error('Failed to polyfill crypto:', error)
    }
  }
})

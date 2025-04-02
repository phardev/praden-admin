export default defineNuxtPlugin(async () => {
  if (process.server) {
    const cryptoModule = await import('crypto')
    global.crypto = cryptoModule.default || cryptoModule
  }
})

import Keycloak from 'keycloak-js'
import { NuxtApp } from 'nuxt/app'

export default defineNuxtPlugin((nuxtApp: NuxtApp) => {
  const { KEYCLOAK_URL, KEYCLOAK_REALM, KEYCLOAK_CLIENT_ID } =
    useRuntimeConfig().public

  const keycloak = new Keycloak({
    url: KEYCLOAK_URL,
    realm: KEYCLOAK_REALM,
    clientId: KEYCLOAK_CLIENT_ID
  })

  const keycloakReady = new Promise<void>((resolve, reject) => {
    keycloak
      .init({
        checkLoginIframe: false
      })
      .then((authenticated) => {
        if (authenticated) {
          const intervalId = setInterval(() => {
            keycloak.updateToken(60).catch((err) => {
              console.error('Failed to refresh token', err)
              clearInterval(intervalId)
            })
          }, 60000)
        } else {
          console.warn('User is not authenticated')
          keycloak.login()
        }
        resolve()
      })
      .catch((err) => {
        console.error('Keycloak initialization failed', err)
        reject(err)
      })
  })

  nuxtApp.provide('keycloak', keycloak)
  nuxtApp.provide('keycloakReady', keycloakReady)
})

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
  keycloak
    .init({
      onLoad: 'login-required'
    })
    .then((authenticated) => {
      if (authenticated) {
        console.log('Successfully authenticated')
        setInterval(() => {
          keycloak.updateToken(70).catch(console.error)
        }, 60000)
      }
    })
  nuxtApp.$keycloak = keycloak
})

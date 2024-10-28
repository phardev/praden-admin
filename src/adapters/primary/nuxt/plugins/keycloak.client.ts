import Keycloak from 'keycloak-js'
import { NuxtApp } from 'nuxt/app'

export default defineNuxtPlugin((nuxtApp: NuxtApp) => {
  // const { KEYCLOAK_URL, KEYCLOAK_REALM, KEYCLOAK_CLIENT_ID } =
  //   useRuntimeConfig().public
  const keycloak = new Keycloak({
    url: 'https://keycloak.phardev.local',
    realm: 'Praden',
    clientId: 'admin-app'
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

import { getUserProfile } from '@core/usecases/profile/getUserProfile'
import Keycloak from 'keycloak-js'
import { NuxtApp } from 'nuxt/app'
import { useUserProfileGateway } from '../../../../../gateways/userProfileGateway'

export default defineNuxtPlugin((nuxtApp: NuxtApp) => {
  const { KEYCLOAK_URL, KEYCLOAK_REALM, KEYCLOAK_CLIENT_ID } =
    useRuntimeConfig().public

  const keycloak = new Keycloak({
    url: KEYCLOAK_URL,
    realm: KEYCLOAK_REALM,
    clientId: KEYCLOAK_CLIENT_ID
  })

  const userProfileGateway = useUserProfileGateway()

  const loadUserProfile = async () => {
    try {
      await getUserProfile(userProfileGateway)
    } catch {
      // Error already handled in getUserProfile
    }
  }

  const keycloakReady = new Promise<void>((resolve, reject) => {
    keycloak
      .init({
        checkLoginIframe: false
      })
      .then(async (authenticated) => {
        if (authenticated) {
          const intervalId = setInterval(() => {
            keycloak.updateToken(60).catch(() => {
              clearInterval(intervalId)
            })
          }, 60000)
        } else {
          keycloak.login()
        }

        resolve()

        if (authenticated) {
          nextTick(() => {
            loadUserProfile()
          })
        }
      })
      .catch((err) => {
        reject(err)
      })
  })

  nuxtApp.provide('keycloak', keycloak)
  nuxtApp.provide('keycloakReady', keycloakReady)
})

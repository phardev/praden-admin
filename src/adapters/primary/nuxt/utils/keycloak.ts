import Keycloak from 'keycloak-js'

export const getToken = async (): Promise<string | null> => {
  const nuxtApp = useNuxtApp()
  const $keycloak = nuxtApp.$keycloak as Keycloak
  const $keycloakReady = nuxtApp.$keycloakReady as Promise<void>

  try {
    await $keycloakReady
    if (!$keycloak.authenticated) {
      console.warn('User is not authenticated. Triggering login...')
      await $keycloak.login()
      return null
    }
    if ($keycloak.isTokenExpired()) {
      console.log('token expired, refresh')
      await $keycloak.updateToken(30)
    }
    return $keycloak.token || null
  } catch (error) {
    console.error('Failed to update token:', error)
    return null
  }
}

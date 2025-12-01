import Keycloak from 'keycloak-js'

export const getToken = async (): Promise<string | null> => {
  const nuxtApp = useNuxtApp()
  const $keycloak = nuxtApp.$keycloak as Keycloak

  try {
    if (!$keycloak.authenticated) {
      await $keycloak.login()
      return null
    }
    if ($keycloak.isTokenExpired()) {
      await $keycloak.updateToken(30)
    }
    return $keycloak.token || null
  } catch {
    return null
  }
}

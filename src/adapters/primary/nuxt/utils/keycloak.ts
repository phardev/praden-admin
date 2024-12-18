export const getToken = async (): Promise<string | null> => {
  const { $keycloak, $keycloakReady } = useNuxtApp()

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

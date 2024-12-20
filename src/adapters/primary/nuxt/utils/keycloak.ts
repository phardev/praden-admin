export const getToken = async (): Promise<string | null> => {
  const { $keycloak, $keycloakReady } = useNuxtApp()

  try {
    await $keycloakReady
    if (!$keycloak.authenticated) {
      console.warn('User is not authenticated. Triggering login...')
      await $keycloak.login()
      return null
    }
    return $keycloak.token || null
  } catch (error) {
    console.error('Failed to update token:', error)
    return null
  }
}

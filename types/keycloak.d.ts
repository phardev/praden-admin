import Keycloak from 'keycloak-js'

declare module '#app' {
  interface NuxtApp {
    $keycloak: Keycloak
    $keycloakReady: Promise<void>
  }
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $keycloak: Keycloak
    $keycloakReady: Promise<void>
  }
}

export {}

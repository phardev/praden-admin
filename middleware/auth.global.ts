import { getPermissionsVM } from '@adapters/primary/view-models/permissions/getPermissionsVM'
import { useUserProfileStore } from '@store/userProfileStore'
import { canAccessRoute } from '@utils/permissions/routePermissionMapping'

export default defineNuxtRouteMiddleware(async (to) => {
  const publicRoutes = ['/', '/login', '/logout']

  if (publicRoutes.includes(to.path)) {
    return
  }

  const userProfileStore = useUserProfileStore()

  if (!userProfileStore.current && !userProfileStore.error) {
    const { $keycloakReady } = useNuxtApp()

    if ($keycloakReady) {
      try {
        await $keycloakReady
        await new Promise((resolve) => setTimeout(resolve, 100))
      } catch (error) {
        console.error('Authentication failed:', error)
        return navigateTo('/')
      }
    }
  }

  const permissions = getPermissionsVM()

  if (!canAccessRoute(to.path, permissions)) {
    return navigateTo('/')
  }
})

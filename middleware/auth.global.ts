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
      } catch {
        return navigateTo('/')
      }
    }
  }

  const permissions = getPermissionsVM()

  if (!canAccessRoute(to.path, permissions)) {
    return navigateTo('/')
  }
})

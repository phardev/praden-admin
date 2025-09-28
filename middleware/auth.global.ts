import { getPermissionsVM } from '@adapters/primary/view-models/permissions/getPermissionsVM'
import { canAccessRoute } from '@utils/permissions/routePermissionMapping'

export default defineNuxtRouteMiddleware((to) => {
  const publicRoutes = ['/', '/login', '/logout']

  if (publicRoutes.includes(to.path)) {
    return
  }

  const permissions = getPermissionsVM()

  if (!canAccessRoute(to.path, permissions)) {
    return navigateTo('/')
  }
})

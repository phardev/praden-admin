import { PermissionResource } from '@core/entities/permissionResource'

export const ROUTE_PERMISSION_MAP: Record<string, PermissionResource> = {
  '/dashboard': PermissionResource.DASHBOARD,
  '/reminders': PermissionResource.REMINDERS,
  '/products': PermissionResource.PRODUCTS,
  '/products/new': PermissionResource.PRODUCTS,
  '/products/edit': PermissionResource.PRODUCTS,
  '/products/get': PermissionResource.PRODUCTS,
  '/laboratories': PermissionResource.LABORATORIES,
  '/laboratories/new': PermissionResource.LABORATORIES,
  '/laboratories/edit': PermissionResource.LABORATORIES,
  '/laboratories/get': PermissionResource.LABORATORIES,
  '/categories': PermissionResource.CATEGORIES,
  '/categories/new': PermissionResource.CATEGORIES,
  '/categories/edit': PermissionResource.CATEGORIES,
  '/categories/get': PermissionResource.CATEGORIES,
  '/promotions': PermissionResource.PROMOTIONS,
  '/promotions/new': PermissionResource.PROMOTIONS,
  '/promotions/edit': PermissionResource.PROMOTIONS,
  '/promotions/get': PermissionResource.PROMOTIONS,
  '/promotion-codes': PermissionResource.PROMOTION_CODES,
  '/promotion-codes/new': PermissionResource.PROMOTION_CODES,
  '/promotion-codes/edit': PermissionResource.PROMOTION_CODES,
  '/promotion-codes/get': PermissionResource.PROMOTION_CODES,
  '/customers': PermissionResource.CUSTOMERS,
  '/customers/new': PermissionResource.CUSTOMERS,
  '/customers/edit': PermissionResource.CUSTOMERS,
  '/customers/get': PermissionResource.CUSTOMERS,
  '/newsletter-subscriptions': PermissionResource.NEWSLETTER,
  '/support': PermissionResource.SUPPORT,
  '/support/ticket-predefined-answers': PermissionResource.SUPPORT,
  '/deliveries': PermissionResource.DELIVERIES,
  '/preparations': PermissionResource.PREPARATIONS,
  '/waitingPreparations': PermissionResource.PREPARATIONS,
  '/orders': PermissionResource.ORDERS,
  '/banners': PermissionResource.BANNERS,
  '/banners/new': PermissionResource.BANNERS,
  '/banners/edit': PermissionResource.BANNERS,
  '/staff': PermissionResource.STAFF,
  '/research': PermissionResource.RESEARCH
} as const

export const getRequiredPermission = (
  route: string
): PermissionResource | null => {
  if (ROUTE_PERMISSION_MAP[route]) {
    return ROUTE_PERMISSION_MAP[route]
  }

  for (const [mappedRoute, permission] of Object.entries(
    ROUTE_PERMISSION_MAP
  )) {
    const routeParts = route.split('/')
    const mappedParts = mappedRoute.split('/')

    if (
      mappedRoute.includes('/edit') ||
      mappedRoute.includes('/get') ||
      mappedRoute.includes('/new')
    ) {
      const basePath = mappedRoute.split('/').slice(0, 2).join('/')
      const currentBasePath = route.split('/').slice(0, 2).join('/')

      if (basePath === currentBasePath) {
        return permission
      }
    }

    if (
      routeParts.length === 3 &&
      mappedParts.length === 2 &&
      routeParts[1] === mappedParts[1]
    ) {
      return permission
    }
  }

  return null
}

export const canAccessRoute = (
  route: string,
  userPermissions: Record<string, boolean>
): boolean => {
  const requiredPermission = getRequiredPermission(route)

  if (!requiredPermission) {
    return true
  }

  const permissionKey = getPermissionKey(requiredPermission)
  return userPermissions[permissionKey] || false
}

export const getPermissionKey = (permission: PermissionResource): string => {
  const permissionMap: Record<PermissionResource, string> = {
    [PermissionResource.DASHBOARD]: 'canAccessDashboard',
    [PermissionResource.REMINDERS]: 'canAccessReminders',
    [PermissionResource.PRODUCTS]: 'canAccessProducts',
    [PermissionResource.LABORATORIES]: 'canAccessLaboratories',
    [PermissionResource.CATEGORIES]: 'canAccessCategories',
    [PermissionResource.PROMOTIONS]: 'canAccessPromotions',
    [PermissionResource.PROMOTION_CODES]: 'canAccessPromotionCodes',
    [PermissionResource.CUSTOMERS]: 'canAccessCustomers',
    [PermissionResource.NEWSLETTER]: 'canAccessNewsletter',
    [PermissionResource.SUPPORT]: 'canAccessSupport',
    [PermissionResource.DELIVERIES]: 'canAccessDeliveries',
    [PermissionResource.PREPARATIONS]: 'canAccessPreparations',
    [PermissionResource.ORDERS]: 'canAccessOrders',
    [PermissionResource.BANNERS]: 'canAccessBanners',
    [PermissionResource.STAFF]: 'canAccessStaff',
    [PermissionResource.RESEARCH]: 'canAccessResearch'
  }

  return permissionMap[permission]
}

export const getRoutesForPermission = (
  permission: PermissionResource
): string[] => {
  return Object.entries(ROUTE_PERMISSION_MAP)
    .filter(([, routePermission]) => routePermission === permission)
    .map(([route]) => route)
}

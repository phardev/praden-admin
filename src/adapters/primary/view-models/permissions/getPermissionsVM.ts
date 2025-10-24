import { PermissionResource } from '@core/entities/permissionResource'
import { useUserProfileStore } from '@store/userProfileStore'

export interface GetPermissionsVM {
  canAccessDashboard: boolean
  canAccessReminders: boolean
  canAccessProducts: boolean
  canAccessLaboratories: boolean
  canAccessCategories: boolean
  canAccessPromotions: boolean
  canAccessPromotionCodes: boolean
  canAccessCustomers: boolean
  canAccessNewsletter: boolean
  canAccessSupport: boolean
  canAccessDeliveries: boolean
  canAccessPreparations: boolean
  canAccessOrders: boolean
  canAccessBanners: boolean
  canAccessStaff: boolean
  canAccessResearch: boolean
}

export const getPermissionsVM = (): GetPermissionsVM => {
  const userProfileStore = useUserProfileStore()

  return {
    canAccessDashboard: userProfileStore.hasPermission(
      PermissionResource.DASHBOARD
    ),
    canAccessReminders: userProfileStore.hasPermission(
      PermissionResource.REMINDERS
    ),
    canAccessProducts: userProfileStore.hasPermission(
      PermissionResource.PRODUCTS
    ),
    canAccessLaboratories: userProfileStore.hasPermission(
      PermissionResource.LABORATORIES
    ),
    canAccessCategories: userProfileStore.hasPermission(
      PermissionResource.CATEGORIES
    ),
    canAccessPromotions: userProfileStore.hasPermission(
      PermissionResource.PROMOTIONS
    ),
    canAccessPromotionCodes: userProfileStore.hasPermission(
      PermissionResource.PROMOTION_CODES
    ),
    canAccessCustomers: userProfileStore.hasPermission(
      PermissionResource.CUSTOMERS
    ),
    canAccessNewsletter: userProfileStore.hasPermission(
      PermissionResource.NEWSLETTER
    ),
    canAccessSupport: userProfileStore.hasPermission(
      PermissionResource.SUPPORT
    ),
    canAccessDeliveries: userProfileStore.hasPermission(
      PermissionResource.DELIVERIES
    ),
    canAccessPreparations: userProfileStore.hasPermission(
      PermissionResource.PREPARATIONS
    ),
    canAccessOrders: userProfileStore.hasPermission(PermissionResource.ORDERS),
    canAccessBanners: userProfileStore.hasPermission(
      PermissionResource.BANNERS
    ),
    canAccessStaff: userProfileStore.hasPermission(PermissionResource.STAFF),
    canAccessResearch: userProfileStore.hasPermission(
      PermissionResource.RESEARCH
    )
  }
}

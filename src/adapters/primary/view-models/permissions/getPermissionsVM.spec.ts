import {
  GetPermissionsVM,
  getPermissionsVM
} from '@adapters/primary/view-models/permissions/getPermissionsVM'
import { useUserProfileStore } from '@store/userProfileStore'
import {
  adminUserProfile,
  assistantUserProfile,
  pharmacistUserProfile
} from '@utils/testData/userProfiles'
import { createPinia, setActivePinia } from 'pinia'

describe('Get permissions VM', () => {
  let userProfileStore: any
  let vm: GetPermissionsVM

  beforeEach(() => {
    setActivePinia(createPinia())
    userProfileStore = useUserProfileStore()
  })

  describe('User with no profile loaded', () => {
    it('should deny all permissions when no user profile is loaded', () => {
      whenGetPermissionsVM()
      expectPermissionsToEqual({
        canAccessDashboard: false,
        canAccessReminders: false,
        canAccessProducts: false,
        canAccessLaboratories: false,
        canAccessCategories: false,
        canAccessPromotions: false,
        canAccessPromotionCodes: false,
        canAccessCustomers: false,
        canAccessNewsletter: false,
        canAccessSupport: false,
        canAccessDeliveries: false,
        canAccessPreparations: false,
        canAccessOrders: false,
        canAccessShopManagement: false,
        canAccessBanners: false,
        canAccessStaff: false,
        canAccessResearch: false
      })
    })
  })

  describe('User with null profile', () => {
    it('should deny all permissions when user profile is null', () => {
      givenUserProfile(null)
      whenGetPermissionsVM()
      expectPermissionsToEqual({
        canAccessDashboard: false,
        canAccessReminders: false,
        canAccessProducts: false,
        canAccessLaboratories: false,
        canAccessCategories: false,
        canAccessPromotions: false,
        canAccessPromotionCodes: false,
        canAccessCustomers: false,
        canAccessNewsletter: false,
        canAccessSupport: false,
        canAccessDeliveries: false,
        canAccessPreparations: false,
        canAccessOrders: false,
        canAccessShopManagement: false,
        canAccessBanners: false,
        canAccessStaff: false,
        canAccessResearch: false
      })
    })
  })

  describe('Assistant user permissions', () => {
    it('should allow dashboard, reminders, customers, newsletter, support, preparations and orders access only', () => {
      givenUserProfile(assistantUserProfile)
      whenGetPermissionsVM()
      expectPermissionsToEqual({
        canAccessDashboard: true,
        canAccessReminders: true,
        canAccessProducts: false,
        canAccessLaboratories: false,
        canAccessCategories: false,
        canAccessPromotions: false,
        canAccessPromotionCodes: false,
        canAccessCustomers: true,
        canAccessNewsletter: true,
        canAccessSupport: true,
        canAccessDeliveries: false,
        canAccessPreparations: true,
        canAccessOrders: true,
        canAccessShopManagement: false,
        canAccessBanners: false,
        canAccessStaff: false,
        canAccessResearch: false
      })
    })
  })

  describe('Pharmacist user permissions', () => {
    it('should allow most permissions except staff and research', () => {
      givenUserProfile(pharmacistUserProfile)
      whenGetPermissionsVM()
      expectPermissionsToEqual({
        canAccessDashboard: true,
        canAccessReminders: true,
        canAccessProducts: true,
        canAccessLaboratories: true,
        canAccessCategories: true,
        canAccessPromotions: true,
        canAccessPromotionCodes: true,
        canAccessCustomers: true,
        canAccessNewsletter: true,
        canAccessSupport: true,
        canAccessDeliveries: true,
        canAccessPreparations: true,
        canAccessOrders: true,
        canAccessShopManagement: true,
        canAccessBanners: true,
        canAccessStaff: false,
        canAccessResearch: false
      })
    })
  })

  describe('Admin user permissions', () => {
    it('should allow access to all resources', () => {
      givenUserProfile(adminUserProfile)
      whenGetPermissionsVM()
      expectPermissionsToEqual({
        canAccessDashboard: true,
        canAccessReminders: true,
        canAccessProducts: true,
        canAccessLaboratories: true,
        canAccessCategories: true,
        canAccessPromotions: true,
        canAccessPromotionCodes: true,
        canAccessCustomers: true,
        canAccessNewsletter: true,
        canAccessSupport: true,
        canAccessDeliveries: true,
        canAccessPreparations: true,
        canAccessOrders: true,
        canAccessShopManagement: true,
        canAccessBanners: true,
        canAccessStaff: true,
        canAccessResearch: true
      })
    })
  })

  const givenUserProfile = (profile: any) => {
    userProfileStore.setCurrent(profile)
  }

  const whenGetPermissionsVM = () => {
    vm = getPermissionsVM()
  }

  const expectPermissionsToEqual = (expectedPermissions: GetPermissionsVM) => {
    expect(vm).toStrictEqual(expectedPermissions)
  }
})

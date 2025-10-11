import { createPinia, setActivePinia } from 'pinia'
import { useNavigationMenuStore } from '@store/navigationMenuStore'
import { useUserProfileStore } from '@store/userProfileStore'
import {
  GetNavigationMenuVM,
  getNavigationMenuVM
} from '@adapters/primary/view-models/navigation-menu/get-navigation-menu/getNavigationMenuVM'
import { fullMenu } from '@utils/testData/navigationMenu'
import {
  adminUserProfile,
  pharmacistUserProfile,
  assistantUserProfile
} from '@utils/testData/userProfiles'

describe('Get navigation menu VM', () => {
  let navigationMenuStore: any
  let userProfileStore: any
  let vm: GetNavigationMenuVM

  beforeEach(() => {
    setActivePinia(createPinia())
    navigationMenuStore = useNavigationMenuStore()
    userProfileStore = useUserProfileStore()
    navigationMenuStore.current = fullMenu
  })

  describe('User with no profile loaded', () => {
    it('should return empty menu when no user profile is loaded', () => {
      whenGetNavigationMenuVM()
      expectVMToEqual({
        logo: fullMenu.logo,
        title: fullMenu.title,
        sections: []
      })
    })
  })

  describe('There is no menu', () => {
    it('should return an empty object', () => {
      navigationMenuStore.current = null
      whenGetNavigationMenuVM()
      expectVMToEqual({})
    })
  })

  describe('Assistant user (dashboard, reminders, customers, newsletter, support, preparations and orders permissions)', () => {
    it('should show only pages assistant has permission for', () => {
      givenUserProfile(assistantUserProfile)
      whenGetNavigationMenuVM()
      expectVMToEqual({
        logo: fullMenu.logo,
        title: fullMenu.title,
        sections: [
          {
            title: 'Statistiques',
            links: [
              {
                name: 'Tableau de bord',
                icon: 'akar-icons:statistic-up',
                href: '/dashboard'
              },
              {
                name: 'Relances',
                icon: 'mdi:bell-outline',
                href: '/reminders'
              }
            ]
          },
          {
            title: 'Clients',
            links: [
              {
                name: 'Clients',
                icon: 'material-symbols:person-outline-rounded',
                href: '/customers'
              },
              {
                name: 'Newsletter',
                icon: 'mdi:email-newsletter',
                href: '/newsletter-subscriptions'
              },
              {
                name: 'SAV',
                icon: 'streamline:interface-help-customer-support-2-customer-headphones-headset-help-microphone-phone-person-support',
                href: '/support'
              }
            ]
          },
          {
            title: 'Commandes',
            links: [
              {
                name: 'Préparations',
                icon: 'akar-icons:shipping-box-01',
                href: '/preparations'
              },
              {
                name: 'Préparations en attente',
                icon: 'pajamas:status-waiting',
                href: '/waitingPreparations'
              },
              {
                name: 'Commandes',
                icon: 'material-symbols:orders-outline',
                href: '/orders'
              }
            ]
          }
        ]
      })
    })
  })

  describe('Pharmacist user (most permissions except staff/research)', () => {
    it('should show all sections except Administration', () => {
      givenUserProfile(pharmacistUserProfile)
      whenGetNavigationMenuVM()
      expectVMToEqual({
        logo: fullMenu.logo,
        title: fullMenu.title,
        sections: [
          {
            title: 'Statistiques',
            links: [
              {
                name: 'Tableau de bord',
                icon: 'akar-icons:statistic-up',
                href: '/dashboard'
              },
              {
                name: 'Relances',
                icon: 'mdi:bell-outline',
                href: '/reminders'
              }
            ]
          },
          {
            title: 'Catalogue',
            links: [
              {
                name: 'Produits',
                icon: 'fluent-mdl2:product-catalog',
                href: '/products'
              },
              {
                name: 'Laboratoires',
                icon: 'mdi:beaker-outline',
                href: '/laboratories'
              },
              {
                name: 'Catégories',
                icon: 'tabler:category',
                href: '/categories'
              },
              {
                name: 'Promotions',
                icon: 'uil:euro-circle',
                href: '/promotions'
              },
              {
                name: 'Codes promotion',
                icon: 'ic:outline-discount',
                href: '/promotion-codes'
              }
            ]
          },
          {
            title: 'Clients',
            links: [
              {
                name: 'Clients',
                icon: 'material-symbols:person-outline-rounded',
                href: '/customers'
              },
              {
                name: 'Newsletter',
                icon: 'mdi:email-newsletter',
                href: '/newsletter-subscriptions'
              },
              {
                name: 'SAV',
                icon: 'streamline:interface-help-customer-support-2-customer-headphones-headset-help-microphone-phone-person-support',
                href: '/support'
              }
            ]
          },
          {
            title: 'Logistique',
            links: [
              {
                name: 'Livraisons',
                icon: 'material-symbols-light:delivery-truck-speed-outline',
                href: '/deliveries'
              }
            ]
          },
          {
            title: 'Commandes',
            links: [
              {
                name: 'Préparations',
                icon: 'akar-icons:shipping-box-01',
                href: '/preparations'
              },
              {
                name: 'Préparations en attente',
                icon: 'pajamas:status-waiting',
                href: '/waitingPreparations'
              },
              {
                name: 'Commandes',
                icon: 'material-symbols:orders-outline',
                href: '/orders'
              }
            ]
          },
          {
            title: 'Boutique',
            links: [
              {
                name: 'Gestion boutique',
                icon: 'heroicons:cog-6-tooth',
                href: '/shop-settings'
              },
              {
                name: 'Bannières',
                icon: 'material-symbols:add-photo-alternate-outline',
                href: '/banners'
              }
            ]
          }
        ]
      })
    })
  })

  describe('Admin user (all permissions)', () => {
    it('should show all sections including Administration', () => {
      givenUserProfile(adminUserProfile)
      whenGetNavigationMenuVM()
      expectVMToEqual(fullMenu)
    })
  })

  const givenUserProfile = (profile: any) => {
    userProfileStore.setCurrent(profile)
  }

  const whenGetNavigationMenuVM = () => {
    vm = getNavigationMenuVM()
  }

  const expectVMToEqual = (expectedVm: GetNavigationMenuVM) => {
    expect(vm).toStrictEqual(expectedVm)
  }
})

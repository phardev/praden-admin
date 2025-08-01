import { NavigationMenu } from '@core/usecases/navigation-menu/navigation-menu-get/navigationMenu'

export const fullMenu: NavigationMenu = {
  logo: 'https://www.pharmabest.com/images/header/pharmabest-header.svg',
  title: 'Pharmacie Agnes Praden',
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
          name: 'Bannières',
          icon: 'material-symbols:add-photo-alternate-outline',
          href: '/banners'
        }
      ]
    },
    {
      title: 'Administration',
      links: [
        {
          name: 'Recherche',
          icon: 'material-symbols:search-rounded',
          href: '/research'
        }
      ]
    }
  ]
}

export const prodMenu: NavigationMenu = {
  logo: 'https://www.pharmabest.com/images/header/pharmabest-header.svg',
  title: 'Pharmacie Agnes Praden',
  sections: [
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
        }
      ]
    }
  ]
}

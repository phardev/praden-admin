import { NavigationMenu } from '@core/usecases/navigation-menu/navigation-menu-get/navigationMenu'

export const fullMenu: NavigationMenu = {
  logo: 'https://www.pharmabest.com/images/header/pharmabest-header.svg',
  title: 'Pharmacie Agnes Praden',
  sections: [
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
          name: 'SAV',
          icon: 'streamline:interface-help-customer-support-2-customer-headphones-headset-help-microphone-phone-person-support',
          href: '/after-sales'
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

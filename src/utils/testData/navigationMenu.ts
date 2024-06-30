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

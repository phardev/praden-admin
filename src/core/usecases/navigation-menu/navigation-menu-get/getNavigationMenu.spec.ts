import { getNavigationMenu } from '@core/usecases/navigation-menu/navigation-menu-get/getNavigationMenu'
import { InMemoryNavigationMenuGateway } from '@core/usecases/navigation-menu/navigation-menu-get/inMemoryNavigationMenuGateway'
import { NavigationMenu } from '@core/usecases/navigation-menu/navigation-menu-get/navigationMenu'
import { useNavigationMenuStore } from '@store/navigationMenuStore'
import { fullMenu, prodMenu } from '@utils/testData/navigationMenu'
import { createPinia, setActivePinia } from 'pinia'

describe('Navigation menu get', () => {
  let navigationMenuGateway: InMemoryNavigationMenuGateway
  let navigationMenuStore: any

  beforeEach(() => {
    setActivePinia(createPinia())
    navigationMenuGateway = new InMemoryNavigationMenuGateway()
    navigationMenuStore = useNavigationMenuStore()
  })
  describe('There is no navigation menu', () => {
    it('should have nothing', async () => {
      await whenGetNavigationMenu()
      expectCurrentMenuToBe({
        sections: [],
        logo: '',
        title: ''
      })
    })
  })

  describe.each([{ menu: fullMenu }, { menu: prodMenu }])(
    'There is a navigation menu',
    ({ menu }) => {
      it('should set the menu', async () => {
        givenExistingMenu(menu)
        await whenGetNavigationMenu()
        expectCurrentMenuToBe(menu)
      })
    }
  )

  const givenExistingMenu = (menu: NavigationMenu) => {
    navigationMenuGateway.feedWith(menu)
  }

  const whenGetNavigationMenu = async () => {
    await getNavigationMenu(navigationMenuGateway)
  }

  const expectCurrentMenuToBe = (menu?: NavigationMenu) => {
    expect(navigationMenuStore.current).toStrictEqual(menu)
  }
})

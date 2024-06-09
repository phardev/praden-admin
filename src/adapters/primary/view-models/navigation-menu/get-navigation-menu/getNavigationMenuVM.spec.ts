import { createPinia, setActivePinia } from 'pinia'
import { useNavigationMenuStore } from '@store/navigationMenuStore'
import { NavigationMenu } from '@core/usecases/navigation-menu/navigation-menu-get/navigationMenu'
import {
  GetNavigationMenuVM,
  getNavigationMenuVM
} from '@adapters/primary/view-models/navigation-menu/get-navigation-menu/getNavigationMenuVM'
import { fullMenu, prodMenu } from '@utils/testData/navigationMenu'

describe('Get navigation menu VM', () => {
  let navigationMenuStore: any
  let vm: GetNavigationMenuVM

  beforeEach(() => {
    setActivePinia(createPinia())
    navigationMenuStore = useNavigationMenuStore()
  })

  describe('There is no menu', () => {
    it('should return an empty object', () => {
      whenGetNavigationMenuVM()
      expectVMToEqual({})
    })
  })

  describe.each([{ menu: fullMenu }, { menu: prodMenu }])(
    'There is a menu',
    ({ menu }) => {
      it('should return the menu', () => {
        givenThereIsANavigationMenu(menu)
        whenGetNavigationMenuVM()
        expectVMToEqual(menu)
      })
    }
  )

  const givenThereIsANavigationMenu = (menu: NavigationMenu) => {
    navigationMenuStore.current = menu
  }

  const whenGetNavigationMenuVM = () => {
    vm = getNavigationMenuVM()
  }

  const expectVMToEqual = (expectedVm: GetNavigationMenuVM) => {
    expect(vm).toStrictEqual(expectedVm)
  }
})

import { NavigationMenuGateway } from '@core/usecases/navigation-menu/navigation-menu-get/navigationMenuGateway'
import { useNavigationMenuStore } from '@store/navigationMenuStore'

export const getNavigationMenu = async (
  navigationMenuGateway: NavigationMenuGateway
): Promise<void> => {
  const menu = await navigationMenuGateway.get()
  const menuStore = useNavigationMenuStore()
  menuStore.setCurrent(menu)
}

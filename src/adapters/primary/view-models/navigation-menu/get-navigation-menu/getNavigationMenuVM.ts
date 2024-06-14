import { NavigationMenu } from '@core/usecases/navigation-menu/navigation-menu-get/navigationMenu'
import { useNavigationMenuStore } from '@store/navigationMenuStore'

export type GetNavigationMenuVM = Partial<NavigationMenu>

export const getNavigationMenuVM = (): GetNavigationMenuVM => {
  const navigationMenuStore = useNavigationMenuStore()
  const menu = navigationMenuStore.current
  return menu || {}
}

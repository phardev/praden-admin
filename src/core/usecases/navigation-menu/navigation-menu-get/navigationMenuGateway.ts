import { NavigationMenu } from '@core/usecases/navigation-menu/navigation-menu-get/navigationMenu'

export interface NavigationMenuGateway {
  get(): Promise<NavigationMenu>
}

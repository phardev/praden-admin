import { NavigationMenu } from '@core/usecases/navigation-menu/navigation-menu-get/navigationMenu'
import { NavigationMenuGateway } from '@core/usecases/navigation-menu/navigation-menu-get/navigationMenuGateway'

export class InMemoryNavigationMenuGateway implements NavigationMenuGateway {
  private menu: NavigationMenu | undefined = undefined

  get(): Promise<NavigationMenu> {
    if (!this.menu) {
      return Promise.resolve({
        logo: '',
        title: '',
        sections: []
      })
    }
    return Promise.resolve(JSON.parse(JSON.stringify(this.menu)))
  }

  feedWith(menu: NavigationMenu): void {
    this.menu = menu
  }
}

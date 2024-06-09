import { defineStore } from 'pinia'
import { NavigationMenu } from '@core/usecases/navigation-menu/navigation-menu-get/navigationMenu'

export const useNavigationMenuStore = defineStore('NavigationMenuStore', {
  state: () => {
    return {
      current: undefined as NavigationMenu | undefined
    }
  },
  actions: {
    setCurrent(menu: NavigationMenu | undefined) {
      if (!menu) this.current = undefined
      else this.current = JSON.parse(JSON.stringify(menu))
    }
  }
})

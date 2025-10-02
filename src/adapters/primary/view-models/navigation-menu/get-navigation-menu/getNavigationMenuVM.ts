import { NavigationMenu } from '@core/usecases/navigation-menu/navigation-menu-get/navigationMenu'
import { useNavigationMenuStore } from '@store/navigationMenuStore'
import { getPermissionsVM } from '@adapters/primary/view-models/permissions/getPermissionsVM'
import { canAccessRoute } from '@utils/permissions/routePermissionMapping'

export type GetNavigationMenuVM = Partial<NavigationMenu>

export const getNavigationMenuVM = (): GetNavigationMenuVM => {
  const navigationMenuStore = useNavigationMenuStore()
  const permissions = getPermissionsVM()
  const menu = navigationMenuStore.current

  if (!menu) {
    return {}
  }

  const filteredSections = menu.sections
    .map((section) => {
      const filteredLinks = section.links.filter((link) => {
        return canAccessRoute(link.href, permissions)
      })

      return {
        ...section,
        links: filteredLinks
      }
    })
    .filter((section) => section.links.length > 0)

  return {
    logo: menu.logo,
    title: menu.title,
    sections: filteredSections
  }
}

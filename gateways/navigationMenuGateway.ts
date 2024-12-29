import { isLocalEnv } from '@utils/env'
import { InMemoryNavigationMenuGateway } from '@core/usecases/navigation-menu/navigation-menu-get/inMemoryNavigationMenuGateway'
import { fullMenu } from '@utils/testData/navigationMenu'

export const useNavigationMenuGateway = () => {
  const navigationMenuGateway = new InMemoryNavigationMenuGateway()
  if (isLocalEnv()) {
    navigationMenuGateway.feedWith(fullMenu)
  } else {
    navigationMenuGateway.feedWith(fullMenu)
  }
  return navigationMenuGateway
}

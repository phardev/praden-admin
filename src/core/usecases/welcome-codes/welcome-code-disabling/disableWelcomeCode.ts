import { WelcomeCodeGateway } from '@core/gateways/welcomeCodeGateway'
import { UUID } from '@core/types/types'
import { saveWelcomeCodes } from '../saveWelcomeCodes'

export const disableWelcomeCode = (
  uuid: UUID,
  welcomeCodeGateway: WelcomeCodeGateway
): Promise<void> =>
  saveWelcomeCodes(welcomeCodeGateway, () => welcomeCodeGateway.disable(uuid))

import { WelcomeCodeGateway } from '@core/gateways/welcomeCodeGateway'
import { UUID } from '@core/types/types'
import { saveWelcomeCodes } from '../saveWelcomeCodes'

export const enableWelcomeCode = (
  uuid: UUID,
  welcomeCodeGateway: WelcomeCodeGateway
): Promise<void> =>
  saveWelcomeCodes(welcomeCodeGateway, () => welcomeCodeGateway.enable(uuid))

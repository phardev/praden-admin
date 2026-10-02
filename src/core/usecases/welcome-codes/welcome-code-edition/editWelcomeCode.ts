import { WelcomeCodeDTO } from '@core/entities/welcomeCode'
import { WelcomeCodeGateway } from '@core/gateways/welcomeCodeGateway'
import { UUID } from '@core/types/types'
import { saveWelcomeCodes } from '../saveWelcomeCodes'

export const editWelcomeCode = (
  uuid: UUID,
  dto: WelcomeCodeDTO,
  welcomeCodeGateway: WelcomeCodeGateway
): Promise<void> =>
  saveWelcomeCodes(welcomeCodeGateway, () => welcomeCodeGateway.edit(uuid, dto))

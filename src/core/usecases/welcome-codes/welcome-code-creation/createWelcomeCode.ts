import { WelcomeCodeDTO } from '@core/entities/welcomeCode'
import { WelcomeCodeGateway } from '@core/gateways/welcomeCodeGateway'
import { saveWelcomeCodes } from '../saveWelcomeCodes'

export const createWelcomeCode = (
  dto: WelcomeCodeDTO,
  welcomeCodeGateway: WelcomeCodeGateway
): Promise<void> =>
  saveWelcomeCodes(welcomeCodeGateway, () => welcomeCodeGateway.create(dto))

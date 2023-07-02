import { PreparationStartedMessage } from '@core/entities/emailMessage'

export interface EmailGateway {
  sendPreparationStartedMessage(
    preparationStartedMessageDTO: PreparationStartedMessage
  ): Promise<void>
}

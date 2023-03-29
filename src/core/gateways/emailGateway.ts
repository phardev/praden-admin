import { EmailMessage } from '@core/entities/emailMessage'

export interface EmailGateway {
  send(email: EmailMessage): Promise<void>
}

import { EmailMessage } from '@core/entities/emailMessage'
import { EmailGateway } from '@core/gateways/emailGateway'

export class FakeEmailGateway implements EmailGateway {
  private emails: Array<EmailMessage> = []

  list(): Array<EmailMessage> {
    return this.emails
  }

  sendPreparationStartedMessage(emailMessage: EmailMessage): Promise<void> {
    this.emails.push(emailMessage)
    return Promise.resolve()
  }
}

import { EmailGateway } from '@core/gateways/emailGateway'
import { EmailMessage } from '@core/entities/emailMessage'

export class FakeEmailGateway implements EmailGateway {
  private emails: Array<EmailMessage> = []

  list(): Array<EmailMessage> {
    return this.emails
  }

  send(emailMessage: EmailMessage): Promise<void> {
    this.emails.push(emailMessage)
    return Promise.resolve()
  }
}

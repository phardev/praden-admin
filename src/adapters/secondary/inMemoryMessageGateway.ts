import { MessageGateway } from '@core/gateways/messageGateway'
import { Message, MessageContent } from '@core/entities/order'
import { DateProvider } from '@core/gateways/dateProvider'

export class InMemoryMessageGateway implements MessageGateway {
  private messages: Array<Message> = []
  private dateProvider: DateProvider

  constructor(dateProvider: DateProvider) {
    this.dateProvider = dateProvider
  }

  list(): Promise<Array<Message>> {
    return Promise.resolve(this.messages)
  }

  create(content: MessageContent): Promise<Message> {
    const message = {
      content,
      sentAt: this.dateProvider.now()
    }
    this.messages.push(message)
    return Promise.resolve(message)
  }
}

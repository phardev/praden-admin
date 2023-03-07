import { Message, MessageContent } from '@core/entities/order'

export interface MessageGateway {
  list(): Promise<Array<Message>>
  create(content: MessageContent): Promise<Message>
}

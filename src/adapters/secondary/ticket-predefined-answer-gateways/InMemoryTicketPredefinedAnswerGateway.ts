import { TicketPredefinedAnswerGateway } from '@core/gateways/ticketPredefinedAnswerGateway'
import { TicketPredefinedAnswer } from '@core/entities/ticketPredefinedAnswer'
import { UUID } from '@core/types/types'
import { CreateTicketPredefinedAnswerDTO } from '@core/gateways/ticketPredefinedAnswerGateway'
import { UpdateTicketPredefinedAnswerDTO } from '@core/gateways/ticketPredefinedAnswerGateway'
import { TicketPredefinedAnswerDoesNotExistsError } from '@core/errors/TicketPredefinedAnswerDoesNotExistsError'
import { UuidGenerator } from '@core/gateways/uuidGenerator'

export class InMemoryTicketPredefinedAnswerGateway
  implements TicketPredefinedAnswerGateway
{
  private answers: TicketPredefinedAnswer[] = []
  private uuidGenerator: UuidGenerator

  constructor(uuidGenerator: UuidGenerator) {
    this.uuidGenerator = uuidGenerator
  }

  list(): Promise<Array<TicketPredefinedAnswer>> {
    return Promise.resolve(this.answers)
  }
  getByUuid(uuid: UUID): Promise<TicketPredefinedAnswer> {
    const answer = this.answers.find((a) => a.uuid === uuid)
    if (!answer) {
      throw new TicketPredefinedAnswerDoesNotExistsError(uuid)
    }
    return Promise.resolve(answer)
  }
  create(
    dto: CreateTicketPredefinedAnswerDTO
  ): Promise<TicketPredefinedAnswer> {
    const uuid = this.uuidGenerator.generate()
    const answer = {
      uuid,
      title: dto.title,
      content: dto.content
    }
    this.answers.push(answer)
    return Promise.resolve(answer)
  }
  update(
    uuid: UUID,
    dto: UpdateTicketPredefinedAnswerDTO
  ): Promise<TicketPredefinedAnswer> {
    const answer = this.answers.find((a) => a.uuid === uuid)
    if (!answer) {
      throw new TicketPredefinedAnswerDoesNotExistsError(uuid)
    }
    answer.title = dto.title
    answer.content = dto.content
    return Promise.resolve(answer)
  }

  delete(uuid: UUID): Promise<void> {
    const answer = this.answers.find((a) => a.uuid === uuid)
    if (!answer) {
      throw new TicketPredefinedAnswerDoesNotExistsError(uuid)
    }
    this.answers = this.answers.filter((a) => a.uuid !== uuid)
    return Promise.resolve()
  }

  feedWith(...answers: TicketPredefinedAnswer[]) {
    this.answers = answers
  }
}

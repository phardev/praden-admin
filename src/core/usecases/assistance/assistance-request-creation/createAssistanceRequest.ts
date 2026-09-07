import type {
  AssistanceRequestGateway,
  CreateAssistanceRequestDTO
} from '@core/gateways/assistanceRequestGateway'
import { useAssistanceRequestStore } from '@store/assistanceRequestStore'

export const createAssistanceRequest = async (
  dto: CreateAssistanceRequestDTO,
  attachments: Array<File>,
  gateway: AssistanceRequestGateway
): Promise<void> => {
  const created = await gateway.create(dto, attachments)
  useAssistanceRequestStore().requestCreated(created)
}

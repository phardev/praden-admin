import { usePreparationStore } from '@store/preparationStore'
import { Header } from '@adapters/primary/view-models/get-orders-to-prepare/getPreparationsVM'
import { Message, MessageContent } from '@core/entities/order'
import { timestampToLocaleString } from '@utils/formatters'
import { HashTable } from '@core/types/types'

export enum PreparationStatus {
  NotPrepared,
  Prepared,
  ErrorTooMuchQuantity
}

export interface GetPreparationLineVM {
  reference: string
  name: string
  expectedQuantity: number
  preparedQuantity: number
  status: PreparationStatus
}

export interface GetPreparationVM {
  reference: string
  headers: Array<Header>
  lines: Array<GetPreparationLineVM>
  messages: Array<any>
  canValidate: boolean
}

const isValid = (lines: Array<GetPreparationLineVM>) => {
  return lines.every((line) => line.expectedQuantity === line.preparedQuantity)
}

const getLineStatus = (line: GetPreparationLineVM): PreparationStatus => {
  if (line.expectedQuantity < line.preparedQuantity)
    return PreparationStatus.ErrorTooMuchQuantity
  return line.expectedQuantity === line.preparedQuantity
    ? PreparationStatus.Prepared
    : PreparationStatus.NotPrepared
}

interface GetPreparationMessagesVM {
  content: string
  sentDate: string
  sentDatetime: Date
}

const getMessageContent = (content: MessageContent): string => {
  const messages: HashTable<string> = {
    [MessageContent.AskToClient]: 'Demande de choix',
    [MessageContent.PartialShip]: 'Envoi partiel',
    [MessageContent.WaitForRestock]: 'Attente de stock',
    [MessageContent.CancelOrder]: 'Annulation de commande'
  }
  return messages[content]
}

const getMessages = (
  messages: Array<Message>
): Array<GetPreparationMessagesVM> => {
  return messages.map((message) => {
    return {
      content: getMessageContent(message.content),
      sentDate: timestampToLocaleString(message.sentAt, 'fr-FR'),
      sentDatetime: new Date(message.sentAt)
    }
  })
}

export const getPreparationVM = (): GetPreparationVM => {
  const preparationStore = usePreparationStore()
  const preparation = preparationStore.current
  if (!preparation) {
    return {
      reference: '',
      headers: [],
      lines: [],
      messages: [],
      canValidate: false
    }
  }
  const headers: Array<Header> = [
    {
      name: 'Référence',
      value: 'reference'
    },
    {
      name: 'Nom',
      value: 'name'
    },
    {
      name: 'Quantité attendue',
      value: 'expectedQuantity'
    },
    {
      name: 'Quantité préparée',
      value: 'preparedQuantity'
    },
    {
      name: 'Status',
      value: 'status'
    }
  ]
  const lines: Array<GetPreparationLineVM> = preparation.lines.map((line) => {
    return {
      reference: line.cip13,
      name: line.name,
      expectedQuantity: line.expectedQuantity,
      preparedQuantity: line.preparedQuantity,
      status: getLineStatus(line)
    }
  })
  return {
    reference: preparation.uuid,
    headers,
    lines,
    messages: getMessages(preparation.messages),
    canValidate: isValid(lines)
  }
}

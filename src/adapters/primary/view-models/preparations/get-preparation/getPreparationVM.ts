import { Header } from '@adapters/primary/view-models/preparations/get-orders-to-prepare/getPreparationsVM'
import { Delivery } from '@core/entities/delivery'
import {
  getOrderStatus,
  Message,
  MessageContent,
  Order,
  OrderLine,
  OrderLineStatus
} from '@core/entities/order'
import { HashTable } from '@core/types/types'
import { PreparationError } from '@core/usecases/order/scan-product-to-preparation/scanProductToPreparation'
import { usePreparationStore } from '@store/preparationStore'
import { timestampToLocaleString } from '@utils/formatters'

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

export interface PreparationDeliveryVM {
  uuid: string
  trackingNumber?: string
}

export interface GetPreparationVM {
  reference: string
  headers: Array<Header>
  lines: Array<GetPreparationLineVM>
  deliveries: Array<PreparationDeliveryVM>
  messages: Array<any>
  customerMessage?: string
  canValidate: boolean
  canCancel: boolean
  canAskHowToFinish: boolean
  error?: PreparationError
  isLoading: boolean
  shouldRedirectToOrder: boolean
}

const canValidate = (
  lines: Array<GetPreparationLineVM>,
  messages: Array<Message>
) => {
  const areAllLinesPrepared = lines.every(
    (line) => line.expectedQuantity === line.preparedQuantity
  )
  const canDoPartialShip =
    messages.length > 0
      ? messages[messages.length - 1].content === MessageContent.PartialShip
      : false
  return areAllLinesPrepared || canDoPartialShip
}

export const getLineStatus = (line: OrderLine): PreparationStatus => {
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

export const getMessagesVM = (
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

const canCancel = (messages: Array<Message>): boolean => {
  return messages.length > 0
    ? messages[messages.length - 1].content === MessageContent.CancelOrder
    : false
}

const canAskHowToFinish = (
  lines: Array<GetPreparationLineVM>,
  preparation: Order
): boolean => {
  if (canValidate(lines, preparation.messages)) {
    return false
  }
  if (
    preparation.lines.every((line) => line.status === OrderLineStatus.Created)
  )
    return false
  const messages = preparation.messages
  return messages.length === 0
}

const shouldRedirectToOrder = (preparation: Order): boolean => {
  const status = getOrderStatus(preparation)
  return (
    status === OrderLineStatus.Prepared || status === OrderLineStatus.Canceled
  )
}

export const getPreparationVM = (): GetPreparationVM => {
  const preparationStore = usePreparationStore()
  const preparation = preparationStore.current
  if (!preparation) {
    return {
      reference: '',
      headers: [],
      lines: [],
      deliveries: [],
      messages: [],
      canValidate: false,
      canCancel: false,
      canAskHowToFinish: false,
      isLoading: false,
      shouldRedirectToOrder: false
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
  const lines: Array<GetPreparationLineVM> = preparation.lines.map(
    (line: OrderLine) => {
      return {
        reference: line.ean13,
        name: line.name,
        expectedQuantity: line.expectedQuantity,
        preparedQuantity: line.preparedQuantity,
        status: getLineStatus(line)
      }
    }
  )
  const error = preparationStore.error
  const res: GetPreparationVM = {
    reference: preparation.uuid,
    headers,
    lines,
    deliveries: getDeliveriesVM(preparation.deliveries),
    messages: getMessagesVM(preparation.messages),
    canValidate: canValidate(lines, preparation.messages),
    canCancel: canCancel(preparation.messages),
    canAskHowToFinish: canAskHowToFinish(lines, preparation),
    error,
    isLoading: preparationStore.isLoading,
    shouldRedirectToOrder: shouldRedirectToOrder(preparation)
  }
  if (preparation.customerMessage) {
    res.customerMessage = preparation.customerMessage
  }
  return res
}

const getDeliveriesVM = (
  deliveries: Array<Delivery>
): Array<PreparationDeliveryVM> => {
  return deliveries.map((delivery: Delivery) => {
    const res: PreparationDeliveryVM = {
      uuid: delivery.uuid
    }
    if (delivery.trackingNumber) {
      res.trackingNumber = delivery.trackingNumber
    }
    return res
  })
}

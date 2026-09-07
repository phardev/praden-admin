import {
  AssistanceMessageSide,
  AssistanceRequestCategory,
  type AssistanceRequestDetails,
  AssistanceRequestStatus,
  AssistanceSubjectType
} from '@core/entities/assistanceRequest'
import {
  assistanceNow,
  receivedLabelMinutesAgo
} from '@utils/testData/assistanceNow'
import { elodieDurand } from '@utils/testData/customers'
import { orderToPrepare1, orderToPrepare2 } from '@utils/testData/orders'
import { dolodent } from '@utils/testData/products'

const receivedLabelDescription =
  "L'étiquette de livraison ne s'imprime pas\nJ'ai validé la commande puis cliqué sur « Imprimer l'étiquette », rien ne se passe."
const waitingForAnswerPriceDescription =
  'Le prix affiché sur le site ne correspond pas au prix en pharmacie\nLe produit est à 5,50 € en boutique mais le site affiche 6,20 €.'
const onHoldMailDescription =
  'La cliente ne reçoit pas les e-mails de confirmation\nElle a passé deux commandes cette semaine et ne reçoit aucun e-mail.'
const inProgressSearchDescription =
  'La recherche de produits ne renvoie plus rien\nDepuis ce matin, toute recherche affiche « Aucun résultat ».'
const resolvedRelayDescription =
  'Le point relais choisi par le client ne correspond pas\nLa commande indique un relais à Strasbourg alors que le client habite Metz.'
const cancelledDescription =
  'Demande créée par erreur\nMerci de ne pas en tenir compte.'

const firstLine = (description: string): string => description.split('\n')[0]

const receivedLabelAt = assistanceNow - receivedLabelMinutesAgo * 60 * 1000

const waitingForAnswerCreatedAt = Date.UTC(2026, 8, 2, 9, 12)
const waitingForAnswerLastActivityAt = Date.UTC(2026, 8, 2, 16, 40)
const onHoldCreatedAt = Date.UTC(2026, 8, 1, 11, 5)
const onHoldLastActivityAt = Date.UTC(2026, 8, 1, 14, 30)
const inProgressCreatedAt = Date.UTC(2026, 7, 31, 8, 30)
const resolvedCreatedAt = Date.UTC(2026, 7, 28, 14, 0)
const resolvedLastActivityAt = Date.UTC(2026, 7, 29, 9, 15)
const cancelledCreatedAt = Date.UTC(2026, 7, 20, 9, 0)

export const receivedLabelRequest: AssistanceRequestDetails = {
  id: '21',
  reference: '00021',
  category: AssistanceRequestCategory.ORDER,
  subject: {
    type: AssistanceSubjectType.ORDER,
    label: `${orderToPrepare1.deliveryAddress.firstname} ${orderToPrepare1.deliveryAddress.lastname}`,
    uuid: orderToPrepare1.uuid,
    pageUrl: `/orders/${orderToPrepare1.uuid}`
  },
  title: firstLine(receivedLabelDescription),
  author: 'Marie Dupont',
  status: AssistanceRequestStatus.RECEIVED,
  createdAt: receivedLabelAt,
  lastActivityAt: receivedLabelAt,
  description: receivedLabelDescription,
  messages: [
    {
      id: '21-report',
      side: AssistanceMessageSide.PHARMACY,
      author: 'Marie Dupont',
      content: receivedLabelDescription,
      sentAt: receivedLabelAt,
      attachments: []
    }
  ]
}

export const waitingForAnswerPriceRequest: AssistanceRequestDetails = {
  id: '19',
  reference: '00019',
  category: AssistanceRequestCategory.PRODUCT,
  subject: {
    type: AssistanceSubjectType.PRODUCT,
    label: dolodent.name,
    uuid: dolodent.uuid,
    pageUrl: `/products/get/${dolodent.uuid}`
  },
  title: firstLine(waitingForAnswerPriceDescription),
  author: 'Sophie Martin',
  status: AssistanceRequestStatus.WAITING_FOR_YOUR_ANSWER,
  createdAt: waitingForAnswerCreatedAt,
  lastActivityAt: waitingForAnswerLastActivityAt,
  description: waitingForAnswerPriceDescription,
  messages: [
    {
      id: '19-report',
      side: AssistanceMessageSide.PHARMACY,
      author: 'Sophie Martin',
      content: waitingForAnswerPriceDescription,
      sentAt: waitingForAnswerCreatedAt,
      attachments: []
    },
    {
      id: '19-message-1',
      side: AssistanceMessageSide.PHARDEV,
      author: 'Cédric Martin',
      content:
        'Bonjour Sophie, pouvez-vous me confirmer le prix affiché dans Winpharma ?',
      sentAt: Date.UTC(2026, 8, 2, 10, 5),
      attachments: []
    },
    {
      id: '19-message-2',
      side: AssistanceMessageSide.PHARMACY,
      author: 'Sophie Martin',
      content: 'Oui, 5,50 € TTC dans Winpharma.',
      sentAt: Date.UTC(2026, 8, 2, 10, 20),
      attachments: []
    },
    {
      id: '19-message-3',
      side: AssistanceMessageSide.PHARDEV,
      author: 'Cédric Martin',
      content:
        "Merci. Voici ce que je vois côté site, est-ce bien l'étiquette en rayon ?",
      sentAt: waitingForAnswerLastActivityAt,
      attachments: [
        {
          id: 'attachment-1',
          filename: 'capture-etiquette.png',
          mimeType: 'image/png',
          size: 142 * 1024
        }
      ]
    }
  ]
}

export const onHoldMailRequest: AssistanceRequestDetails = {
  id: '18',
  reference: '00018',
  category: AssistanceRequestCategory.CUSTOMER,
  subject: {
    type: AssistanceSubjectType.CUSTOMER,
    label: `${elodieDurand.firstname} ${elodieDurand.lastname}`,
    uuid: elodieDurand.uuid,
    pageUrl: `/customers/get/${elodieDurand.uuid}`
  },
  title: firstLine(onHoldMailDescription),
  author: 'Marie Dupont',
  status: AssistanceRequestStatus.ON_HOLD,
  createdAt: onHoldCreatedAt,
  lastActivityAt: onHoldLastActivityAt,
  description: onHoldMailDescription,
  messages: [
    {
      id: '18-report',
      side: AssistanceMessageSide.PHARMACY,
      author: 'Marie Dupont',
      content: onHoldMailDescription,
      sentAt: onHoldCreatedAt,
      attachments: []
    },
    {
      id: '18-message-1',
      side: AssistanceMessageSide.PHARDEV,
      author: 'Cédric Martin',
      content:
        "Nous attendons le retour de l'hébergeur e-mail, je reviens vers vous dès que possible.",
      sentAt: onHoldLastActivityAt,
      attachments: []
    }
  ]
}

export const inProgressSearchRequest: AssistanceRequestDetails = {
  id: '16',
  reference: '00016',
  category: AssistanceRequestCategory.OTHER,
  title: firstLine(inProgressSearchDescription),
  author: 'Julien Petit',
  status: AssistanceRequestStatus.IN_PROGRESS,
  createdAt: inProgressCreatedAt,
  lastActivityAt: inProgressCreatedAt,
  description: inProgressSearchDescription,
  messages: [
    {
      id: '16-report',
      side: AssistanceMessageSide.PHARMACY,
      author: 'Julien Petit',
      content: inProgressSearchDescription,
      sentAt: inProgressCreatedAt,
      attachments: []
    }
  ]
}

export const resolvedRelayRequest: AssistanceRequestDetails = {
  id: '15',
  reference: '00015',
  category: AssistanceRequestCategory.DELIVERY,
  subject: {
    type: AssistanceSubjectType.ORDER,
    label: `${orderToPrepare2.deliveryAddress.firstname} ${orderToPrepare2.deliveryAddress.lastname}`,
    uuid: orderToPrepare2.uuid,
    pageUrl: `/orders/${orderToPrepare2.uuid}`
  },
  title: firstLine(resolvedRelayDescription),
  author: 'Marie Dupont',
  status: AssistanceRequestStatus.RESOLVED,
  createdAt: resolvedCreatedAt,
  lastActivityAt: resolvedLastActivityAt,
  description: resolvedRelayDescription,
  messages: [
    {
      id: '15-report',
      side: AssistanceMessageSide.PHARMACY,
      author: 'Marie Dupont',
      content: resolvedRelayDescription,
      sentAt: resolvedCreatedAt,
      attachments: []
    },
    {
      id: '15-message-1',
      side: AssistanceMessageSide.PHARDEV,
      author: 'Cédric Martin',
      content:
        'Le relais a été corrigé sur la commande, vous pouvez réimprimer l’étiquette.',
      sentAt: resolvedLastActivityAt,
      attachments: []
    }
  ]
}

export const cancelledRequest: AssistanceRequestDetails = {
  id: '12',
  reference: '00012',
  category: AssistanceRequestCategory.OTHER,
  title: firstLine(cancelledDescription),
  author: 'Marie Dupont',
  status: AssistanceRequestStatus.CANCELLED,
  createdAt: cancelledCreatedAt,
  lastActivityAt: cancelledCreatedAt,
  description: cancelledDescription,
  messages: [
    {
      id: '12-report',
      side: AssistanceMessageSide.PHARMACY,
      author: 'Marie Dupont',
      content: cancelledDescription,
      sentAt: cancelledCreatedAt,
      attachments: []
    }
  ]
}

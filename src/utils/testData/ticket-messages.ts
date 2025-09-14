import { TicketMessage, TicketMessageType } from '@core/entities/ticket'

export const newTicketMessage1: TicketMessage = {
  uuid: 'message-new-ticket-1',
  content:
    "Bonjour, j'ai reçu mon colis mais il manque un produit. Pouvez-vous m'aider ?",
  type: TicketMessageType.PUBLIC,
  sentAt: 1705924800000,
  authorName: 'Élodie Durand',
  attachments: []
}

export const privateNoteMessage1: TicketMessage = {
  uuid: 'message-private-note-1',
  content: 'Client habituellement satisfait, traiter en priorité',
  type: TicketMessageType.PRIVATE,
  sentAt: 1705926000000,
  authorName: 'Opérateur Support',
  attachments: []
}

export const replyMessage1: TicketMessage = {
  uuid: 'message-reply-1',
  content:
    'Bonjour Jean, je vous remercie pour votre retour. Pouvez-vous me préciser le numéro de commande et la raison du remboursement demandé ?',
  type: TicketMessageType.PUBLIC,
  sentAt: 1705926600000,
  authorName: 'Service Client',
  attachments: []
}

export const customerReplyMessage1: TicketMessage = {
  uuid: 'message-customer-reply-1',
  content:
    "Commande #12345, j'ai reçu des médicaments qui ne correspondent pas à mon ordonnance habituelle.",
  type: TicketMessageType.PUBLIC,
  sentAt: 1705928400000,
  authorName: 'Lucas Lefèvre',
  attachments: []
}

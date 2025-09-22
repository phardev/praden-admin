import {
  Ticket,
  TicketStatus,
  TicketPriority,
  TicketMessageType
} from '@core/entities/ticket'
import {
  newTicketMessage1,
  privateNoteMessage1,
  replyMessage1,
  customerReplyMessage1
} from './ticket-messages'
import {
  orderToPrepare1,
  orderToPrepare2,
  orderToPrepare3,
  orderDelivered1
} from './orders'
import {
  elodieDurand,
  lucasLefevre,
  sophieMartinez,
  pierreBernard,
  marcLeblanc
} from './customers'

export const newTicket: Ticket = {
  uuid: 'ticket-new-1',
  ticketNumber: 'TICKET_2024_0001',
  subject: 'Produit manquant dans ma commande',
  description:
    "Bonjour, j'ai reçu mon colis mais il manque un produit. Pouvez-vous m'aider ?",
  status: TicketStatus.NEW,
  priority: TicketPriority.MEDIUM,
  customer: {
    uuid: elodieDurand.uuid,
    email: elodieDurand.email,
    firstname: elodieDurand.firstname,
    lastname: elodieDurand.lastname
  },
  messages: [newTicketMessage1],
  createdAt: 1705924800000,
  updatedAt: 1705924800000,
  orderUuid: orderToPrepare1.uuid
}

export const startedTicket: Ticket = {
  uuid: 'ticket-started-1',
  ticketNumber: 'TICKET_2024_0002',
  subject: 'Demande de remboursement',
  description:
    'Je souhaite être remboursé pour ma dernière commande qui ne me convient pas.',
  status: TicketStatus.STARTED,
  priority: TicketPriority.HIGH,
  customer: {
    uuid: lucasLefevre.uuid,
    email: lucasLefevre.email,
    firstname: lucasLefevre.firstname,
    lastname: lucasLefevre.lastname
  },
  messages: [
    {
      uuid: 'message-started-ticket-1',
      content:
        'Je souhaite être remboursé pour ma dernière commande qui ne me convient pas.',
      type: TicketMessageType.PUBLIC,
      sentAt: 1705838400000,
      authorUuid: lucasLefevre.uuid,
      attachments: [
        {
          filename: 'photo_produit_recu.jpg',
          url: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwA=',
          size: 156782,
          mimeType: 'image/jpeg'
        }
      ]
    },
    privateNoteMessage1,
    replyMessage1,
    customerReplyMessage1
  ],
  createdAt: 1705838400000,
  updatedAt: 1705928400000,
  orderUuid: orderToPrepare2.uuid
}

export const urgentTicket: Ticket = {
  uuid: 'ticket-urgent-1',
  ticketNumber: 'TICKET_2024_0003',
  subject: 'Problème urgent avec ma commande',
  description:
    "Ma commande urgente n'est pas arrivée à temps pour un traitement important.",
  status: TicketStatus.STARTED,
  priority: TicketPriority.URGENT,
  customer: {
    uuid: sophieMartinez.uuid,
    email: sophieMartinez.email,
    firstname: sophieMartinez.firstname,
    lastname: sophieMartinez.lastname
  },
  messages: [
    {
      uuid: 'message-urgent-1',
      content:
        "Ma commande urgente n'est pas arrivée à temps pour un traitement important.",
      type: TicketMessageType.PUBLIC,
      sentAt: 1705924200000,
      authorUuid: sophieMartinez.uuid,
      attachments: [
        {
          filename: 'ordonnance_medicale.pdf',
          url: 'data:application/pdf;base64,JVBERi0xLjQKJcOkw7zDtsOIw7M=',
          size: 245680,
          mimeType: 'application/pdf'
        },
        {
          filename: 'prescription_details.jpg',
          url: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwA=',
          size: 198756,
          mimeType: 'image/jpeg'
        }
      ]
    }
  ],
  createdAt: 1705924200000,
  updatedAt: 1705924200000,
  orderUuid: orderToPrepare3.uuid
}

export const resolvedTicket: Ticket = {
  uuid: 'ticket-resolved-1',
  ticketNumber: 'TICKET_2024_0004',
  subject: 'Question sur les frais de livraison',
  description: 'Pourquoi les frais de livraison sont-ils si élevés ?',
  status: TicketStatus.RESOLVED,
  priority: TicketPriority.LOW,
  customer: {
    uuid: pierreBernard.uuid,
    email: pierreBernard.email,
    firstname: pierreBernard.firstname,
    lastname: pierreBernard.lastname
  },
  messages: [
    {
      uuid: 'message-resolved-1',
      content: 'Pourquoi les frais de livraison sont-ils si élevés ?',
      type: TicketMessageType.PUBLIC,
      sentAt: 1705752000000,
      authorUuid: pierreBernard.uuid,
      attachments: []
    },
    {
      uuid: 'message-resolved-reply',
      content:
        'Les frais de livraison dépendent du poids et de la destination. Voici le détail...',
      type: TicketMessageType.PUBLIC,
      sentAt: 1705754400000,
      authorUuid: 'admin-uuid',
      attachments: [
        {
          filename: 'grille_tarifs_livraison.pdf',
          url: 'data:application/pdf;base64,JVBERi0xLjQKJcOkw7zDtsOIw7MKJS0tLS0tLS0tLS0tLS0tLS0t',
          size: 89456,
          mimeType: 'application/pdf'
        }
      ]
    }
  ],
  createdAt: 1705752000000,
  updatedAt: 1705754400000
}

export const lowPriorityTicket: Ticket = {
  uuid: 'ticket-low-priority-1',
  ticketNumber: 'TICKET_2024_0005',
  subject: "Suggestion d'amélioration",
  description:
    "Il serait bien d'avoir plus de choix de couleurs pour ce produit.",
  status: TicketStatus.NEW,
  priority: TicketPriority.LOW,
  customer: {
    uuid: elodieDurand.uuid,
    email: elodieDurand.email,
    firstname: elodieDurand.firstname,
    lastname: elodieDurand.lastname
  },
  messages: [
    {
      uuid: 'message-suggestion-1',
      content:
        "Il serait bien d'avoir plus de choix de couleurs pour ce produit.",
      type: TicketMessageType.PUBLIC,
      sentAt: 1705666200000,
      authorUuid: elodieDurand.uuid,
      attachments: []
    }
  ],
  createdAt: 1705666200000,
  updatedAt: 1705666200000
}

export const waitingForAnswerTicket: Ticket = {
  uuid: 'ticket-waiting-answer-1',
  ticketNumber: 'TICKET_2024_0006',
  subject: 'Problème avec ma commande',
  description: "Ma commande semble avoir été livrée mais je ne l'ai pas reçue.",
  status: TicketStatus.STARTED,
  priority: TicketPriority.MEDIUM,
  customer: {
    uuid: marcLeblanc.uuid,
    email: marcLeblanc.email,
    firstname: marcLeblanc.firstname,
    lastname: marcLeblanc.lastname
  },
  messages: [
    {
      uuid: 'message-waiting-initial',
      content: "Ma commande semble avoir été livrée mais je ne l'ai pas reçue.",
      type: TicketMessageType.PUBLIC,
      sentAt: 1705840000000,
      authorUuid: marcLeblanc.uuid,
      attachments: [
        {
          filename: 'notification_livraison.jpg',
          url: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwA=',
          size: 134567,
          mimeType: 'image/jpeg'
        }
      ]
    },
    {
      uuid: 'message-waiting-reply',
      content:
        'Bonjour Marc, je vais vérifier avec le transporteur. Pouvez-vous me confirmer votre adresse de livraison et avez-vous vérifié auprès de vos voisins ?',
      type: TicketMessageType.PUBLIC,
      sentAt: 1705842000000,
      authorUuid: 'admin-uuid',
      attachments: []
    }
  ],
  createdAt: 1705840000000,
  updatedAt: 1705842000000,
  orderUuid: orderDelivered1.uuid
}

export const notWaitingForAnswerTicket: Ticket = {
  uuid: 'ticket-not-waiting-answer-1',
  ticketNumber: 'TICKET_2024_0007',
  subject: 'Problème avec ma commande',
  description: "Ma commande semble avoir été livrée mais je ne l'ai pas reçue.",
  status: TicketStatus.STARTED,
  priority: TicketPriority.MEDIUM,
  customer: {
    uuid: marcLeblanc.uuid,
    email: marcLeblanc.email,
    firstname: marcLeblanc.firstname,
    lastname: marcLeblanc.lastname
  },
  messages: [
    {
      uuid: 'message-waiting-initial',
      content: "Ma commande semble avoir été livrée mais je ne l'ai pas reçue.",
      type: TicketMessageType.PUBLIC,
      sentAt: 1705840000000,
      authorUuid: marcLeblanc.uuid,
      attachments: [
        {
          filename: 'notification_livraison.jpg',
          url: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwA=',
          size: 134567,
          mimeType: 'image/jpeg'
        }
      ]
    },
    {
      uuid: 'not-message-waiting-reply',
      content: 'Note privée',
      type: TicketMessageType.PRIVATE,
      sentAt: 1705842000000,
      authorUuid: 'admin-uuid',
      attachments: []
    }
  ],
  createdAt: 1705840000000,
  updatedAt: 1705842000000,
  orderUuid: orderDelivered1.uuid
}

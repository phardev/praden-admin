import { TicketPredefinedAnswer } from '@core/entities/ticketPredefinedAnswer'

export const thankYouAnswer: TicketPredefinedAnswer = {
  uuid: 'answer-thank-you-1',
  title: 'Merci pour votre message',
  content:
    "Bonjour,\n\nMerci pour votre message. Nous avons bien pris en compte votre demande et reviendrons vers vous rapidement.\n\nCordialement,\nL'équipe support"
}

export const orderShippedAnswer: TicketPredefinedAnswer = {
  uuid: 'answer-order-shipped-1',
  title: 'Commande expédiée',
  content:
    "Bonjour,\n\nVotre commande a été expédiée et vous devriez la recevoir dans les prochains jours. Vous pouvez suivre votre colis avec le numéro de suivi fourni.\n\nCordialement,\nL'équipe support"
}

export const problemResolvedAnswer: TicketPredefinedAnswer = {
  uuid: 'answer-problem-resolved-1',
  title: 'Problème résolu',
  content:
    "Bonjour,\n\nNous avons résolu le problème que vous aviez signalé. N'hésitez pas à nous recontacter si vous avez d'autres questions.\n\nCordialement,\nL'équipe support"
}

export const refundProcessAnswer: TicketPredefinedAnswer = {
  uuid: 'answer-refund-process-1',
  title: 'Processus de remboursement',
  content:
    "Bonjour,\n\nNous avons initié le processus de remboursement pour votre commande. Le remboursement sera effectué sur votre moyen de paiement original sous 5 à 7 jours ouvrés.\n\nCordialement,\nL'équipe support"
}

export const deliveryInfoAnswer: TicketPredefinedAnswer = {
  uuid: 'answer-delivery-info-1',
  title: 'Informations de livraison',
  content:
    "Bonjour,\n\nVoici les informations concernant votre livraison. Les frais de port sont calculés en fonction du poids du colis et de la zone de livraison. Vous pouvez consulter notre grille tarifaire complète sur notre site.\n\nCordialement,\nL'équipe support"
}

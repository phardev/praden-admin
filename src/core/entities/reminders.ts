export interface PaymentReminders {
  messagesSentCount: number
  orderCreatedCount: number
}

export interface AbandonedCartReminders {
  remindedCartsCount: number
  orderedCartsCount: number
}

export interface Reminders {
  paymentReminders: PaymentReminders
  abandonedCartReminders: AbandonedCartReminders
}

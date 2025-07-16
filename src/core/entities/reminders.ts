export interface PaymentReminders {
  messagesSentCount: number
  orderCreatedCount: number
}

export interface Reminders {
  paymentReminders: PaymentReminders
}

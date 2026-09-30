import { Reminders } from '@core/entities/reminders'
import { useStatsStore } from '@store/statsStore'
import { createPinia, setActivePinia } from 'pinia'
import { getRemindersVM } from './getRemindersVM'

const noAbandonedCartReminders = {
  remindedCartsCount: 0,
  orderedCartsCount: 0
}

const noAbandonedCartRemindersVM = {
  ...noAbandonedCartReminders,
  conversionRate: 0
}

describe('getRemindersVM', () => {
  let statsStore: any

  beforeEach(() => {
    setActivePinia(createPinia())
    statsStore = useStatsStore()
  })

  it('should return default values when no reminders data is available', () => {
    statsStore.reminders = undefined
    const result = getRemindersVM()
    expect(result).toStrictEqual({
      paymentReminders: {
        messagesSentCount: 0,
        orderCreatedCount: 0,
        conversionRate: 0
      },
      abandonedCartReminders: noAbandonedCartRemindersVM
    })
  })

  it('should calculate 0% conversion rate when messagesSentCount is 0', () => {
    const mockReminders: Reminders = {
      paymentReminders: {
        messagesSentCount: 0,
        orderCreatedCount: 5
      },
      abandonedCartReminders: noAbandonedCartReminders
    }
    statsStore.reminders = mockReminders
    const result = getRemindersVM()
    expect(result).toStrictEqual({
      paymentReminders: {
        messagesSentCount: 0,
        orderCreatedCount: 5,
        conversionRate: 0
      },
      abandonedCartReminders: noAbandonedCartRemindersVM
    })
  })

  it('should calculate correct conversion rate when data is available', () => {
    const mockReminders: Reminders = {
      paymentReminders: {
        messagesSentCount: 10,
        orderCreatedCount: 4
      },
      abandonedCartReminders: noAbandonedCartReminders
    }
    statsStore.reminders = mockReminders
    const result = getRemindersVM()
    expect(result).toStrictEqual({
      paymentReminders: {
        messagesSentCount: 10,
        orderCreatedCount: 4,
        conversionRate: 40
      },
      abandonedCartReminders: noAbandonedCartRemindersVM
    })
  })

  it('should round the conversion rate to the nearest integer', () => {
    const mockReminders: Reminders = {
      paymentReminders: {
        messagesSentCount: 9,
        orderCreatedCount: 2
      },
      abandonedCartReminders: noAbandonedCartReminders
    }
    statsStore.reminders = mockReminders
    const result = getRemindersVM()
    expect(result).toStrictEqual({
      paymentReminders: {
        messagesSentCount: 9,
        orderCreatedCount: 2,
        conversionRate: 22
      },
      abandonedCartReminders: noAbandonedCartRemindersVM
    })
  })

  it('should calculate the conversion rate of the abandoned cart reminders', () => {
    const reminded = 8
    const ordered = 2
    statsStore.reminders = {
      paymentReminders: { messagesSentCount: 0, orderCreatedCount: 0 },
      abandonedCartReminders: {
        remindedCartsCount: reminded,
        orderedCartsCount: ordered
      }
    }
    expect(getRemindersVM().abandonedCartReminders).toStrictEqual({
      remindedCartsCount: reminded,
      orderedCartsCount: ordered,
      conversionRate: Math.round((ordered / reminded) * 100)
    })
  })
})

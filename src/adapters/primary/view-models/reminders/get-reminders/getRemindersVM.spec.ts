import { Reminders } from '@core/entities/reminders'
import { useStatsStore } from '@store/statsStore'
import { createPinia, setActivePinia } from 'pinia'
import { getRemindersVM } from './getRemindersVM'

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
      }
    })
  })

  it('should calculate 0% conversion rate when messagesSentCount is 0', () => {
    const mockReminders: Reminders = {
      paymentReminders: {
        messagesSentCount: 0,
        orderCreatedCount: 5
      }
    }
    statsStore.reminders = mockReminders
    const result = getRemindersVM()
    expect(result).toStrictEqual({
      paymentReminders: {
        messagesSentCount: 0,
        orderCreatedCount: 5,
        conversionRate: 0
      }
    })
  })

  it('should calculate correct conversion rate when data is available', () => {
    const mockReminders: Reminders = {
      paymentReminders: {
        messagesSentCount: 10,
        orderCreatedCount: 4
      }
    }
    statsStore.reminders = mockReminders
    const result = getRemindersVM()
    expect(result).toStrictEqual({
      paymentReminders: {
        messagesSentCount: 10,
        orderCreatedCount: 4,
        conversionRate: 40
      }
    })
  })

  it('should round the conversion rate to the nearest integer', () => {
    const mockReminders: Reminders = {
      paymentReminders: {
        messagesSentCount: 9,
        orderCreatedCount: 2
      }
    }
    statsStore.reminders = mockReminders
    const result = getRemindersVM()
    expect(result).toStrictEqual({
      paymentReminders: {
        messagesSentCount: 9,
        orderCreatedCount: 2,
        conversionRate: 22
      }
    })
  })
})

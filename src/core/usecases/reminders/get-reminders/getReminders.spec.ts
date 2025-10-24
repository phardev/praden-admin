import { Reminders } from '@core/entities/reminders'
import { useStatsStore } from '@store/statsStore'
import { createPinia, setActivePinia } from 'pinia'
import { getReminders } from './getReminders'
import { InMemoryRemindersGateway } from './inMemoryRemindersGateway'

describe('GetReminders', () => {
  let remindersGateway: InMemoryRemindersGateway
  let mockData: Reminders
  let statsStore: any

  beforeEach(() => {
    setActivePinia(createPinia())
    statsStore = useStatsStore()
    remindersGateway = new InMemoryRemindersGateway()
    mockData = {
      paymentReminders: {
        messagesSentCount: 9,
        orderCreatedCount: 6
      }
    }
    remindersGateway.feedWith(mockData)
  })

  it('should retrieve reminders data and store it in the stats store', async () => {
    await getReminders(remindersGateway)
    expect(statsStore.reminders).toStrictEqual(mockData)
  })
})

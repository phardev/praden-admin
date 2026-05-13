import {
  GetOrderTimelineVM,
  getOrderTimelineVM,
  TimelineEntryVM
} from '@adapters/primary/view-models/orders/get-order-timeline/getOrderTimelineVM'
import { Order } from '@core/entities/order'
import { TimelineEntryType } from '@core/entities/orderTimeline'
import { useOrderStore } from '@store/orderStore'
import { orderToPrepare1 } from '@utils/testData/orders'
import { createPinia, setActivePinia } from 'pinia'

describe('Get order timeline VM', () => {
  let orderStore: any

  beforeEach(() => {
    setActivePinia(createPinia())
    orderStore = useOrderStore()
  })

  describe('There is no current order', () => {
    it('should return an empty list of entries', () => {
      const vm = getOrderTimelineVM()
      const expected: GetOrderTimelineVM = { entries: [] }
      expect(vm).toStrictEqual(expected)
    })
  })

  describe('The current order has no timeline yet', () => {
    it('should return an empty list of entries', () => {
      const order: Order = JSON.parse(JSON.stringify(orderToPrepare1))
      delete order.timeline
      orderStore.setCurrent(order)
      const vm = getOrderTimelineVM()
      expect(vm.entries).toStrictEqual([])
    })
  })

  describe('The current order has a timeline with a staff actor', () => {
    let order: Order
    const placedAt = 1_700_000_000_000

    beforeEach(() => {
      order = JSON.parse(JSON.stringify(orderToPrepare1))
      order.timeline = [
        {
          type: TimelineEntryType.PreparationStarted,
          createdAt: placedAt,
          actor: {
            kind: 'staff',
            email: 'marie@phardev.fr',
            firstname: 'Marie',
            lastname: 'Dupont'
          }
        }
      ]
      orderStore.setCurrent(order)
    })

    it('should expose the entry with i18n key, formatted timestamp and actor name', () => {
      const expected: TimelineEntryVM = {
        type: TimelineEntryType.PreparationStarted,
        labelKey: 'orders.timeline.events.preparationStarted',
        timestamp: '14/11/2023 22:13',
        actor: { kind: 'staff', name: 'Marie Dupont' }
      }
      expect(getOrderTimelineVM().entries).toStrictEqual([expected])
    })
  })

  describe('The current order has a staff actor with no firstname/lastname', () => {
    it('should fall back to the actor email', () => {
      const order: Order = JSON.parse(JSON.stringify(orderToPrepare1))
      order.timeline = [
        {
          type: TimelineEntryType.PreparationSaved,
          createdAt: 1_700_000_000_000,
          actor: { kind: 'staff', email: 'no-name@phardev.fr' }
        }
      ]
      orderStore.setCurrent(order)
      expect(getOrderTimelineVM().entries[0].actor).toStrictEqual({
        kind: 'staff',
        name: 'no-name@phardev.fr'
      })
    })
  })

  describe('The current order has a system actor', () => {
    it('should expose the actor as system', () => {
      const order: Order = JSON.parse(JSON.stringify(orderToPrepare1))
      order.timeline = [
        {
          type: TimelineEntryType.Paid,
          createdAt: 1_700_000_000_000,
          actor: { kind: 'system' }
        }
      ]
      orderStore.setCurrent(order)
      expect(getOrderTimelineVM().entries[0].actor).toStrictEqual({
        kind: 'system'
      })
    })
  })

  describe('The current order has an unknown actor (legacy data)', () => {
    it('should expose the actor as unknown', () => {
      const order: Order = JSON.parse(JSON.stringify(orderToPrepare1))
      order.timeline = [
        {
          type: TimelineEntryType.Placed,
          createdAt: 1_700_000_000_000,
          actor: { kind: 'unknown' }
        }
      ]
      orderStore.setCurrent(order)
      expect(getOrderTimelineVM().entries[0].actor).toStrictEqual({
        kind: 'unknown'
      })
    })
  })
})

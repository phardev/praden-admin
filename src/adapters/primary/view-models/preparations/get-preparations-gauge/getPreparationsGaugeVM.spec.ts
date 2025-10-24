import { FakeDateProvider } from '@adapters/secondary/date-providers/FakeDateProvider'
import { Timestamp } from '@core/types/types'
import { usePreparationStore } from '@store/preparationStore'
import {
  orderSaved1,
  orderWaitingForClientAnswer1,
  orderWaitingForRestock,
  orderWithoutDelivery
} from '@utils/testData/orders'
import { createPinia, setActivePinia } from 'pinia'
import { GaugeStatus, getPreparationsGaugeVM } from './getPreparationsGaugeVM'

describe('Get preparations gauge VM', () => {
  let preparationStore: any
  let now: Timestamp
  let dateProvider: FakeDateProvider

  beforeEach(() => {
    setActivePinia(createPinia())
    preparationStore = usePreparationStore()
    now = new Date('2025-06-21T00:00:00Z').getTime()
    dateProvider = new FakeDateProvider()
    dateProvider.feedWith(now)
  })

  describe('When there are no preparations', () => {
    it('should return a gauge with 100% and good status', () => {
      preparationStore.items = []
      const vm = getPreparationsGaugeVM(dateProvider)
      expect(vm).toStrictEqual({
        status: GaugeStatus.Good,
        percentage: 100,
        totalCount: 0,
        goodCount: 0,
        warningCount: 0,
        alertCount: 0
      })
    })
  })

  describe('When all preparations are in good status', () => {
    it('should return a gauge with 100% and good status', () => {
      now = orderSaved1.createdAt
      dateProvider.feedWith(now)
      preparationStore.items = [orderSaved1]
      const vm = getPreparationsGaugeVM(dateProvider)
      expect(vm).toStrictEqual({
        status: GaugeStatus.Good,
        percentage: 100,
        totalCount: 1,
        goodCount: 1,
        warningCount: 0,
        alertCount: 0
      })
    })
  })

  describe('When there are some warning preparations', () => {
    it('should return a gauge with warning status', () => {
      now = orderSaved1.createdAt + 40 * 3600 * 1000
      dateProvider.feedWith(now)
      preparationStore.items = [orderSaved1]
      const vm = getPreparationsGaugeVM(dateProvider)
      expect(vm).toStrictEqual({
        status: GaugeStatus.Warning,
        percentage: 50,
        totalCount: 1,
        goodCount: 0,
        warningCount: 1,
        alertCount: 0
      })
    })
  })

  describe('When there are some alert preparations', () => {
    it('should return a gauge with alert status', () => {
      now = orderSaved1.createdAt + 49 * 3600 * 1000
      dateProvider.feedWith(now)
      preparationStore.items = [orderSaved1]
      const vm = getPreparationsGaugeVM(dateProvider)
      expect(vm).toStrictEqual({
        status: GaugeStatus.Alert,
        percentage: 0,
        totalCount: 1,
        goodCount: 0,
        warningCount: 0,
        alertCount: 1
      })
    })
  })

  describe('When preparations are in waiting state', () => {
    it('should ignore them in the calculation', () => {
      preparationStore.items = [
        orderWaitingForClientAnswer1,
        orderWaitingForRestock
      ]
      const vm = getPreparationsGaugeVM(dateProvider)
      expect(vm).toStrictEqual({
        status: GaugeStatus.Good,
        percentage: 100,
        totalCount: 0,
        goodCount: 0,
        warningCount: 0,
        alertCount: 0
      })
    })
  })

  describe('When preparations does not have delivery', () => {
    it('should ignore them in the calculation', () => {
      preparationStore.items = [orderWithoutDelivery]
      const vm = getPreparationsGaugeVM(dateProvider)
      expect(vm).toStrictEqual({
        status: GaugeStatus.Good,
        percentage: 100,
        totalCount: 0,
        goodCount: 0,
        warningCount: 0,
        alertCount: 0
      })
    })
  })
})

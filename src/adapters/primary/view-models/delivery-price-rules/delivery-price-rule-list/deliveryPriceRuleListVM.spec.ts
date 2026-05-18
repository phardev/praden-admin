import { FakeDateProvider } from '@adapters/secondary/date-providers/FakeDateProvider'
import { useDeliveryMethodStore } from '@store/deliveryMethodStore'
import { useDeliveryPriceRuleStore } from '@store/deliveryPriceRuleStore'
import {
  christmasFreeShipping,
  freeShippingOver39,
  inactiveRule,
  standardShipping
} from '@utils/testData/deliveryPriceRules'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import { getDeliveryPriceRuleListVM } from './deliveryPriceRuleListVM'

describe('deliveryPriceRuleListVM', () => {
  let dateProvider: FakeDateProvider

  beforeEach(() => {
    setActivePinia(createPinia())
    const deliveryMethodStore = useDeliveryMethodStore()
    deliveryMethodStore.list([
      {
        uuid: 'delivery-colissimo',
        name: 'Colissimo',
        description: 'Livraison Colissimo',
        type: 'DELIVERY' as any,
        carrier: {
          uuid: 'carrier-colissimo',
          name: 'Colissimo',
          type: 'COLISSIMO' as any
        },
        priceRanges: []
      },
      {
        uuid: 'delivery-mondial-relay',
        name: 'Mondial Relay',
        description: 'Livraison Mondial Relay',
        type: 'DELIVERY' as any,
        carrier: {
          uuid: 'carrier-mondial-relay',
          name: 'Mondial Relay',
          type: 'DPD' as any
        },
        priceRanges: []
      }
    ])
    dateProvider = new FakeDateProvider()
    dateProvider.feedWith(christmasFreeShipping.startDate!)
  })

  it('should return empty array when no rules', () => {
    const store = useDeliveryPriceRuleStore()
    store.list([])

    const result = getDeliveryPriceRuleListVM(dateProvider)

    expect(result).toStrictEqual([])
  })

  it('should format price in euros', () => {
    const store = useDeliveryPriceRuleStore()
    store.list([standardShipping])

    const result = getDeliveryPriceRuleListVM(dateProvider)

    expect(result[0].formattedPrice).toStrictEqual('5,90 €')
  })

  it('should format weight in kg', () => {
    const store = useDeliveryPriceRuleStore()
    store.list([standardShipping])

    const result = getDeliveryPriceRuleListVM(dateProvider)

    expect(result[0].formattedMaxWeight).toStrictEqual('30 kg')
  })

  it('should format min order value in euros', () => {
    const store = useDeliveryPriceRuleStore()
    store.list([freeShippingOver39])

    const result = getDeliveryPriceRuleListVM(dateProvider)

    expect(result[0].formattedMinOrderValue).toStrictEqual('39,00 €')
  })

  it('should return dash for date range when no dates', () => {
    const store = useDeliveryPriceRuleStore()
    store.list([standardShipping])

    const result = getDeliveryPriceRuleListVM(dateProvider)

    expect(result[0].formattedDateRange).toStrictEqual('-')
  })

  it('should format date range when dates present', () => {
    const store = useDeliveryPriceRuleStore()
    store.list([christmasFreeShipping])

    const result = getDeliveryPriceRuleListVM(dateProvider)

    expect(result[0].formattedDateRange).toStrictEqual(
      '21 déc. 2023 - 31 déc. 2023'
    )
  })

  it('should include delivery method name', () => {
    const store = useDeliveryPriceRuleStore()
    store.list([standardShipping])

    const result = getDeliveryPriceRuleListVM(dateProvider)

    expect(result[0].deliveryMethodName).toStrictEqual('Colissimo')
  })

  it('should return rules sorted by priority descending', () => {
    const store = useDeliveryPriceRuleStore()
    store.list([standardShipping, freeShippingOver39, christmasFreeShipping])

    const result = getDeliveryPriceRuleListVM(dateProvider)

    expect(result.map((r) => r.priority)).toStrictEqual([100, 50, 1])
  })

  it('should expose disabled status when rule is not active', () => {
    const store = useDeliveryPriceRuleStore()
    store.list([inactiveRule])

    const result = getDeliveryPriceRuleListVM(dateProvider)

    expect(result[0].status).toStrictEqual('disabled')
  })

  it('should expose upcoming status when start date is in the future', () => {
    dateProvider.feedWith(christmasFreeShipping.startDate! - 1)
    const store = useDeliveryPriceRuleStore()
    store.list([christmasFreeShipping])

    const result = getDeliveryPriceRuleListVM(dateProvider)

    expect(result[0].status).toStrictEqual('upcoming')
  })

  it('should expose active status when current date is within range', () => {
    dateProvider.feedWith(christmasFreeShipping.startDate!)
    const store = useDeliveryPriceRuleStore()
    store.list([christmasFreeShipping])

    const result = getDeliveryPriceRuleListVM(dateProvider)

    expect(result[0].status).toStrictEqual('active')
  })

  it('should expose expired status when end date is reached', () => {
    dateProvider.feedWith(christmasFreeShipping.endDate!)
    const store = useDeliveryPriceRuleStore()
    store.list([christmasFreeShipping])

    const result = getDeliveryPriceRuleListVM(dateProvider)

    expect(result[0].status).toStrictEqual('expired')
  })

  it('should map all fields correctly', () => {
    const store = useDeliveryPriceRuleStore()
    store.list([inactiveRule])

    const result = getDeliveryPriceRuleListVM(dateProvider)

    expect(result).toStrictEqual([
      {
        uuid: 'rule-inactive',
        name: 'Ancienne règle désactivée',
        deliveryMethodUuid: 'delivery-mondial-relay',
        deliveryMethodName: 'Mondial Relay',
        formattedPrice: '2,99 €',
        formattedMinOrderValue: '0,00 €',
        formattedMaxWeight: '10 kg',
        formattedDateRange: '-',
        priority: 5,
        status: 'disabled'
      }
    ])
  })
})

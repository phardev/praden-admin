import { WelcomeCodeStatus } from '@core/entities/welcomeCode'
import { useWelcomeCodeStore } from '@store/welcomeCodeStore'
import { priceFormatter, timestampToLocaleString } from '@utils/formatters'
import {
  disabledWelcomeCode,
  fiveEuroWelcomeCode,
  freeRelayDeliveryWelcomeCode,
  tenPercentWelcomeCode
} from '@utils/testData/welcomeCodes'
import { createPinia, setActivePinia } from 'pinia'
import { GetWelcomeCodesVM, getWelcomeCodesVM } from './getWelcomeCodesVM'

describe('Get welcome codes VM', () => {
  let welcomeCodeStore: ReturnType<typeof useWelcomeCodeStore>
  let vm: GetWelcomeCodesVM

  const euros = (cents: number) =>
    priceFormatter('fr-FR', 'EUR').format(cents / 100)
  const date = (timestamp: number) =>
    timestampToLocaleString(timestamp, 'fr-FR')
  const percent = (rate: number) =>
    new Intl.NumberFormat('fr-FR', {
      style: 'percent',
      maximumFractionDigits: 1
    }).format(rate)

  beforeEach(() => {
    setActivePinia(createPinia())
    welcomeCodeStore = useWelcomeCodeStore()
  })

  const whenGetVM = () => {
    vm = getWelcomeCodesVM()
  }

  it('should have no item when there is no welcome code', () => {
    whenGetVM()
    expect(vm).toStrictEqual({
      headers: [
        { name: 'welcomeCode.headers.code', value: 'code' },
        { name: 'welcomeCode.headers.discount', value: 'discount' },
        { name: 'welcomeCode.headers.minimumAmount', value: 'minimumAmount' },
        { name: 'welcomeCode.headers.period', value: 'period' },
        { name: 'welcomeCode.headers.status', value: 'status' },
        { name: 'welcomeCode.headers.sentCount', value: 'sentCount' },
        { name: 'welcomeCode.headers.usedCount', value: 'usedCount' },
        { name: 'welcomeCode.headers.conversionRate', value: 'conversionRate' },
        { name: 'welcomeCode.headers.actions', value: 'actions' }
      ],
      items: [],
      sentCode: undefined,
      isLoading: false,
      isSaving: false
    })
  })

  it('should describe a fixed discount on products sent in the welcome mail', () => {
    welcomeCodeStore.list([fiveEuroWelcomeCode])
    whenGetVM()
    expect(vm.items).toStrictEqual([
      {
        uuid: fiveEuroWelcomeCode.uuid,
        code: fiveEuroWelcomeCode.code,
        discount: {
          key: 'welcomeCode.discount.products',
          params: { reduction: `-${euros(fiveEuroWelcomeCode.amount)}` }
        },
        minimumAmount: euros(fiveEuroWelcomeCode.conditions.minimumAmount!),
        period: {
          key: 'welcomeCode.period.between',
          params: {
            start: date(fiveEuroWelcomeCode.startDate!),
            end: date(fiveEuroWelcomeCode.endDate!)
          }
        },
        status: {
          key: 'welcomeCode.status.SENT',
          color: 'green'
        },
        sentCount: String(fiveEuroWelcomeCode.sentCount),
        usedCount: String(fiveEuroWelcomeCode.usedCount),
        conversionRate: percent(fiveEuroWelcomeCode.conversionRate!),
        isActive: true
      }
    ])
  })

  it('should describe a percentage discount that only has an end date', () => {
    welcomeCodeStore.list([tenPercentWelcomeCode])
    whenGetVM()
    expect({
      discount: vm.items[0].discount,
      minimumAmount: vm.items[0].minimumAmount,
      period: vm.items[0].period,
      status: vm.items[0].status
    }).toStrictEqual({
      discount: {
        key: 'welcomeCode.discount.products',
        params: { reduction: `-${tenPercentWelcomeCode.amount} %` }
      },
      minimumAmount: '',
      period: {
        key: 'welcomeCode.period.until',
        params: { end: date(tenPercentWelcomeCode.endDate!) }
      },
      status: { key: 'welcomeCode.status.USABLE', color: 'blue' }
    })
  })

  it('should describe a scheduled free delivery that was never sent', () => {
    welcomeCodeStore.list([freeRelayDeliveryWelcomeCode])
    whenGetVM()
    expect({
      discount: vm.items[0].discount,
      period: vm.items[0].period,
      status: vm.items[0].status,
      conversionRate: vm.items[0].conversionRate
    }).toStrictEqual({
      discount: { key: 'welcomeCode.discount.freeDelivery', params: {} },
      period: {
        key: 'welcomeCode.period.from',
        params: { start: date(freeRelayDeliveryWelcomeCode.startDate!) }
      },
      status: { key: 'welcomeCode.status.SCHEDULED', color: 'orange' },
      conversionRate: ''
    })
  })

  it('should describe a disabled partial delivery discount without dates', () => {
    welcomeCodeStore.list([disabledWelcomeCode])
    whenGetVM()
    expect({
      discount: vm.items[0].discount,
      period: vm.items[0].period,
      status: vm.items[0].status,
      isActive: vm.items[0].isActive
    }).toStrictEqual({
      discount: {
        key: 'welcomeCode.discount.delivery',
        params: { reduction: `-${euros(disabledWelcomeCode.amount)}` }
      },
      period: { key: 'welcomeCode.period.unlimited', params: {} },
      status: { key: 'welcomeCode.status.DISABLED', color: 'gray' },
      isActive: false
    })
  })

  it('should tell an ended welcome code apart', () => {
    welcomeCodeStore.list([
      { ...tenPercentWelcomeCode, status: WelcomeCodeStatus.Ended }
    ])
    whenGetVM()
    expect(vm.items[0].status).toStrictEqual({
      key: 'welcomeCode.status.ENDED',
      color: 'red'
    })
  })

  it('should point out the code sent in the welcome mail', () => {
    welcomeCodeStore.list([tenPercentWelcomeCode, fiveEuroWelcomeCode])
    whenGetVM()
    expect(vm.sentCode).toStrictEqual(vm.items[1])
  })

  it('should be aware that the welcome codes are loading', () => {
    welcomeCodeStore.startLoading()
    whenGetVM()
    expect(vm.isLoading).toBe(true)
  })

  it('should be aware that a welcome code is being saved', () => {
    welcomeCodeStore.startSaving()
    whenGetVM()
    expect(vm.isSaving).toBe(true)
  })
})

import { FakeDateProvider } from '@adapters/secondary/date-providers/FakeDateProvider'
import { Header } from '@adapters/primary/view-models/preparations/get-orders-to-prepare/getPreparationsVM'
import { createPinia, setActivePinia } from 'pinia'
import { usePromotionCodeStore } from '@store/promotionCodeStore'
import { getPromotionCodesVM, GetPromotionCodesVM } from './getPromotionCodesVM'
import {
  fifteenPercentIfMiniumAmountPromotionCode,
  limitedInTimePromotionCode,
  tenEuroFixedPromotionCode
} from '@utils/testData/promotionCodes'

describe('Get promotion codes VM', () => {
  let promotionCodeStore: any
  const dateProvider: FakeDateProvider = new FakeDateProvider()

  const expectedHeaders: Array<Header> = [
    {
      name: 'Code',
      value: 'code'
    },
    {
      name: 'Montant',
      value: 'amount'
    },
    {
      name: 'Date de début',
      value: 'startDate'
    },
    {
      name: 'Date de fin',
      value: 'endDate'
    },
    {
      name: "Nombre d'utilisations",
      value: 'currentUses'
    }
  ]

  beforeEach(() => {
    setActivePinia(createPinia())
    promotionCodeStore = usePromotionCodeStore()
  })

  describe('There is no promotion code', () => {
    it('should list nothing', () => {
      expectVMToMatch({})
    })
  })

  describe('There is some promotion codes', () => {
    beforeEach(() => {
      promotionCodeStore.items = [
        fifteenPercentIfMiniumAmountPromotionCode,
        tenEuroFixedPromotionCode,
        limitedInTimePromotionCode
      ]
    })

    describe('Promotion codes in progress', () => {
      it('should list all of them', () => {
        givenNowIs(limitedInTimePromotionCode.startDate + 1)
        const expectedVM: Partial<GetPromotionCodesVM> = {
          items: {
            'En cours': {
              count: 3,
              table: {
                headers: expectedHeaders,
                items: [
                  {
                    uuid: fifteenPercentIfMiniumAmountPromotionCode.uuid,
                    code: fifteenPercentIfMiniumAmountPromotionCode.code,
                    amount: '15%',
                    startDate: '',
                    startDatetime: new Date(''),
                    endDate: '',
                    endDatetime: new Date(''),
                    currentUses:
                      fifteenPercentIfMiniumAmountPromotionCode.currentUses
                  },
                  {
                    uuid: tenEuroFixedPromotionCode.uuid,
                    code: tenEuroFixedPromotionCode.code,
                    amount: '10,00\u00A0€',
                    startDate: '',
                    startDatetime: new Date(''),
                    endDate: '',
                    endDatetime: new Date(''),
                    currentUses: tenEuroFixedPromotionCode.currentUses
                  },
                  {
                    uuid: limitedInTimePromotionCode.uuid,
                    code: limitedInTimePromotionCode.code,
                    amount: '10,00\u00A0€',
                    startDate: '8 janv. 2025',
                    startDatetime: new Date('2025-01-08T13:03:41.000Z'),
                    endDate: '9 janv. 2025',
                    endDatetime: new Date('2025-01-09T00:10:21.000Z'),
                    currentUses: limitedInTimePromotionCode.currentUses
                  }
                ]
              }
            }
          }
        }
        expectVMToMatch(expectedVM)
      })
    })
    describe('Promotion codes not started', () => {
      it('should list all of them', () => {
        givenNowIs(limitedInTimePromotionCode.startDate - 1)
        promotionCodeStore.items = [limitedInTimePromotionCode]
        const expectedVM: Partial<GetPromotionCodesVM> = {
          items: {
            'À venir': {
              count: 1,
              table: {
                headers: expectedHeaders,
                items: [
                  {
                    uuid: limitedInTimePromotionCode.uuid,
                    code: limitedInTimePromotionCode.code,
                    amount: '10,00\u00A0€',
                    startDate: '8 janv. 2025',
                    startDatetime: new Date('2025-01-08T13:03:41.000Z'),
                    endDate: '9 janv. 2025',
                    endDatetime: new Date('2025-01-09T00:10:21.000Z'),
                    currentUses: limitedInTimePromotionCode.currentUses
                  }
                ]
              }
            }
          }
        }
        expectVMToMatch(expectedVM)
      })
    })
    describe('Promotion codes already ended', () => {
      it('should list all of them', () => {
        givenNowIs(limitedInTimePromotionCode.endDate + 1)
        promotionCodeStore.items = [limitedInTimePromotionCode]
        const expectedVM: Partial<GetPromotionCodesVM> = {
          items: {
            Terminé: {
              count: 1,
              table: {
                headers: expectedHeaders,
                items: [
                  {
                    uuid: limitedInTimePromotionCode.uuid,
                    code: limitedInTimePromotionCode.code,
                    amount: '10,00\u00A0€',
                    startDate: '8 janv. 2025',
                    startDatetime: new Date('2025-01-08T13:03:41.000Z'),
                    endDate: '9 janv. 2025',
                    endDatetime: new Date('2025-01-09T00:10:21.000Z'),
                    currentUses: limitedInTimePromotionCode.currentUses
                  }
                ]
              }
            }
          }
        }
        expectVMToMatch(expectedVM)
      })
    })
    describe('Loading', () => {
      it('should be aware during loading', () => {
        promotionCodeStore.items = []
        promotionCodeStore.isLoading = true
        expectVMToMatch({ isLoading: true })
      })
    })
  })

  const givenNowIs = (now: number) => {
    dateProvider.feedWith(now)
  }

  const expectVMToMatch = (expectedVM: Partial<GetPromotionCodesVM>) => {
    const emptyVM: GetPromotionCodesVM = {
      isLoading: false,
      items: {
        'En cours': {
          count: 0,
          table: {
            headers: expectedHeaders,
            items: []
          }
        },
        Terminé: {
          count: 0,
          table: {
            headers: expectedHeaders,
            items: []
          }
        },
        'À venir': {
          count: 0,
          table: {
            headers: expectedHeaders,
            items: []
          }
        }
      }
    }
    expect(getPromotionCodesVM(dateProvider)).toMatchObject({
      ...emptyVM,
      ...expectedVM
    })
  }
})

import { GetPromotionsVM, getPromotionsVM } from './getPromotionsVM'
import { createPinia, setActivePinia } from 'pinia'
import { usePromotionStore } from '@store/promotionStore'
import { Header } from '@adapters/primary/view-models/preparations/get-orders-to-prepare/getPreparationsVM'
import {
  promotionFixedMultipleProducts,
  promotionPercentageDolodent
} from '@utils/testData/promotions'
import { FakeDateProvider } from '@adapters/secondary/date-providers/FakeDateProvider'

describe('Get products VM', () => {
  let promotionStore: any
  const dateProvider: FakeDateProvider = new FakeDateProvider()

  const expectedHeaders: Array<Header> = [
    {
      name: 'Nom',
      value: 'name'
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
      name: 'Nombre de produits',
      value: 'numberOfProducts'
    }
  ]

  beforeEach(() => {
    setActivePinia(createPinia())
    promotionStore = usePromotionStore()
  })

  describe('There is no promotions', () => {
    it('should list nothing', () => {
      expectVMToMatch({})
    })
  })
  describe('There is some promotions', () => {
    beforeEach(() => {
      promotionStore.items = [
        promotionFixedMultipleProducts,
        promotionPercentageDolodent
      ]
    })
    describe('Promotions in progress', () => {
      it('should list all of them', () => {
        givenNowIs(1690417000000)
        const expectedVM: GetPromotionsVM = {
          'En cours': {
            count: 2,
            table: {
              headers: expectedHeaders,
              items: [
                {
                  uuid: promotionFixedMultipleProducts.uuid,
                  name: promotionFixedMultipleProducts.name,
                  amount: '1,00\u00A0€',
                  startDate: '27 juil. 2023',
                  startDatetime: new Date('2023-07-27T00:00:00.000Z'),
                  endDate: '27 août 2023',
                  endDatetime: new Date('2023-08-27T00:00:00.000Z'),
                  numberOfProducts: 2
                },
                {
                  uuid: promotionPercentageDolodent.uuid,
                  name: promotionPercentageDolodent.name,
                  amount: '10%',
                  startDate: '27 juil. 2023',
                  startDatetime: new Date('2023-07-27T00:00:00.000Z'),
                  endDate: '27 août 2023',
                  endDatetime: new Date('2023-08-27T00:00:00.000Z'),
                  numberOfProducts: 1
                }
              ]
            }
          }
        }
        expectVMToMatch(expectedVM)
      })
      it('should list all of them if there is no starting date or ending date', () => {
        const withoutDatePromo = JSON.parse(
          JSON.stringify(promotionFixedMultipleProducts)
        )
        delete withoutDatePromo.startDate
        delete withoutDatePromo.endDate
        withoutDatePromo.amount = 299
        promotionStore.items = [withoutDatePromo]
        givenNowIs(2690417000000)
        const expectedVM: GetPromotionsVM = {
          'En cours': {
            count: 1,
            table: {
              headers: expectedHeaders,
              items: [
                {
                  name: withoutDatePromo.name,
                  amount: '2,99\u00A0€',
                  startDate: '',
                  startDatetime: new Date(''),
                  endDate: '',
                  endDatetime: new Date(''),
                  numberOfProducts: 2
                }
              ]
            }
          }
        }
        expectVMToMatch(expectedVM)
      })
      it('should list all of them if there is no starting date but there is an ending date', () => {
        const withoutDatePromo = JSON.parse(
          JSON.stringify(promotionPercentageDolodent)
        )
        delete withoutDatePromo.startDate
        withoutDatePromo.endDate = 1696104400000
        withoutDatePromo.amount = 25
        promotionStore.items = [withoutDatePromo]
        givenNowIs(1693094400000)
        const expectedVM: GetPromotionsVM = {
          'En cours': {
            count: 1,
            table: {
              headers: expectedHeaders,
              items: [
                {
                  name: promotionPercentageDolodent.name,
                  amount: '25%',
                  startDate: '',
                  startDatetime: new Date(''),
                  endDate: '30 sept. 2023',
                  endDatetime: new Date('2023-09-30T20:06:40.000Z'),
                  numberOfProducts: 1
                }
              ]
            }
          }
        }
        expectVMToMatch(expectedVM)
      })
      it('should list all of them if there is a starting date but there is not an ending date', () => {
        const withoutDatePromo = JSON.parse(
          JSON.stringify(promotionPercentageDolodent)
        )
        delete withoutDatePromo.endDate
        withoutDatePromo.startDate = 1696104400000
        promotionStore.items = [withoutDatePromo]
        givenNowIs(1696114400000)
        const expectedVM: GetPromotionsVM = {
          'En cours': {
            count: 1,
            table: {
              headers: expectedHeaders,
              items: [
                {
                  name: promotionPercentageDolodent.name,
                  amount: '10%',
                  startDate: '30 sept. 2023',
                  startDatetime: new Date('2023-09-30T20:06:40.000Z'),
                  endDate: '',
                  endDatetime: new Date(''),
                  numberOfProducts: 1
                }
              ]
            }
          }
        }
        expectVMToMatch(expectedVM)
      })
    })
    describe('All promotions are over', () => {
      it('should list all of them', () => {
        givenNowIs(1790417000000)
        const expectedVM: GetPromotionsVM = {
          Terminée: {
            count: 2,
            table: {
              headers: expectedHeaders,
              items: [
                {
                  name: promotionFixedMultipleProducts.name,
                  amount: '1,00\u00A0€',
                  startDate: '27 juil. 2023',
                  startDatetime: new Date('2023-07-27T00:00:00.000Z'),
                  endDate: '27 août 2023',
                  endDatetime: new Date('2023-08-27T00:00:00.000Z'),
                  numberOfProducts: 2
                },
                {
                  name: promotionPercentageDolodent.name,
                  amount: '10%',
                  startDate: '27 juil. 2023',
                  startDatetime: new Date('2023-07-27T00:00:00.000Z'),
                  endDate: '27 août 2023',
                  endDatetime: new Date('2023-08-27T00:00:00.000Z'),
                  numberOfProducts: 1
                }
              ]
            }
          }
        }
        expectVMToMatch(expectedVM)
      })
    })
    describe('All promotions are not started', () => {
      it('should list all of them', () => {
        givenNowIs(1590417000000)
        const expectedVM: GetPromotionsVM = {
          'À venir': {
            count: 2,
            table: {
              headers: expectedHeaders,
              items: [
                {
                  name: promotionFixedMultipleProducts.name,
                  amount: '1,00\u00A0€',
                  startDate: '27 juil. 2023',
                  startDatetime: new Date('2023-07-27T00:00:00.000Z'),
                  endDate: '27 août 2023',
                  endDatetime: new Date('2023-08-27T00:00:00.000Z'),
                  numberOfProducts: 2
                },
                {
                  name: promotionPercentageDolodent.name,
                  amount: '10%',
                  startDate: '27 juil. 2023',
                  startDatetime: new Date('2023-07-27T00:00:00.000Z'),
                  endDate: '27 août 2023',
                  endDatetime: new Date('2023-08-27T00:00:00.000Z'),
                  numberOfProducts: 1
                }
              ]
            }
          }
        }
        expectVMToMatch(expectedVM)
      })
    })
  })

  const givenNowIs = (now: number) => {
    dateProvider.feedWith(now)
  }

  const expectVMToMatch = (expectedVM: GetPromotionsVM) => {
    const emptyVM: GetPromotionsVM = {
      'En cours': {
        count: 0,
        table: {
          headers: expectedHeaders,
          items: []
        }
      },
      Terminée: {
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
    expect(getPromotionsVM(dateProvider)).toMatchObject({
      ...emptyVM,
      ...expectedVM
    })
  }
})

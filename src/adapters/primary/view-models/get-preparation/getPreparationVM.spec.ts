import {
  orderToCancel,
  orderInPreparation1,
  orderToPrepare1,
  orderToPrepare2,
  orderWithMissingProduct1
} from '@utils/testData/orders'
import { Order } from '@core/entities/order'
import { createPinia, setActivePinia } from 'pinia'
import { usePreparationStore } from '@store/preparationStore'
import {
  getPreparationVM,
  GetPreparationVM,
  PreparationStatus
} from '@adapters/primary/view-models/get-preparation/getPreparationVM'
import { dolodent, ultraLevure } from '@utils/testData/products'
import { Header } from '@adapters/primary/view-models/get-orders-to-prepare/getPreparationsVM'

describe('Get preparation VM', () => {
  let preparationStore: any
  const headers: Array<Header> = [
    {
      name: 'Référence',
      value: 'reference'
    },
    {
      name: 'Nom',
      value: 'name'
    },
    {
      name: 'Quantité attendue',
      value: 'expectedQuantity'
    },
    {
      name: 'Quantité préparée',
      value: 'preparedQuantity'
    },
    {
      name: 'Status',
      value: 'status'
    }
  ]
  beforeEach(() => {
    setActivePinia(createPinia())
    preparationStore = usePreparationStore()
  })
  describe('There is a preparation', () => {
    describe('Initially', () => {
      it('should get the preparation vm for a preparation', () => {
        givenCurrentPreparationIs(orderToPrepare1)
        const expectedVM: GetPreparationVM = {
          reference: orderToPrepare1.uuid,
          headers,
          lines: [
            {
              reference: dolodent.cip13,
              name: dolodent.name,
              expectedQuantity: 2,
              preparedQuantity: 0,
              status: PreparationStatus.NotPrepared
            }
          ],
          messages: [],
          canValidate: false,
          canCancel: false,
          canAskHowToFinish: false
        }
        expect(getPreparationVM()).toStrictEqual(expectedVM)
      })
      it('should get the preparation vm for another preparation', () => {
        givenCurrentPreparationIs(orderToPrepare2)
        const expectedVM: GetPreparationVM = {
          reference: orderToPrepare2.uuid,
          headers,
          lines: [
            {
              reference: dolodent.cip13,
              name: dolodent.name,
              expectedQuantity: 1,
              preparedQuantity: 0,
              status: PreparationStatus.NotPrepared
            },
            {
              reference: ultraLevure.cip13,
              name: ultraLevure.name,
              expectedQuantity: 2,
              preparedQuantity: 0,
              status: PreparationStatus.NotPrepared
            }
          ],
          messages: [],
          canValidate: false,
          canCancel: false,
          canAskHowToFinish: false
        }
        expect(getPreparationVM()).toStrictEqual(expectedVM)
      })
    })
    describe('Some products were scanned', () => {
      it('should get the preparation vm', () => {
        const order = JSON.parse(JSON.stringify(orderToPrepare1))
        order.lines[0].preparedQuantity = 2
        givenCurrentPreparationIs(order)
        const expectedVM: GetPreparationVM = {
          reference: orderToPrepare1.uuid,
          headers,
          lines: [
            {
              reference: dolodent.cip13,
              name: dolodent.name,
              expectedQuantity: 2,
              preparedQuantity: 2,
              status: PreparationStatus.Prepared
            }
          ],
          messages: [],
          canValidate: true,
          canCancel: false,
          canAskHowToFinish: false
        }
        expect(getPreparationVM()).toStrictEqual(expectedVM)
      })
      it('should get the preparation vm for a partially prepared order', () => {
        const order = JSON.parse(JSON.stringify(orderToPrepare2))
        order.lines[0].preparedQuantity = 1
        order.lines[1].preparedQuantity = 1
        givenCurrentPreparationIs(order)
        const expectedVM: GetPreparationVM = {
          reference: orderToPrepare2.uuid,
          headers,
          lines: [
            {
              reference: dolodent.cip13,
              name: dolodent.name,
              expectedQuantity: 1,
              preparedQuantity: 1,
              status: PreparationStatus.Prepared
            },
            {
              reference: ultraLevure.cip13,
              name: ultraLevure.name,
              expectedQuantity: 2,
              preparedQuantity: 1,
              status: PreparationStatus.NotPrepared
            }
          ],
          messages: [],
          canValidate: false,
          canCancel: false,
          canAskHowToFinish: false
        }
        expect(getPreparationVM()).toStrictEqual(expectedVM)
      })
      it('should get the preparation vm for an preparation with too much prepared quantity', () => {
        const order = JSON.parse(JSON.stringify(orderToPrepare1))
        order.lines[0].preparedQuantity = 3
        givenCurrentPreparationIs(order)
        const expectedVM: GetPreparationVM = {
          reference: orderToPrepare1.uuid,
          headers,
          lines: [
            {
              reference: dolodent.cip13,
              name: dolodent.name,
              expectedQuantity: 2,
              preparedQuantity: 3,
              status: PreparationStatus.ErrorTooMuchQuantity
            }
          ],
          messages: [],
          canValidate: false,
          canCancel: false,
          canAskHowToFinish: false
        }
        expect(getPreparationVM()).toStrictEqual(expectedVM)
      })
    })
  })
  describe('Partial ship asked', () => {
    beforeEach(() => {
      givenCurrentPreparationIs(orderWithMissingProduct1)
    })
    it('should get all messages', () => {
      const expectedVM: Partial<GetPreparationVM> = {
        messages: [
          {
            content: 'Demande de choix',
            sentDate: '24 janv. 2023',
            sentDatetime: new Date(1674573878456)
          },
          {
            content: 'Envoi partiel',
            sentDate: '25 janv. 2023',
            sentDatetime: new Date(1674684178456)
          }
        ]
      }
      expectVMToMatch(expectedVM)
    })
    it('should allow to validate', () => {
      const expectedVM: Partial<GetPreparationVM> = {
        canValidate: true
      }
      expectVMToMatch(expectedVM)
    })
    it('should not allow to ask how to finish', () => {
      const expectedVM: Partial<GetPreparationVM> = {
        canAskHowToFinish: false
      }
      expectVMToMatch(expectedVM)
    })
  })
  describe('Wait for restock asked', () => {
    it('should get all messages for a restock', () => {
      givenCurrentPreparationIs(orderInPreparation1)
      const expectedVM: Partial<GetPreparationVM> = {
        messages: [
          {
            content: 'Demande de choix',
            sentDate: '5 févr. 2023',
            sentDatetime: new Date(1675564430539)
          },
          {
            content: 'Attente de stock',
            sentDate: '5 févr. 2023',
            sentDatetime: new Date(1675564440539)
          }
        ]
      }
      expectVMToMatch(expectedVM)
    })
    it('should not allow to ask how to finish', () => {
      const expectedVM: Partial<GetPreparationVM> = {
        canAskHowToFinish: false
      }
      expectVMToMatch(expectedVM)
    })
  })
  describe('Cancel order asked', () => {
    beforeEach(() => {
      givenCurrentPreparationIs(orderToCancel)
    })
    it('should get all messages for a cancel', () => {
      const expectedVM: Partial<GetPreparationVM> = {
        messages: [
          {
            content: 'Demande de choix',
            sentDate: '24 janv. 2023',
            sentDatetime: new Date(1674573878456)
          },
          {
            content: 'Annulation de commande',
            sentDate: '24 janv. 2023',
            sentDatetime: new Date(1674574178456)
          }
        ]
      }
      expectVMToMatch(expectedVM)
    })
    it('should allow to cancel', () => {
      const expectedVM: Partial<GetPreparationVM> = {
        canCancel: true
      }
      expectVMToMatch(expectedVM)
    })
    it('should not allow to ask how to finish', () => {
      const expectedVM: Partial<GetPreparationVM> = {
        canAskHowToFinish: false
      }
      expectVMToMatch(expectedVM)
    })
  })
  describe('There is no current preparation', () => {
    it('should return an empty vm', () => {
      const emptyVM: GetPreparationVM = {
        reference: '',
        headers: [],
        lines: [],
        messages: [],
        canValidate: false,
        canCancel: false,
        canAskHowToFinish: false
      }
      expect(getPreparationVM()).toStrictEqual(emptyVM)
    })
  })

  const givenCurrentPreparationIs = (order: Order) => {
    preparationStore.current = order
  }

  const expectVMToMatch = (partialVM: Partial<GetPreparationVM>) => {
    expect(getPreparationVM()).toMatchObject(partialVM)
  }
})

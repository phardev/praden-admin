import {
  AssistanceRequestCategory,
  AssistanceSubjectType
} from '@core/entities/assistanceRequest'
import { useAssistanceRequestStore } from '@store/assistanceRequestStore'
import { useCustomerStore } from '@store/customerStore'
import { useOrderStore } from '@store/orderStore'
import { useProductStore } from '@store/productStore'
import { receivedLabelRequest } from '@utils/testData/assistanceRequests'
import { elodieDurand } from '@utils/testData/customers'
import { orderToPrepare1, orderToPrepare2 } from '@utils/testData/orders'
import { dolodent } from '@utils/testData/products'
import { createPinia, setActivePinia } from 'pinia'
import { type AssistancePanelVM, assistancePanelVM } from './assistancePanelVM'

describe('Assistance panel VM', () => {
  let orderStore: ReturnType<typeof useOrderStore>
  let productStore: ReturnType<typeof useProductStore>
  let customerStore: ReturnType<typeof useCustomerStore>
  let assistanceRequestStore: ReturnType<typeof useAssistanceRequestStore>

  const blankPanel: AssistancePanelVM = {
    pageSubject: undefined,
    suggestedCategory: undefined,
    lastCreated: undefined
  }

  beforeEach(() => {
    setActivePinia(createPinia())
    orderStore = useOrderStore()
    productStore = useProductStore()
    customerStore = useCustomerStore()
    assistanceRequestStore = useAssistanceRequestStore()
  })

  describe('Page subject', () => {
    describe('Given an order detail page', () => {
      it('should prefill the order as subject with the ORDER category', () => {
        orderStore.setCurrent(orderToPrepare1)
        expect(
          assistancePanelVM(`/orders/${orderToPrepare1.uuid}`)
        ).toStrictEqual({
          ...blankPanel,
          pageSubject: {
            type: AssistanceSubjectType.ORDER,
            label: `${orderToPrepare1.deliveryAddress.firstname} ${orderToPrepare1.deliveryAddress.lastname}`,
            uuid: orderToPrepare1.uuid,
            pageUrl: `/orders/${orderToPrepare1.uuid}`
          },
          suggestedCategory: AssistanceRequestCategory.ORDER
        })
      })

      it('should not prefill when the loaded order is another one', () => {
        orderStore.setCurrent(orderToPrepare2)
        expect(
          assistancePanelVM(`/orders/${orderToPrepare1.uuid}`)
        ).toStrictEqual(blankPanel)
      })

      it('should not prefill on the order creation page', () => {
        orderStore.setCurrent(orderToPrepare1)
        expect(assistancePanelVM('/orders/new')).toStrictEqual(blankPanel)
      })
    })

    describe('Given a product page', () => {
      const productSubject = {
        type: AssistanceSubjectType.PRODUCT,
        label: dolodent.name,
        uuid: dolodent.uuid,
        pageUrl: `/products/get/${dolodent.uuid}`
      }

      it('should prefill the product from the detail page', () => {
        productStore.setCurrent({ product: dolodent })
        expect(
          assistancePanelVM(`/products/get/${dolodent.uuid}`)
        ).toStrictEqual({
          ...blankPanel,
          pageSubject: productSubject,
          suggestedCategory: AssistanceRequestCategory.PRODUCT
        })
      })

      it('should prefill the product from the edit page', () => {
        productStore.setCurrent({ product: dolodent })
        expect(
          assistancePanelVM(`/products/edit/${dolodent.uuid}`)
        ).toStrictEqual({
          ...blankPanel,
          pageSubject: productSubject,
          suggestedCategory: AssistanceRequestCategory.PRODUCT
        })
      })
    })

    describe('Given a customer page', () => {
      it('should prefill the customer from the detail page', () => {
        customerStore.setCurrent(elodieDurand)
        expect(
          assistancePanelVM(`/customers/get/${elodieDurand.uuid}`)
        ).toStrictEqual({
          ...blankPanel,
          pageSubject: {
            type: AssistanceSubjectType.CUSTOMER,
            label: `${elodieDurand.firstname} ${elodieDurand.lastname}`,
            uuid: elodieDurand.uuid,
            pageUrl: `/customers/get/${elodieDurand.uuid}`
          },
          suggestedCategory: AssistanceRequestCategory.CUSTOMER
        })
      })
    })

    describe('Given any other page', () => {
      it('should not prefill anything', () => {
        orderStore.setCurrent(orderToPrepare1)
        expect(assistancePanelVM('/assistance')).toStrictEqual(blankPanel)
      })
    })
  })

  describe('Last created request', () => {
    it('should expose the id and reference of the last created request', () => {
      assistanceRequestStore.requestCreated(receivedLabelRequest)
      expect(assistancePanelVM('/assistance')).toStrictEqual({
        ...blankPanel,
        lastCreated: {
          id: receivedLabelRequest.id,
          reference: receivedLabelRequest.reference
        }
      })
    })
  })
})

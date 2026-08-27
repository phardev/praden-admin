import type { Address, Contact } from '@core/entities/order'
import type { CreateManualOrderDTO } from '@core/usecases/order/manual-order-creation/createManualOrder'
import { ManualOrderPaymentMode } from '@core/usecases/order/manual-order-creation/createManualOrder'
import { elodieDurand } from '@utils/testData/customers'
import {
  clickAndCollect,
  deliveryInRelayPointDPD,
  express
} from '@utils/testData/deliveryMethods'
import { dpdRelayPointAlesCentre } from '@utils/testData/dpdRelayPoints'
import { dolodent, ultraLevure } from '@utils/testData/products'
import { buildCreateManualOrderDto } from './buildCreateManualOrderDto'
import type { OrderCreateFormState } from './orderCreateFormState'
import { emptyOrderCreateFormState } from './orderCreateFormState'

describe('Build create manual order DTO', () => {
  const deliveryAddress: Address = {
    firstname: elodieDurand.firstname,
    lastname: elodieDurand.lastname,
    address: '12 rue des Lilas',
    city: 'Alès',
    zip: '30100',
    country: 'France'
  }
  const billingAddress: Address = {
    firstname: elodieDurand.firstname,
    lastname: elodieDurand.lastname,
    address: '3 place du Marché',
    city: 'Nîmes',
    zip: '30000',
    country: 'France'
  }
  const contact: Contact = {
    email: elodieDurand.email,
    phone: elodieDurand.phone
  }

  const baseFormState = (): OrderCreateFormState => {
    return {
      ...emptyOrderCreateFormState(),
      customer: elodieDurand,
      lines: [
        { product: dolodent, quantity: 2 },
        {
          product: ultraLevure,
          quantity: ultraLevure.maxQuantityForOrder!
        }
      ],
      deliveryMethod: express,
      deliveryAddress,
      billingAddress,
      contact
    }
  }

  describe('Given a delivery with the same billing address, when building the DTO, then the billing address is copied from the delivery address', () => {
    it('should build the DTO without prices and with the delivery address duplicated', () => {
      const formState: OrderCreateFormState = {
        ...baseFormState(),
        billingSameAsDelivery: true
      }
      const expectedDTO: CreateManualOrderDTO = {
        customerUuid: elodieDurand.uuid,
        lines: [
          { productUuid: dolodent.uuid, quantity: 2 },
          {
            productUuid: ultraLevure.uuid,
            quantity: ultraLevure.maxQuantityForOrder!
          }
        ],
        deliveryMethodUuid: express.uuid,
        deliveryAddress,
        billingAddress: deliveryAddress,
        contact,
        sendConfirmationEmail: false,
        paymentMode: ManualOrderPaymentMode.AlreadyPaid
      }
      expect(buildCreateManualOrderDto(formState)).toStrictEqual(expectedDTO)
    })
  })

  describe('Given a distinct billing address, when building the DTO, then both addresses are kept', () => {
    it('should keep the delivery and billing addresses distinct', () => {
      const formState: OrderCreateFormState = {
        ...baseFormState(),
        billingSameAsDelivery: false
      }
      const expectedDTO: CreateManualOrderDTO = {
        customerUuid: elodieDurand.uuid,
        lines: [
          { productUuid: dolodent.uuid, quantity: 2 },
          {
            productUuid: ultraLevure.uuid,
            quantity: ultraLevure.maxQuantityForOrder!
          }
        ],
        deliveryMethodUuid: express.uuid,
        deliveryAddress,
        billingAddress,
        contact,
        sendConfirmationEmail: false,
        paymentMode: ManualOrderPaymentMode.AlreadyPaid
      }
      expect(buildCreateManualOrderDto(formState)).toStrictEqual(expectedDTO)
    })
  })

  describe('Given a DPD relay method with a selected point, when building the DTO, then the pickup id and name are included', () => {
    it('should attach the selected relay point id and name', () => {
      const formState: OrderCreateFormState = {
        ...baseFormState(),
        deliveryMethod: deliveryInRelayPointDPD,
        selectedRelayPoint: dpdRelayPointAlesCentre,
        billingSameAsDelivery: true
      }
      const expectedDTO: CreateManualOrderDTO = {
        customerUuid: elodieDurand.uuid,
        lines: [
          { productUuid: dolodent.uuid, quantity: 2 },
          {
            productUuid: ultraLevure.uuid,
            quantity: ultraLevure.maxQuantityForOrder!
          }
        ],
        deliveryMethodUuid: deliveryInRelayPointDPD.uuid,
        deliveryAddress,
        billingAddress: deliveryAddress,
        contact,
        pickupId: dpdRelayPointAlesCentre.id,
        pickupName: dpdRelayPointAlesCentre.name,
        sendConfirmationEmail: false,
        paymentMode: ManualOrderPaymentMode.AlreadyPaid
      }
      expect(buildCreateManualOrderDto(formState)).toStrictEqual(expectedDTO)
    })
  })

  describe('Given click and collect, when building the DTO, then the delivery address is copied from the billing address', () => {
    it('should copy the billing address and combine the picking day with the picking hour', () => {
      const pickingDay = new Date('2026-02-26T00:00:00').getTime()
      const formState: OrderCreateFormState = {
        ...baseFormState(),
        deliveryMethod: clickAndCollect,
        deliveryAddress: emptyOrderCreateFormState().deliveryAddress,
        pickingDate: pickingDay,
        pickingHour: '14:30',
        sendConfirmationEmail: true
      }
      const expectedDTO: CreateManualOrderDTO = {
        customerUuid: elodieDurand.uuid,
        lines: [
          { productUuid: dolodent.uuid, quantity: 2 },
          {
            productUuid: ultraLevure.uuid,
            quantity: ultraLevure.maxQuantityForOrder!
          }
        ],
        deliveryMethodUuid: clickAndCollect.uuid,
        deliveryAddress: billingAddress,
        billingAddress,
        contact,
        pickingDate: new Date('2026-02-26T14:30:00').getTime(),
        sendConfirmationEmail: true,
        paymentMode: ManualOrderPaymentMode.AlreadyPaid
      }
      expect(buildCreateManualOrderDto(formState)).toStrictEqual(expectedDTO)
    })
  })

  describe('Given click and collect without a picking hour, when building the DTO, then no picking date is sent', () => {
    it('should build the DTO without picking date', () => {
      const formState: OrderCreateFormState = {
        ...baseFormState(),
        deliveryMethod: clickAndCollect,
        deliveryAddress: emptyOrderCreateFormState().deliveryAddress,
        pickingDate: new Date('2026-02-26T00:00:00').getTime(),
        pickingHour: undefined
      }
      const expectedDTO: CreateManualOrderDTO = {
        customerUuid: elodieDurand.uuid,
        lines: [
          { productUuid: dolodent.uuid, quantity: 2 },
          {
            productUuid: ultraLevure.uuid,
            quantity: ultraLevure.maxQuantityForOrder!
          }
        ],
        deliveryMethodUuid: clickAndCollect.uuid,
        deliveryAddress: billingAddress,
        billingAddress,
        contact,
        sendConfirmationEmail: false,
        paymentMode: ManualOrderPaymentMode.AlreadyPaid
      }
      expect(buildCreateManualOrderDto(formState)).toStrictEqual(expectedDTO)
    })
  })

  describe('Given a payment mode other than already paid, when building the DTO, then the payment mode is kept', () => {
    it('should build the DTO with the selected payment mode', () => {
      const formState: OrderCreateFormState = {
        ...baseFormState(),
        billingSameAsDelivery: true,
        paymentMode: ManualOrderPaymentMode.PaymentLink
      }
      const expectedDTO: CreateManualOrderDTO = {
        customerUuid: elodieDurand.uuid,
        lines: [
          { productUuid: dolodent.uuid, quantity: 2 },
          {
            productUuid: ultraLevure.uuid,
            quantity: ultraLevure.maxQuantityForOrder!
          }
        ],
        deliveryMethodUuid: express.uuid,
        deliveryAddress,
        billingAddress: deliveryAddress,
        contact,
        sendConfirmationEmail: false,
        paymentMode: ManualOrderPaymentMode.PaymentLink
      }
      expect(buildCreateManualOrderDto(formState)).toStrictEqual(expectedDTO)
    })
  })
})

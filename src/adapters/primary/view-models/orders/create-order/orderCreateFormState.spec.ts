import {
  elodieCart,
  elodieCartReadyToOrder,
  guestCartDetail
} from '@utils/testData/carts'
import { elodieDurand } from '@utils/testData/customers'
import {
  deliveryInRelayPointDPD,
  express
} from '@utils/testData/deliveryMethods'
import {
  canChangeCustomer,
  emptyAddress,
  emptyOrderCreateFormState,
  withCustomer,
  withDeliveryMethod
} from './orderCreateFormState'

describe('Order create form state', () => {
  describe('Can change customer', () => {
    it('should allow changing the customer on a manual order', () => {
      expect(canChangeCustomer(emptyOrderCreateFormState())).toBe(true)
    })

    it('should lock the customer when the cart belongs to a customer', () => {
      expect(
        canChangeCustomer({
          ...emptyOrderCreateFormState(),
          cartUuid: elodieCart.uuid,
          cartOwnedBy: elodieDurand.uuid
        })
      ).toBe(false)
    })

    it('should let the staff choose the customer of a visitor cart', () => {
      expect(
        canChangeCustomer({
          ...emptyOrderCreateFormState(),
          cartUuid: guestCartDetail.uuid
        })
      ).toBe(true)
    })
  })

  describe('Choosing the customer', () => {
    const customerAddress = {
      ...emptyAddress(),
      firstname: elodieDurand.firstname,
      lastname: elodieDurand.lastname
    }

    it('should fill the contact and the addresses with the customer details', () => {
      expect(
        withCustomer(emptyOrderCreateFormState(), elodieDurand)
      ).toStrictEqual({
        ...emptyOrderCreateFormState(),
        customer: elodieDurand,
        contact: { email: elodieDurand.email, phone: elodieDurand.phone },
        deliveryAddress: customerAddress,
        billingAddress: customerAddress
      })
    })

    it('should keep what the visitor left in the cart and complete the rest', () => {
      const visitorAddress = elodieCartReadyToOrder.deliveryAddress!
      const state = {
        ...emptyOrderCreateFormState(),
        cartUuid: guestCartDetail.uuid,
        contact: guestCartDetail.contact!,
        deliveryAddress: visitorAddress
      }
      expect(withCustomer(state, elodieDurand)).toStrictEqual({
        ...state,
        customer: elodieDurand,
        billingAddress: customerAddress
      })
    })
  })

  describe('Delivery method', () => {
    it('should restore the customer address when leaving a relay method', () => {
      const relayAddress = elodieCartReadyToOrder.deliveryAddress!
      const state = withDeliveryMethod(
        {
          ...emptyOrderCreateFormState(),
          customer: elodieDurand,
          deliveryMethod: deliveryInRelayPointDPD,
          selectedRelayPoint: {
            id: elodieCartReadyToOrder.delivery!.pickupId!,
            name: elodieCartReadyToOrder.delivery!.pickupName!,
            address: relayAddress.address,
            zipCode: relayAddress.zip,
            city: relayAddress.city
          },
          deliveryAddress: relayAddress
        },
        express
      )
      expect(state.deliveryAddress).toStrictEqual({
        ...emptyAddress(),
        firstname: elodieDurand.firstname,
        lastname: elodieDurand.lastname
      })
    })
  })
})

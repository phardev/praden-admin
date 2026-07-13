import type { Address, Contact } from '@core/entities/order'
import { priceFormatter } from '@utils/formatters'
import { addTaxToPrice } from '@utils/price'
import { elodieDurand } from '@utils/testData/customers'
import {
  clickAndCollect,
  deliveryInRelayPointDPD,
  express
} from '@utils/testData/deliveryMethods'
import { dpdRelayPointAlesCentre } from '@utils/testData/dpdRelayPoints'
import { productPromotionPercentage } from '@utils/testData/productPromotions'
import { dolodent, ultraLevure } from '@utils/testData/products'
import type { DeliveryMethodChoiceVM } from './deliveryMethodChoicesVM'
import type { OrderCreateFormState } from './orderCreateFormState'
import { emptyOrderCreateFormState } from './orderCreateFormState'
import type { OrderCreateSummaryVM } from './orderCreateSummaryVM'
import { orderCreateSummaryVM } from './orderCreateSummaryVM'

describe('Order create summary VM', () => {
  const NOW = productPromotionPercentage.startDate! + 1
  const address: Address = {
    firstname: elodieDurand.firstname,
    lastname: elodieDurand.lastname,
    address: '12 rue des Lilas',
    city: 'Alès',
    zip: '30100',
    country: 'France'
  }
  const contact: Contact = {
    email: elodieDurand.email,
    phone: elodieDurand.phone
  }

  const expressChoice: DeliveryMethodChoiceVM = {
    uuid: express.uuid,
    name: express.name,
    description: express.description,
    delay: express.delay,
    isClickAndCollect: false,
    fee: express.priceRanges.FRANCE[0].price,
    formattedFee: '6,00 €',
    isFree: false,
    disabled: false,
    disabledReason: undefined
  }

  const clickAndCollectChoice: DeliveryMethodChoiceVM = {
    uuid: clickAndCollect.uuid,
    name: clickAndCollect.name,
    description: clickAndCollect.description,
    delay: undefined,
    isClickAndCollect: true,
    fee: 0,
    formattedFee: '0,00 €',
    isFree: true,
    disabled: false,
    disabledReason: undefined
  }

  const disabledExpressChoice: DeliveryMethodChoiceVM = {
    ...expressChoice,
    fee: undefined,
    formattedFee: undefined,
    disabled: true,
    disabledReason: 'orders.create.delivery.notAvailableForCountry'
  }

  const formatter = priceFormatter('fr-FR', 'EUR')
  const dpdFee = deliveryInRelayPointDPD.priceRanges.FRANCE[0].price
  const dpdFeeWithTax = Math.round(addTaxToPrice(dpdFee, 20))

  const dpdChoice: DeliveryMethodChoiceVM = {
    uuid: deliveryInRelayPointDPD.uuid,
    name: deliveryInRelayPointDPD.name,
    description: deliveryInRelayPointDPD.description,
    delay: deliveryInRelayPointDPD.delay,
    isClickAndCollect: false,
    fee: dpdFee,
    formattedFee: formatter.format(dpdFeeWithTax / 100),
    isFree: false,
    disabled: false,
    disabledReason: undefined
  }

  const validFormState = (): OrderCreateFormState => {
    return {
      ...emptyOrderCreateFormState(),
      customer: elodieDurand,
      lines: [{ product: dolodent, quantity: 2 }],
      deliveryMethod: express,
      deliveryAddress: address,
      billingSameAsDelivery: true,
      contact
    }
  }

  describe('Given an empty form, when getting summary, then all blockers are listed', () => {
    it('should list every blocker and forbid submit', () => {
      const expectedVM: OrderCreateSummaryVM = {
        linesCount: 0,
        formattedLinesTotal: '0,00 €',
        formattedDeliveryFee: undefined,
        formattedTotal: '0,00 €',
        blockers: [
          'orders.create.blockers.selectCustomer',
          'orders.create.blockers.addProducts',
          'orders.create.blockers.selectDeliveryMethod',
          'orders.create.blockers.fillAddresses',
          'orders.create.blockers.fillContact'
        ],
        canSubmit: false
      }
      expect(
        orderCreateSummaryVM(emptyOrderCreateFormState(), undefined, NOW)
      ).toStrictEqual(expectedVM)
    })
  })

  describe('Given a complete form, when getting summary, then totals include the delivery fee with tax', () => {
    it('should compute the totals and allow submit', () => {
      const expectedVM: OrderCreateSummaryVM = {
        linesCount: 2,
        formattedLinesTotal: '11,00 €',
        formattedDeliveryFee: '6,00 €',
        formattedTotal: '17,00 €',
        blockers: [],
        canSubmit: true
      }
      expect(
        orderCreateSummaryVM(validFormState(), expressChoice, NOW)
      ).toStrictEqual(expectedVM)
    })
  })

  describe('Given a line with an active promotion, when getting summary, then totals use the discounted price', () => {
    it('should compute the totals with the discounted line price', () => {
      const formState = {
        ...validFormState(),
        lines: [
          {
            product: dolodent,
            quantity: 2,
            promotions: [productPromotionPercentage]
          }
        ]
      }
      const expectedVM: OrderCreateSummaryVM = {
        linesCount: 2,
        formattedLinesTotal: '9,90 €',
        formattedDeliveryFee: '6,00 €',
        formattedTotal: '15,90 €',
        blockers: [],
        canSubmit: true
      }
      expect(orderCreateSummaryVM(formState, expressChoice, NOW)).toStrictEqual(
        expectedVM
      )
    })
  })

  describe('Given a selected delivery method whose choice is disabled, when getting summary, then submit is blocked', () => {
    it('should block submit until another delivery method is selected', () => {
      const expectedVM: OrderCreateSummaryVM = {
        linesCount: 2,
        formattedLinesTotal: '11,00 €',
        formattedDeliveryFee: undefined,
        formattedTotal: '11,00 €',
        blockers: ['orders.create.blockers.deliveryMethodUnavailable'],
        canSubmit: false
      }
      expect(
        orderCreateSummaryVM(validFormState(), disabledExpressChoice, NOW)
      ).toStrictEqual(expectedVM)
    })
  })

  describe('Given a selected delivery method without a matching choice, when getting summary, then submit is blocked', () => {
    it('should block submit when the choice is missing', () => {
      const expectedVM: OrderCreateSummaryVM = {
        linesCount: 2,
        formattedLinesTotal: '11,00 €',
        formattedDeliveryFee: undefined,
        formattedTotal: '11,00 €',
        blockers: ['orders.create.blockers.deliveryMethodUnavailable'],
        canSubmit: false
      }
      expect(
        orderCreateSummaryVM(validFormState(), undefined, NOW)
      ).toStrictEqual(expectedVM)
    })
  })

  describe('Given a DPD relay method without a selected point, when getting summary, then submit is blocked', () => {
    it('should block submit until a relay point is chosen', () => {
      const formState: OrderCreateFormState = {
        ...validFormState(),
        deliveryMethod: deliveryInRelayPointDPD
      }
      const expectedVM: OrderCreateSummaryVM = {
        linesCount: 2,
        formattedLinesTotal: formatter.format(11),
        formattedDeliveryFee: formatter.format(dpdFeeWithTax / 100),
        formattedTotal: formatter.format(11 + dpdFeeWithTax / 100),
        blockers: ['orders.create.blockers.selectRelayPoint'],
        canSubmit: false
      }
      expect(orderCreateSummaryVM(formState, dpdChoice, NOW)).toStrictEqual(
        expectedVM
      )
    })
  })

  describe('Given a DPD relay method with a selected point, when getting summary, then submit is allowed', () => {
    it('should allow submit once a relay point is chosen', () => {
      const formState: OrderCreateFormState = {
        ...validFormState(),
        deliveryMethod: deliveryInRelayPointDPD,
        selectedRelayPoint: dpdRelayPointAlesCentre
      }
      const expectedVM: OrderCreateSummaryVM = {
        linesCount: 2,
        formattedLinesTotal: formatter.format(11),
        formattedDeliveryFee: formatter.format(dpdFeeWithTax / 100),
        formattedTotal: formatter.format(11 + dpdFeeWithTax / 100),
        blockers: [],
        canSubmit: true
      }
      expect(orderCreateSummaryVM(formState, dpdChoice, NOW)).toStrictEqual(
        expectedVM
      )
    })
  })

  describe('Given an invalid contact email, when getting summary, then contact blocks submit', () => {
    it('should block submit until the email is valid', () => {
      const formState = {
        ...validFormState(),
        contact: { ...contact, email: 'marie@' }
      }
      const expectedVM: OrderCreateSummaryVM = {
        linesCount: 2,
        formattedLinesTotal: '11,00 €',
        formattedDeliveryFee: '6,00 €',
        formattedTotal: '17,00 €',
        blockers: ['orders.create.blockers.fillContact'],
        canSubmit: false
      }
      expect(orderCreateSummaryVM(formState, expressChoice, NOW)).toStrictEqual(
        expectedVM
      )
    })
  })

  describe('Given a line exceeding max quantity, when getting summary, then submit is blocked', () => {
    it('should block submit until quantities are fixed', () => {
      const formState = {
        ...validFormState(),
        lines: [
          {
            product: ultraLevure,
            quantity: ultraLevure.maxQuantityForOrder! + 1
          }
        ]
      }
      const expectedVM: OrderCreateSummaryVM = {
        linesCount: ultraLevure.maxQuantityForOrder! + 1,
        formattedLinesTotal: '33,25 €',
        formattedDeliveryFee: '6,00 €',
        formattedTotal: '39,25 €',
        blockers: ['orders.create.blockers.fixQuantities'],
        canSubmit: false
      }
      expect(orderCreateSummaryVM(formState, expressChoice, NOW)).toStrictEqual(
        expectedVM
      )
    })
  })

  describe('Given click and collect with a billing address and a picking slot, when getting summary, then the delivery address is not required', () => {
    it('should allow submit without a delivery address', () => {
      const formState: OrderCreateFormState = {
        ...validFormState(),
        deliveryMethod: clickAndCollect,
        deliveryAddress: emptyOrderCreateFormState().deliveryAddress,
        billingAddress: address,
        pickingDate: NOW,
        pickingHour: '14:30'
      }
      const expectedVM: OrderCreateSummaryVM = {
        linesCount: 2,
        formattedLinesTotal: '11,00 €',
        formattedDeliveryFee: '0,00 €',
        formattedTotal: '11,00 €',
        blockers: [],
        canSubmit: true
      }
      expect(
        orderCreateSummaryVM(formState, clickAndCollectChoice, NOW)
      ).toStrictEqual(expectedVM)
    })
  })

  describe('Given click and collect with a billing address without a picking hour, when getting summary, then the picking slot blocks submit', () => {
    it('should block submit until a picking day and hour are chosen', () => {
      const formState: OrderCreateFormState = {
        ...validFormState(),
        deliveryMethod: clickAndCollect,
        deliveryAddress: emptyOrderCreateFormState().deliveryAddress,
        billingAddress: address,
        pickingDate: NOW,
        pickingHour: undefined
      }
      const expectedVM: OrderCreateSummaryVM = {
        linesCount: 2,
        formattedLinesTotal: '11,00 €',
        formattedDeliveryFee: '0,00 €',
        formattedTotal: '11,00 €',
        blockers: ['orders.create.blockers.selectPickingSlot'],
        canSubmit: false
      }
      expect(
        orderCreateSummaryVM(formState, clickAndCollectChoice, NOW)
      ).toStrictEqual(expectedVM)
    })
  })

  describe('Given a distinct billing address left empty, when getting summary, then addresses block submit', () => {
    it('should block submit until the billing address is filled', () => {
      const formState: OrderCreateFormState = {
        ...validFormState(),
        billingSameAsDelivery: false
      }
      const expectedVM: OrderCreateSummaryVM = {
        linesCount: 2,
        formattedLinesTotal: '11,00 €',
        formattedDeliveryFee: '6,00 €',
        formattedTotal: '17,00 €',
        blockers: ['orders.create.blockers.fillAddresses'],
        canSubmit: false
      }
      expect(orderCreateSummaryVM(formState, expressChoice, NOW)).toStrictEqual(
        expectedVM
      )
    })
  })
})

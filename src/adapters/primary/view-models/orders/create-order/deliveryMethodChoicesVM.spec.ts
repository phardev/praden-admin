import { priceFormatter } from '@utils/formatters'
import { addTaxToPrice } from '@utils/price'
import { pharmacy } from '@utils/testData/carriers'
import {
  clickAndCollect,
  deliveryInRelayPoint,
  deliveryInRelayPointDPD,
  express
} from '@utils/testData/deliveryMethods'
import {
  christmasFreeShipping,
  freeShippingOver39,
  standardShipping
} from '@utils/testData/deliveryPriceRules'
import { anaca3Minceur, dolodent } from '@utils/testData/products'
import type { DeliveryMethodChoiceVM } from './deliveryMethodChoicesVM'
import { deliveryMethodChoicesVM } from './deliveryMethodChoicesVM'

describe('Delivery method choices VM', () => {
  const NOW = christmasFreeShipping.endDate! + 1
  const DELIVERY_TAX_RATE = 20
  const formatter = priceFormatter('fr-FR', 'EUR')
  const formattedFee = (fee: number) =>
    formatter.format(Math.round(addTaxToPrice(fee, DELIVERY_TAX_RATE)) / 100)

  describe('Given no lines, when getting choices, then all methods are disabled', () => {
    it('should disable every method until products are added', () => {
      const expectedVM: Array<DeliveryMethodChoiceVM> = [
        {
          uuid: clickAndCollect.uuid,
          name: clickAndCollect.name,
          description: clickAndCollect.description,
          delay: undefined,
          isClickAndCollect: true,
          fee: undefined,
          formattedFee: undefined,
          isFree: false,
          disabled: true,
          disabledReason: 'orders.create.delivery.addProductsFirst'
        },
        {
          uuid: express.uuid,
          name: express.name,
          description: express.description,
          delay: express.delay,
          isClickAndCollect: false,
          fee: undefined,
          formattedFee: undefined,
          isFree: false,
          disabled: true,
          disabledReason: 'orders.create.delivery.addProductsFirst'
        },
        {
          uuid: deliveryInRelayPoint.uuid,
          name: deliveryInRelayPoint.name,
          description: deliveryInRelayPoint.description,
          delay: deliveryInRelayPoint.delay,
          isClickAndCollect: false,
          fee: undefined,
          formattedFee: undefined,
          isFree: false,
          disabled: true,
          disabledReason: 'orders.create.delivery.addProductsFirst'
        }
      ]
      expect(
        deliveryMethodChoicesVM(
          [clickAndCollect, express, deliveryInRelayPoint],
          [],
          [],
          'France',
          NOW
        )
      ).toStrictEqual(expectedVM)
    })
  })

  describe('Given lines, when getting choices, then click and collect is free', () => {
    it('should price click and collect at zero', () => {
      const expectedVM: Array<DeliveryMethodChoiceVM> = [
        {
          uuid: clickAndCollect.uuid,
          name: clickAndCollect.name,
          description: clickAndCollect.description,
          delay: undefined,
          isClickAndCollect: true,
          fee: 0,
          formattedFee: '0,00\u00A0€',
          isFree: true,
          disabled: false,
          disabledReason: undefined
        }
      ]
      expect(
        deliveryMethodChoicesVM(
          [clickAndCollect],
          [],
          [{ product: anaca3Minceur, quantity: 1 }],
          'France',
          NOW
        )
      ).toStrictEqual(expectedVM)
    })
  })

  describe('Given lines, when getting choices, then the Colissimo relay method is available', () => {
    it('should enable and price the Colissimo relay method', () => {
      const expectedVM: Array<DeliveryMethodChoiceVM> = [
        {
          uuid: deliveryInRelayPoint.uuid,
          name: deliveryInRelayPoint.name,
          description: deliveryInRelayPoint.description,
          delay: deliveryInRelayPoint.delay,
          isClickAndCollect: false,
          fee: deliveryInRelayPoint.priceRanges.FRANCE[0].price,
          formattedFee: formattedFee(
            deliveryInRelayPoint.priceRanges.FRANCE[0].price
          ),
          isFree: false,
          disabled: false,
          disabledReason: undefined
        }
      ]
      expect(
        deliveryMethodChoicesVM(
          [deliveryInRelayPoint],
          [],
          [{ product: anaca3Minceur, quantity: 1 }],
          'France',
          NOW
        )
      ).toStrictEqual(expectedVM)
    })
  })

  describe('Given lines, when getting choices, then relay methods of unsupported carriers stay disabled', () => {
    it('should keep unsupported relay methods disabled', () => {
      const unsupportedRelayMethod = {
        ...deliveryInRelayPoint,
        uuid: 'unsupported-relay',
        carrier: pharmacy
      }
      const expectedVM: Array<DeliveryMethodChoiceVM> = [
        {
          uuid: unsupportedRelayMethod.uuid,
          name: unsupportedRelayMethod.name,
          description: unsupportedRelayMethod.description,
          delay: unsupportedRelayMethod.delay,
          isClickAndCollect: false,
          fee: undefined,
          formattedFee: undefined,
          isFree: false,
          disabled: true,
          disabledReason: 'orders.create.delivery.relayNotAvailable'
        }
      ]
      expect(
        deliveryMethodChoicesVM(
          [unsupportedRelayMethod],
          [],
          [{ product: anaca3Minceur, quantity: 1 }],
          'France',
          NOW
        )
      ).toStrictEqual(expectedVM)
    })
  })

  describe('Given lines, when getting choices, then the DPD relay method is available', () => {
    it('should enable and price the DPD relay method', () => {
      const expectedVM: Array<DeliveryMethodChoiceVM> = [
        {
          uuid: deliveryInRelayPointDPD.uuid,
          name: deliveryInRelayPointDPD.name,
          description: deliveryInRelayPointDPD.description,
          delay: deliveryInRelayPointDPD.delay,
          isClickAndCollect: false,
          fee: deliveryInRelayPointDPD.priceRanges.FRANCE[0].price,
          formattedFee: formattedFee(
            deliveryInRelayPointDPD.priceRanges.FRANCE[0].price
          ),
          isFree: false,
          disabled: false,
          disabledReason: undefined
        }
      ]
      expect(
        deliveryMethodChoicesVM(
          [deliveryInRelayPointDPD],
          [],
          [{ product: anaca3Minceur, quantity: 1 }],
          'France',
          NOW
        )
      ).toStrictEqual(expectedVM)
    })
  })

  describe('Given a light basket, when getting choices, then uses the first weight range for the country', () => {
    it('should price the delivery with the first weight range', () => {
      const expectedVM: Array<DeliveryMethodChoiceVM> = [
        {
          uuid: express.uuid,
          name: express.name,
          description: express.description,
          delay: express.delay,
          isClickAndCollect: false,
          fee: express.priceRanges.FRANCE[0].price,
          formattedFee: formattedFee(express.priceRanges.FRANCE[0].price),
          isFree: false,
          disabled: false,
          disabledReason: undefined
        }
      ]
      expect(
        deliveryMethodChoicesVM(
          [express],
          [],
          [{ product: anaca3Minceur, quantity: 1 }],
          'France',
          NOW
        )
      ).toStrictEqual(expectedVM)
    })
  })

  describe('Given a heavier basket, when getting choices, then uses the matching weight range', () => {
    it('should price the delivery with the matching weight range', () => {
      const expectedVM: Array<DeliveryMethodChoiceVM> = [
        {
          uuid: express.uuid,
          name: express.name,
          description: express.description,
          delay: express.delay,
          isClickAndCollect: false,
          fee: express.priceRanges.FRANCE[1].price,
          formattedFee: formattedFee(express.priceRanges.FRANCE[1].price),
          isFree: false,
          disabled: false,
          disabledReason: undefined
        }
      ]
      expect(
        deliveryMethodChoicesVM(
          [express],
          [],
          [{ product: anaca3Minceur, quantity: 3 }],
          'France',
          NOW
        )
      ).toStrictEqual(expectedVM)
    })
  })

  describe('Given another country, when getting choices, then uses the country price ranges', () => {
    it('should price the delivery with the country ranges', () => {
      const expectedVM: Array<DeliveryMethodChoiceVM> = [
        {
          uuid: express.uuid,
          name: express.name,
          description: express.description,
          delay: express.delay,
          isClickAndCollect: false,
          fee: express.priceRanges.BELGIQUE[0].price,
          formattedFee: formattedFee(express.priceRanges.BELGIQUE[0].price),
          isFree: false,
          disabled: false,
          disabledReason: undefined
        }
      ]
      expect(
        deliveryMethodChoicesVM(
          [express],
          [],
          [{ product: anaca3Minceur, quantity: 1 }],
          'Belgique',
          NOW
        )
      ).toStrictEqual(expectedVM)
    })
  })

  describe('Given a country without price ranges, when getting choices, then the method is disabled', () => {
    it('should disable the method for the country', () => {
      const expectedVM: Array<DeliveryMethodChoiceVM> = [
        {
          uuid: express.uuid,
          name: express.name,
          description: express.description,
          delay: express.delay,
          isClickAndCollect: false,
          fee: undefined,
          formattedFee: undefined,
          isFree: false,
          disabled: true,
          disabledReason: 'orders.create.delivery.notAvailableForCountry'
        }
      ]
      expect(
        deliveryMethodChoicesVM(
          [express],
          [],
          [{ product: anaca3Minceur, quantity: 1 }],
          'Espagne',
          NOW
        )
      ).toStrictEqual(expectedVM)
    })
  })

  describe('Given an active matching rule, when getting choices, then the rule price applies', () => {
    it('should price the delivery with the rule price', () => {
      const rule = { ...standardShipping, deliveryMethodUuid: express.uuid }
      const expectedVM: Array<DeliveryMethodChoiceVM> = [
        {
          uuid: express.uuid,
          name: express.name,
          description: express.description,
          delay: express.delay,
          isClickAndCollect: false,
          fee: standardShipping.price,
          formattedFee: formattedFee(standardShipping.price),
          isFree: false,
          disabled: false,
          disabledReason: undefined
        }
      ]
      expect(
        deliveryMethodChoicesVM(
          [express],
          [rule],
          [{ product: anaca3Minceur, quantity: 1 }],
          'France',
          NOW
        )
      ).toStrictEqual(expectedVM)
    })
  })

  describe('Given two matching rules, when getting choices, then the lowest priority rule applies first', () => {
    it('should apply the rule with the lowest priority', () => {
      const freeRule = {
        ...freeShippingOver39,
        deliveryMethodUuid: express.uuid
      }
      const standardRule = {
        ...standardShipping,
        deliveryMethodUuid: express.uuid
      }
      const expectedVM: Array<DeliveryMethodChoiceVM> = [
        {
          uuid: express.uuid,
          name: express.name,
          description: express.description,
          delay: express.delay,
          isClickAndCollect: false,
          fee: standardShipping.price,
          formattedFee: formattedFee(standardShipping.price),
          isFree: false,
          disabled: false,
          disabledReason: undefined
        }
      ]
      expect(
        deliveryMethodChoicesVM(
          [express],
          [freeRule, standardRule],
          [{ product: anaca3Minceur, quantity: 5 }],
          'France',
          NOW
        )
      ).toStrictEqual(expectedVM)
    })
  })

  describe('Given an expired rule, when getting choices, then falls back to the price ranges', () => {
    it('should ignore the expired rule', () => {
      const expiredRule = {
        ...christmasFreeShipping,
        deliveryMethodUuid: express.uuid
      }
      const expectedVM: Array<DeliveryMethodChoiceVM> = [
        {
          uuid: express.uuid,
          name: express.name,
          description: express.description,
          delay: express.delay,
          isClickAndCollect: false,
          fee: express.priceRanges.FRANCE[0].price,
          formattedFee: formattedFee(express.priceRanges.FRANCE[0].price),
          isFree: false,
          disabled: false,
          disabledReason: undefined
        }
      ]
      expect(
        deliveryMethodChoicesVM(
          [express],
          [expiredRule],
          [{ product: anaca3Minceur, quantity: 1 }],
          'France',
          NOW
        )
      ).toStrictEqual(expectedVM)
    })
  })

  describe('Given a medicine in the basket, when getting choices, then rules do not apply', () => {
    it('should ignore rules when the basket contains a medicine', () => {
      const rule = { ...standardShipping, deliveryMethodUuid: express.uuid }
      const expectedVM: Array<DeliveryMethodChoiceVM> = [
        {
          uuid: express.uuid,
          name: express.name,
          description: express.description,
          delay: express.delay,
          isClickAndCollect: false,
          fee: express.priceRanges.FRANCE[1].price,
          formattedFee: formattedFee(express.priceRanges.FRANCE[1].price),
          isFree: false,
          disabled: false,
          disabledReason: undefined
        }
      ]
      expect(
        deliveryMethodChoicesVM(
          [express],
          [rule],
          [{ product: dolodent, quantity: 1 }],
          'France',
          NOW
        )
      ).toStrictEqual(expectedVM)
    })
  })
})

import {
  productPromotionFixed,
  productPromotionPercentage
} from '@utils/testData/productPromotions'
import { chamomilla, dolodent, ultraLevure } from '@utils/testData/products'
import type { OrderCreateLineVM } from './orderCreateLinesVM'
import { orderCreateLinesVM } from './orderCreateLinesVM'

describe('Order create lines VM', () => {
  const NOW = productPromotionPercentage.startDate! + 1

  describe('Given no lines, when getting VM, then returns no items', () => {
    it('should return an empty array', () => {
      expect(orderCreateLinesVM([], NOW)).toStrictEqual([])
    })
  })

  describe('Given a line within limits, when getting VM, then formats prices with tax', () => {
    it('should format unit and total prices with tax', () => {
      const expectedVM: Array<OrderCreateLineVM> = [
        {
          productUuid: dolodent.uuid,
          name: dolodent.name,
          ean13: dolodent.ean13,
          miniature: dolodent.miniature,
          quantity: 2,
          availableStock: dolodent.availableStock,
          maxQuantityForOrder: undefined,
          formattedUnitPrice: '5,50\u00A0€',
          formattedLineTotal: '11,00\u00A0€',
          hasPromotion: false,
          maxQuantityError: false,
          unavailable: false
        }
      ]
      expect(
        orderCreateLinesVM([{ product: dolodent, quantity: 2 }], NOW)
      ).toStrictEqual(expectedVM)
    })
  })

  describe('Given a line with an active percentage promotion, when getting VM, then prices are discounted', () => {
    it('should discount the unit and total prices', () => {
      const expectedVM: Array<OrderCreateLineVM> = [
        {
          productUuid: dolodent.uuid,
          name: dolodent.name,
          ean13: dolodent.ean13,
          miniature: dolodent.miniature,
          quantity: 2,
          availableStock: dolodent.availableStock,
          maxQuantityForOrder: undefined,
          formattedUnitPrice: '4,95\u00A0€',
          formattedLineTotal: '9,90\u00A0€',
          hasPromotion: true,
          maxQuantityError: false,
          unavailable: false
        }
      ]
      expect(
        orderCreateLinesVM(
          [
            {
              product: dolodent,
              quantity: 2,
              promotions: [productPromotionPercentage]
            }
          ],
          NOW
        )
      ).toStrictEqual(expectedVM)
    })
  })

  describe('Given a line with a fixed promotion, when getting VM, then the TTC amount is deduced', () => {
    it('should deduce the fixed TTC amount from the unit price', () => {
      const expectedVM: Array<OrderCreateLineVM> = [
        {
          productUuid: dolodent.uuid,
          name: dolodent.name,
          ean13: dolodent.ean13,
          miniature: dolodent.miniature,
          quantity: 1,
          availableStock: dolodent.availableStock,
          maxQuantityForOrder: undefined,
          formattedUnitPrice: '4,40\u00A0€',
          formattedLineTotal: '4,40\u00A0€',
          hasPromotion: true,
          maxQuantityError: false,
          unavailable: false
        }
      ]
      expect(
        orderCreateLinesVM(
          [
            {
              product: dolodent,
              quantity: 1,
              promotions: [productPromotionFixed]
            }
          ],
          NOW
        )
      ).toStrictEqual(expectedVM)
    })
  })

  describe('Given a line with an ended promotion, when getting VM, then the catalog price applies', () => {
    it('should ignore the ended promotion', () => {
      const expectedVM: Array<OrderCreateLineVM> = [
        {
          productUuid: dolodent.uuid,
          name: dolodent.name,
          ean13: dolodent.ean13,
          miniature: dolodent.miniature,
          quantity: 1,
          availableStock: dolodent.availableStock,
          maxQuantityForOrder: undefined,
          formattedUnitPrice: '5,50\u00A0€',
          formattedLineTotal: '5,50\u00A0€',
          hasPromotion: false,
          maxQuantityError: false,
          unavailable: false
        }
      ]
      expect(
        orderCreateLinesVM(
          [
            {
              product: dolodent,
              quantity: 1,
              promotions: [productPromotionPercentage]
            }
          ],
          productPromotionPercentage.endDate! + 1
        )
      ).toStrictEqual(expectedVM)
    })
  })

  describe('Given a line exceeding max quantity, when getting VM, then flags the error', () => {
    it('should flag the max quantity error', () => {
      const quantity = ultraLevure.maxQuantityForOrder! + 1
      const expectedVM: Array<OrderCreateLineVM> = [
        {
          productUuid: ultraLevure.uuid,
          name: ultraLevure.name,
          ean13: ultraLevure.ean13,
          miniature: ultraLevure.miniature,
          quantity,
          availableStock: ultraLevure.availableStock,
          maxQuantityForOrder: ultraLevure.maxQuantityForOrder,
          formattedUnitPrice: '4,75\u00A0€',
          formattedLineTotal: '33,25\u00A0€',
          hasPromotion: false,
          maxQuantityError: true,
          unavailable: false
        }
      ]
      expect(
        orderCreateLinesVM([{ product: ultraLevure, quantity }], NOW)
      ).toStrictEqual(expectedVM)
    })
  })

  describe('Given a backend violation for a line, when getting VM, then flags the line with the backend max', () => {
    it('should flag the line with the max returned by the backend', () => {
      const backendMax = 1
      const expectedVM: Array<OrderCreateLineVM> = [
        {
          productUuid: dolodent.uuid,
          name: dolodent.name,
          ean13: dolodent.ean13,
          miniature: dolodent.miniature,
          quantity: 2,
          availableStock: dolodent.availableStock,
          maxQuantityForOrder: backendMax,
          formattedUnitPrice: '5,50\u00A0€',
          formattedLineTotal: '11,00\u00A0€',
          hasPromotion: false,
          maxQuantityError: true,
          unavailable: false
        }
      ]
      expect(
        orderCreateLinesVM([{ product: dolodent, quantity: 2 }], NOW, [
          {
            productUuid: dolodent.uuid,
            requestedQuantity: 2,
            maxQuantityForOrder: backendMax
          }
        ])
      ).toStrictEqual(expectedVM)
    })
  })

  describe('Given a line exceeding available stock, when getting VM, then flags it as unavailable', () => {
    it('should flag the line as unavailable', () => {
      const quantity = chamomilla.availableStock + 1
      const expectedVM: Array<OrderCreateLineVM> = [
        {
          productUuid: chamomilla.uuid,
          name: chamomilla.name,
          ean13: chamomilla.ean13,
          miniature: chamomilla.miniature,
          quantity,
          availableStock: chamomilla.availableStock,
          maxQuantityForOrder: undefined,
          formattedUnitPrice: '6,90\u00A0€',
          formattedLineTotal: '13,80\u00A0€',
          hasPromotion: false,
          maxQuantityError: false,
          unavailable: true
        }
      ]
      expect(
        orderCreateLinesVM([{ product: chamomilla, quantity }], NOW)
      ).toStrictEqual(expectedVM)
    })
  })
})

import { ReductionType } from '@core/entities/promotion'
import {
  productPromotionFixed,
  productPromotionPercentage,
  productPromotionWin
} from '@utils/testData/productPromotions'
import { dolodent } from '@utils/testData/products'
import {
  promotionalUnitPriceWithTax,
  selectApplicablePromotion
} from './productPromotionPricing'

describe('Product promotion pricing', () => {
  const NOW = productPromotionPercentage.startDate! + 1

  describe('Given no promotions, when selecting, then nothing applies', () => {
    it('should select nothing without promotions', () => {
      expect(selectApplicablePromotion(undefined, NOW)).toStrictEqual(undefined)
    })
  })

  describe('Given an ended promotion, when selecting, then nothing applies', () => {
    it('should ignore the ended promotion', () => {
      expect(
        selectApplicablePromotion(
          [productPromotionPercentage],
          productPromotionPercentage.endDate! + 1
        )
      ).toStrictEqual(undefined)
    })
  })

  describe('Given a promotion not started yet, when selecting, then nothing applies', () => {
    it('should ignore the promotion not started', () => {
      expect(
        selectApplicablePromotion(
          [productPromotionPercentage],
          productPromotionPercentage.startDate! - 1
        )
      ).toStrictEqual(undefined)
    })
  })

  describe('Given a promotion starting now, when selecting, then it applies', () => {
    it('should keep the promotion starting exactly now', () => {
      expect(
        selectApplicablePromotion(
          [productPromotionPercentage],
          productPromotionPercentage.startDate!
        )
      ).toStrictEqual(productPromotionPercentage)
    })
  })

  describe('Given a percentage and a fixed promotion, when selecting, then the percentage wins', () => {
    it('should prefer the percentage promotion', () => {
      expect(
        selectApplicablePromotion(
          [productPromotionFixed, productPromotionPercentage],
          NOW
        )
      ).toStrictEqual(productPromotionPercentage)
    })
  })

  describe('Given two percentage promotions, when selecting, then the highest amount wins', () => {
    it('should select the highest percentage', () => {
      const higherPercentage = {
        ...productPromotionPercentage,
        uuid: 'product-promotion-percentage-higher',
        amount: productPromotionPercentage.amount + 1
      }
      expect(
        selectApplicablePromotion(
          [productPromotionPercentage, higherPercentage],
          NOW
        )
      ).toStrictEqual(higherPercentage)
    })
  })

  describe('Given two fixed promotions, when selecting, then the highest amount wins', () => {
    it('should select the highest fixed', () => {
      const higherFixed = {
        ...productPromotionFixed,
        uuid: 'product-promotion-fixed-higher',
        amount: productPromotionFixed.amount + 1
      }
      expect(
        selectApplicablePromotion([productPromotionFixed, higherFixed], NOW)
      ).toStrictEqual(higherFixed)
    })
  })

  describe('Given a manual and a WIN promotion, when selecting, then the manual wins', () => {
    it('should prefer the manual promotion over WIN', () => {
      expect(
        selectApplicablePromotion(
          [productPromotionWin, productPromotionFixed],
          NOW
        )
      ).toStrictEqual(productPromotionFixed)
    })
  })

  describe('Given only WIN promotions, when selecting, then the most recent wins', () => {
    it('should select the most recent WIN promotion', () => {
      const olderWin = {
        ...productPromotionWin,
        uuid: 'product-promotion-win-older',
        createdAt: productPromotionWin.createdAt! - 1000
      }
      expect(
        selectApplicablePromotion([olderWin, productPromotionWin], NOW)
      ).toStrictEqual(productPromotionWin)
    })
  })

  describe('Given no applicable promotion, when pricing, then the catalog price applies', () => {
    it('should price with tax without discount', () => {
      expect(promotionalUnitPriceWithTax(dolodent, undefined)).toStrictEqual(
        550
      )
    })
  })

  describe('Given a percentage promotion, when pricing, then the discounted price applies', () => {
    it('should discount the price by the percentage before adding tax', () => {
      expect(
        promotionalUnitPriceWithTax(dolodent, productPromotionPercentage)
      ).toStrictEqual(495)
    })
  })

  describe('Given a fixed promotion, when pricing, then the TTC amount is deduced', () => {
    it('should deduce the fixed TTC amount from the price', () => {
      expect(
        promotionalUnitPriceWithTax(dolodent, productPromotionFixed)
      ).toStrictEqual(440)
    })
  })

  describe('Given a fixed promotion larger than the price, when pricing, then the price is floored at zero', () => {
    it('should floor the discounted price at zero', () => {
      const hugeFixed = {
        ...productPromotionFixed,
        amount: dolodent.priceWithoutTax * 10
      }
      expect(promotionalUnitPriceWithTax(dolodent, hugeFixed)).toStrictEqual(0)
    })
  })

  describe('Given a WIN promotion typed fixed, when pricing, then it discounts like any fixed promotion', () => {
    it('should apply the WIN fixed discount', () => {
      const winFixed = {
        ...productPromotionWin,
        type: ReductionType.Fixed,
        amount: productPromotionFixed.amount
      }
      expect(promotionalUnitPriceWithTax(dolodent, winFixed)).toStrictEqual(440)
    })
  })
})

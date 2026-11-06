import { FakeDateProvider } from '@adapters/secondary/date-providers/FakeDateProvider'
import { ShowcaseKind, ShowcaseProduct } from '@core/entities/homepageShowcase'
import { Product } from '@core/entities/product'
import { useHomepageShowcaseStore } from '@store/homepageShowcaseStore'
import { useSearchStore } from '@store/searchStore'
import {
  toShowcaseProduct,
  twentyPercentUntilEndOfNovember,
  twoEurosFromBlackFriday
} from '@utils/testData/homepageShowcases'
import {
  anaca3Minceur,
  chamomilla,
  dolodent,
  ultraLevure
} from '@utils/testData/products'
import { createPinia, setActivePinia } from 'pinia'
import {
  HOMEPAGE_SHOWCASE_SEARCH_NAMESPACE,
  homepageShowcaseFormVM,
  ShowcaseItemVisibility,
  ShowcasePromotionStatus
} from './homepageShowcaseFormVM'

const NOW = new Date('2026-11-10T12:00:00Z').getTime()

const productNumbered = (product: Product, index: number): Product => ({
  ...product,
  uuid: `${product.uuid}-${index}`
})

describe('Homepage showcase form VM', () => {
  let dateProvider: FakeDateProvider

  beforeEach(() => {
    setActivePinia(createPinia())
    dateProvider = new FakeDateProvider()
    dateProvider.feedWith(NOW)
  })

  describe('Pharmacist selection', () => {
    const kind = ShowcaseKind.PharmacistSelection

    it('should list the chosen products, all visible on the homepage', () => {
      givenShowcase(kind, toShowcaseProduct(dolodent))
      expect(whenBuildingVM(kind).items).toStrictEqual([
        {
          uuid: dolodent.uuid,
          name: dolodent.name,
          miniature: dolodent.miniature,
          price: new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR'
          }).format(
            (dolodent.priceWithoutTax * (1 + dolodent.percentTaxRate / 100)) /
              100
          ),
          promotion: undefined,
          visibility: ShowcaseItemVisibility.Visible
        }
      ])
    })

    it('should never announce the block as hidden', () => {
      givenShowcase(kind)
      expect(whenBuildingVM(kind).isHiddenOnShop).toBe(false)
    })
  })

  describe('Homepage promotions', () => {
    const kind = ShowcaseKind.HomepagePromotions

    it('should show the discount and end date of a promotion in progress', () => {
      givenShowcase(
        kind,
        toShowcaseProduct(dolodent, [twentyPercentUntilEndOfNovember])
      )
      expect(whenBuildingVM(kind).items[0].promotion).toStrictEqual({
        status: ShowcasePromotionStatus.InProgress,
        discount: '-20 %',
        date: '30 nov.'
      })
    })

    it('should show the start date of an upcoming promotion', () => {
      givenShowcase(
        kind,
        toShowcaseProduct(dolodent, [twoEurosFromBlackFriday])
      )
      expect(whenBuildingVM(kind).items[0].promotion).toStrictEqual({
        status: ShowcasePromotionStatus.Upcoming,
        discount: '-2,00 €',
        date: '27 nov.'
      })
    })

    it('should not display a product whose promotion has not started', () => {
      givenShowcase(
        kind,
        toShowcaseProduct(dolodent, [twoEurosFromBlackFriday])
      )
      expect(whenBuildingVM(kind).items[0].visibility).toBe(
        ShowcaseItemVisibility.NotInPromotion
      )
    })

    it('should not display a product without promotion', () => {
      givenShowcase(kind, toShowcaseProduct(dolodent))
      expect(whenBuildingVM(kind).items[0].visibility).toBe(
        ShowcaseItemVisibility.NotInPromotion
      )
    })

    it('should keep the products beyond the homepage limit out of the homepage', () => {
      const products = [0, 1, 2, 3, 4, 5, 6].map((index) =>
        toShowcaseProduct(productNumbered(dolodent, index), [
          twentyPercentUntilEndOfNovember
        ])
      )
      givenShowcase(kind, ...products)
      expect(
        whenBuildingVM(kind).items.map((item) => item.visibility)
      ).toStrictEqual([
        ...Array(6).fill(ShowcaseItemVisibility.Visible),
        ShowcaseItemVisibility.BeyondLimit
      ])
    })

    it('should not count a hidden product against the homepage limit', () => {
      const products = [0, 1, 2, 3, 4, 5].map((index) =>
        toShowcaseProduct(productNumbered(dolodent, index), [
          twentyPercentUntilEndOfNovember
        ])
      )
      givenShowcase(kind, toShowcaseProduct(chamomilla), ...products)
      expect(whenBuildingVM(kind).visibleCount).toBe(products.length)
    })

    it('should count the chosen products', () => {
      givenShowcase(
        kind,
        toShowcaseProduct(chamomilla),
        toShowcaseProduct(dolodent, [twentyPercentUntilEndOfNovember])
      )
      expect(whenBuildingVM(kind).selectedCount).toBe(2)
    })

    it('should announce the block as hidden when no product is displayed', () => {
      givenShowcase(kind, toShowcaseProduct(chamomilla))
      expect(whenBuildingVM(kind).isHiddenOnShop).toBe(true)
    })

    it('should not announce the block as hidden when a product is displayed', () => {
      givenShowcase(
        kind,
        toShowcaseProduct(dolodent, [twentyPercentUntilEndOfNovember])
      )
      expect(whenBuildingVM(kind).isHiddenOnShop).toBe(false)
    })

    it('should badge a product added from the search with its promotion', () => {
      givenShowcase(kind)
      givenSearchResults(kind, {
        ...ultraLevure,
        promotions: [twentyPercentUntilEndOfNovember]
      })
      const vm = whenBuildingVM(kind)
      vm.addProduct(ultraLevure.uuid)
      expect(vm.items[0].promotion?.status).toBe(
        ShowcasePromotionStatus.InProgress
      )
    })
  })

  describe('Editing', () => {
    const kind = ShowcaseKind.HomepagePromotions

    it('should add a product found in the search', () => {
      givenShowcase(kind, toShowcaseProduct(dolodent))
      givenSearchResults(kind, ultraLevure)
      const vm = whenBuildingVM(kind)
      vm.addProduct(ultraLevure.uuid)
      expect(vm.getProductUuids()).toStrictEqual([
        dolodent.uuid,
        ultraLevure.uuid
      ])
    })

    it('should remove a product', () => {
      givenShowcase(
        kind,
        toShowcaseProduct(dolodent),
        toShowcaseProduct(chamomilla)
      )
      const vm = whenBuildingVM(kind)
      vm.removeProduct(dolodent.uuid)
      expect(vm.getProductUuids()).toStrictEqual([chamomilla.uuid])
    })

    it('should move a product', () => {
      givenShowcase(
        kind,
        toShowcaseProduct(dolodent),
        toShowcaseProduct(chamomilla),
        toShowcaseProduct(anaca3Minceur)
      )
      const vm = whenBuildingVM(kind)
      vm.reorder(2, 0)
      expect(vm.getProductUuids()).toStrictEqual([
        anaca3Minceur.uuid,
        dolodent.uuid,
        chamomilla.uuid
      ])
    })

    it('should have no change right after loading', () => {
      givenShowcase(kind, toShowcaseProduct(dolodent))
      expect(whenBuildingVM(kind).hasChanges).toBe(false)
    })

    it('should have changes after a product is removed', () => {
      givenShowcase(kind, toShowcaseProduct(dolodent))
      const vm = whenBuildingVM(kind)
      vm.removeProduct(dolodent.uuid)
      expect(vm.hasChanges).toBe(true)
    })

    it('should come back to the saved showcase on reset', () => {
      givenShowcase(kind, toShowcaseProduct(dolodent))
      const vm = whenBuildingVM(kind)
      vm.removeProduct(dolodent.uuid)
      vm.reset()
      expect(vm.hasChanges).toBe(false)
    })

    it('should give the products to save in the chosen order', () => {
      const promoted = toShowcaseProduct(dolodent, [
        twentyPercentUntilEndOfNovember
      ])
      givenShowcase(kind, promoted, toShowcaseProduct(chamomilla))
      const vm = whenBuildingVM(kind)
      vm.reorder(1, 0)
      expect(vm.getProducts()).toStrictEqual([
        toShowcaseProduct(chamomilla),
        promoted
      ])
    })

    it('should keep each showcase form apart', () => {
      givenShowcase(kind, toShowcaseProduct(dolodent))
      givenShowcase(
        ShowcaseKind.PharmacistSelection,
        toShowcaseProduct(chamomilla)
      )
      whenBuildingVM(kind).removeProduct(dolodent.uuid)
      expect(
        whenBuildingVM(ShowcaseKind.PharmacistSelection).getProductUuids()
      ).toStrictEqual([chamomilla.uuid])
    })

    it('should reflect a failed save', () => {
      useHomepageShowcaseStore().setError('Failed to update showcase')
      expect(whenBuildingVM(kind).hasSaveFailed).toBe(true)
    })

    it('should reflect the loading state', () => {
      useHomepageShowcaseStore().startLoading()
      expect(whenBuildingVM(kind).isLoading).toBe(true)
    })
  })

  const givenShowcase = (
    kind: ShowcaseKind,
    ...products: Array<ShowcaseProduct>
  ) => {
    useHomepageShowcaseStore().setShowcase(kind, products)
  }

  const givenSearchResults = (kind: ShowcaseKind, ...products: Array<any>) => {
    useSearchStore().set(HOMEPAGE_SHOWCASE_SEARCH_NAMESPACE(kind), products)
  }

  const whenBuildingVM = (kind: ShowcaseKind) =>
    homepageShowcaseFormVM(kind, dateProvider)
})

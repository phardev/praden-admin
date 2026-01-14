import { Header } from '@adapters/primary/view-models/preparations/get-orders-to-prepare/getPreparationsVM'
import { ProductStatus } from '@core/entities/product'
import { useProductStore } from '@store/productStore'
import { useSearchStore } from '@store/searchStore'
import {
  dolodentListItem,
  productWithForbiddenPromotionListItem,
  productWithoutCategoryListItem,
  productWithoutLaboratoryListItem,
  ultraLevureListItem
} from '@utils/testData/fixtures/products/productListItems'
import {
  dolodent,
  productWithForbiddenPromotion,
  productWithoutCategory,
  productWithoutLaboratory,
  ultraLevure
} from '@utils/testData/products'
import { createPinia, setActivePinia } from 'pinia'
import { GetProductsVM, getProductsVM } from './getProductsVM'

describe('Get products VM', () => {
  let productStore: any
  let searchStore: any
  const key = 'list-products'
  let expectedVM: Partial<GetProductsVM>

  const expectedHeaders: Array<Header> = [
    {
      name: 'Image',
      value: 'img'
    },
    {
      name: 'Nom',
      value: 'name'
    },
    {
      name: 'Référence',
      value: 'reference'
    },
    {
      name: 'Laboratoire',
      value: 'laboratory'
    },
    {
      name: 'Catégories',
      value: 'categories'
    },
    {
      name: 'Prix HT',
      value: 'priceWithoutTax'
    },
    {
      name: 'Prix TTC',
      value: 'priceWithTax'
    },
    {
      name: 'Stock',
      value: 'availableStock'
    },
    {
      name: 'Statut',
      value: 'isActive'
    },
    {
      name: 'Promotions',
      value: 'arePromotionsAllowed'
    }
  ]

  beforeEach(() => {
    setActivePinia(createPinia())
    productStore = useProductStore()
    searchStore = useSearchStore()
  })

  describe('There is no products', () => {
    it('should list nothing', () => {
      expectedVM = {
        headers: expectedHeaders,
        items: [],
        currentSearch: undefined
      }
      expectVMToMatch(expectedVM)
    })
  })
  describe('There is some products', () => {
    describe('Product does not have category', () => {
      it('should list all of them with empty name', () => {
        productStore.items = [productWithoutCategoryListItem]
        expectedVM = {
          items: [
            {
              uuid: productWithoutCategory.uuid,
              name: productWithoutCategory.name,
              img: productWithoutCategory.miniature,
              reference: productWithoutCategory.ean13,
              laboratory: productWithoutCategory.laboratory!.name,
              categories: [],
              priceWithoutTax: '5,90\u00A0€',
              priceWithTax: '6,49\u00A0€',
              availableStock: productWithoutCategory.availableStock,
              isActive: true,
              arePromotionsAllowed: true
            }
          ]
        }
        expectVMToMatch(expectedVM)
      })
    })
    describe('Product does not have laboratory', () => {
      it('should list all of them with empty name', () => {
        productStore.items = [productWithoutLaboratoryListItem]
        expectedVM = {
          items: [
            {
              uuid: productWithoutLaboratory.uuid,
              name: productWithoutLaboratory.name,
              img: productWithoutLaboratory.miniature,
              reference: productWithoutLaboratory.ean13,
              laboratory: '',
              categories: productWithoutLaboratory.categories.map(
                (c) => c.name
              ),
              priceWithoutTax: '5,90\u00A0€',
              priceWithTax: '6,49\u00A0€',
              availableStock: productWithoutCategory.availableStock,
              isActive: true,
              arePromotionsAllowed: true
            }
          ]
        }
        expectVMToMatch(expectedVM)
      })
    })
    describe('There is category', () => {
      it('should list all of them', () => {
        productStore.items = [dolodentListItem, ultraLevureListItem]
        expectedVM = {
          headers: expectedHeaders,
          items: [
            {
              uuid: dolodent.uuid,
              name: dolodent.name,
              img: dolodent.miniature,
              reference: dolodent.ean13,
              laboratory: dolodent.laboratory!.name,
              categories: dolodent.categories.map((c) => c.name),
              priceWithoutTax: '5,00\u00A0€',
              priceWithTax: '5,50\u00A0€',
              availableStock: dolodent.availableStock,
              isActive: true,
              arePromotionsAllowed: false
            },
            {
              uuid: ultraLevure.uuid,
              name: ultraLevure.name,
              img: ultraLevure.miniature,
              reference: ultraLevure.ean13,
              laboratory: ultraLevure.laboratory!.name,
              categories: ultraLevure.categories.map((c) => c.name),
              priceWithoutTax: '4,32\u00A0€',
              priceWithTax: '4,75\u00A0€',
              availableStock: ultraLevure.availableStock,
              isActive: false,
              arePromotionsAllowed: false
            }
          ]
        }
        expectVMToMatch(expectedVM)
      })
    })
    describe('Products are not eligible to promotion', () => {
      it('should list all of them', () => {
        productStore.items = [
          dolodentListItem,
          productWithForbiddenPromotionListItem
        ]
        expectedVM = {
          headers: expectedHeaders,
          items: [
            {
              uuid: dolodent.uuid,
              name: dolodent.name,
              img: dolodent.miniature,
              reference: dolodent.ean13,
              laboratory: dolodent.laboratory!.name,
              categories: dolodent.categories.map((c) => c.name),
              priceWithoutTax: '5,00\u00A0€',
              priceWithTax: '5,50\u00A0€',
              availableStock: dolodent.availableStock,
              isActive: true,
              arePromotionsAllowed: false
            },
            {
              uuid: productWithForbiddenPromotion.uuid,
              name: productWithForbiddenPromotion.name,
              img: productWithForbiddenPromotion.miniature,
              reference: productWithForbiddenPromotion.ean13,
              laboratory: productWithForbiddenPromotion.laboratory!.name,
              categories: productWithForbiddenPromotion.categories.map(
                (c) => c.name
              ),
              priceWithoutTax: '3,33\u00A0€',
              priceWithTax: '3,99\u00A0€',
              availableStock: productWithForbiddenPromotion.availableStock,
              isActive: true,
              arePromotionsAllowed: false
            }
          ]
        }
        expectVMToMatch(expectedVM)
      })
    })
    describe('Search', () => {
      describe('There is a search result', () => {
        beforeEach(() => {
          searchStore.set(key, [dolodentListItem])
          searchStore.setFilter(key, {
            query: 'dol',
            status: ProductStatus.Active
          })
        })
        it('should list only the search result', () => {
          expectedVM = {
            items: [
              {
                uuid: dolodent.uuid,
                name: dolodent.name,
                img: dolodent.miniature,
                reference: dolodent.ean13,
                laboratory: dolodent.laboratory!.name,
                categories: dolodent.categories.map((c) => c.name),
                priceWithoutTax: '5,00\u00A0€',
                priceWithTax: '5,50\u00A0€',
                availableStock: dolodent.availableStock,
                isActive: true,
                arePromotionsAllowed: false
              }
            ],
            currentSearch: {
              query: 'dol',
              status: ProductStatus.Active
            }
          }
          expectVMToMatch(expectedVM)
        })
      })
      describe('There is another search result', () => {
        beforeEach(() => {
          searchStore.set(key, [ultraLevureListItem])
        })
        it('should list only the search result', () => {
          expectedVM = {
            headers: expectedHeaders,
            items: [
              {
                uuid: ultraLevure.uuid,
                name: ultraLevure.name,
                img: ultraLevure.miniature,
                reference: ultraLevure.ean13,
                laboratory: ultraLevure.laboratory!.name,
                categories: ultraLevure.categories.map((c) => c.name),
                priceWithoutTax: '4,32\u00A0€',
                priceWithTax: '4,75\u00A0€',
                availableStock: ultraLevure.availableStock,
                isActive: false,
                arePromotionsAllowed: false
              }
            ]
          }
          expectVMToMatch(expectedVM)
        })
      })
      describe('Search performed but no results found', () => {
        beforeEach(() => {
          productStore.items = [dolodentListItem, ultraLevureListItem]
          searchStore.set(key, [])
          searchStore.setFilter(key, { query: 'nonexistent' })
        })
        it('should show empty list (no results)', () => {
          expectedVM = {
            items: [],
            currentSearch: { query: 'nonexistent' }
          }
          expectVMToMatch(expectedVM)
        })
      })
      describe('Search results should not have pagination', () => {
        beforeEach(() => {
          productStore.hasMore = true
          searchStore.set(key, [dolodentListItem])
        })
        it('should return hasMore false when search results are present', () => {
          expectedVM = {
            items: [
              {
                uuid: dolodent.uuid,
                name: dolodent.name,
                img: dolodent.miniature,
                reference: dolodent.ean13,
                laboratory: dolodent.laboratory!.name,
                categories: dolodent.categories.map((c) => c.name),
                priceWithoutTax: '5,00\u00A0€',
                priceWithTax: '5,50\u00A0€',
                availableStock: dolodent.availableStock,
                isActive: true,
                arePromotionsAllowed: false
              }
            ],
            hasMore: false
          }
          expectVMToMatch(expectedVM)
        })
      })
    })
    describe('Are all products listed ?', () => {
      it('should inform that there is more items', () => {
        productStore.hasMore = false
        expectedVM = {
          hasMore: false
        }
        expectVMToMatch(expectedVM)
      })
      it('should inform that there is still items', () => {
        productStore.hasMore = true
        expectedVM = {
          hasMore: true
        }
        expectVMToMatch(expectedVM)
      })
    })
  })

  describe('There is an error in search', () => {
    beforeEach(() => {
      searchStore.setError(key, 'dol')
    })
    it('should display the error', () => {
      expectedVM = {
        searchError:
          'Veuillez saisir au moins 3 caractères pour lancer la recherche.'
      }
      expectVMToMatch(expectedVM)
    })
  })

  describe('Loading', () => {
    it('should be aware during loading', () => {
      productStore.isLoading = true
      expectedVM = {
        isLoading: true
      }
      expectVMToMatch(expectedVM)
    })
  })

  const expectVMToMatch = (expectedVM: Partial<GetProductsVM>) => {
    const emptyVM: GetProductsVM = {
      headers: expectedHeaders,
      items: [],
      hasMore: false,
      currentSearch: undefined,
      searchError: undefined,
      isLoading: false
    }
    expect(getProductsVM(key)).toMatchObject({ ...emptyVM, ...expectedVM })
  }
})

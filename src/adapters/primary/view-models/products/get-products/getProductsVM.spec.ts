import { GetProductsVM, getProductsVM } from './getProductsVM'
import {
  dolodent,
  productWithoutCategory,
  ultraLevure
} from '@utils/testData/products'
import { createPinia, setActivePinia } from 'pinia'
import { useProductStore } from '@store/productStore'
import { Header } from '@adapters/primary/view-models/preparations/get-orders-to-prepare/getPreparationsVM'
import { useSearchStore } from '@store/searchStore'

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
        productStore.items = [productWithoutCategory]
        expectedVM = {
          items: [
            {
              uuid: productWithoutCategory.uuid,
              name: productWithoutCategory.name,
              img: productWithoutCategory.miniature,
              reference: productWithoutCategory.ean13,
              laboratory: productWithoutCategory.laboratory,
              categories: [],
              priceWithoutTax: '5,90\u00A0€',
              priceWithTax: '6,49\u00A0€',
              availableStock: productWithoutCategory.availableStock
            }
          ]
        }
        expectVMToMatch(expectedVM)
      })
    })
    describe('There is category', () => {
      it('should list all of them', () => {
        productStore.items = [dolodent, ultraLevure]
        expectedVM = {
          headers: expectedHeaders,
          items: [
            {
              uuid: dolodent.uuid,
              name: dolodent.name,
              img: dolodent.miniature,
              reference: dolodent.ean13,
              laboratory: dolodent.laboratory,
              categories: dolodent.categories.map((c) => c.name),
              priceWithoutTax: '5,00\u00A0€',
              priceWithTax: '5,50\u00A0€',
              availableStock: dolodent.availableStock
            },
            {
              uuid: ultraLevure.uuid,
              name: ultraLevure.name,
              img: ultraLevure.miniature,
              reference: ultraLevure.ean13,
              laboratory: ultraLevure.laboratory,
              categories: ultraLevure.categories.map((c) => c.name),
              priceWithoutTax: '4,32\u00A0€',
              priceWithTax: '4,75\u00A0€',
              availableStock: ultraLevure.availableStock
            }
          ]
        }
        expectVMToMatch(expectedVM)
      })
    })
    describe('Search', () => {
      describe('There is a search result', () => {
        beforeEach(() => {
          searchStore.set(key, [dolodent])
          searchStore.setFilter(key, 'dol')
        })
        it('should list only the search result', () => {
          expectedVM = {
            items: [
              {
                uuid: dolodent.uuid,
                name: dolodent.name,
                img: dolodent.miniature,
                reference: dolodent.ean13,
                laboratory: dolodent.laboratory,
                categories: dolodent.categories.map((c) => c.name),
                priceWithoutTax: '5,00\u00A0€',
                priceWithTax: '5,50\u00A0€',
                availableStock: dolodent.availableStock
              }
            ],
            currentSearch: 'dol'
          }
          expectVMToMatch(expectedVM)
        })
      })
      describe('There is another search result', () => {
        beforeEach(() => {
          searchStore.set(key, [ultraLevure])
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
                laboratory: ultraLevure.laboratory,
                categories: ultraLevure.categories.map((c) => c.name),
                priceWithoutTax: '4,32\u00A0€',
                priceWithTax: '4,75\u00A0€',
                availableStock: ultraLevure.availableStock
              }
            ]
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

  const expectVMToMatch = (expectedVM: Partial<GetProductsVM>) => {
    const emptyVM: GetProductsVM = {
      headers: expectedHeaders,
      items: [],
      hasMore: false,
      currentSearch: undefined,
      searchError: undefined
    }
    expect(getProductsVM(key)).toMatchObject({ ...emptyVM, ...expectedVM })
  }
})

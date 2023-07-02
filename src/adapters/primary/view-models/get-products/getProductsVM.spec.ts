import { getProductsVM } from './getProductsVM'
import { dolodent, ultraLevure } from '@utils/testData/products'
import { createPinia, setActivePinia } from 'pinia'
import { useProductStore } from '@store/productStore'
import { useCategoryStore } from '@store/categoryStore'
import { dents, diarrhee } from '@utils/testData/categories'
import { Header } from '@adapters/primary/view-models/get-orders-to-prepare/getPreparationsVM'

describe('Get products VM', () => {
  let productStore: any
  let categoryStore: any

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
      name: 'Catégorie',
      value: 'category'
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
    categoryStore = useCategoryStore()
  })

  describe('There is no products', () => {
    it('should list nothing', () => {
      const vm = getProductsVM()
      const expectedVM = {
        headers: expectedHeaders,
        items: []
      }
      expect(vm).toStrictEqual(expectedVM)
    })
  })
  describe('There is some products', () => {
    beforeEach(() => {
      productStore.items = [dolodent, ultraLevure]
    })
    describe('Categories are not loaded', () => {
      it('should list all of them', () => {
        categoryStore.items = []
        const vm = getProductsVM()
        const expectedVM = {
          headers: expectedHeaders,
          items: [
            {
              name: dolodent.name,
              img: dolodent.miniature,
              reference: dolodent.cip13,
              category: '',
              priceWithoutTax: '5,00\u00A0€',
              priceWithTax: '5,50\u00A0€',
              availableStock: dolodent.availableStock
            },
            {
              name: ultraLevure.name,
              img: ultraLevure.miniature,
              reference: ultraLevure.cip13,
              category: '',
              priceWithoutTax: '4,32\u00A0€',
              priceWithTax: '4,75\u00A0€',
              availableStock: ultraLevure.availableStock
            }
          ]
        }
        expect(vm).toStrictEqual(expectedVM)
      })
    })
    describe('Categories are loaded', () => {
      it('should list all of them', () => {
        categoryStore.items = [dents, diarrhee]
        const vm = getProductsVM()
        const expectedVM = {
          headers: expectedHeaders,
          items: [
            {
              name: dolodent.name,
              img: dolodent.miniature,
              reference: dolodent.cip13,
              category: 'Dents',
              priceWithoutTax: '5,00\u00A0€',
              priceWithTax: '5,50\u00A0€',
              availableStock: dolodent.availableStock
            },
            {
              name: ultraLevure.name,
              img: ultraLevure.miniature,
              reference: ultraLevure.cip13,
              category: 'Diarrhée',
              priceWithoutTax: '4,32\u00A0€',
              priceWithTax: '4,75\u00A0€',
              availableStock: ultraLevure.availableStock
            }
          ]
        }
        expect(vm).toStrictEqual(expectedVM)
      })
    })
  })
})

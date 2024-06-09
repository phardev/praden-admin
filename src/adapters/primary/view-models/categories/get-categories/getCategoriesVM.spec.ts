import { Header } from '@adapters/primary/view-models/preparations/get-orders-to-prepare/getPreparationsVM'
import { createPinia, setActivePinia } from 'pinia'
import { useCategoryStore } from '@store/categoryStore'
import { getCategoriesVM } from '@adapters/primary/view-models/categories/get-categories/getCategoriesVM'
import { dents, minceur } from '@utils/testData/categories'

describe('Get categories', () => {
  let categoryStore: any

  const expectedHeaders: Array<Header> = [
    {
      name: 'Nom',
      value: 'name'
    },
    {
      name: 'Description',
      value: 'description'
    }
  ]

  beforeEach(() => {
    setActivePinia(createPinia())
    categoryStore = useCategoryStore()
  })

  describe('There is no category', () => {
    it('should list nothing', () => {
      const vm = getCategoriesVM()
      const expectedVM = {
        headers: expectedHeaders,
        items: []
      }
      expect(vm).toStrictEqual(expectedVM)
    })
  })
  describe('There is some products', () => {
    beforeEach(() => {
      categoryStore.items = [dents, minceur]
    })
    it('should list all of them', () => {
      const vm = getCategoriesVM()
      const expectedVM = {
        headers: expectedHeaders,
        items: [
          {
            uuid: dents.uuid,
            name: dents.name,
            description: dents.description
          },
          {
            uuid: minceur.uuid,
            name: minceur.name,
            description: minceur.description
          }
        ]
      }
      expect(vm).toStrictEqual(expectedVM)
    })
  })
})

import { createPinia, setActivePinia } from 'pinia'
import { useCategoryStore } from '@store/categoryStore'
import { categoryReorderVM } from './categoryReorderVM'
import { baby, dents, mum } from '@utils/testData/categories'

describe('Category Reorder VM', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('Given empty store', () => {
    it('should initialize with empty sorted categories', () => {
      const categoryStore = useCategoryStore()
      categoryStore.items = []

      const vm = categoryReorderVM()

      expect(vm.sortedCategories).toStrictEqual([])
    })
  })

  describe('Given store with categories', () => {
    it('should initialize with sorted categories by order ascending', () => {
      const categoryStore = useCategoryStore()
      categoryStore.items = [baby, dents, mum]

      const vm = categoryReorderVM()

      expect(vm.sortedCategories).toStrictEqual([
        {
          uuid: dents.uuid,
          name: dents.name,
          order: dents.order,
          image: dents.image,
          miniature: dents.miniature
        },
        {
          uuid: mum.uuid,
          name: mum.name,
          order: mum.order,
          image: mum.image,
          miniature: mum.miniature
        },
        {
          uuid: baby.uuid,
          name: baby.name,
          order: baby.order,
          image: baby.image,
          miniature: baby.miniature
        }
      ])
    })

    it('should start with hasChanges false', () => {
      const categoryStore = useCategoryStore()
      categoryStore.items = [dents, mum]

      const vm = categoryReorderVM()

      expect(vm.hasChanges).toStrictEqual(false)
    })

    it('should reflect loading state from store', () => {
      const categoryStore = useCategoryStore()
      categoryStore.items = [dents]
      categoryStore.isLoading = true

      const vm = categoryReorderVM()

      expect(vm.isLoading).toStrictEqual(true)
    })

    it('should return category UUIDs in current order', () => {
      const categoryStore = useCategoryStore()
      categoryStore.items = [dents, mum, baby]

      const vm = categoryReorderVM()

      expect(vm.getCategoryUuids()).toStrictEqual([
        dents.uuid,
        mum.uuid,
        baby.uuid
      ])
    })

    it('should reset to store state and clear hasChanges', () => {
      const categoryStore = useCategoryStore()
      categoryStore.items = [dents, mum, baby]

      const vm = categoryReorderVM()
      vm.reorder(2, 0)
      vm.reset()

      const result = {
        sortedCategories: vm.sortedCategories,
        hasChanges: vm.hasChanges,
        isLoading: vm.isLoading
      }

      expect(result).toStrictEqual({
        sortedCategories: [
          {
            uuid: dents.uuid,
            name: dents.name,
            order: dents.order,
            image: dents.image,
            miniature: dents.miniature
          },
          {
            uuid: mum.uuid,
            name: mum.name,
            order: mum.order,
            image: mum.image,
            miniature: mum.miniature
          },
          {
            uuid: baby.uuid,
            name: baby.name,
            order: baby.order,
            image: baby.image,
            miniature: baby.miniature
          }
        ],
        hasChanges: false,
        isLoading: false
      })
    })
  })

  describe('Given reorder with indices', () => {
    it('should move item forward from oldIndex to newIndex', () => {
      const categoryStore = useCategoryStore()
      categoryStore.items = [dents, mum, baby]

      const vm = categoryReorderVM()
      vm.reorder(2, 0)

      expect(vm.sortedCategories).toStrictEqual([
        {
          uuid: baby.uuid,
          name: baby.name,
          order: baby.order,
          image: baby.image,
          miniature: baby.miniature
        },
        {
          uuid: dents.uuid,
          name: dents.name,
          order: dents.order,
          image: dents.image,
          miniature: dents.miniature
        },
        {
          uuid: mum.uuid,
          name: mum.name,
          order: mum.order,
          image: mum.image,
          miniature: mum.miniature
        }
      ])
    })

    it('should move item backward from oldIndex to newIndex', () => {
      const categoryStore = useCategoryStore()
      categoryStore.items = [dents, mum, baby]

      const vm = categoryReorderVM()
      vm.reorder(0, 2)

      expect(vm.sortedCategories).toStrictEqual([
        {
          uuid: mum.uuid,
          name: mum.name,
          order: mum.order,
          image: mum.image,
          miniature: mum.miniature
        },
        {
          uuid: baby.uuid,
          name: baby.name,
          order: baby.order,
          image: baby.image,
          miniature: baby.miniature
        },
        {
          uuid: dents.uuid,
          name: dents.name,
          order: dents.order,
          image: dents.image,
          miniature: dents.miniature
        }
      ])
    })

    it('should set hasChanges to true after reorder with indices', () => {
      const categoryStore = useCategoryStore()
      categoryStore.items = [dents, mum]

      const vm = categoryReorderVM()
      vm.reorder(0, 1)

      expect(vm.hasChanges).toStrictEqual(true)
    })
  })
})

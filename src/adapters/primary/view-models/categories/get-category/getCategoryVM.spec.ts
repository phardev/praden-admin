import { baby, dents, minceur, mum } from '@utils/testData/categories'
import { Field } from '@adapters/primary/view-models/promotions/create-promotion/createPromotionVM'
import { createPinia, setActivePinia } from 'pinia'
import { useFormStore } from '@store/formStore'
import { useCategoryStore } from '@store/categoryStore'
import { GetCategoryVM, getCategoryVM } from './getCategoryVM'
import { Category } from '@core/entities/category'
import { UUID } from '@core/types/types'

describe('Get category VM', () => {
  let formStore: any
  let categoryStore: any
  const key = 'testRoute'
  let vm: GetCategoryVM
  const availableCategories: Array<Category> = [dents, baby, minceur, mum]

  beforeEach(() => {
    setActivePinia(createPinia())
    formStore = useFormStore()
    categoryStore = useCategoryStore()
    categoryStore.items = availableCategories
    categoryStore.current = baby
    vm = getCategoryVM(key)
  })
  describe('Initial VM', () => {
    describe('Name field', () => {
      it('should get the category name', () => {
        const expectedField: Field<string> = {
          value: baby.name,
          canEdit: false
        }
        expect(vm.getName()).toStrictEqual(expectedField)
      })
      it('should save the name value in form store', () => {
        expect(formStore.get(key).name).toStrictEqual(baby.name)
      })
    })
    describe('Description field', () => {
      it('should get the category description', () => {
        const expectedField: Field<string> = {
          value: baby.description,
          canEdit: false
        }
        expect(vm.getDescription()).toStrictEqual(expectedField)
      })
      it('should save the description value in form store', () => {
        expect(formStore.get(key).description).toStrictEqual(baby.description)
      })
    })
    describe('Parent uuid field', () => {
      it('should get the category parent uuid', () => {
        const expectedField: Field<string> = {
          value: baby.parentUuid,
          canEdit: false
        }
        expect(vm.getParentUuid()).toStrictEqual(expectedField)
      })
      it('should save the parent uuid value in form store', () => {
        expect(formStore.get(key).parentUuid).toStrictEqual(baby.parentUuid)
      })
      describe('Category choices', () => {
        it('should provide all categories except the selected one', () => {
          expect(vm.getAvailableCategories()).toStrictEqual([
            {
              uuid: dents.uuid,
              name: dents.name
            },
            {
              uuid: minceur.uuid,
              name: minceur.name
            },
            {
              uuid: mum.uuid,
              name: mum.name
            }
          ])
        })
      })
    })
  })
  describe('Validation', () => {
    it('should not allow to validate', () => {
      expect(vm.getCanValidate()).toBe(false)
    })
    it('should not display validate', () => {
      expect(vm.getDisplayValidate()).toBe(false)
    })
  })
  describe('There is no current category', () => {
    beforeEach(() => {
      categoryStore.current = undefined
      vm = getCategoryVM('test')
    })
    it('should initialize empty name', () => {
      const expectedField: Field<string> = {
        value: '',
        canEdit: false
      }
      expect(vm.getDescription()).toStrictEqual(expectedField)
    })
    it('should initialize undefined parent uuid', () => {
      const expectedField: Field<UUID | undefined> = {
        value: undefined,
        canEdit: false
      }
      expect(vm.getParentUuid()).toStrictEqual(expectedField)
    })
  })
})

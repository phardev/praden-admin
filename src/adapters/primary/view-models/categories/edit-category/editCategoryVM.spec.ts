import { createPinia, setActivePinia } from 'pinia'
import { useFormStore } from '@store/formStore'
import { useCategoryStore } from '@store/categoryStore'
import { baby, dents, minceur } from '@utils/testData/categories'
import { Field } from '@adapters/primary/view-models/promotions/create-promotion/createPromotionVM'
import {
  EditCategoryVM,
  editCategoryVM
} from '@adapters/primary/view-models/categories/edit-category/editCategoryVM'

describe('Edit category VM', () => {
  let formStore: any
  let categoryStore: any
  const key = 'testRoute'
  let vm: EditCategoryVM

  beforeEach(() => {
    setActivePinia(createPinia())
    formStore = useFormStore()
    categoryStore = useCategoryStore()
    categoryStore.items = [dents, baby, minceur]
    categoryStore.current = dents
    vm = editCategoryVM(key)
  })

  describe('Initial VM', () => {
    describe('Name field', () => {
      it('should get the category name', () => {
        const expectedField: Field<string> = {
          value: dents.name,
          canEdit: true
        }
        expect(vm.getName()).toStrictEqual(expectedField)
      })
      it('should save the name value in form store', () => {
        expect(formStore.get(key).name).toStrictEqual(dents.name)
      })
    })
    describe('Description field', () => {
      it('should get the category description', () => {
        const expectedField: Field<string> = {
          value: dents.description,
          canEdit: true
        }
        expect(vm.getDescription()).toStrictEqual(expectedField)
      })
      it('should save the name value in form store', () => {
        expect(formStore.get(key).description).toStrictEqual(dents.description)
      })
    })
    describe('Parent uuid field', () => {
      it('should get the category parent uuid', () => {
        const expectedField: Field<string> = {
          value: dents.parentUuid,
          canEdit: true
        }
        expect(vm.getParentUuid()).toStrictEqual(expectedField)
      })
      it('should save the parent uuid value in form store', () => {
        expect(formStore.get(key).parentUuid).toStrictEqual(dents.parentUuid)
      })
    })
  })
  describe('Update parent category uuid', () => {
    it('should update parent category uuid value in form store', () => {
      vm.setParentUuid('test')
      expect(formStore.get(key).parentUuid).toStrictEqual('test')
    })
    it('should update parent category uuid field', () => {
      vm.setParentUuid('test')
      const expectedField: Field<string> = {
        value: 'test',
        canEdit: true
      }
      expect(vm.getParentUuid()).toStrictEqual(expectedField)
    })
  })
})

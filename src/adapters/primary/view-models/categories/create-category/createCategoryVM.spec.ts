import { createPinia, setActivePinia } from 'pinia'
import { useFormStore } from '@store/formStore'
import { useCategoryStore } from '@store/categoryStore'
import { medicaments, mumAndBaby } from '@utils/testData/categoriesDemoPraden'
import { dents, minceur } from '@utils/testData/categories'
import {
  createCategoryVM,
  CreateCategoryVM
} from '@adapters/primary/view-models/categories/create-category/createCategoryVM'
import type { Field } from '@adapters/primary/view-models/promotions/create-promotion/createPromotionVM'
import type { UUID } from '@core/types/types'
import { CreateCategoryDTO } from '@core/usecases/categories/category-creation/createCategory'

describe('Create category VM', () => {
  let formStore: any
  let categoryStore: any
  let vm: CreateCategoryVM
  const key = 'create-category-key'

  beforeEach(() => {
    setActivePinia(createPinia())
    formStore = useFormStore()
    categoryStore = useCategoryStore()
    categoryStore.items = [medicaments, mumAndBaby, minceur]
    categoryStore.current = dents
    vm = createCategoryVM(key)
  })

  describe('There is no current category', () => {
    beforeEach(() => {
      vm = createCategoryVM(key)
    })
    describe('Initial VM', () => {
      describe('Name', () => {
        it('should have an empty name', () => {
          const expectedField: Field<string> = {
            value: '',
            canEdit: true
          }
          expect(vm.getName()).toStrictEqual(expectedField)
        })
        it('should save the name value in form store', () => {
          expect(formStore.get(key).name).toStrictEqual('')
        })
      })
      describe('Category choices', () => {
        it('should provide all categories', () => {
          expect(vm.getAvailableCategories()).toStrictEqual([
            {
              uuid: medicaments.uuid,
              name: medicaments.name
            },
            {
              uuid: mumAndBaby.uuid,
              name: mumAndBaby.name
            },
            {
              uuid: minceur.uuid,
              name: minceur.name
            }
          ])
        })
      })
      describe('Category selected', () => {
        it('should not have any category selected', () => {
          const expectedField: Field<UUID | undefined> = {
            value: undefined,
            canEdit: true
          }
          expect(vm.getParentUuid()).toStrictEqual(expectedField)
        })
        it('should not have any category selected in form store', () => {
          expect(formStore.get(key).parentUuid).toBe(undefined)
        })
      })
      describe('Description field', () => {
        it('should have an empty description', () => {
          const expectedField: Field<string> = {
            value: '',
            canEdit: true
          }
          expect(vm.getDescription()).toStrictEqual(expectedField)
        })
        it('should save the description in form store', () => {
          expect(formStore.get(key).description).toBe('')
        })
      })
    })
    describe('Update name', () => {
      it('should update name value in form store', () => {
        vm.setName('test')
        expect(formStore.get(key).name).toStrictEqual('test')
      })
      it('should update name field', () => {
        vm.setName('test')
        const expectedField: Field<string> = {
          value: 'test',
          canEdit: true
        }
        expect(vm.getName()).toStrictEqual(expectedField)
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

    describe('Update description', () => {
      it('should update description value in form store', () => {
        vm.setDescription('description')
        expect(formStore.get(key).description).toStrictEqual('description')
      })
      it('should update description field', () => {
        vm.setDescription('description')
        const expectedField: Field<string> = {
          value: 'description',
          canEdit: true
        }
        expect(vm.getDescription()).toStrictEqual(expectedField)
      })
    })

    describe('DTO', () => {
      describe('For a dto', () => {
        it('should prepare the dto', () => {
          const expectedDTO: CreateCategoryDTO = {
            name: 'test',
            parentUuid: 'abc123',
            description: 'description'
          }
          vm.setName(expectedDTO.name)
          vm.setParentUuid(expectedDTO.parentUuid)
          vm.setDescription(expectedDTO.description)
          expect(vm.getDto()).toStrictEqual(expectedDTO)
        })
      })
    })
  })
})

import { Field } from '@adapters/primary/view-models/promotions/create-promotion/createPromotionVM'
import { useFormStore } from '@store/formStore'
import { useCategoryStore } from '@store/categoryStore'
import { baby, minceur, mum } from '@utils/testData/categories'
import { createPinia, setActivePinia } from 'pinia'
import {
  CategoryFormGetVM,
  categoryFormGetVM
} from '@adapters/primary/view-models/categories/category-form/categoryFormGetVM'
import {
  CategoryFormCreateVM,
  categoryFormCreateVM
} from '@adapters/primary/view-models/categories/category-form/categoryFormCreateVM'
import { CreateCategoryDTO } from '@core/usecases/categories/category-creation/createCategory'
import {
  CategoryFormEditVM,
  categoryFormEditVM
} from '@adapters/primary/view-models/categories/category-form/categoryFormEditVM'

const editableInitialVMTests = (
  getVM: () => CategoryFormCreateVM | CategoryFormEditVM | CategoryFormGetVM,
  key: string,
  expectedValue: any
) => {
  return initialVMTests(getVM, key, expectedValue, true)
}

const readOnlyInitialVMTests = (
  getVM: () => CategoryFormCreateVM | CategoryFormEditVM | CategoryFormGetVM,
  key: string,
  expectedValue: any
) => {
  return initialVMTests(getVM, key, expectedValue, false)
}

const initialVMTests = (
  getVM: () => CategoryFormCreateVM | CategoryFormEditVM | CategoryFormGetVM,
  key: string,
  expectedValue: any,
  editable: boolean
) => {
  let formStore: any
  let vm: any
  let categoryStore: any

  beforeEach(() => {
    formStore = useFormStore()
    categoryStore = useCategoryStore()
    categoryStore.items = [mum, baby, minceur]
    vm = getVM()
  })
  describe.each([
    { field: 'name', expected: expectedValue.name },
    { field: 'description', expected: expectedValue.description },
    { field: 'parentUuid', expected: expectedValue.parentUuid }
  ])('Initial field value', ({ field, expected }) => {
    it(`should have ${field} to be "${expected}"`, () => {
      const expectedField: Field<any> = {
        value: expected,
        canEdit: editable
      }
      expect(vm.get(field)).toStrictEqual(expectedField)
    })
    it(`should save the ${field} value in form store`, () => {
      expect(formStore.get(key)[field]).toStrictEqual(expected)
    })
  })
  describe('Category choices', () => {
    it('should provide all categories', () => {
      expect(vm.getAvailableCategories()).toStrictEqual([
        {
          uuid: mum.uuid,
          name: mum.name
        },
        {
          uuid: baby.uuid,
          name: baby.name
        },
        {
          uuid: minceur.uuid,
          name: minceur.name
        }
      ])
    })
  })
}

export const updateFieldsTests = (
  getVM: () => CategoryFormCreateVM | CategoryFormEditVM,
  key: string
) => {
  let formStore: any
  let vm: CategoryFormCreateVM
  beforeEach(() => {
    formStore = useFormStore()
    vm = getVM()
  })
  describe.each([
    { field: 'name', value: 'New name', expected: 'New name' },
    {
      field: 'description',
      value: 'the new description',
      expected: 'the new description'
    },
    { field: 'parentUuid', value: 'new-uuid', expected: 'new-uuid' }
  ])('Update simple fields', ({ field, value, expected }) => {
    it(`should update ${field} value in form store`, () => {
      vm.set(field, value)
      expect(formStore.get(key)[field]).toStrictEqual(expected)
    })
    it(`should update ${field} field`, () => {
      vm.set(field, value)
      const expectedField: Field<any> = {
        value: expected,
        canEdit: true
      }
      expect(vm.get(field)).toStrictEqual(expectedField)
    })
  })
}

describe('Category form VM', () => {
  let categoryStore: any

  beforeEach(() => {
    setActivePinia(createPinia())
    categoryStore = useCategoryStore()
  })
  describe('Category form get VM', () => {
    let vm: CategoryFormGetVM
    const category = baby
    const key = 'get-category-form'

    beforeEach(() => {
      categoryStore.current = category
      vm = categoryFormGetVM(key)
    })

    describe('Initial VM', () => {
      const expected: any = {
        name: baby.name,
        description: baby.description,
        parentUuid: baby.parentUuid
      }
      readOnlyInitialVMTests(() => vm, key, expected)
    })
    describe('Validation', () => {
      describe('Display validate', () => {
        it('should never display the validate button', () => {
          expect(vm.getDisplayValidate()).toBe(false)
        })
      })
      describe('Can validate', () => {
        it('should not allow to validate', () => {
          expect(vm.getCanValidate()).toBe(false)
        })
      })
    })
  })
  describe('Category form create VM', () => {
    let vm: CategoryFormCreateVM
    const key = 'create-category-form'

    beforeEach(() => {
      vm = categoryFormCreateVM(key)
    })

    describe('Initial VM', () => {
      const expected: any = {
        name: '',
        description: '',
        parentUuid: undefined
      }
      editableInitialVMTests(() => vm, key, expected)
    })
    describe('Update', () => {
      updateFieldsTests(() => vm, key)
    })
    describe('DTO', () => {
      describe('For a dto', () => {
        it('should prepare the dto', () => {
          const expectedDTO: CreateCategoryDTO = {
            name: 'test',
            parentUuid: 'abc123',
            description: 'description'
          }
          vm.set('name', expectedDTO.name)
          vm.set('parentUuid', expectedDTO.parentUuid)
          vm.set('description', expectedDTO.description)
          expect(vm.getDto()).toStrictEqual(expectedDTO)
        })
      })
    })
    describe('Validation', () => {
      describe('Display validate', () => {
        it('should always display the validate button', () => {
          expect(vm.getDisplayValidate()).toBe(true)
        })
      })
      describe('Can validate', () => {
        it('should allow to validate', () => {
          expect(vm.getCanValidate()).toBe(true)
        })
      })
    })
  })
  describe('Category form edit VM', () => {
    const category = minceur
    let vm: CategoryFormEditVM
    const key = 'edit-category-form'

    beforeEach(() => {
      categoryStore.current = category
      vm = categoryFormEditVM(key)
    })

    describe('Initial VM', () => {
      const expected: any = {
        name: category.name,
        description: category.description,
        parentUuid: category.parentUuid
      }
      editableInitialVMTests(() => vm, key, expected)
    })
    describe('Update', () => {
      updateFieldsTests(() => vm, key)
    })
    describe('DTO', () => {
      describe('For a dto', () => {
        it('should prepare the dto', () => {
          const expectedDTO: CreateCategoryDTO = {
            name: 'test',
            parentUuid: 'abc123',
            description: 'description'
          }
          vm.set('name', expectedDTO.name)
          vm.set('parentUuid', expectedDTO.parentUuid)
          vm.set('description', expectedDTO.description)
          expect(vm.getDto()).toStrictEqual(expectedDTO)
        })
      })
    })
    describe('Validation', () => {
      describe('Display validate', () => {
        it('should always display the validate button', () => {
          expect(vm.getDisplayValidate()).toBe(true)
        })
      })
      describe('Can validate', () => {
        it('should allow to validate', () => {
          expect(vm.getCanValidate()).toBe(true)
        })
      })
    })
  })
})

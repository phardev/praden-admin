import { createPinia, setActivePinia } from 'pinia'
import { useFormStore } from '@store/formStore'
import { useCategoryStore } from '@store/categoryStore'
import { medicaments, mumAndBaby } from '@utils/testData/categoriesDemoPraden'
import { minceur } from '@utils/testData/categories'
import {
  createProductVM,
  CreateProductVM
} from '@adapters/primary/view-models/products/create-product/createProductVM'
import { Field } from '@adapters/primary/view-models/promotions/create-promotion/createPromotionVM'
import { UUID } from '@core/types/types'

describe('Create product VM', () => {
  let formStore: any
  let categoryStore: any
  let vm: CreateProductVM
  const key = 'create-product-key'

  beforeEach(() => {
    setActivePinia(createPinia())
    formStore = useFormStore()
    categoryStore = useCategoryStore()
    categoryStore.items = [medicaments, mumAndBaby, minceur]
    vm = createProductVM(key)
  })

  describe('Initial VM', () => {
    describe('Name field', () => {
      it('should have an empty name', () => {
        const expectedField: Field<string> = {
          value: '',
          canEdit: true
        }
        expect(vm.name).toStrictEqual(expectedField)
      })
      it('should save the name value in form store', () => {
        expect(formStore.get(key).name).toStrictEqual('')
      })
    })
    describe('Category choices', () => {
      it('should provide all categories', () => {
        expect(vm.availableCategories).toStrictEqual([
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
        expect(vm.categoryUuid).toStrictEqual(expectedField)
      })
      it('should not have any category selected in form store', () => {
        expect(formStore.get(key).categoryUuid).toBe(undefined)
      })
    })
    describe('Cip13 field', () => {
      it('should have an empty cip13', () => {
        const expectedField: Field<string> = {
          value: '',
          canEdit: true
        }
        expect(vm.cip13).toStrictEqual(expectedField)
      })
      it('should save the cip13 value in form store', () => {
        expect(formStore.get(key).cip13).toStrictEqual('')
      })
    })
    describe('Price without tax', () => {
      it('should not have any price without tax', () => {
        const expectedField: Field<string | undefined> = {
          value: undefined,
          canEdit: true
        }
        expect(vm.priceWithoutTax).toStrictEqual(expectedField)
      })
      it('should not have any price without tax in form store', () => {
        expect(formStore.get(key).priceWithoutTax).toBe(undefined)
      })
    })
    describe('Percent tax rate', () => {
      it('should not have any percent tax rate', () => {
        const expectedField: Field<string | undefined> = {
          value: undefined,
          canEdit: true
        }
        expect(vm.percentTaxRate).toStrictEqual(expectedField)
      })
      it('should not have any percent tax rate in form store', () => {
        expect(formStore.get(key).priceWithoutTax).toBe(undefined)
      })
    })
    describe('Laboratory field', () => {
      it('should have an empty laboratory', () => {
        const expectedField: Field<string> = {
          value: '',
          canEdit: true
        }
        expect(vm.laboratory).toStrictEqual(expectedField)
      })
      it('should save the laboratory in form store', () => {
        expect(formStore.get(key).laboratory).toBe('')
      })
    })
    describe('Location field', () => {
      it('should have an empty location', () => {
        const expectedField: Field<string> = {
          value: '',
          canEdit: true
        }
        expect(vm.location).toStrictEqual(expectedField)
      })
      it('should save the location in form store', () => {
        expect(formStore.get(key).location).toBe('')
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
      expect(vm.name).toStrictEqual(expectedField)
    })
  })
  describe('Update category uuid', () => {
    it('should update category uuid value in form store', () => {
      vm.setCategoryUuid('test')
      expect(formStore.get(key).categoryUuid).toStrictEqual('test')
    })
    it('should update category uuid field', () => {
      vm.setCategoryUuid('test')
      const expectedField: Field<string> = {
        value: 'test',
        canEdit: true
      }
      expect(vm.categoryUuid).toStrictEqual(expectedField)
    })
  })

  describe('Update cip13', () => {
    it('should update cip13 value in form store', () => {
      vm.setCip13('test')
      expect(formStore.get(key).cip13).toStrictEqual('test')
    })
    it('should update cip13 field', () => {
      vm.setCip13('test')
      const expectedField: Field<string> = {
        value: 'test',
        canEdit: true
      }
      expect(vm.cip13).toStrictEqual(expectedField)
    })
  })

  describe('Update price without tax', () => {
    it('should update price without tax value in form store', () => {
      vm.setPriceWithoutTax('12')
      expect(formStore.get(key).priceWithoutTax).toStrictEqual('12')
    })
    it('should update price without tax field', () => {
      vm.setPriceWithoutTax('12')
      const expectedField: Field<string> = {
        value: '12',
        canEdit: true
      }
      expect(vm.priceWithoutTax).toStrictEqual(expectedField)
    })
  })

  describe('Update percent tax rate', () => {
    it('should update percent tax rate value in form store', () => {
      vm.setPercentTaxRate('5')
      expect(formStore.get(key).percentTaxRate).toStrictEqual('5')
    })
    it('should update percent tax rate field', () => {
      vm.setPercentTaxRate('5')
      const expectedField: Field<string> = {
        value: '5',
        canEdit: true
      }
      expect(vm.percentTaxRate).toStrictEqual(expectedField)
    })
  })

  describe('Update laboratory', () => {
    it('should update laboratory value in form store', () => {
      vm.setLaboratory('laboratory')
      expect(formStore.get(key).laboratory).toStrictEqual('laboratory')
    })
    it('should update laboratory field', () => {
      vm.setLaboratory('laboratory')
      const expectedField: Field<string> = {
        value: 'laboratory',
        canEdit: true
      }
      expect(vm.laboratory).toStrictEqual(expectedField)
    })
  })

  describe('Update location', () => {
    it('should update location value in form store', () => {
      vm.setLocation('location')
      expect(formStore.get(key).location).toStrictEqual('location')
    })
    it('should update location field', () => {
      vm.setLocation('location')
      const expectedField: Field<string> = {
        value: 'location',
        canEdit: true
      }
      expect(vm.location).toStrictEqual(expectedField)
    })
  })
})

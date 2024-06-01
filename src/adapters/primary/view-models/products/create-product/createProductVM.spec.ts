import { createPinia, setActivePinia } from 'pinia'
import { useFormStore } from '@store/formStore'
import { useCategoryStore } from '@store/categoryStore'
import { medicaments, mumAndBaby } from '@utils/testData/categoriesDemoPraden'
import { minceur } from '@utils/testData/categories'
import {
  createProductVM,
  CreateProductVM
} from '@adapters/primary/view-models/products/create-product/createProductVM'
import { type Field } from '@adapters/primary/view-models/promotions/create-promotion/createPromotionVM'
import { CreateProductDTO } from '@core/usecases/product/product-creation/createProduct'

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
    describe.each([
      { field: 'name', expected: '' },
      { field: 'categoryUuid', expected: undefined },
      { field: 'cip7', expected: '' },
      { field: 'cip13', expected: '' },
      { field: 'ean13', expected: '' },
      { field: 'priceWithoutTax', expected: undefined },
      { field: 'percentTaxRate', expected: undefined },
      { field: 'priceWithTax', expected: undefined },
      { field: 'laboratory', expected: '' },
      { field: 'location', expected: '' },
      { field: 'availableStock', expected: '' },
      { field: 'images', expected: [] },
      { field: 'newImages', expected: [] },
      { field: 'description', expected: '' },
      { field: 'instructionsForUse', expected: '' },
      { field: 'composition', expected: '' }
    ])('Field', ({ field, expected }) => {
      it(`should have an empty ${field}`, () => {
        const expectedField: Field<any> = {
          value: expected,
          canEdit: true
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
  })
  describe.each([
    { field: 'name', value: 'test', expected: 'test' },
    { field: 'categoryUuid', value: 'new-uuid', expected: 'new-uuid' },
    { field: 'cip7', value: 'cip7', expected: 'cip7' },
    { field: 'cip13', value: 'cip13', expected: 'cip13' },
    { field: 'ean13', value: 'ean13', expected: 'ean13' },
    { field: 'laboratory', value: 'laboratory', expected: 'laboratory' },
    { field: 'location', value: 'location', expected: 'location' },
    { field: 'availableStock', value: 13, expected: 13 },
    { field: 'description', value: 'description', expected: 'description' },
    {
      field: 'instructionsForUse',
      value: 'instructionsForUse',
      expected: 'instructionsForUse'
    },
    { field: 'composition', value: 'composition', expected: 'composition' }
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
  describe('Update price without tax', () => {
    describe('The tax rate is not set', () => {
      beforeEach(() => {
        vm.set('priceWithoutTax', '12')
      })
      it('should update price without tax value in form store', () => {
        expect(formStore.get(key).priceWithoutTax).toStrictEqual('12')
      })
      it('should update price without tax field', () => {
        const expectedField: Field<string> = {
          value: '12',
          canEdit: true
        }
        expect(vm.get('priceWithoutTax')).toStrictEqual(expectedField)
      })
      it('should not have any price with tax', () => {
        const expectedField: Field<string | undefined> = {
          value: undefined,
          canEdit: true
        }
        expect(vm.get('priceWithTax')).toStrictEqual(expectedField)
      })
      it('should not have any price with tax in form store', () => {
        expect(formStore.get(key).priceWithTax).toBe(undefined)
      })
    })
    describe('The tax rate is set', () => {
      beforeEach(() => {
        vm.set('percentTaxRate', '5.5')
        vm.set('priceWithoutTax', '12')
      })
      it('should update price without tax value in form store', () => {
        expect(formStore.get(key).priceWithoutTax).toStrictEqual('12')
      })
      it('should update price without tax field', () => {
        const expectedField: Field<string> = {
          value: '12',
          canEdit: true
        }
        expect(vm.get('priceWithoutTax')).toStrictEqual(expectedField)
      })
      it('should update price with tax value in form store', () => {
        expect(formStore.get(key).priceWithTax).toStrictEqual('12.66')
      })
      it('should update price with tax field', () => {
        const expectedField: Field<string> = {
          value: '12.66',
          canEdit: true
        }
        expect(vm.get('priceWithTax')).toStrictEqual(expectedField)
      })
    })
  })

  describe('Update percent tax rate', () => {
    describe('Price without tax and price with tax are not set', () => {
      beforeEach(() => {
        vm.set('percentTaxRate', '5')
      })
      it('should update percent tax rate value in form store', () => {
        expect(formStore.get(key).percentTaxRate).toStrictEqual('5')
      })
      it('should update percent tax rate field', () => {
        const expectedField: Field<string> = {
          value: '5',
          canEdit: true
        }
        expect(vm.get('percentTaxRate')).toStrictEqual(expectedField)
      })
      it('should not update price without tax value in form store', () => {
        expect(formStore.get(key).priceWithoutTax).toStrictEqual(undefined)
      })
      it('should update price without tax field', () => {
        const expectedField: Field<string> = {
          value: undefined,
          canEdit: true
        }
        expect(vm.get('priceWithoutTax')).toStrictEqual(expectedField)
      })
      it('should not have any price with tax', () => {
        const expectedField: Field<string | undefined> = {
          value: undefined,
          canEdit: true
        }
        expect(vm.get('priceWithTax')).toStrictEqual(expectedField)
      })
      it('should not have any price with tax in form store', () => {
        expect(formStore.get(key).priceWithTax).toBe(undefined)
      })
    })
    describe('Price without tax is already set  and price with tax is not set', () => {
      const percentTaxRate = '10'
      beforeEach(() => {
        vm.set('priceWithoutTax', '20')
        vm.set('percentTaxRate', percentTaxRate)
      })
      it('should update percent tax rate value in form store', () => {
        expect(formStore.get(key).percentTaxRate).toStrictEqual(percentTaxRate)
      })
      it('should update percent tax rate field', () => {
        const expectedField: Field<string> = {
          value: percentTaxRate,
          canEdit: true
        }
        expect(vm.get('percentTaxRate')).toStrictEqual(expectedField)
      })
      it('should compute the price with tax', () => {
        const expectedField: Field<string | undefined> = {
          value: '22.00',
          canEdit: true
        }
        expect(vm.get('priceWithTax')).toStrictEqual(expectedField)
      })
      it('should have the price with tax in form store', () => {
        expect(formStore.get(key).priceWithTax).toBe('22.00')
      })
    })
    describe('Price without tax is not set and price with tax is already set', () => {
      const percentTaxRate = '10'
      beforeEach(() => {
        vm.set('priceWithTax', '20')
        vm.set('percentTaxRate', percentTaxRate)
      })
      it('should update percent tax rate value in form store', () => {
        expect(formStore.get(key).percentTaxRate).toStrictEqual(percentTaxRate)
      })
      it('should update percent tax rate field', () => {
        const expectedField: Field<string> = {
          value: percentTaxRate,
          canEdit: true
        }
        expect(vm.get('percentTaxRate')).toStrictEqual(expectedField)
      })
      it('should compute the price without tax', () => {
        const expectedField: Field<string | undefined> = {
          value: '18.18',
          canEdit: true
        }
        expect(vm.get('priceWithoutTax')).toStrictEqual(expectedField)
      })
      it('should have the price without tax in form store', () => {
        expect(formStore.get(key).priceWithoutTax).toBe('18.18')
      })
    })
    describe('Both price without tax and price with tax are already set', () => {
      const percentTaxRate = '20'
      beforeEach(() => {
        vm.set('priceWithoutTax', '20')
        vm.set('priceWithTax', '100')
        vm.set('percentTaxRate', percentTaxRate)
      })
      it('should update percent tax rate value in form store', () => {
        expect(formStore.get(key).percentTaxRate).toStrictEqual(percentTaxRate)
      })
      it('should update percent tax rate field', () => {
        const expectedField: Field<string> = {
          value: percentTaxRate,
          canEdit: true
        }
        expect(vm.get('percentTaxRate')).toStrictEqual(expectedField)
      })
      it('should not change the price without tax', () => {
        const expectedField: Field<string | undefined> = {
          value: '20',
          canEdit: true
        }
        expect(vm.get('priceWithoutTax')).toStrictEqual(expectedField)
      })
      it('should have the price without tax in form store', () => {
        expect(formStore.get(key).priceWithoutTax).toBe('20')
      })
      it('should re-compute the price with tax', () => {
        const expectedField: Field<string | undefined> = {
          value: '24.00',
          canEdit: true
        }
        expect(vm.get('priceWithTax')).toStrictEqual(expectedField)
      })
      it('should have the price with tax in form store', () => {
        expect(formStore.get(key).priceWithTax).toBe('24.00')
      })
    })
  })

  describe('Update price with tax', () => {
    describe('Tax rate is not already defined', () => {
      beforeEach(() => {
        vm.set('priceWithTax', '12')
      })
      it('should update price with tax value in form store', () => {
        expect(formStore.get(key).priceWithTax).toStrictEqual('12')
      })
      it('should update price with tax field', () => {
        const expectedField: Field<string> = {
          value: '12',
          canEdit: true
        }
        expect(vm.get('priceWithTax')).toStrictEqual(expectedField)
      })
      it('should not update price without tax value in form store', () => {
        expect(formStore.get(key).priceWithoutTax).toStrictEqual(undefined)
      })
      it('should update price without tax field', () => {
        const expectedField: Field<string> = {
          value: undefined,
          canEdit: true
        }
        expect(vm.get('priceWithoutTax')).toStrictEqual(expectedField)
      })
    })
    describe('Tax rate is already defined', () => {
      beforeEach(() => {
        formStore.set(key, { percentTaxRate: 10 })
        vm.set('priceWithTax', '12')
      })
      it('should update price with tax value in form store', () => {
        expect(formStore.get(key).priceWithTax).toStrictEqual('12')
      })
      it('should update price without tax value in form store', () => {
        expect(formStore.get(key).priceWithoutTax).toStrictEqual('10.91')
      })
      it('should update price with tax field', () => {
        const expectedField: Field<string> = {
          value: '10.91',
          canEdit: true
        }
        expect(vm.get('priceWithoutTax')).toStrictEqual(expectedField)
      })
      it('should update price without tax field', () => {
        const expectedField: Field<string> = {
          value: '10.91',
          canEdit: true
        }
        expect(vm.get('priceWithoutTax')).toStrictEqual(expectedField)
      })
    })
  })

  describe('Update new images', () => {
    const newImages: Array<File> = [
      new File(['data1'], 'File 1', { type: 'image/png' }),
      new File(['data2'], 'File 2', { type: 'image/jpeg' }),
      new File(['data3'], 'File 3', { type: 'image/gif' })
    ]
    beforeEach(async () => {
      await vm.set('newImages', newImages)
    })
    it('should update new images value in form store', () => {
      expect(formStore.get(key).newImages).toStrictEqual(newImages)
    })
    it('should update new images field', () => {
      const expectedField: Field<Array<File>> = {
        value: newImages,
        canEdit: true
      }
      expect(vm.get('newImages')).toStrictEqual(expectedField)
    })
    it('should extract new images content', () => {
      const expectedImages: Field<Array<string>> = {
        value: [
          'data:image/png;base64,ZGF0YTE=',
          'data:image/jpeg;base64,ZGF0YTI=',
          'data:image/gif;base64,ZGF0YTM='
        ],
        canEdit: true
      }
      expect(vm.get('images')).toStrictEqual(expectedImages)
    })
  })
  describe('DTO', () => {
    describe('For a dto', () => {
      it('should prepare the dto', () => {
        const newImages = [
          new File(['data1'], 'File 1', { type: 'image/png' }),
          new File(['data2'], 'File 2', { type: 'image/jpeg' }),
          new File(['data3'], 'File 3', { type: 'image/gif' })
        ]
        const expectedDTO: CreateProductDTO = {
          name: 'test',
          cip7: '1234567',
          cip13: '1234567890123',
          ean13: '1234567890123',
          categoryUuid: 'abc123',
          laboratory: 'laboratory',
          images: newImages,
          priceWithoutTax: '12',
          percentTaxRate: '5',
          location: 'G2',
          availableStock: '21',
          description: '<p>description</p>',
          instructionsForUse: '<p>instructionsForUse</p>',
          composition: '<p>composition</p>'
        }
        vm.set('name', expectedDTO.name)
        vm.set('cip7', expectedDTO.cip7)
        vm.set('cip13', expectedDTO.cip13)
        vm.set('ean13', expectedDTO.ean13)
        vm.set('newImages', newImages)
        vm.set('categoryUuid', expectedDTO.categoryUuid)
        vm.set('laboratory', expectedDTO.laboratory)
        vm.set('priceWithoutTax', expectedDTO.priceWithoutTax)
        vm.set('percentTaxRate', expectedDTO.percentTaxRate)
        vm.set('location', expectedDTO.location)
        vm.set('availableStock', expectedDTO.availableStock)
        vm.set('description', expectedDTO.description)
        vm.set('instructionsForUse', expectedDTO.instructionsForUse)
        vm.set('composition', expectedDTO.composition)
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
      it('should allow to validate at start', () => {
        expect(vm.getCanValidate()).toBe(true)
      })
    })
  })
})

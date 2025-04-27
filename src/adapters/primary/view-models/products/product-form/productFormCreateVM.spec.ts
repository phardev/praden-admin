import {
  CreateProductLaboratoriesVM,
  productFormCreateVM,
  ProductFormCreateVM
} from './productFormCreateVM'
import { CreateProductDTO } from '@core/usecases/product/product-creation/createProduct'
import { createPinia, setActivePinia } from 'pinia'
import { useFormStore } from '@store/formStore'
import type { Field } from '@adapters/primary/view-models/promotions/promotion-form/promotionFormCreateVM'
import { useLaboratoryStore } from '@store/laboratoryStore'
import { anaca3, avene, sanofiAventis } from '@utils/testData/laboratories'
import { useProductStore } from '@store/productStore'
import { ProductStatus } from '@core/entities/product'

describe('Product form create VM', () => {
  let vm: ProductFormCreateVM
  let formStore: any
  let laboratoryStore: any
  const key = 'create-product-key'

  beforeEach(() => {
    setActivePinia(createPinia())
    formStore = useFormStore()
    laboratoryStore = useLaboratoryStore()
    vm = productFormCreateVM(key)
  })

  describe('Initial VM', () => {
    const expected: any = {
      name: '',
      isActive: true,
      categoryUuids: [],
      cip7: '',
      cip13: '',
      ean13: '',
      miniature: undefined,
      newMiniature: undefined,
      images: [],
      newImages: [],
      priceWithoutTax: undefined,
      percentTaxRate: undefined,
      priceWithTax: undefined,
      locations: {},
      availableStock: '',
      laboratory: undefined,
      description: '',
      instructionsForUse: '',
      composition: '',
      weight: '',
      maxQuantityForOrder: '',
      arePromotionsAllowed: true
    }
    describe.each([
      { field: 'name', expected: expected.name },
      {
        field: 'categoryUuids',
        expected: expected.categoryUuids
      },
      { field: 'cip7', expected: expected.cip7 },
      { field: 'cip13', expected: expected.cip13 },
      { field: 'ean13', expected: expected.ean13 },
      { field: 'images', expected: expected.images },
      { field: 'percentTaxRate', expected: expected.percentTaxRate },
      { field: 'availableStock', expected: expected.availableStock },
      { field: 'laboratory', expected: expected.laboratory },
      { field: 'description', expected: expected.description },
      { field: 'instructionsForUse', expected: expected.instructionsForUse },
      { field: 'composition', expected: expected.composition },
      {
        field: 'maxQuantityForOrder',
        expected: expected.maxQuantityForOrder
      },
      { field: 'isMedicine', expected: expected.isMedicine },
      { field: 'priceWithoutTax', expected: expected.priceWithoutTax },
      { field: 'priceWithTax', expected: expected.priceWithTax },
      { field: 'locations', expected: expected.locations },
      { field: 'weight', expected: expected.weight },
      { field: 'isActive', expected: expected.isActive }
    ])('Initial field value', ({ field, expected }) => {
      it(`should have ${field} to be "${expected}"`, () => {
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
  })
  describe('Laboratory choices', () => {
    it('should provide all laboratories', () => {
      const availableLaboratories = [anaca3]
      const expectedAvailableLaboratories: CreateProductLaboratoriesVM = [
        {
          uuid: anaca3.uuid,
          name: anaca3.name
        }
      ]

      laboratoryStore.items = availableLaboratories
      expect(vm.getAvailableLaboratories()).toStrictEqual(
        expectedAvailableLaboratories
      )
    })
  })
  describe('Toggle categories', () => {
    describe('Simple toggle', () => {
      it('should add the category to the list of categories', () => {
        vm.toggleCategory('added-category')
        const expectedField: Field<any> = {
          value: ['added-category'],
          canEdit: true
        }
        expect(vm.get('categoryUuids')).toStrictEqual(expectedField)
      })
    })
    describe('Simple toggle on multiple categories', () => {
      it('should add the categories to the list of categories', () => {
        vm.toggleCategory('added-category')
        vm.toggleCategory('another-added-category')
        const expectedField: Field<any> = {
          value: ['added-category', 'another-added-category'],
          canEdit: true
        }
        expect(vm.get('categoryUuids')).toStrictEqual(expectedField)
      })
    })
    describe('Toggle 2 times a category', () => {
      it('should not add the category to the list of categories', () => {
        vm.toggleCategory('added-category')
        vm.toggleCategory('added-category')
        const expectedField: Field<any> = {
          value: [],
          canEdit: true
        }
        expect(vm.get('categoryUuids')).toStrictEqual(expectedField)
      })
    })
    describe('Complex toggle', () => {
      it('should add some categories to the list of categories', () => {
        vm.toggleCategory('added-category')
        vm.toggleCategory('another-added-category')
        vm.toggleCategory('added-category')
        vm.toggleCategory('added-category')
        vm.toggleCategory('another-added-category')
        vm.toggleCategory('wow-category')
        vm.toggleCategory('batman-category')
        vm.toggleCategory('another-added-category')
        vm.toggleCategory('added-category')
        const expectedField: Field<any> = {
          value: ['wow-category', 'batman-category', 'another-added-category'],
          canEdit: true
        }
        expect(vm.get('categoryUuids')).toStrictEqual(expectedField)
      })
    })
  })
  describe('Toggle is active', () => {
    it('should toggle is active', () => {
      vm.toggleIsActive()
      expect(vm.get('isActive')).toStrictEqual({
        canEdit: true,
        value: false
      })
    })
    it('should toggle 2 times', () => {
      vm.toggleIsActive()
      vm.toggleIsActive()
      expect(vm.get('isActive')).toStrictEqual({
        canEdit: true,
        value: true
      })
    })
  })
  describe('DTO', () => {
    describe('For a dto', () => {
      beforeEach(() => {
        laboratoryStore.items = [avene, sanofiAventis]
      })
      it('should prepare the dto', async () => {
        const newImages = [
          new File(['data1'], 'File 1', { type: 'image/png' }),
          new File(['data2'], 'File 2', { type: 'image/jpeg' }),
          new File(['data3'], 'File 3', { type: 'image/gif' })
        ]
        const newMiniature = new File(['data1'], 'MINIATURE', {
          type: 'image/png'
        })
        const expectedDTO: CreateProductDTO = {
          name: 'test',
          status: ProductStatus.Active,
          cip7: '1234567',
          cip13: '1234567890123',
          ean13: '1234567890123',
          categoryUuids: ['abc123'],
          laboratory: sanofiAventis,
          miniature: newMiniature,
          images: newImages,
          priceWithoutTax: 1200,
          percentTaxRate: 5,
          locations: {},
          availableStock: 21,
          description: '<p>description</p>',
          instructionsForUse: '<p>instructionsForUse</p>',
          composition: '<p>composition</p>',
          weight: 1200,
          maxQuantityForOrder: 12,
          flags: { arePromotionsAllowed: true }
        }
        vm.set('name', expectedDTO.name)
        vm.set('cip7', expectedDTO.cip7)
        vm.set('cip13', expectedDTO.cip13)
        vm.set('ean13', expectedDTO.ean13)
        await vm.set('miniature', newMiniature)
        await vm.set('newImages', newImages)
        expectedDTO.categoryUuids.forEach((uuid) => {
          vm.toggleCategory(uuid)
        })
        vm.set('laboratory', expectedDTO.laboratory.uuid)
        vm.set('priceWithoutTax', '12')
        vm.set('percentTaxRate', '5')
        vm.set('locations', expectedDTO.locations)
        vm.set('availableStock', '21')
        vm.set('description', expectedDTO.description)
        vm.set('instructionsForUse', expectedDTO.instructionsForUse)
        vm.set('composition', expectedDTO.composition)
        vm.set('weight', '1.2')
        vm.set('maxQuantityForOrder', '12')

        expect(vm.getDto()).toStrictEqual(expectedDTO)
      })
    })
    describe('For a dto with inactive product', () => {
      beforeEach(() => {
        laboratoryStore.items = [avene, sanofiAventis]
      })
      it('should prepare the dto', async () => {
        const newImages = [
          new File(['data1'], 'File 1', { type: 'image/png' }),
          new File(['data2'], 'File 2', { type: 'image/jpeg' }),
          new File(['data3'], 'File 3', { type: 'image/gif' })
        ]
        const newMiniature = new File(['data1'], 'MINIATURE', {
          type: 'image/png'
        })
        const expectedDTO: CreateProductDTO = {
          name: 'test',
          status: ProductStatus.Inactive,
          cip7: '1234567',
          cip13: '1234567890123',
          ean13: '1234567890123',
          categoryUuids: ['abc123'],
          laboratory: sanofiAventis,
          miniature: newMiniature,
          images: newImages,
          priceWithoutTax: 1200,
          percentTaxRate: 5,
          locations: {},
          availableStock: 21,
          description: '<p>description</p>',
          instructionsForUse: '<p>instructionsForUse</p>',
          composition: '<p>composition</p>',
          weight: 1200,
          maxQuantityForOrder: 12,
          flags: { arePromotionsAllowed: true }
        }
        vm.toggleIsActive()
        vm.set('name', expectedDTO.name)
        vm.set('cip7', expectedDTO.cip7)
        vm.set('cip13', expectedDTO.cip13)
        vm.set('ean13', expectedDTO.ean13)
        await vm.set('miniature', newMiniature)
        await vm.set('newImages', newImages)
        expectedDTO.categoryUuids.forEach((uuid) => {
          vm.toggleCategory(uuid)
        })
        vm.set('laboratory', expectedDTO.laboratory.uuid)
        vm.set('priceWithoutTax', '12')
        vm.set('percentTaxRate', '5')
        vm.set('locations', expectedDTO.locations)
        vm.set('availableStock', '21')
        vm.set('description', expectedDTO.description)
        vm.set('instructionsForUse', expectedDTO.instructionsForUse)
        vm.set('composition', expectedDTO.composition)
        vm.set('weight', '1.2')
        vm.set('maxQuantityForOrder', '12')
        expect(vm.getDto()).toStrictEqual(expectedDTO)
      })
    })
    describe('For a dto without category', () => {
      beforeEach(() => {
        laboratoryStore.items = [avene, sanofiAventis]
      })
      it('should prepare the dto', async () => {
        const newImages = [
          new File(['data1'], 'File 1', { type: 'image/png' }),
          new File(['data2'], 'File 2', { type: 'image/jpeg' }),
          new File(['data3'], 'File 3', { type: 'image/gif' })
        ]
        const newMiniature = new File(['data1'], 'MINIATURE', {
          type: 'image/png'
        })
        const expectedDTO: CreateProductDTO = {
          name: 'test',
          status: ProductStatus.Active,
          cip7: '1234567',
          cip13: '1234567890123',
          ean13: '1234567890123',
          categoryUuids: [],
          laboratory: sanofiAventis,
          miniature: newMiniature,
          images: newImages,
          priceWithoutTax: 1200,
          percentTaxRate: 5,
          locations: {},
          availableStock: 21,
          description: '<p>description</p>',
          instructionsForUse: '<p>instructionsForUse</p>',
          composition: '<p>composition</p>',
          weight: 1200,
          maxQuantityForOrder: 12,
          flags: { arePromotionsAllowed: true }
        }
        vm.set('name', expectedDTO.name)
        vm.set('cip7', expectedDTO.cip7)
        vm.set('cip13', expectedDTO.cip13)
        vm.set('ean13', expectedDTO.ean13)
        await vm.set('miniature', newMiniature)
        await vm.set('newImages', newImages)
        vm.set('laboratory', expectedDTO.laboratory.uuid)
        vm.set('priceWithoutTax', '12')
        vm.set('percentTaxRate', '5')
        vm.set('locations', expectedDTO.locations)
        vm.set('availableStock', '21')
        vm.set('description', expectedDTO.description)
        vm.set('instructionsForUse', expectedDTO.instructionsForUse)
        vm.set('composition', expectedDTO.composition)
        vm.set('weight', '1.2')
        vm.set('maxQuantityForOrder', '12')
        expect(vm.getDto()).toStrictEqual(expectedDTO)
      })
    })
    describe('For a dto without max quantity for order', () => {
      beforeEach(() => {
        laboratoryStore.items = [avene, sanofiAventis]
      })
      it('should prepare the dto', async () => {
        const newImages = [
          new File(['data1'], 'File 1', { type: 'image/png' }),
          new File(['data2'], 'File 2', { type: 'image/jpeg' }),
          new File(['data3'], 'File 3', { type: 'image/gif' })
        ]
        const newMiniature = new File(['data1'], 'MINIATURE', {
          type: 'image/png'
        })
        const expectedDTO: CreateProductDTO = {
          name: 'test',
          status: ProductStatus.Active,
          cip7: '1234567',
          cip13: '1234567890123',
          ean13: '1234567890123',
          categoryUuids: [],
          laboratory: sanofiAventis,
          miniature: newMiniature,
          images: newImages,
          priceWithoutTax: 1200,
          percentTaxRate: 5,
          locations: {},
          availableStock: 21,
          description: '<p>description</p>',
          instructionsForUse: '<p>instructionsForUse</p>',
          composition: '<p>composition</p>',
          weight: 1200,
          maxQuantityForOrder: undefined,
          flags: { arePromotionsAllowed: true }
        }
        vm.set('name', expectedDTO.name)
        vm.set('cip7', expectedDTO.cip7)
        vm.set('cip13', expectedDTO.cip13)
        vm.set('ean13', expectedDTO.ean13)
        await vm.set('miniature', newMiniature)
        await vm.set('newImages', newImages)
        vm.set('laboratory', expectedDTO.laboratory.uuid)
        vm.set('priceWithoutTax', '12')
        vm.set('percentTaxRate', '5')
        vm.set('locations', expectedDTO.locations)
        vm.set('availableStock', '21')
        vm.set('description', expectedDTO.description)
        vm.set('instructionsForUse', expectedDTO.instructionsForUse)
        vm.set('composition', expectedDTO.composition)
        vm.set('weight', '1.2')
        vm.set('maxQuantityForOrder', undefined)
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
  describe('Loading', () => {
    it('should be aware during loading', () => {
      const productStore = useProductStore()
      productStore.isLoading = true
      expect(vm.isLoading()).toBe(true)
    })
    it('should be aware when not loading', () => {
      const productStore = useProductStore()
      productStore.isLoading = false
      expect(vm.isLoading()).toBe(false)
    })
  })
})

import type { Field } from '@adapters/primary/view-models/promotions/promotion-form/promotionFormCreateVM'
import { SequentialUuidGenerator } from '@adapters/secondary/uuid-generators/SequentialUuidGenerator'
import { ProductStatus, StockManagementMode } from '@core/entities/product'
import type { ProductImage } from '@core/entities/productImage'
import { CreateProductDTO } from '@core/usecases/product/product-creation/createProduct'
import { useFormStore } from '@store/formStore'
import { useLaboratoryStore } from '@store/laboratoryStore'
import { useProductStore } from '@store/productStore'
import { anaca3, avene, sanofiAventis } from '@utils/testData/laboratories'
import { createPinia, setActivePinia } from 'pinia'
import {
  CreateProductLaboratoriesVM,
  NewProductFormInitializer,
  ProductFormCreateVM,
  ProductFormFieldsWriter,
  productFormCreateVM
} from './productFormCreateVM'
import { ProductFormFieldsReader } from './productFormGetVM'

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
      productImages: [],
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
      { field: 'productImages', expected: expected.productImages },
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
          minStockToSell: 6,
          stockManagementMode: StockManagementMode.WINPHARMA,
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
        await vm.addImages(newImages)
        expectedDTO.categoryUuids.forEach((uuid) => {
          vm.toggleCategory(uuid)
        })
        vm.set('laboratory', expectedDTO.laboratory!.uuid)
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
          minStockToSell: 6,
          stockManagementMode: StockManagementMode.WINPHARMA,
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
        await vm.addImages(newImages)
        expectedDTO.categoryUuids.forEach((uuid) => {
          vm.toggleCategory(uuid)
        })
        vm.set('laboratory', expectedDTO.laboratory!.uuid)
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
          minStockToSell: 6,
          stockManagementMode: StockManagementMode.WINPHARMA,
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
        await vm.addImages(newImages)
        vm.set('laboratory', expectedDTO.laboratory!.uuid)
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
          minStockToSell: 6,
          stockManagementMode: StockManagementMode.WINPHARMA,
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
        await vm.addImages(newImages)
        vm.set('laboratory', expectedDTO.laboratory!.uuid)
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
  describe('Decimal separator', () => {
    it('should read a weight typed with a comma', () => {
      vm.set('weight', '0,5')
      expect(vm.getDto().weight).toBe(500)
    })
    it('should read a price typed with a comma', () => {
      vm.set('priceWithoutTax', '12,50')
      expect(vm.getDto().priceWithoutTax).toBe(1250)
    })
    it('should read a price formatted by the currency input', () => {
      vm.set('priceWithoutTax', '12,50 €')
      expect(vm.getDto().priceWithoutTax).toBe(1250)
    })
  })

  describe('Validation', () => {
    const fillRequiredFields = () => {
      vm.set('name', 'Doliprane 1000mg')
      vm.set('ean13', '1234567890123')
      vm.set('weight', '0,5')
      vm.set('priceWithoutTax', '12,50')
      vm.set('percentTaxRate', '20')
    }
    describe('Display validate', () => {
      it('should always display the validate button', () => {
        expect(vm.getDisplayValidate()).toBe(true)
      })
    })
    describe('Can validate', () => {
      it('should not allow to validate at start', () => {
        expect(vm.getCanValidate()).toBe(false)
      })
      it('should list every missing required field at start', () => {
        expect(vm.getValidationErrors()).toStrictEqual([
          { key: 'validation.name.required' },
          { key: 'validation.ean13.required' },
          { key: 'validation.weight.required' },
          { key: 'validation.priceWithoutTax.required' },
          { key: 'validation.percentTaxRate.required' }
        ])
      })
      it('should refuse an empty price', () => {
        fillRequiredFields()
        vm.set('priceWithoutTax', '')
        expect(vm.getValidationErrors()).toStrictEqual([
          { key: 'validation.priceWithoutTax.required' }
        ])
      })
      it('should refuse an empty tax rate', () => {
        fillRequiredFields()
        vm.set('percentTaxRate', '')
        expect(vm.getValidationErrors()).toStrictEqual([
          { key: 'validation.percentTaxRate.required' }
        ])
      })
      it('should accept a price deliberately set to zero', () => {
        fillRequiredFields()
        vm.set('priceWithoutTax', '0')
        expect(vm.getValidationErrors()).toStrictEqual([])
      })
      it('should accept a tax rate deliberately set to zero', () => {
        fillRequiredFields()
        vm.set('percentTaxRate', '0')
        expect(vm.getValidationErrors()).toStrictEqual([])
      })
      it('should allow to validate once required fields are filled', () => {
        fillRequiredFields()
        expect(vm.getCanValidate()).toBe(true)
      })
      it('should refuse a weight that is not a positive number', () => {
        fillRequiredFields()
        vm.set('weight', 'abc')
        expect(vm.getValidationErrors()).toStrictEqual([
          { key: 'validation.weight.gt', params: { min: 0 } }
        ])
      })
      it('should refuse a blank name', () => {
        fillRequiredFields()
        vm.set('name', '   ')
        expect(vm.getValidationErrors()).toStrictEqual([
          { key: 'validation.name.required' }
        ])
      })
    })
  })

  describe('Product images', () => {
    const uuidGenerator = new SequentialUuidGenerator('img')
    const fileA = new File(['a'], 'a.png', { type: 'image/png' })
    const fileB = new File(['b'], 'b.png', { type: 'image/png' })
    const fileC = new File(['c'], 'c.png', { type: 'image/png' })

    beforeEach(() => {
      uuidGenerator.reset()
      const fieldsReader = new ProductFormFieldsReader(key)
      const fieldsWriter = new ProductFormFieldsWriter(key, fieldsReader)
      vm = new ProductFormCreateVM(
        new NewProductFormInitializer(key),
        fieldsReader,
        fieldsWriter,
        uuidGenerator
      )
    })

    it('should keep the added images in the form store', async () => {
      await vm.addImages([fileA, fileB])
      const productImages = formStore.get(key)
        .productImages as Array<ProductImage>
      expect(productImages.map((image) => image.order)).toStrictEqual([0, 1])
    })

    it('should display the added images in order', async () => {
      await vm.addImages([fileA, fileB])
      expect(
        vm.getProductImagesForDisplay().map((image) => image.id)
      ).toStrictEqual(['img-0', 'img-1'])
    })

    it('should remove an image by its id', async () => {
      await vm.addImages([fileA, fileB, fileC])
      vm.removeImageById('img-1')
      expect(
        vm.getProductImagesForDisplay().map((image) => image.id)
      ).toStrictEqual(['img-0', 'img-2'])
    })

    it('should reorder images', async () => {
      await vm.addImages([fileA, fileB, fileC])
      vm.reorderImages(2, 0)
      expect(
        vm.getProductImagesForDisplay().map((image) => image.id)
      ).toStrictEqual(['img-2', 'img-0', 'img-1'])
    })

    it('should send the files in display order in the dto', async () => {
      await vm.addImages([fileA, fileB, fileC])
      vm.reorderImages(2, 0)
      expect(vm.getDto().images).toStrictEqual([fileC, fileA, fileB])
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

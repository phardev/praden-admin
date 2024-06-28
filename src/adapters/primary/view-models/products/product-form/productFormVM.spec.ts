import { createPinia, setActivePinia } from 'pinia'
import { useFormStore } from '@store/formStore'
import { useCategoryStore } from '@store/categoryStore'
import { medicaments, mumAndBaby } from '@utils/testData/categoriesDemoPraden'
import { minceur } from '@utils/testData/categories'
import {
  productFormCreateVM,
  ProductFormCreateVM
} from '@adapters/primary/view-models/products/product-form/productFormCreateVM'
import { type Field } from '@adapters/primary/view-models/promotions/promotion-form/promotionFormCreateVM'
import { CreateProductDTO } from '@core/usecases/product/product-creation/createProduct'
import {
  productFormEditVM,
  ProductFormEditVM
} from '@adapters/primary/view-models/products/product-form/productFormEditVM'
import {
  ProductFormGetVM,
  productFormGetVM
} from '@adapters/primary/view-models/products/product-form/productFormGetVM'
import { Product } from '@core/entities/product'
import { chamomilla, dolodent, ultraLevure } from '@utils/testData/products'
import { useProductStore } from '@store/productStore'
import { useLocationStore } from '@store/locationStore'
import { magasin, reserve, zoneGeo } from '@utils/testData/locations'
import { promotionFixedMultipleProducts } from '@utils/testData/promotions'

const editableInitialVMTests = (
  getVM: () => ProductFormCreateVM | ProductFormEditVM | ProductFormGetVM,
  key: string,
  expectedValue: any
) => {
  return initialVMTests(getVM, key, expectedValue, true)
}

const readOnlyInitialVMTests = (
  getVM: () => ProductFormCreateVM | ProductFormEditVM | ProductFormGetVM,
  key: string,
  expectedValue: any
) => {
  return initialVMTests(getVM, key, expectedValue, false)
}

const initialVMTests = (
  getVM: () => ProductFormCreateVM | ProductFormEditVM | ProductFormGetVM,
  key: string,
  expectedValue: any,
  editable: boolean
) => {
  let formStore: any
  let vm: any
  let categoryStore: any
  let locationStore: any

  beforeEach(() => {
    formStore = useFormStore()
    categoryStore = useCategoryStore()
    categoryStore.items = [medicaments, mumAndBaby, minceur]
    locationStore = useLocationStore()
    locationStore.items = [reserve, zoneGeo, magasin]
    vm = getVM()
  })
  describe.each([
    { field: 'name', expected: expectedValue.name },
    { field: 'categoryUuid', expected: expectedValue.categoryUuid },
    { field: 'cip7', expected: expectedValue.cip7 },
    { field: 'cip13', expected: expectedValue.cip13 },
    { field: 'ean13', expected: expectedValue.ean13 },
    { field: 'priceWithoutTax', expected: expectedValue.priceWithoutTax },
    { field: 'percentTaxRate', expected: expectedValue.percentTaxRate },
    { field: 'priceWithTax', expected: expectedValue.priceWithTax },
    { field: 'laboratory', expected: expectedValue.laboratory },
    { field: 'locations', expected: expectedValue.locations },
    { field: 'availableStock', expected: expectedValue.availableStock },
    { field: 'images', expected: expectedValue.images },
    { field: 'newImages', expected: expectedValue.newImages },
    { field: 'description', expected: expectedValue.description },
    { field: 'instructionsForUse', expected: expectedValue.instructionsForUse },
    { field: 'composition', expected: expectedValue.composition },
    { field: 'weight', expected: expectedValue.weight },
    { field: 'isMedecine', expected: expectedValue.isMedicine },
    {
      field: 'maxQuantityForOrder',
      expected: expectedValue.maxQuantityForOrder
    }
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
  describe('Locations choices', () => {
    it('should provide all locations', () => {
      expect(vm.getAvailableLocations()).toStrictEqual([
        {
          uuid: zoneGeo.uuid,
          name: zoneGeo.name
        },
        {
          uuid: reserve.uuid,
          name: reserve.name
        },
        {
          uuid: magasin.uuid,
          name: magasin.name
        }
      ])
    })
  })
  describe('Promotion', () => {
    it('should provide the promotion', () => {
      expect(vm.getPromotion()).toStrictEqual(expectedValue.promotion)
    })
  })
}

export const updateFieldsTests = (
  getVM: () => ProductFormCreateVM | ProductFormEditVM,
  key: string
) => {
  let formStore: any
  let vm: ProductFormCreateVM
  beforeEach(() => {
    formStore = useFormStore()
    vm = getVM()
  })
  describe.each([
    { field: 'name', value: 'test', expected: 'test' },
    { field: 'categoryUuid', value: 'new-uuid', expected: 'new-uuid' },
    { field: 'cip7', value: 'cip7', expected: 'cip7' },
    { field: 'cip13', value: 'cip13', expected: 'cip13' },
    { field: 'ean13', value: 'ean13', expected: 'ean13' },
    { field: 'laboratory', value: 'laboratory', expected: 'laboratory' },
    { field: 'availableStock', value: 13, expected: 13 },
    { field: 'description', value: 'description', expected: 'description' },
    {
      field: 'instructionsForUse',
      value: 'instructionsForUse',
      expected: 'instructionsForUse'
    },
    { field: 'composition', value: 'composition', expected: 'composition' },
    { field: 'weight', value: '0.12', expected: '0.12' },
    { field: 'maxQuantityForOrder', value: '6', expected: '6' }
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
        formStore.set(key, { percentTaxRate: undefined })
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
      it('should clear price with tax', () => {
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
        formStore.set(key, { percentTaxRate: '5.5' })
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
        formStore.set(key, {
          priceWithoutTax: undefined,
          priceWithTax: undefined
        })
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
      it('should not update price without tax field', () => {
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
        formStore.set(key, { priceWithoutTax: '20', priceWithTax: undefined })
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
        formStore.set(key, { priceWithoutTax: undefined, priceWithTax: '20' })
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
        formStore.set(key, { priceWithoutTax: '20', priceWithTax: '100' })
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
    describe('Tax rate and price without tax are not already defined', () => {
      beforeEach(() => {
        formStore.set(key, {
          priceWithoutTax: undefined,
          percentTaxRate: undefined
        })
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
    let oldImages
    beforeEach(async () => {
      oldImages = JSON.parse(JSON.stringify(vm.get('images').value))
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
          ...oldImages,
          'data:image/png;base64,ZGF0YTE=',
          'data:image/jpeg;base64,ZGF0YTI=',
          'data:image/gif;base64,ZGF0YTM='
        ],
        canEdit: true
      }
      expect(vm.get('images')).toStrictEqual(expectedImages)
    })
  })
  describe('Update locations', () => {
    let location: any
    let expectedLocations: any
    let alreadyPresentLocation: any
    describe('The locations are not set', () => {
      beforeEach(() => {
        alreadyPresentLocation = {}
        location = { uuid: zoneGeo.uuid, value: 'new-location' }
        expectedLocations = {
          [zoneGeo.uuid]: location.value
        }
        formStore.set(key, { locations: alreadyPresentLocation })
        vm.set('locations', location)
      })
      it('should update locations value in form store', () => {
        expect(formStore.get(key).locations).toStrictEqual(expectedLocations)
      })
      it('should update locations field', () => {
        const expectedField: Field<string> = {
          value: expectedLocations,
          canEdit: true
        }
        expect(vm.get('locations')).toStrictEqual(expectedField)
      })
    })
    describe('The location is already set', () => {
      beforeEach(() => {
        alreadyPresentLocation = {
          [zoneGeo.uuid]: 'old-location'
        }
        location = { uuid: zoneGeo.uuid, value: 'new-location' }
        expectedLocations = {
          [zoneGeo.uuid]: location.value
        }
        formStore.set(key, { locations: alreadyPresentLocation })
        vm.set('locations', location)
      })
      it('should update locations value in form store', () => {
        expect(formStore.get(key).locations).toStrictEqual(expectedLocations)
      })
      it('should update locations field', () => {
        const expectedField: Field<string> = {
          value: expectedLocations,
          canEdit: true
        }
        expect(vm.get('locations')).toStrictEqual(expectedField)
      })
    })
    describe('Another location is already set', () => {
      beforeEach(() => {
        alreadyPresentLocation = {
          [zoneGeo.uuid]: 'zonegeo-location'
        }
        location = { uuid: reserve.uuid, value: 'reserve-location' }
        expectedLocations = {
          [zoneGeo.uuid]: 'zonegeo-location',
          [reserve.uuid]: location.value
        }
        formStore.set(key, { locations: alreadyPresentLocation })
        vm.set('locations', location)
      })
      it('should update the right location value in form store', () => {
        expect(formStore.get(key).locations).toStrictEqual(expectedLocations)
      })
      it('should update locations field', () => {
        const expectedField: Field<string> = {
          value: expectedLocations,
          canEdit: true
        }
        expect(vm.get('locations')).toStrictEqual(expectedField)
      })
    })
  })
}

describe('Product form VM', () => {
  let locationStore: any
  beforeEach(() => {
    setActivePinia(createPinia())
    locationStore = useLocationStore()
    locationStore.items = [reserve, zoneGeo, magasin]
  })
  describe('Product form create VM', () => {
    let vm: ProductFormCreateVM
    const key = 'create-product-key'

    beforeEach(() => {
      vm = productFormCreateVM(key)
    })

    describe('Initial VM', () => {
      const expected: any = {
        name: '',
        categoryUuid: undefined,
        cip7: '',
        cip13: '',
        ean13: '',
        images: [],
        newImages: [],
        priceWithoutTax: undefined,
        percentTaxRate: undefined,
        locations: {},
        availableStock: '',
        laboratory: '',
        description: '',
        instructionsForUse: '',
        composition: '',
        weight: '',
        maxQuantityForOrder: ''
      }
      editableInitialVMTests(() => vm, key, expected)
    })
    describe('Update', () => {
      updateFieldsTests(() => vm, key)
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
            locations: {},
            availableStock: '21',
            description: '<p>description</p>',
            instructionsForUse: '<p>instructionsForUse</p>',
            composition: '<p>composition</p>',
            weight: 1200,
            maxQuantityForOrder: 12
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
          vm.set('locations', expectedDTO.locations)
          vm.set('availableStock', expectedDTO.availableStock)
          vm.set('description', expectedDTO.description)
          vm.set('instructionsForUse', expectedDTO.instructionsForUse)
          vm.set('composition', expectedDTO.composition)
          vm.set('weight', '1.2')
          vm.set('maxQuantityForOrder', '12')
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
  describe('Product form edit VM', () => {
    let vm: ProductFormEditVM
    const key = 'edit-product-key'
    let productStore: any
    const availableProducts: Array<Product> = [
      dolodent,
      chamomilla,
      ultraLevure
    ]

    const product = ultraLevure
    beforeEach(() => {
      productStore = useProductStore()
      productStore.items = availableProducts
      productStore.current = { product }
      vm = productFormEditVM(key)
    })

    describe('Initial VM', () => {
      const expected: any = {
        name: product.name,
        categoryUuid: product.categoryUuid,
        cip7: product.cip7,
        cip13: product.cip13,
        ean13: product.ean13,
        images: product.images,
        newImages: [],
        priceWithoutTax: '4.32',
        priceWithTax: '4.75',
        percentTaxRate: product.percentTaxRate,
        locations: {
          [zoneGeo.uuid]: 'C3',
          [reserve.uuid]: 'RESERVE_1'
        },
        availableStock: product.availableStock,
        laboratory: product.laboratory,
        description: product.description,
        instructionsForUse: product.instructionsForUse,
        composition: product.composition,
        weight: '0.012',
        maxQuantityForOrder: product.maxQuantityForOrder
      }
      editableInitialVMTests(() => vm, key, expected)
    })
    describe('Update', () => {
      updateFieldsTests(() => vm, key)
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
            locations: {
              [zoneGeo.uuid]: 'G2',
              [reserve.uuid]: 'RESERVE_1'
            },
            availableStock: '21',
            description: '<p>description</p>',
            instructionsForUse: '<p>instructionsForUse</p>',
            composition: '<p>composition</p>',
            weight: 125,
            maxQuantityForOrder: 6
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
          vm.set('locations', { uuid: zoneGeo.uuid, value: 'G2' })
          vm.set('availableStock', expectedDTO.availableStock)
          vm.set('description', expectedDTO.description)
          vm.set('instructionsForUse', expectedDTO.instructionsForUse)
          vm.set('composition', expectedDTO.composition)
          vm.set('weight', '0.125')
          vm.set('maxQuantityForOrder', '6')
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

  describe('Product form get VM', () => {
    let vm: ProductFormGetVM
    let productStore: any
    const availableProducts: Array<Product> = [
      dolodent,
      chamomilla,
      ultraLevure
    ]
    const key = 'get-product-key'

    const product = ultraLevure
    beforeEach(() => {
      productStore = useProductStore()
      productStore.items = availableProducts
      productStore.current = {
        product,
        promotion: promotionFixedMultipleProducts
      }
      vm = productFormGetVM(key)
    })

    describe('Initial VM', () => {
      const expected: any = {
        name: product.name,
        categoryUuid: product.categoryUuid,
        cip7: product.cip7,
        cip13: product.cip13,
        ean13: product.ean13,
        images: product.images,
        newImages: [],
        priceWithoutTax: '4.32',
        priceWithTax: '4.75',
        percentTaxRate: product.percentTaxRate,
        locations: {
          [zoneGeo.uuid]: 'C3',
          [reserve.uuid]: 'RESERVE_1'
        },
        availableStock: product.availableStock,
        laboratory: product.laboratory,
        description: product.description,
        instructionsForUse: product.instructionsForUse,
        composition: product.composition,
        weight: '0.012',
        maxQuantityForOrder: product.maxQuantityForOrder,
        promotion: {
          href: `/promotions/get/${promotionFixedMultipleProducts.uuid}`,
          type: 'FIXE',
          amount: '1,00\u00A0€',
          startDate: '27 juil. 2023',
          startDatetime: new Date('2023-07-27T00:00:00.000Z'),
          endDate: '27 août 2023',
          endDatetime: new Date('2023-08-27T00:00:00.000Z')
        }
      }
      readOnlyInitialVMTests(() => vm, key, expected)
    })
    describe('Validation', () => {
      describe('Display validate', () => {
        it('should always display the validate button', () => {
          expect(vm.getDisplayValidate()).toBe(false)
        })
      })
      describe('Can validate', () => {
        it('should allow to validate at start', () => {
          expect(vm.getCanValidate()).toBe(false)
        })
      })
    })
  })
})

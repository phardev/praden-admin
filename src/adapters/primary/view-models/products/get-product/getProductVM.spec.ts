import { baby, dents, minceur, mum } from '@utils/testData/categories'
import { Field } from '@adapters/primary/view-models/promotions/create-promotion/createPromotionVM'
import { createPinia, setActivePinia } from 'pinia'
import { useFormStore } from '@store/formStore'
import { UUID } from '@core/types/types'
import {
  getProductVM,
  GetProductVM
} from '@adapters/primary/view-models/products/get-product/getProductVM'
import { chamomilla, dolodent, ultraLevure } from '@utils/testData/products'
import { Product } from '@core/entities/product'
import { useProductStore } from '@store/productStore'
import { useCategoryStore } from '@store/categoryStore'
import { Category } from '@core/entities/category'

describe('Get product VM', () => {
  let formStore: any
  let productStore: any
  let categoryStore: any
  const key = 'testRoute'
  let vm: GetProductVM
  const availableCategories: Array<Category> = [baby, dents, minceur, mum]
  const availableProducts: Array<Product> = [dolodent, chamomilla, ultraLevure]

  beforeEach(() => {
    setActivePinia(createPinia())
    formStore = useFormStore()
    productStore = useProductStore()
    productStore.items = availableProducts
    categoryStore = useCategoryStore()
    categoryStore.items = availableCategories
  })
  describe('Initial VM', () => {
    const product = ultraLevure
    beforeEach(() => {
      productStore.current = product
      vm = getProductVM(key)
    })
    describe('Name field', () => {
      it('should have an empty name', () => {
        const expectedField: Field<string> = {
          value: product.name,
          canEdit: false
        }
        expect(vm.getName()).toStrictEqual(expectedField)
      })
      it('should save the name value in form store', () => {
        expect(formStore.get(key).name).toStrictEqual(product.name)
      })
    })
    describe('Category choices', () => {
      it('should provide all categories', () => {
        expect(vm.getAvailableCategories()).toStrictEqual([
          {
            uuid: baby.uuid,
            name: baby.name
          },
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
    describe('Category selected', () => {
      it('should have the product category selected', () => {
        const expectedField: Field<UUID | undefined> = {
          value: product.categoryUuid,
          canEdit: false
        }
        expect(vm.getCategoryUuid()).toStrictEqual(expectedField)
      })
      it('should not have any category selected in form store', () => {
        expect(formStore.get(key).categoryUuid).toBe(product.categoryUuid)
      })
    })
    describe('Cip7 field', () => {
      it('should have the product cip', () => {
        const expectedField: Field<string> = {
          value: product.cip7,
          canEdit: false
        }
        expect(vm.getCip7()).toStrictEqual(expectedField)
      })
      it('should save the cip7 value in form store', () => {
        expect(formStore.get(key).cip7).toStrictEqual(product.cip7)
      })
    })
    describe('Cip13 field', () => {
      it('should have the product cip13', () => {
        const expectedField: Field<string> = {
          value: product.cip13,
          canEdit: false
        }
        expect(vm.getCip13()).toStrictEqual(expectedField)
      })
      it('should save the cip13 value in form store', () => {
        expect(formStore.get(key).cip13).toStrictEqual(product.cip13)
      })
    })
    describe('EAN13 field', () => {
      it('should have the product ean13', () => {
        const expectedField: Field<string> = {
          value: product.ean13,
          canEdit: false
        }
        expect(vm.getEan13()).toStrictEqual(expectedField)
      })
      it('should save the ean13 value in form store', () => {
        expect(formStore.get(key).ean13).toStrictEqual(product.ean13)
      })
    })
    describe('Price without tax', () => {
      it('should have the price without tax', () => {
        const expectedField: Field<string | undefined> = {
          value: '4.32',
          canEdit: false
        }
        expect(vm.getPriceWithoutTax()).toStrictEqual(expectedField)
      })
      it('should not have any price without tax in form store', () => {
        expect(formStore.get(key).priceWithoutTax).toBe('4.32')
      })
    })
    describe('Percent tax rate', () => {
      it('should get tax rate', () => {
        const expectedField: Field<number | undefined> = {
          value: 10,
          canEdit: false
        }
        expect(vm.getPercentTaxRate()).toStrictEqual(expectedField)
      })
      it('should not have any percent tax rate in form store', () => {
        expect(formStore.get(key).percentTaxRate).toBe(10)
      })
    })
    describe('Price with tax', () => {
      it('should have the price with tax', () => {
        const expectedField: Field<string | undefined> = {
          value: '4.75',
          canEdit: false
        }
        expect(vm.getPriceWithTax()).toStrictEqual(expectedField)
      })
      it('should not have any price with tax in form store', () => {
        expect(formStore.get(key).priceWithTax).toBe('4.75')
      })
    })
    describe('Laboratory field', () => {
      it('should have the laboratory', () => {
        const expectedField: Field<string> = {
          value: product.laboratory,
          canEdit: false
        }
        expect(vm.getLaboratory()).toStrictEqual(expectedField)
      })
      it('should save the laboratory in form store', () => {
        expect(formStore.get(key).laboratory).toBe(product.laboratory)
      })
    })
    describe('Location field', () => {
      it('should have the location', () => {
        const expectedField: Field<string> = {
          value: product.location,
          canEdit: false
        }
        expect(vm.getLocation()).toStrictEqual(expectedField)
      })
      it('should save the location in form store', () => {
        expect(formStore.get(key).location).toBe(product.location)
      })
    })
    describe('Available stock field', () => {
      it('should have an empty available stock', () => {
        const expectedField: Field<number> = {
          value: product.availableStock,
          canEdit: false
        }
        expect(vm.getAvailableStock()).toStrictEqual(expectedField)
      })
      it('should save the available stock in form store', () => {
        expect(formStore.get(key).availableStock).toBe(product.availableStock)
      })
    })
    describe('Images', () => {
      it('should get the images', () => {
        const expectedField: Array<string> = product.images
        expect(vm.getImages()).toStrictEqual(expectedField)
      })
    })
    describe('New images', () => {
      it('should have an empty array', () => {
        const expectedField: Field<Array<File>> = {
          value: [],
          canEdit: false
        }
        expect(vm.getNewImages()).toStrictEqual(expectedField)
      })
      it('should save the new images in form store', () => {
        expect(formStore.get(key).newImages).toStrictEqual([])
      })
    })
    describe('Description field', () => {
      it('should have the description', () => {
        const expectedField: Field<string> = {
          value: product.description,
          canEdit: false
        }
        expect(vm.getDescription()).toStrictEqual(expectedField)
      })
      it('should save the description in form store', () => {
        expect(formStore.get(key).description).toBe(product.description)
      })
    })
    describe('Instruction for use field', () => {
      it('should have the instructions', () => {
        const expectedField: Field<string> = {
          value: product.instructionsForUse,
          canEdit: false
        }
        expect(vm.getInstructionsForUse()).toStrictEqual(expectedField)
      })
      it('should save the instructions in form store', () => {
        expect(formStore.get(key).instructionsForUse).toBe(
          product.instructionsForUse
        )
      })
    })
    describe('Composition field', () => {
      it('should have the composition', () => {
        const expectedField: Field<string> = {
          value: product.composition,
          canEdit: false
        }
        expect(vm.getComposition()).toStrictEqual(expectedField)
      })
      it('should save the composition in form store', () => {
        expect(formStore.get(key).composition).toBe(product.composition)
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
})

import {
  CategoryFormCreateVM,
  categoryFormCreateVM
} from '@adapters/primary/view-models/categories/category-form/categoryFormCreateVM'
import {
  CategoryAvailableProductItemVM,
  CategoryProductItemVM
} from '@adapters/primary/view-models/categories/category-form/categoryFormVM'
import { Header } from '@adapters/primary/view-models/preparations/get-orders-to-prepare/getPreparationsVM'
import {
  Field,
  PromotionProductItemVM
} from '@adapters/primary/view-models/promotions/promotion-form/promotionFormCreateVM'
import { Category } from '@core/entities/category'
import { Product } from '@core/entities/product'
import { CreateCategoryDTO } from '@core/usecases/categories/category-creation/createCategory'
import { useCategoryStore } from '@store/categoryStore'
import { useFormStore } from '@store/formStore'
import { useProductStore } from '@store/productStore'
import { useSearchStore } from '@store/searchStore'
import { baby, dents, minceur, mum } from '@utils/testData/categories'
import {
  anaca3Minceur,
  calmosine,
  chamomilla,
  dolodent,
  productWithoutCategory,
  ultraLevure
} from '@utils/testData/products'
import { createPinia, setActivePinia } from 'pinia'

const anaca3VM: CategoryProductItemVM = {
  uuid: anaca3Minceur.uuid,
  name: anaca3Minceur.name,
  reference: anaca3Minceur.ean13,
  categories: anaca3Minceur.categories.map((c) => c.name),
  laboratory: anaca3Minceur.laboratory!.name
}

const calmosineVM: CategoryProductItemVM = {
  uuid: calmosine.uuid,
  name: calmosine.name,
  reference: calmosine.ean13,
  categories: calmosine.categories.map((c) => c.name),
  laboratory: calmosine.laboratory!.name
}

const dolodentVM: CategoryProductItemVM = {
  uuid: dolodent.uuid,
  name: dolodent.name,
  reference: dolodent.ean13,
  categories: dolodent.categories.map((c) => c.name),
  laboratory: dolodent.laboratory!.name
}

const chamomillaVM: CategoryProductItemVM = {
  uuid: chamomilla.uuid,
  name: chamomilla.name,
  reference: chamomilla.ean13,
  categories: chamomilla.categories.map((c) => c.name),
  laboratory: chamomilla.laboratory!.name
}

const productWithoutCategoryVM: CategoryProductItemVM = {
  uuid: productWithoutCategory.uuid,
  name: productWithoutCategory.name,
  reference: productWithoutCategory.ean13,
  categories: [],
  laboratory: productWithoutCategory.laboratory!.name
}

const availableAnaca3VM: CategoryAvailableProductItemVM = anaca3VM
const availableCalmosineVM: CategoryAvailableProductItemVM = calmosineVM
const availableDolodentVM: CategoryAvailableProductItemVM = dolodentVM
const availableChamomillaVM: CategoryAvailableProductItemVM = chamomillaVM
const availableProductWithoutCategoryVM: CategoryAvailableProductItemVM =
  productWithoutCategoryVM

const expectedProductsHeader: Array<Header> = [
  {
    name: 'Nom',
    value: 'name'
  },
  {
    name: 'Référence',
    value: 'reference'
  },
  {
    name: 'Catégories',
    value: 'categories'
  },
  {
    name: 'Laboratoire',
    value: 'laboratory'
  }
]

const expectedAvailableProductsHeader: Array<Header> = [
  {
    name: 'Nom',
    value: 'name'
  },
  {
    name: 'Référence',
    value: 'reference'
  },
  {
    name: 'Catégories',
    value: 'categories'
  },
  {
    name: 'Laboratoire',
    value: 'laboratory'
  }
]

describe('Category form create VM', () => {
  let categoryStore: any
  let productStore: any
  let formStore: any
  let searchStore: any
  const key = 'create-category-form'
  let vm: CategoryFormCreateVM

  beforeEach(() => {
    setActivePinia(createPinia())
    categoryStore = useCategoryStore()
    productStore = useProductStore()
    formStore = useFormStore()
    searchStore = useSearchStore()
  })
  describe('Initial VM', () => {
    beforeEach(() => {
      givenExistingProducts(
        dolodent,
        anaca3Minceur,
        chamomilla,
        calmosine,
        productWithoutCategory
      )
      vm = getVM()
    })
    describe.each([
      { field: 'name', expected: '' },
      { field: 'description', expected: '' },
      { field: 'miniature', expected: undefined },
      { field: 'img', expected: undefined },
      { field: 'parentUuid', expected: undefined }
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
    describe('Category choices', () => {
      it('should provide an empty array', () => {
        expect(vm.getAvailableCategories()).toStrictEqual([])
      })
    })
    describe('Products', () => {
      describe('Products in category', () => {
        it('should get the products headers', () => {
          expect(vm.getProductsHeaders()).toStrictEqual(expectedProductsHeader)
        })
        it('should get the products', () => {
          const expectedProductsField = {
            value: [],
            canEdit: true
          }
          expect(vm.getProducts()).toStrictEqual(expectedProductsField)
        })
      })
      describe('Products not in category', () => {
        beforeEach(() => {
          givenExistingCategories(mum, baby, minceur, dents)
        })
        it('should get the available products headers', () => {
          expect(vm.getAvailableProductsHeaders()).toStrictEqual(
            expectedAvailableProductsHeader
          )
        })
        it('should get the available products', () => {
          const expectedField = {
            value: [
              availableDolodentVM,
              availableAnaca3VM,
              availableChamomillaVM,
              availableCalmosineVM,
              availableProductWithoutCategoryVM
            ],
            canEdit: true
          }
          expect(vm.getAvailableProducts()).toStrictEqual(expectedField)
        })
      })
    })
  })
  describe('Update fields', () => {
    beforeEach(() => {
      categoryStore.current = { category: baby, products: [dolodent.uuid] }
      givenExistingProducts(dolodent, anaca3Minceur, chamomilla, calmosine)
      vm = getVM()
    })
    describe.each([
      { field: 'name', value: 'New name', expected: 'New name' },
      {
        field: 'description',
        value: 'the new description',
        expected: 'the new description'
      },
      {
        field: 'miniature',
        value: new File(['miniature'], 'Miniature 1', { type: 'image/png' }),
        expected: 'data:image/png;base64,bWluaWF0dXJl'
      },
      { field: 'parentUuid', value: 'new-uuid', expected: 'new-uuid' }
    ])('Update simple fields', ({ field, value, expected }) => {
      it(`should update ${field} value in form store`, async () => {
        await vm.set(field, value)
        expect(formStore.get(key)[field]).toStrictEqual(expected)
      })
      it(`should update ${field} field`, async () => {
        await vm.set(field, value)
        const expectedField: Field<any> = {
          value: expected,
          canEdit: true
        }
        expect(vm.get(field)).toStrictEqual(expectedField)
      })
    })
    describe('Update products', () => {
      describe('Add products', () => {
        beforeEach(() => {
          givenExistingCategories(dents, baby, minceur)
        })
        describe('In one step', () => {
          const selectedProducts = [dolodent.uuid, anaca3Minceur.uuid]
          let expectedProducts: any
          beforeEach(() => {
            givenExistingProducts(dolodent, anaca3Minceur, calmosine)
            const expectedSet = new Set<string>(formStore.get(key).products)
            expectedProducts = [...expectedSet, dolodent, anaca3Minceur]
            vm.addProducts(selectedProducts)
          })
          it('should add selected products to form store', () => {
            expect(formStore.get(key).products).toStrictEqual(expectedProducts)
          })
          it('should get all products vm', () => {
            const expectedField: Field<Array<CategoryProductItemVM>> = {
              value: [dolodentVM, anaca3VM],
              canEdit: true
            }
            expect(vm.getProducts()).toStrictEqual(expectedField)
          })
          it('should remove products from available selection', () => {
            const expectedField: Field<Array<PromotionProductItemVM>> = {
              value: [availableCalmosineVM],
              canEdit: true
            }
            expect(vm.getAvailableProducts()).toStrictEqual(expectedField)
          })
        })
        describe('In multiple steps', () => {
          beforeEach(() => {
            givenExistingProducts(dolodent, anaca3Minceur)
            vm.addProducts([dolodent.uuid])
            vm.addProducts([anaca3Minceur.uuid])
          })
          it('should add selected products to form store', () => {
            expect(formStore.get(key).products).toStrictEqual([
              dolodent,
              anaca3Minceur
            ])
          })
          it('should get all products vm', () => {
            const expectedField: Field<Array<CategoryProductItemVM>> = {
              value: [dolodentVM, anaca3VM],
              canEdit: true
            }
            expect(vm.getProducts()).toStrictEqual(expectedField)
          })
        })
        describe('Add products from search result', () => {
          beforeEach(() => {
            givenExistingProducts()
            givenExistingSearchResult(dolodent, anaca3Minceur, calmosine)
            vm.addProducts([dolodent.uuid, anaca3Minceur.uuid])
          })
          it('should add selected products to form store', () => {
            expect(formStore.get(key).products).toStrictEqual([
              dolodent,
              anaca3Minceur
            ])
          })
          it('should get all products vm', () => {
            const expectedField: Field<Array<CategoryProductItemVM>> = {
              value: [dolodentVM, anaca3VM],
              canEdit: true
            }
            expect(vm.getProducts()).toStrictEqual(expectedField)
          })
          it('should remove products from available selection', () => {
            const expectedField: Field<Array<PromotionProductItemVM>> = {
              value: [availableCalmosineVM],
              canEdit: true
            }
            expect(vm.getAvailableProducts()).toStrictEqual(expectedField)
          })
        })
      })
      describe('Remove products', () => {
        beforeEach(() => {
          givenExistingProducts(dolodent, anaca3Minceur, calmosine)
          givenExistingCategories(dents, baby, minceur)
          formStore.set(key, {
            products: productStore.items
          })
        })
        describe('In one step', () => {
          beforeEach(() => {
            vm.removeProducts([dolodent.uuid])
          })
          it('should add selected products to form store', () => {
            expect(formStore.get(key).products).toStrictEqual([
              anaca3Minceur,
              calmosine
            ])
          })
          it('should get all products vm', () => {
            const expectedField: Field<Array<CategoryProductItemVM>> = {
              value: [anaca3VM, calmosineVM],
              canEdit: true
            }
            expect(vm.getProducts()).toStrictEqual(expectedField)
          })
          it('should remove products from available selection', () => {
            const expectedField: Field<Array<CategoryProductItemVM>> = {
              value: [availableDolodentVM],
              canEdit: true
            }
            expect(vm.getAvailableProducts()).toStrictEqual(expectedField)
          })
        })
        describe('In multiple steps', () => {
          beforeEach(() => {
            vm.removeProducts([dolodent.uuid])
            vm.removeProducts([anaca3Minceur.uuid])
          })
          it('should add selected products to form store', () => {
            expect(formStore.get(key).products).toStrictEqual([calmosine])
          })
          it('should get all products vm', () => {
            const expectedField: Field<Array<CategoryProductItemVM>> = {
              value: [calmosineVM],
              canEdit: true
            }
            expect(vm.getProducts()).toStrictEqual(expectedField)
          })
        })
      })
    })
    describe('Update image', () => {
      const value = new File(['image'], 'IMG 1', { type: 'image/jpg' })
      beforeEach(async () => {
        await vm.set('image', value)
      })
      describe('Image', () => {
        const expected = 'data:image/jpg;base64,aW1hZ2U='
        it('should update image field in store', () => {
          const expectedField: Field<any> = {
            value: expected,
            canEdit: true
          }
          expect(vm.get('image')).toStrictEqual(expectedField)
        })
        it('should update image field', () => {
          expect(formStore.get(key)['image']).toStrictEqual(expected)
        })
      })
      it('should update new image value in store', () => {
        expect(formStore.get(key)['newImage']).toStrictEqual(value)
      })
    })
  })
  describe('DTO', () => {
    beforeEach(() => {
      vm = getVM()
    })
    describe('For a simple dto', () => {
      it('should prepare the dto', () => {
        const expectedDTO: CreateCategoryDTO = {
          name: 'test',
          parentUuid: 'abc123',
          description: 'description',
          miniature: undefined,
          image: undefined,
          productsAdded: []
        }
        vm.set('name', expectedDTO.name)
        vm.set('parentUuid', expectedDTO.parentUuid)
        vm.set('description', expectedDTO.description)
        expect(vm.getDto()).toStrictEqual(expectedDTO)
      })
    })
    describe('For a dto with added products', () => {
      it('should prepare the dto for one added product', () => {
        const expectedDTO: CreateCategoryDTO = {
          name: '',
          parentUuid: undefined,
          description: '',
          miniature: undefined,
          image: undefined,
          productsAdded: [chamomilla.uuid]
        }
        givenExistingProducts(chamomilla)
        vm.addProducts([chamomilla.uuid])
        expect(vm.getDto()).toStrictEqual(expectedDTO)
      })
      it('should prepare the dto for multiple added products', () => {
        const expectedDTO: CreateCategoryDTO = {
          name: '',
          parentUuid: undefined,
          description: '',
          miniature: undefined,
          image: undefined,
          productsAdded: [ultraLevure.uuid, chamomilla.uuid]
        }
        givenExistingProducts(ultraLevure, chamomilla)
        vm.addProducts([ultraLevure.uuid, chamomilla.uuid])
        expect(vm.getDto()).toStrictEqual(expectedDTO)
      })
      it('should not add already existing products', () => {
        const expectedDTO: CreateCategoryDTO = {
          name: '',
          parentUuid: undefined,
          description: '',
          miniature: undefined,
          image: undefined,
          productsAdded: [dolodent.uuid]
        }
        givenExistingProducts(dolodent)
        vm.addProducts([dolodent.uuid])
        vm.addProducts([dolodent.uuid])
        expect(vm.getDto()).toStrictEqual(expectedDTO)
      })
    })
    describe('Manage complex dto', () => {
      it('should manage a complex dto with multiple add', () => {
        vm = getVM()
        const expectedDTO: CreateCategoryDTO = {
          name: baby.name,
          parentUuid: baby.parentUuid,
          description: baby.description,
          miniature: undefined,
          image: undefined,
          productsAdded: [ultraLevure.uuid, chamomilla.uuid, anaca3Minceur.uuid]
        }
        givenExistingProducts(ultraLevure, chamomilla, anaca3Minceur)
        vm.set('name', baby.name)
        vm.addProducts([ultraLevure.uuid])
        vm.removeProducts([ultraLevure.uuid, chamomilla.uuid])
        vm.addProducts([ultraLevure.uuid, chamomilla.uuid])
        vm.set('description', baby.description)
        vm.set('parentUuid', baby.parentUuid)
        vm.addProducts([anaca3Minceur.uuid])
        vm.removeProducts([dolodent.uuid])
        expect(vm.getDto()).toStrictEqual(expectedDTO)
      })
    })
    describe('For a dto with image', () => {
      it('should get the image', async () => {
        const newImage = new File(['miniature'], 'Miniature 1', {
          type: 'image/png'
        })
        const expectedDTO: CreateCategoryDTO = {
          name: '',
          parentUuid: undefined,
          description: '',
          miniature: undefined,
          image: newImage,
          productsAdded: []
        }
        await vm.set('image', newImage)
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
  describe('Loading', () => {
    it('should be aware during loading', () => {
      categoryStore.isLoading = true
      expect(vm.isLoading()).toBe(true)
    })
    it('should be aware when not loading', () => {
      categoryStore.isLoading = false
      expect(vm.isLoading()).toBe(false)
    })
  })

  const givenExistingProducts = (...products: Array<Product>) => {
    productStore.items = products
  }

  const givenExistingSearchResult = (...products: Array<Product>) => {
    searchStore.items[key] = products
  }

  const givenExistingCategories = (...categories: Array<Category>) => {
    categoryStore.items = categories
  }

  const getVM = (): CategoryFormCreateVM => {
    return categoryFormCreateVM(key)
  }
})

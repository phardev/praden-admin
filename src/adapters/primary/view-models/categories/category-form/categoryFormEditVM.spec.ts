import {
  Field,
  PromotionProductItemVM
} from '@adapters/primary/view-models/promotions/promotion-form/promotionFormCreateVM'
import { useFormStore } from '@store/formStore'
import { useCategoryStore } from '@store/categoryStore'
import { baby, dents, minceur, mum } from '@utils/testData/categories'
import { createPinia, setActivePinia } from 'pinia'
import { Header } from '@adapters/primary/view-models/preparations/get-orders-to-prepare/getPreparationsVM'
import {
  anaca3Minceur,
  calmosine,
  chamomilla,
  dolodent,
  productWithoutCategory,
  ultraLevure
} from '@utils/testData/products'
import { Product } from '@core/entities/product'
import { useProductStore } from '@store/productStore'
import {
  CategoryAvailableProductItemVM,
  CategoryProductItemVM
} from '@adapters/primary/view-models/categories/category-form/categoryFormVM'
import {
  categoryFormEditVM,
  CategoryFormEditVM
} from '@adapters/primary/view-models/categories/category-form/categoryFormEditVM'
import { Category } from '@core/entities/category'
import { EditCategoryDTO } from '@core/usecases/categories/category-edition/editCategory'
import { useSearchStore } from '@store/searchStore'

const anaca3VM: CategoryProductItemVM = {
  uuid: anaca3Minceur.uuid,
  name: anaca3Minceur.name,
  reference: anaca3Minceur.cip13,
  laboratory: anaca3Minceur.laboratory
}

const calmosineVM: CategoryProductItemVM = {
  uuid: calmosine.uuid,
  name: calmosine.name,
  reference: calmosine.cip13,
  laboratory: calmosine.laboratory
}

const dolodentVM: CategoryProductItemVM = {
  uuid: dolodent.uuid,
  name: dolodent.name,
  reference: dolodent.cip13,
  laboratory: dolodent.laboratory
}

const chamomillaVM: CategoryProductItemVM = {
  uuid: chamomilla.uuid,
  name: chamomilla.name,
  reference: chamomilla.cip13,
  laboratory: chamomilla.laboratory
}

const productWithoutCategoryVM: CategoryProductItemVM = {
  uuid: productWithoutCategory.uuid,
  name: productWithoutCategory.name,
  reference: productWithoutCategory.cip13,
  laboratory: productWithoutCategory.laboratory
}

const availableAnaca3VM: CategoryAvailableProductItemVM = {
  ...anaca3VM,
  categories: [minceur.name]
}

const availableCalmosineVM: CategoryAvailableProductItemVM = {
  ...calmosineVM,
  categories: [baby.name]
}

const availableDolodentVM: CategoryAvailableProductItemVM = {
  ...dolodentVM,
  categories: [dents.name]
}

const availableChamomillaVM: CategoryAvailableProductItemVM = {
  ...chamomillaVM,
  categories: [dents.name]
}

const availableProductWithoutCategoryVM: CategoryAvailableProductItemVM = {
  ...productWithoutCategoryVM,
  categories: []
}

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
    name: 'Catégorie',
    value: 'category'
  },
  {
    name: 'Laboratoire',
    value: 'laboratory'
  }
]

describe('Category form edit VM', () => {
  let categoryStore: any
  let productStore: any
  let formStore: any
  let searchStore: any
  const key = 'edit-category-form'
  let vm: CategoryFormEditVM

  beforeEach(() => {
    setActivePinia(createPinia())
    categoryStore = useCategoryStore()
    productStore = useProductStore()
    formStore = useFormStore()
    searchStore = useSearchStore()
  })
  describe.each([
    {
      category: baby,
      products: [],
      expectedProducts: [],
      expectedAvailableProducts: [
        availableDolodentVM,
        availableAnaca3VM,
        availableChamomillaVM,
        availableCalmosineVM,
        availableProductWithoutCategoryVM
      ]
    },
    {
      category: minceur,
      products: [anaca3Minceur, calmosine],
      expectedProducts: [anaca3VM, calmosineVM],
      expectedAvailableProducts: [
        availableDolodentVM,
        availableChamomillaVM,
        availableProductWithoutCategoryVM
      ]
    }
  ])(
    'Initial VM',
    ({ category, products, expectedProducts, expectedAvailableProducts }) => {
      beforeEach(() => {
        categoryStore.current = { category, products }
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
        { field: 'name', expected: category.name },
        { field: 'description', expected: category.description },
        { field: 'miniature', expected: category.miniature },
        { field: 'image', expected: category.image },
        { field: 'parentUuid', expected: category.parentUuid }
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
            expect(vm.getProductsHeaders()).toStrictEqual(
              expectedProductsHeader
            )
          })
          it('should get the products', () => {
            const expectedProductsField = {
              value: expectedProducts,
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
              value: expectedAvailableProducts,
              canEdit: true
            }
            expect(vm.getAvailableProducts()).toStrictEqual(expectedField)
          })
        })
      })
    }
  )
  describe('Update fields', () => {
    beforeEach(() => {
      categoryStore.current = { category: baby, products: [dolodent] }
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
          beforeEach(() => {
            givenExistingProducts(dolodent, anaca3Minceur, calmosine)
            vm.addProducts(selectedProducts)
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
        describe('In multiple steps', () => {
          const expectedProducts = [dolodent, anaca3Minceur]
          beforeEach(() => {
            givenExistingProducts(dolodent, anaca3Minceur)
            vm.addProducts([dolodent.uuid])
            vm.addProducts([anaca3Minceur.uuid])
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
    const currentCategory: Category = baby
    beforeEach(() => {
      categoryStore.current = {
        category: currentCategory,
        products: [dolodent]
      }
      vm = getVM()
    })
    describe('For a simple dto', () => {
      it('should prepare the dto', () => {
        const expectedDTO: EditCategoryDTO = {
          name: 'test',
          parentUuid: 'abc123',
          description: 'description',
          miniature: currentCategory.miniature,
          image: currentCategory.image,
          newImage: undefined,
          productsAdded: [],
          productsRemoved: []
        }
        vm.set('name', expectedDTO.name)
        vm.set('parentUuid', expectedDTO.parentUuid)
        vm.set('description', expectedDTO.description)
        expect(vm.getDto()).toStrictEqual(expectedDTO)
      })
    })
    describe('For a dto with added products', () => {
      it('should prepare the dto for one added product', () => {
        givenExistingProducts(chamomilla)
        const expectedDTO: EditCategoryDTO = {
          name: currentCategory.name,
          parentUuid: currentCategory.parentUuid,
          description: currentCategory.description,
          miniature: currentCategory.miniature,
          image: currentCategory.image,
          newImage: undefined,
          productsAdded: [chamomilla.uuid],
          productsRemoved: []
        }
        vm.addProducts([chamomilla.uuid])
        expect(vm.getDto()).toStrictEqual(expectedDTO)
      })
      it('should prepare the dto for multiple added products', () => {
        const expectedDTO: EditCategoryDTO = {
          name: currentCategory.name,
          parentUuid: currentCategory.parentUuid,
          description: currentCategory.description,
          miniature: currentCategory.miniature,
          image: currentCategory.image,
          newImage: undefined,
          productsAdded: [ultraLevure.uuid, chamomilla.uuid],
          productsRemoved: []
        }
        givenExistingProducts(ultraLevure, chamomilla)
        vm.addProducts([ultraLevure.uuid, chamomilla.uuid])
        expect(vm.getDto()).toStrictEqual(expectedDTO)
      })
      it('should not add already existing products', () => {
        const expectedDTO: EditCategoryDTO = {
          name: currentCategory.name,
          parentUuid: currentCategory.parentUuid,
          description: currentCategory.description,
          miniature: currentCategory.miniature,
          image: currentCategory.image,
          newImage: undefined,
          productsAdded: [],
          productsRemoved: []
        }
        vm.addProducts([dolodent.uuid])
        expect(vm.getDto()).toStrictEqual(expectedDTO)
      })
    })
    describe('For a dto with removed products', () => {
      it('should prepare the dto for one removed product', () => {
        const expectedDTO: EditCategoryDTO = {
          name: currentCategory.name,
          parentUuid: currentCategory.parentUuid,
          description: currentCategory.description,
          miniature: currentCategory.miniature,
          image: currentCategory.image,
          newImage: undefined,
          productsAdded: [],
          productsRemoved: [dolodent.uuid]
        }
        vm.removeProducts([dolodent.uuid])
        expect(vm.getDto()).toStrictEqual(expectedDTO)
      })
      it('should prepare the dto for multiple removed products', () => {
        categoryStore.current = {
          category: baby,
          products: [dolodent, chamomilla]
        }
        vm = getVM()
        const expectedDTO: EditCategoryDTO = {
          name: baby.name,
          parentUuid: baby.parentUuid,
          description: baby.description,
          miniature: baby.miniature,
          image: baby.image,
          newImage: undefined,
          productsAdded: [],
          productsRemoved: [dolodent.uuid, chamomilla.uuid]
        }
        vm.removeProducts([dolodent.uuid, chamomilla.uuid])
        expect(vm.getDto()).toStrictEqual(expectedDTO)
      })
      it('should not take in account an added and removed product', () => {
        categoryStore.current = {
          category: baby,
          products: [dolodent]
        }
        vm = getVM()
        const expectedDTO: EditCategoryDTO = {
          name: currentCategory.name,
          parentUuid: currentCategory.parentUuid,
          description: currentCategory.description,
          miniature: currentCategory.miniature,
          image: currentCategory.image,
          newImage: undefined,
          productsAdded: [],
          productsRemoved: []
        }
        givenExistingProducts(chamomilla)
        vm.addProducts([chamomilla.uuid])
        vm.removeProducts([chamomilla.uuid])
        expect(vm.getDto()).toStrictEqual(expectedDTO)
      })
    })
    describe('For a dto with image', () => {
      it('should get the image', async () => {
        const newImage = new File(['miniature'], 'Miniature 1', {
          type: 'image/png'
        })
        const expectedDTO: EditCategoryDTO = {
          name: currentCategory.name,
          parentUuid: currentCategory.parentUuid,
          description: currentCategory.description,
          miniature: currentCategory.miniature,
          image: currentCategory.image,
          newImage,
          productsAdded: [],
          productsRemoved: []
        }
        await vm.set('image', newImage)
        expect(vm.getDto()).toStrictEqual(expectedDTO)
      })
    })
    describe('Manage complex dto', () => {
      it('should manage a complex dto with multiple add and remove', () => {
        categoryStore.current = {
          category: baby,
          products: [dolodent, chamomilla]
        }
        vm = getVM()
        const expectedDTO: EditCategoryDTO = {
          name: currentCategory.name,
          parentUuid: currentCategory.parentUuid,
          description: currentCategory.description,
          miniature: currentCategory.miniature,
          image: currentCategory.image,
          newImage: undefined,
          productsAdded: [ultraLevure.uuid, anaca3Minceur.uuid],
          productsRemoved: [dolodent.uuid]
        }
        givenExistingProducts(ultraLevure, chamomilla, anaca3Minceur)
        vm.addProducts([ultraLevure.uuid])
        vm.removeProducts([ultraLevure.uuid, chamomilla.uuid])
        vm.addProducts([ultraLevure.uuid, chamomilla.uuid])
        vm.addProducts([anaca3Minceur.uuid])
        vm.removeProducts([dolodent.uuid])
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

  const givenExistingProducts = (...products: Array<Product>) => {
    productStore.items = products
  }
  const givenExistingCategories = (...categories: Array<Category>) => {
    categoryStore.items = categories
  }
  const givenExistingSearchResult = (...products: Array<Product>) => {
    searchStore.items[key] = products
  }

  const getVM = (): CategoryFormEditVM => {
    return categoryFormEditVM(key)
  }
})

import {
  Field,
  PromotionProductItemVM
} from '@adapters/primary/view-models/promotions/promotion-form/promotionFormCreateVM'
import { useFormStore } from '@store/formStore'
import { useLaboratoryStore } from '@store/laboratoryStore'
import { createPinia, setActivePinia } from 'pinia'
import { Header } from '@adapters/primary/view-models/preparations/get-orders-to-prepare/getPreparationsVM'
import {
  anaca3Minceur,
  calmosine,
  chamomilla,
  dolodent,
  productWithoutLaboratory,
  ultraLevure
} from '@utils/testData/products'
import { Product } from '@core/entities/product'
import { useProductStore } from '@store/productStore'
import { useSearchStore } from '@store/searchStore'
import { LaboratoryProductItemVM } from '@adapters/primary/view-models/laboratories/laboratory-form/laboratoryFormGetVM'
import { LaboratoryAvailableProductItemVM } from '@adapters/primary/view-models/laboratories/laboratory-form/laboratoryFormVM'
import { Laboratory } from '@core/entities/laboratory'
import {
  laboratoryFormEditVM,
  LaboratoryFormEditVM
} from '@adapters/primary/view-models/laboratories/laboratory-form/laboratoryFormEditVM'
import {
  anaca3,
  avene,
  gilbert,
  sanofiAventis
} from '@utils/testData/laboratories'
import { EditLaboratoryDTO } from '@core/usecases/laboratories/laboratory-edition/editLaboratory'

const anaca3VM: LaboratoryProductItemVM = {
  uuid: anaca3Minceur.uuid,
  name: anaca3Minceur.name,
  reference: anaca3Minceur.ean13,
  categories: anaca3Minceur.categories.map((c) => c.name)
}

const calmosineVM: LaboratoryProductItemVM = {
  uuid: calmosine.uuid,
  name: calmosine.name,
  reference: calmosine.ean13,
  categories: calmosine.categories.map((c) => c.name)
}

const dolodentVM: LaboratoryProductItemVM = {
  uuid: dolodent.uuid,
  name: dolodent.name,
  reference: dolodent.ean13,
  categories: dolodent.categories.map((c) => c.name)
}

const chamomillaVM: LaboratoryProductItemVM = {
  uuid: chamomilla.uuid,
  name: chamomilla.name,
  reference: chamomilla.ean13,
  categories: chamomilla.categories.map((c) => c.name)
}

const productWithoutLaboratoryVM: LaboratoryProductItemVM = {
  uuid: productWithoutLaboratory.uuid,
  name: productWithoutLaboratory.name,
  reference: productWithoutLaboratory.ean13,
  categories: productWithoutLaboratory.categories.map((c) => c.name)
}

const availableAnaca3VM: LaboratoryAvailableProductItemVM = {
  ...anaca3VM,
  laboratory: anaca3Minceur.laboratory.name
}

const availableCalmosineVM: LaboratoryAvailableProductItemVM = {
  ...calmosineVM,
  laboratory: calmosine.laboratory.name
}

const availableDolodentVM: LaboratoryAvailableProductItemVM = {
  ...dolodentVM,
  laboratory: dolodent.laboratory.name
}

const availableChamomillaVM: LaboratoryAvailableProductItemVM = {
  ...chamomillaVM,
  laboratory: chamomilla.laboratory.name
}

const availableProductWithoutLaboratoryVM: LaboratoryAvailableProductItemVM = {
  ...productWithoutLaboratoryVM,
  laboratory: ''
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
    name: 'Catégories',
    value: 'categories'
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

describe('Laboratory form edit VM', () => {
  let laboratoryStore: any
  let productStore: any
  let formStore: any
  let searchStore: any
  const key = 'edit-laboratory-form'
  let vm: LaboratoryFormEditVM

  beforeEach(() => {
    setActivePinia(createPinia())
    laboratoryStore = useLaboratoryStore()
    productStore = useProductStore()
    formStore = useFormStore()
    searchStore = useSearchStore()
  })
  describe.each([
    {
      laboratory: avene,
      products: [],
      expectedProducts: [],
      expectedAvailableProducts: [
        availableDolodentVM,
        availableAnaca3VM,
        availableChamomillaVM,
        availableCalmosineVM,
        availableProductWithoutLaboratoryVM
      ]
    },
    {
      laboratory: sanofiAventis,
      products: [anaca3Minceur, calmosine],
      expectedProducts: [anaca3VM, calmosineVM],
      expectedAvailableProducts: [
        availableDolodentVM,
        availableChamomillaVM,
        availableProductWithoutLaboratoryVM
      ]
    }
  ])(
    'Initial VM',
    ({ laboratory, products, expectedProducts, expectedAvailableProducts }) => {
      beforeEach(() => {
        laboratoryStore.current = { laboratory, products }
        givenExistingProducts(
          dolodent,
          anaca3Minceur,
          chamomilla,
          calmosine,
          productWithoutLaboratory
        )
        vm = getVM()
      })
      describe.each([
        { field: 'name', expected: laboratory.name },
        { field: 'description', expected: laboratory.description },
        { field: 'miniature', expected: laboratory.miniature },
        { field: 'image', expected: laboratory.image }
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
      describe('Products', () => {
        describe('Products in laboratory', () => {
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
        describe('Products not in laboratory', () => {
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
      laboratoryStore.current = { laboratory: avene, products: [dolodent] }
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
      }
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
            const expectedField: Field<Array<LaboratoryProductItemVM>> = {
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
              const expectedField: Field<Array<LaboratoryProductItemVM>> = {
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
            const expectedField: Field<Array<LaboratoryProductItemVM>> = {
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
            const expectedField: Field<Array<LaboratoryProductItemVM>> = {
              value: [anaca3VM, calmosineVM],
              canEdit: true
            }
            expect(vm.getProducts()).toStrictEqual(expectedField)
          })
          it('should remove products from available selection', () => {
            const expectedField: Field<Array<LaboratoryProductItemVM>> = {
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
            const expectedField: Field<Array<LaboratoryProductItemVM>> = {
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
    describe('Update miniature', () => {
      const value = new File(['miniature'], 'Miniature 1', {
        type: 'image/jpg'
      })
      beforeEach(async () => {
        await vm.set('miniature', value)
      })
      describe('Miniature', () => {
        const expected = 'data:image/jpg;base64,bWluaWF0dXJl'
        it('should update miniature field in store', () => {
          const expectedField: Field<any> = {
            value: expected,
            canEdit: true
          }
          expect(vm.get('miniature')).toStrictEqual(expectedField)
        })
        it('should update miniature field', () => {
          expect(formStore.get(key)['miniature']).toStrictEqual(expected)
        })
      })
      it('should update new image value in store', () => {
        expect(formStore.get(key)['newMiniature']).toStrictEqual(value)
      })
    })
  })
  describe('DTO', () => {
    const currentLaboratory: Laboratory = avene
    beforeEach(() => {
      laboratoryStore.current = {
        laboratory: currentLaboratory,
        products: [dolodent]
      }
      vm = getVM()
    })
    describe('For a simple dto', () => {
      it('should prepare the dto', () => {
        const expectedDTO: EditLaboratoryDTO = {
          name: 'test',
          description: 'description',
          miniature: currentLaboratory.miniature,
          image: currentLaboratory.image,
          newImage: undefined,
          newMiniature: undefined,
          productsAdded: [],
          productsRemoved: []
        }
        vm.set('name', expectedDTO.name)
        vm.set('description', expectedDTO.description)
        expect(vm.getDto()).toStrictEqual(expectedDTO)
      })
    })
    describe('For a dto with added products', () => {
      it('should prepare the dto for one added product', () => {
        givenExistingProducts(chamomilla)
        const expectedDTO: EditLaboratoryDTO = {
          name: currentLaboratory.name,
          description: currentLaboratory.description,
          miniature: currentLaboratory.miniature,
          newMiniature: undefined,
          image: currentLaboratory.image,
          newImage: undefined,
          productsAdded: [chamomilla.uuid],
          productsRemoved: []
        }
        vm.addProducts([chamomilla.uuid])
        expect(vm.getDto()).toStrictEqual(expectedDTO)
      })
      it('should prepare the dto for multiple added products', () => {
        const expectedDTO: EditLaboratoryDTO = {
          name: currentLaboratory.name,
          description: currentLaboratory.description,
          miniature: currentLaboratory.miniature,
          newMiniature: undefined,
          image: currentLaboratory.image,
          newImage: undefined,
          productsAdded: [ultraLevure.uuid, chamomilla.uuid],
          productsRemoved: []
        }
        givenExistingProducts(ultraLevure, chamomilla)
        vm.addProducts([ultraLevure.uuid, chamomilla.uuid])
        expect(vm.getDto()).toStrictEqual(expectedDTO)
      })
      it('should not add already existing products', () => {
        const expectedDTO: EditLaboratoryDTO = {
          name: currentLaboratory.name,
          description: currentLaboratory.description,
          miniature: currentLaboratory.miniature,
          newMiniature: undefined,
          image: currentLaboratory.image,
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
        const expectedDTO: EditLaboratoryDTO = {
          name: currentLaboratory.name,
          description: currentLaboratory.description,
          miniature: currentLaboratory.miniature,
          newMiniature: undefined,
          image: currentLaboratory.image,
          newImage: undefined,
          productsAdded: [],
          productsRemoved: [dolodent.uuid]
        }
        vm.removeProducts([dolodent.uuid])
        expect(vm.getDto()).toStrictEqual(expectedDTO)
      })
      it('should prepare the dto for multiple removed products', () => {
        laboratoryStore.current = {
          laboratory: sanofiAventis,
          products: [dolodent, chamomilla]
        }
        vm = getVM()
        const expectedDTO: EditLaboratoryDTO = {
          name: sanofiAventis.name,
          description: sanofiAventis.description,
          miniature: sanofiAventis.miniature,
          newMiniature: undefined,
          image: sanofiAventis.image,
          newImage: undefined,
          productsAdded: [],
          productsRemoved: [dolodent.uuid, chamomilla.uuid]
        }
        vm.removeProducts([dolodent.uuid, chamomilla.uuid])
        expect(vm.getDto()).toStrictEqual(expectedDTO)
      })
      it('should not take in account an added and removed product', () => {
        laboratoryStore.current = {
          laboratory: gilbert,
          products: [dolodent]
        }
        vm = getVM()
        const expectedDTO: EditLaboratoryDTO = {
          name: gilbert.name,
          description: gilbert.description,
          miniature: gilbert.miniature,
          newMiniature: undefined,
          image: gilbert.image,
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
        const newImage = new File(['image'], 'Image 1', {
          type: 'image/png'
        })
        const expectedDTO: EditLaboratoryDTO = {
          name: currentLaboratory.name,
          description: currentLaboratory.description,
          miniature: currentLaboratory.miniature,
          newMiniature: undefined,
          image: currentLaboratory.image,
          newImage,
          productsAdded: [],
          productsRemoved: []
        }
        await vm.set('image', newImage)
        expect(vm.getDto()).toStrictEqual(expectedDTO)
      })
    })
    describe('For a dto with miniature', () => {
      it('should get the miniature', async () => {
        const newMiniature = new File(['miniature'], 'Miniature 1', {
          type: 'image/png'
        })
        const expectedDTO: EditLaboratoryDTO = {
          name: currentLaboratory.name,
          description: currentLaboratory.description,
          miniature: currentLaboratory.miniature,
          newMiniature,
          image: currentLaboratory.image,
          newImage: undefined,
          productsAdded: [],
          productsRemoved: []
        }
        await vm.set('miniature', newMiniature)
        expect(vm.getDto()).toStrictEqual(expectedDTO)
      })
    })
    describe('Manage complex dto', () => {
      it('should manage a complex dto with multiple add and remove', () => {
        laboratoryStore.current = {
          laboratory: anaca3,
          products: [dolodent, chamomilla]
        }
        vm = getVM()
        const expectedDTO: EditLaboratoryDTO = {
          name: anaca3.name,
          description: anaca3.description,
          miniature: anaca3.miniature,
          newMiniature: undefined,
          image: anaca3.image,
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

  const givenExistingSearchResult = (...products: Array<Product>) => {
    searchStore.items[key] = products
  }

  const getVM = (): LaboratoryFormEditVM => {
    return laboratoryFormEditVM(key)
  }
})

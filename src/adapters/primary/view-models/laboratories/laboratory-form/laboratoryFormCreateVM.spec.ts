import {
  Field,
  PromotionProductItemVM
} from '@adapters/primary/view-models/promotions/promotion-form/promotionFormCreateVM'
import { useFormStore } from '@store/formStore'
import { useLaboratoryStore } from '@store/laboratoryStore'
import { baby } from '@utils/testData/categories'
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
import { LaboratoryProductItemVM } from './laboratoryFormGetVM'
import { Laboratory } from '@core/entities/laboratory'
import { avene, gilbert } from '@utils/testData/laboratories'
import {
  LaboratoryFormCreateVM,
  laboratoryFormCreateVM
} from './laboratoryFormCreateVM'
import { LaboratoryAvailableProductItemVM } from './laboratoryFormVM'
import { CreateLaboratoryDTO } from '@core/usecases/laboratories/laboratory-creation/createLaboratory'

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

describe('Laboratory form create VM', () => {
  let laboratoryStore: any
  let productStore: any
  let formStore: any
  let searchStore: any
  const key = 'create-laboratory-form'
  let vm: LaboratoryFormCreateVM

  beforeEach(() => {
    setActivePinia(createPinia())
    laboratoryStore = useLaboratoryStore()
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
        productWithoutLaboratory
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
    describe('Products', () => {
      describe('Products in laboratory', () => {
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
      describe('Products not in laboratory', () => {
        beforeEach(() => {
          givenExistingLaboratories(avene, gilbert)
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
              availableProductWithoutLaboratoryVM
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
      laboratoryStore.current = { laboratory: baby, products: [dolodent.uuid] }
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
          givenExistingLaboratories(avene, gilbert)
        })
        describe('In one step', () => {
          const selectedProducts = [dolodent.uuid, anaca3Minceur.uuid]
          let expectedProducts
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
            const expectedField: Field<Array<LaboratoryProductItemVM>> = {
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
      describe('Remove products', () => {
        beforeEach(() => {
          givenExistingProducts(dolodent, anaca3Minceur, calmosine)
          givenExistingLaboratories(avene, gilbert)
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
  })
  describe('DTO', () => {
    beforeEach(() => {
      vm = getVM()
    })
    describe('For a simple dto', () => {
      it('should prepare the dto', () => {
        const expectedDTO: CreateLaboratoryDTO = {
          name: 'test',
          description: 'description',
          miniature: undefined,
          image: undefined,
          productsAdded: []
        }
        vm.set('name', expectedDTO.name)
        vm.set('description', expectedDTO.description)
        expect(vm.getDto()).toStrictEqual(expectedDTO)
      })
    })
    describe('For a dto with added products', () => {
      it('should prepare the dto for one added product', () => {
        const expectedDTO: CreateLaboratoryDTO = {
          name: '',
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
        const expectedDTO: CreateLaboratoryDTO = {
          name: '',
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
        const expectedDTO: CreateLaboratoryDTO = {
          name: '',
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
        const expectedDTO: CreateLaboratoryDTO = {
          name: baby.name,
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
        vm.addProducts([anaca3Minceur.uuid])
        vm.removeProducts([dolodent.uuid])
        expect(vm.getDto()).toStrictEqual(expectedDTO)
      })
    })
    describe('For a dto with image', () => {
      it('should get the image', async () => {
        const newImage = new File(['image'], 'Image 1', {
          type: 'image/png'
        })
        const expectedDTO: CreateLaboratoryDTO = {
          name: '',
          description: '',
          miniature: undefined,
          image: newImage,
          productsAdded: []
        }
        await vm.set('image', newImage)
        expect(vm.getDto()).toStrictEqual(expectedDTO)
      })
    })
    describe('For a dto with miniature', () => {
      it('should get the miniature', async () => {
        const newMiniature = new File(['miniature'], 'Miniature', {
          type: 'image/png'
        })
        const expectedDTO: CreateLaboratoryDTO = {
          name: '',
          description: '',
          miniature: newMiniature,
          image: undefined,
          productsAdded: []
        }
        await vm.set('miniature', newMiniature)
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

  const givenExistingLaboratories = (...laboratories: Array<Laboratory>) => {
    laboratoryStore.items = laboratories
  }

  const getVM = (): LaboratoryFormCreateVM => {
    return laboratoryFormCreateVM(key)
  }
})

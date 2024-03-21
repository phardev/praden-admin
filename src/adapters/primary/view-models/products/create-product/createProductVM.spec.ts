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
import { type UUID } from '@core/types/types'
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
    describe('Name field', () => {
      it('should have an empty name', () => {
        const expectedField: Field<string> = {
          value: '',
          canEdit: true
        }
        expect(vm.getName()).toStrictEqual(expectedField)
      })
      it('should save the name value in form store', () => {
        expect(formStore.get(key).name).toStrictEqual('')
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
    describe('Category selected', () => {
      it('should not have any category selected', () => {
        const expectedField: Field<UUID | undefined> = {
          value: undefined,
          canEdit: true
        }
        expect(vm.getCategoryUuid()).toStrictEqual(expectedField)
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
        expect(vm.getCip13()).toStrictEqual(expectedField)
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
        expect(vm.getPriceWithoutTax()).toStrictEqual(expectedField)
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
        expect(vm.getPercentTaxRate()).toStrictEqual(expectedField)
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
        expect(vm.getLaboratory()).toStrictEqual(expectedField)
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
        expect(vm.getLocation()).toStrictEqual(expectedField)
      })
      it('should save the location in form store', () => {
        expect(formStore.get(key).location).toBe('')
      })
    })
    describe('Available stock field', () => {
      it('should have an empty available stock', () => {
        const expectedField: Field<string> = {
          value: '',
          canEdit: true
        }
        expect(vm.getAvailableStock()).toStrictEqual(expectedField)
      })
      it('should save the available stock in form store', () => {
        expect(formStore.get(key).availableStock).toBe('')
      })
    })
    describe('New images', () => {
      it('should have an empty array', () => {
        const expectedField: Field<Array<File>> = {
          value: [],
          canEdit: true
        }
        expect(vm.getNewImages()).toStrictEqual(expectedField)
      })
      it('should save the new images in form store', () => {
        expect(formStore.get(key).newImages).toStrictEqual([])
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
      expect(vm.getName()).toStrictEqual(expectedField)
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
      expect(vm.getCategoryUuid()).toStrictEqual(expectedField)
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
      expect(vm.getCip13()).toStrictEqual(expectedField)
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
      expect(vm.getPriceWithoutTax()).toStrictEqual(expectedField)
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
      expect(vm.getPercentTaxRate()).toStrictEqual(expectedField)
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
      expect(vm.getLaboratory()).toStrictEqual(expectedField)
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
      expect(vm.getLocation()).toStrictEqual(expectedField)
    })
  })
  describe('Update available stock', () => {
    const stock = '12'
    beforeEach(() => {
      vm.setAvailableStock(stock)
    })
    it('should update available stock value in form store', () => {
      expect(formStore.get(key).availableStock).toStrictEqual(stock)
    })
    it('should update available stock field', () => {
      const expectedField: Field<string> = {
        value: stock,
        canEdit: true
      }
      expect(vm.getAvailableStock()).toStrictEqual(expectedField)
    })
  })
  describe('Update new images', () => {
    const newImages: Array<File> = [
      new File(['data1'], 'File 1', { type: 'image/png' }),
      new File(['data2'], 'File 2', { type: 'image/jpeg' }),
      new File(['data3'], 'File 3', { type: 'image/gif' })
    ]
    beforeEach(async () => {
      await vm.setNewImages(newImages)
    })
    it('should update new images value in form store', () => {
      expect(formStore.get(key).newImages).toStrictEqual(newImages)
    })
    it('should update new images field', () => {
      const expectedField: Field<Array<File>> = {
        value: newImages,
        canEdit: true
      }
      expect(vm.getNewImages()).toStrictEqual(expectedField)
    })
    it('should extract new images content', () => {
      const expectedImages: Array<string> = [
        'data:image/png;base64,ZGF0YTE=',
        'data:image/jpeg;base64,ZGF0YTI=',
        'data:image/gif;base64,ZGF0YTM='
      ]
      expect(vm.getImages()).toStrictEqual(expectedImages)
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
          cip13: '1234567890123',
          categoryUuid: 'abc123',
          laboratory: 'laboratory',
          images: newImages,
          priceWithoutTax: '12',
          percentTaxRate: '5',
          location: 'G2',
          availableStock: '21'
        }
        vm.setName(expectedDTO.name)
        vm.setCip13(expectedDTO.cip13)
        vm.setNewImages(newImages)
        vm.setCategoryUuid(expectedDTO.categoryUuid)
        vm.setLaboratory(expectedDTO.laboratory)
        vm.setPriceWithoutTax(expectedDTO.priceWithoutTax)
        vm.setPercentTaxRate(expectedDTO.percentTaxRate)
        vm.setLocation(expectedDTO.location)
        vm.setAvailableStock(expectedDTO.availableStock)
        expect(vm.getDto()).toStrictEqual(expectedDTO)
      })
    })
  })
})

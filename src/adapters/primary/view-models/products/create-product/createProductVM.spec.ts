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
    describe('Cip7 field', () => {
      it('should have an empty cip7', () => {
        const expectedField: Field<string> = {
          value: '',
          canEdit: true
        }
        expect(vm.getCip7()).toStrictEqual(expectedField)
      })
      it('should save the cip7 value in form store', () => {
        expect(formStore.get(key).cip7).toStrictEqual('')
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
    describe('EAN13 field', () => {
      it('should have an empty ean13', () => {
        const expectedField: Field<string> = {
          value: '',
          canEdit: true
        }
        expect(vm.getEan13()).toStrictEqual(expectedField)
      })
      it('should save the ean13 value in form store', () => {
        expect(formStore.get(key).ean13).toStrictEqual('')
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
        expect(formStore.get(key).percentTaxRate).toBe(undefined)
      })
    })
    describe('Price with tax', () => {
      it('should not have any price with tax', () => {
        const expectedField: Field<string | undefined> = {
          value: undefined,
          canEdit: true
        }
        expect(vm.getPriceWithTax()).toStrictEqual(expectedField)
      })
      it('should not have any price with tax in form store', () => {
        expect(formStore.get(key).priceWithTax).toBe(undefined)
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
    describe('Description field', () => {
      it('should have an empty description', () => {
        const expectedField: Field<string> = {
          value: '',
          canEdit: true
        }
        expect(vm.getDescription()).toStrictEqual(expectedField)
      })
      it('should save the description in form store', () => {
        expect(formStore.get(key).description).toBe('')
      })
    })
    describe('Instruction for use field', () => {
      it('should have an empty instructions', () => {
        const expectedField: Field<string> = {
          value: '',
          canEdit: true
        }
        expect(vm.getInstructionsForUse()).toStrictEqual(expectedField)
      })
      it('should save the instructions in form store', () => {
        expect(formStore.get(key).instructionsForUse).toBe('')
      })
    })
    describe('Composition field', () => {
      it('should have an empty composition', () => {
        const expectedField: Field<string> = {
          value: '',
          canEdit: true
        }
        expect(vm.getComposition()).toStrictEqual(expectedField)
      })
      it('should save the composition in form store', () => {
        expect(formStore.get(key).composition).toBe('')
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

  describe('Update cip7', () => {
    it('should update cip7 value in form store', () => {
      vm.setCip7('test')
      expect(formStore.get(key).cip7).toStrictEqual('test')
    })
    it('should update cip7 field', () => {
      vm.setCip7('test')
      const expectedField: Field<string> = {
        value: 'test',
        canEdit: true
      }
      expect(vm.getCip7()).toStrictEqual(expectedField)
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

  describe('Update ean13', () => {
    it('should update ean13 value in form store', () => {
      vm.setEan13('test')
      expect(formStore.get(key).ean13).toStrictEqual('test')
    })
    it('should update ean13 field', () => {
      vm.setEan13('test')
      const expectedField: Field<string> = {
        value: 'test',
        canEdit: true
      }
      expect(vm.getEan13()).toStrictEqual(expectedField)
    })
  })

  describe('Update price without tax', () => {
    describe('The tax rate is not set', () => {
      beforeEach(() => {
        vm.setPriceWithoutTax('12')
      })
      it('should update price without tax value in form store', () => {
        expect(formStore.get(key).priceWithoutTax).toStrictEqual('12')
      })
      it('should update price without tax field', () => {
        const expectedField: Field<string> = {
          value: '12',
          canEdit: true
        }
        expect(vm.getPriceWithoutTax()).toStrictEqual(expectedField)
      })
      it('should not have any price with tax', () => {
        const expectedField: Field<string | undefined> = {
          value: undefined,
          canEdit: true
        }
        expect(vm.getPriceWithTax()).toStrictEqual(expectedField)
      })
      it('should not have any price with tax in form store', () => {
        expect(formStore.get(key).priceWithTax).toBe(undefined)
      })
    })
    describe('The tax rate is set', () => {
      beforeEach(() => {
        vm.setPercentTaxRate('5.5')
        vm.setPriceWithoutTax('12')
      })
      it('should update price without tax value in form store', () => {
        expect(formStore.get(key).priceWithoutTax).toStrictEqual('12')
      })
      it('should update price without tax field', () => {
        const expectedField: Field<string> = {
          value: '12',
          canEdit: true
        }
        expect(vm.getPriceWithoutTax()).toStrictEqual(expectedField)
      })
      it('should update price with tax value in form store', () => {
        expect(formStore.get(key).priceWithTax).toStrictEqual('12.66')
      })
      it('should update price with tax field', () => {
        const expectedField: Field<string> = {
          value: '12.66',
          canEdit: true
        }
        expect(vm.getPriceWithTax()).toStrictEqual(expectedField)
      })
    })
  })

  describe('Update percent tax rate', () => {
    describe('Price without tax and price with tax are not set', () => {
      beforeEach(() => {
        vm.setPercentTaxRate('5')
      })
      it('should update percent tax rate value in form store', () => {
        expect(formStore.get(key).percentTaxRate).toStrictEqual('5')
      })
      it('should update percent tax rate field', () => {
        const expectedField: Field<string> = {
          value: '5',
          canEdit: true
        }
        expect(vm.getPercentTaxRate()).toStrictEqual(expectedField)
      })
      it('should not update price without tax value in form store', () => {
        expect(formStore.get(key).priceWithoutTax).toStrictEqual(undefined)
      })
      it('should update price without tax field', () => {
        const expectedField: Field<string> = {
          value: undefined,
          canEdit: true
        }
        expect(vm.getPriceWithoutTax()).toStrictEqual(expectedField)
      })
      it('should not have any price with tax', () => {
        const expectedField: Field<string | undefined> = {
          value: undefined,
          canEdit: true
        }
        expect(vm.getPriceWithTax()).toStrictEqual(expectedField)
      })
      it('should not have any price with tax in form store', () => {
        expect(formStore.get(key).priceWithTax).toBe(undefined)
      })
    })
    describe('Price without tax is already set  and price with tax is not set', () => {
      const percentTaxRate = '10'
      beforeEach(() => {
        vm.setPriceWithoutTax('20')
        vm.setPercentTaxRate(percentTaxRate)
      })
      it('should update percent tax rate value in form store', () => {
        expect(formStore.get(key).percentTaxRate).toStrictEqual(percentTaxRate)
      })
      it('should update percent tax rate field', () => {
        const expectedField: Field<string> = {
          value: percentTaxRate,
          canEdit: true
        }
        expect(vm.getPercentTaxRate()).toStrictEqual(expectedField)
      })
      it('should compute the price with tax', () => {
        const expectedField: Field<string | undefined> = {
          value: '22.00',
          canEdit: true
        }
        expect(vm.getPriceWithTax()).toStrictEqual(expectedField)
      })
      it('should have the price with tax in form store', () => {
        expect(formStore.get(key).priceWithTax).toBe('22.00')
      })
    })
    describe('Price without tax is not set and price with tax is already set', () => {
      const percentTaxRate = '10'
      beforeEach(() => {
        vm.setPriceWithTax('20')
        vm.setPercentTaxRate(percentTaxRate)
      })
      it('should update percent tax rate value in form store', () => {
        expect(formStore.get(key).percentTaxRate).toStrictEqual(percentTaxRate)
      })
      it('should update percent tax rate field', () => {
        const expectedField: Field<string> = {
          value: percentTaxRate,
          canEdit: true
        }
        expect(vm.getPercentTaxRate()).toStrictEqual(expectedField)
      })
      it('should compute the price without tax', () => {
        const expectedField: Field<string | undefined> = {
          value: '18.18',
          canEdit: true
        }
        expect(vm.getPriceWithoutTax()).toStrictEqual(expectedField)
      })
      it('should have the price without tax in form store', () => {
        expect(formStore.get(key).priceWithoutTax).toBe('18.18')
      })
    })
    describe('Both price without tax and price with tax are already set', () => {
      const percentTaxRate = '20'
      beforeEach(() => {
        vm.setPriceWithoutTax('20')
        vm.setPriceWithTax('100')
        vm.setPercentTaxRate(percentTaxRate)
      })
      it('should update percent tax rate value in form store', () => {
        expect(formStore.get(key).percentTaxRate).toStrictEqual(percentTaxRate)
      })
      it('should update percent tax rate field', () => {
        const expectedField: Field<string> = {
          value: percentTaxRate,
          canEdit: true
        }
        expect(vm.getPercentTaxRate()).toStrictEqual(expectedField)
      })
      it('should not change the price without tax', () => {
        const expectedField: Field<string | undefined> = {
          value: '20',
          canEdit: true
        }
        expect(vm.getPriceWithoutTax()).toStrictEqual(expectedField)
      })
      it('should have the price without tax in form store', () => {
        expect(formStore.get(key).priceWithoutTax).toBe('20')
      })
      it('should re-compute the price with tax', () => {
        const expectedField: Field<string | undefined> = {
          value: '24.00',
          canEdit: true
        }
        expect(vm.getPriceWithTax()).toStrictEqual(expectedField)
      })
      it('should have the price with tax in form store', () => {
        expect(formStore.get(key).priceWithTax).toBe('24.00')
      })
    })
  })

  describe('Update price with tax', () => {
    describe('Tax rate is not already defined', () => {
      beforeEach(() => {
        vm.setPriceWithTax('12')
      })
      it('should update price with tax value in form store', () => {
        expect(formStore.get(key).priceWithTax).toStrictEqual('12')
      })
      it('should update price with tax field', () => {
        const expectedField: Field<string> = {
          value: '12',
          canEdit: true
        }
        expect(vm.getPriceWithTax()).toStrictEqual(expectedField)
      })
      it('should not update price without tax value in form store', () => {
        expect(formStore.get(key).priceWithoutTax).toStrictEqual(undefined)
      })
      it('should update price without tax field', () => {
        const expectedField: Field<string> = {
          value: undefined,
          canEdit: true
        }
        expect(vm.getPriceWithoutTax()).toStrictEqual(expectedField)
      })
    })
    describe('Tax rate is already defined', () => {
      beforeEach(() => {
        formStore.set(key, { percentTaxRate: 10 })
        vm.setPriceWithTax('12')
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
        expect(vm.getPriceWithoutTax()).toStrictEqual(expectedField)
      })
      it('should update price without tax field', () => {
        const expectedField: Field<string> = {
          value: '10.91',
          canEdit: true
        }
        expect(vm.getPriceWithoutTax()).toStrictEqual(expectedField)
      })
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
  describe('Update description', () => {
    it('should update description value in form store', () => {
      vm.setDescription('<p>description</p>')
      expect(formStore.get(key).description).toStrictEqual('<p>description</p>')
    })
    it('should update description field', () => {
      vm.setDescription('<h1>description</h1>')
      const expectedField: Field<string> = {
        value: '<h1>description</h1>',
        canEdit: true
      }
      expect(vm.getDescription()).toStrictEqual(expectedField)
    })
  })
  describe('Update instructions for use', () => {
    it('should update instructions for use value in form store', () => {
      vm.setInstructionsForUse('<p>this is the instructions</p>')
      expect(formStore.get(key).instructionsForUse).toStrictEqual(
        '<p>this is the instructions</p>'
      )
    })
    it('should update instructions for use field', () => {
      vm.setInstructionsForUse('<h1>this is the new instructions</h1>')
      const expectedField: Field<string> = {
        value: '<h1>this is the new instructions</h1>',
        canEdit: true
      }
      expect(vm.getInstructionsForUse()).toStrictEqual(expectedField)
    })
  })
  describe('Update composition', () => {
    it('should update composition value in form store', () => {
      vm.setComposition('<p>composition</p>')
      expect(formStore.get(key).composition).toStrictEqual('<p>composition</p>')
    })
    it('should update composition field', () => {
      vm.setComposition('<h1>composition</h1>')
      const expectedField: Field<string> = {
        value: '<h1>composition</h1>',
        canEdit: true
      }
      expect(vm.getComposition()).toStrictEqual(expectedField)
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
        vm.setName(expectedDTO.name)
        vm.setCip7(expectedDTO.cip7)
        vm.setCip13(expectedDTO.cip13)
        vm.setEan13(expectedDTO.ean13)
        vm.setNewImages(newImages)
        vm.setCategoryUuid(expectedDTO.categoryUuid)
        vm.setLaboratory(expectedDTO.laboratory)
        vm.setPriceWithoutTax(expectedDTO.priceWithoutTax)
        vm.setPercentTaxRate(expectedDTO.percentTaxRate)
        vm.setLocation(expectedDTO.location)
        vm.setAvailableStock(expectedDTO.availableStock)
        vm.setDescription(expectedDTO.description)
        vm.setInstructionsForUse(expectedDTO.instructionsForUse)
        vm.setComposition(expectedDTO.composition)
        expect(vm.getDto()).toStrictEqual(expectedDTO)
      })
    })
  })
})

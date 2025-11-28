import { ProductFormFieldsWriter } from '@adapters/primary/view-models/products/product-form/productFormCreateVM'
import {
  ExistingProductFormInitializer,
  ProductFormFieldsReader
} from '@adapters/primary/view-models/products/product-form/productFormGetVM'
import { type Field } from '@adapters/primary/view-models/promotions/promotion-form/promotionFormCreateVM'
import { SequentialUuidGenerator } from '@adapters/secondary/uuid-generators/SequentialUuidGenerator'
import { ProductStatus } from '@core/entities/product'
import {
  createExistingImage,
  createNewImage,
  type ProductImage
} from '@core/entities/productImage'
import { EditProductDTO } from '@core/usecases/product/product-edition/editProduct'
import { useCategoryStore } from '@store/categoryStore'
import { useFormStore } from '@store/formStore'
import { useLaboratoryStore } from '@store/laboratoryStore'
import { useLocationStore } from '@store/locationStore'
import { useProductStore } from '@store/productStore'
import { baby, minceur, mum } from '@utils/testData/categories'
import {
  anaca3,
  avene,
  gilbert,
  sanofiAventis
} from '@utils/testData/laboratories'
import { magasin, reserve, zoneGeo } from '@utils/testData/locations'
import { dolodent, hemoclar, ultraLevure } from '@utils/testData/products'
import { promotionFixedMultipleProducts } from '@utils/testData/promotions'
import { createPinia, setActivePinia } from 'pinia'
import { ProductFormEditVM, productFormEditVM } from './productFormEditVM'

describe('Product form edit VM', () => {
  let locationStore: any
  let vm: ProductFormEditVM
  let productStore: any
  let categoryStore: any
  let laboratoryStore: any
  let formStore: any
  const key = 'edit-product-key'
  beforeEach(() => {
    setActivePinia(createPinia())
    locationStore = useLocationStore()
    formStore = useFormStore()
    productStore = useProductStore()
    categoryStore = useCategoryStore()
    laboratoryStore = useLaboratoryStore()
  })

  const productsTestsCases = [
    {
      product: ultraLevure,
      status: ultraLevure.status,
      expectedPriceWithoutTax: '4.32',
      expectedPriceWithTax: '4.75',
      expectedLocations: {
        [zoneGeo.uuid]: 'C3',
        [reserve.uuid]: 'RESERVE_1'
      },
      expectedWeight: '0.012',
      promotion: promotionFixedMultipleProducts,
      expectedPromotion: {
        href: `/promotions/get/${promotionFixedMultipleProducts.uuid}`,
        type: 'FIXE',
        amount: '1,00\u00A0€',
        startDate: '27 juil. 2023',
        startDatetime: new Date('2023-07-27T00:00:00.000Z'),
        endDate: '27 août 2023',
        endDatetime: new Date('2023-08-27T00:00:00.000Z')
      },
      availableLocations: [zoneGeo, reserve, magasin],
      expectedAvailableLocations: [
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
      ],
      availableCategories: [baby, mum, minceur],
      expectedAvailableCategories: [
        {
          uuid: baby.uuid,
          name: baby.name
        },
        {
          uuid: mum.uuid,
          name: mum.name
        },
        {
          uuid: minceur.uuid,
          name: minceur.name
        }
      ],
      availableLaboratories: [avene, gilbert, sanofiAventis],
      expectedAvailableLaboratories: [
        {
          uuid: avene.uuid,
          name: avene.name
        },
        {
          uuid: gilbert.uuid,
          name: gilbert.name
        },
        {
          uuid: sanofiAventis.uuid,
          name: sanofiAventis.name
        }
      ]
    },
    {
      product: dolodent,
      status: dolodent.status,
      expectedPriceWithoutTax: '5.00',
      expectedPriceWithTax: '5.50',
      expectedLocations: {
        [zoneGeo.uuid]: 'DD02'
      },
      expectedWeight: '0.98',
      promotion: undefined,
      expectedPromotion: undefined,
      availableLocations: [zoneGeo, magasin],
      expectedAvailableLocations: [
        {
          uuid: zoneGeo.uuid,
          name: zoneGeo.name
        },
        {
          uuid: magasin.uuid,
          name: magasin.name
        }
      ],
      availableCategories: [minceur],
      expectedAvailableCategories: [
        {
          uuid: minceur.uuid,
          name: minceur.name
        }
      ],
      availableLaboratories: [anaca3],
      expectedAvailableLaboratories: [
        {
          uuid: anaca3.uuid,
          name: anaca3.name
        }
      ]
    }
  ]
  describe('Initial VM', () => {
    describe.each(productsTestsCases)(
      'For a product',
      ({
        product,
        expectedPriceWithoutTax,
        expectedPriceWithTax,
        expectedLocations,
        expectedWeight,
        promotion,
        expectedPromotion,
        availableLocations,
        expectedAvailableLocations,
        availableCategories,
        expectedAvailableCategories,
        availableLaboratories,
        expectedAvailableLaboratories
      }) => {
        beforeEach(() => {
          productStore.current = {
            product,
            promotion
          }
          locationStore.items = availableLocations
          categoryStore.items = availableCategories
          laboratoryStore.items = availableLaboratories
          vm = productFormEditVM(key)
        })
        describe.each([
          { field: 'name', expected: product.name },
          { field: 'status', expected: product.status },
          {
            field: 'categoryUuids',
            expected: product.categories.map((c) => c.uuid)
          },
          { field: 'cip7', expected: product.cip7 },
          { field: 'cip13', expected: product.cip13 },
          { field: 'ean13', expected: product.ean13 },
          { field: 'percentTaxRate', expected: product.percentTaxRate },
          { field: 'availableStock', expected: product.availableStock },
          { field: 'laboratory', expected: product.laboratory!.uuid },
          { field: 'description', expected: product.description },
          { field: 'instructionsForUse', expected: product.instructionsForUse },
          { field: 'composition', expected: product.composition },
          {
            field: 'maxQuantityForOrder',
            expected: product.maxQuantityForOrder
          },
          { field: 'isMedicine', expected: product.isMedicine },
          { field: 'priceWithoutTax', expected: expectedPriceWithoutTax },
          { field: 'priceWithTax', expected: expectedPriceWithTax },
          { field: 'locations', expected: expectedLocations },
          { field: 'weight', expected: expectedWeight }
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
          it('should provide all categories', () => {
            expect(vm.getAvailableCategories()).toStrictEqual(
              expectedAvailableCategories
            )
          })
        })
        describe('Locations choices', () => {
          it('should provide all locations', () => {
            expect(vm.getAvailableLocations()).toStrictEqual(
              expectedAvailableLocations
            )
          })
        })
        describe('Laboratory choices', () => {
          it('should provide all laboratories', () => {
            expect(vm.getAvailableLaboratories()).toStrictEqual(
              expectedAvailableLaboratories
            )
          })
        })
        describe('Promotion', () => {
          it('should provide the promotion', () => {
            expect(vm.getPromotion()).toStrictEqual(expectedPromotion)
          })
        })
      }
    )
  })
  describe('Toggle categories', () => {
    const product = dolodent
    beforeEach(() => {
      productStore.current = {
        product
      }
      vm = productFormEditVM(key)
    })
    describe('Simple toggle', () => {
      it('should add the category to the list of categories', () => {
        vm.toggleCategory('added-category')
        const expectedField: Field<any> = {
          value: [...product.categories.map((c) => c.uuid), 'added-category'],
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
          value: [
            ...product.categories.map((c) => c.uuid),
            'added-category',
            'another-added-category'
          ],
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
          value: [...product.categories.map((c) => c.uuid)],
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
          value: [
            ...product.categories.map((c) => c.uuid),
            'wow-category',
            'batman-category',
            'another-added-category'
          ],
          canEdit: true
        }
        expect(vm.get('categoryUuids')).toStrictEqual(expectedField)
      })
    })
  })
  describe('Toggle is active', () => {
    it('should toggle is active', () => {
      const product = JSON.parse(JSON.stringify(ultraLevure))
      productStore.current = {
        product
      }
      vm = productFormEditVM(key)
      vm.toggleIsActive()
      expect(vm.get('isActive')).toStrictEqual({
        canEdit: true,
        value: true
      })
    })
    it('should toggle 2 times', () => {
      const product = JSON.parse(JSON.stringify(ultraLevure))
      productStore.current = {
        product
      }
      vm = productFormEditVM(key)
      vm.toggleIsActive()
      vm.toggleIsActive()
      expect(vm.get('isActive')).toStrictEqual({
        canEdit: true,
        value: false
      })
    })
  })
  describe('Change laboratory', () => {
    const product = dolodent
    beforeEach(() => {
      productStore.current = {
        product
      }
      vm = productFormEditVM(key)
    })
    describe('Simple toggle on multiple categories', () => {
      it('should add the categories to the list of categories', () => {
        vm.toggleCategory('added-category')
        vm.toggleCategory('another-added-category')
        const expectedField: Field<any> = {
          value: [
            ...product.categories.map((c) => c.uuid),
            'added-category',
            'another-added-category'
          ],
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
          value: [...product.categories.map((c) => c.uuid)],
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
          value: [
            ...product.categories.map((c) => c.uuid),
            'wow-category',
            'batman-category',
            'another-added-category'
          ],
          canEdit: true
        }
        expect(vm.get('categoryUuids')).toStrictEqual(expectedField)
      })
    })
  })

  describe('DTO', () => {
    const product = dolodent
    beforeEach(() => {
      productStore.current = {
        product
      }
      laboratoryStore.items = [avene, sanofiAventis]
    })
    describe('For a dto with orderedImages from existing product', () => {
      it('should include existing images as orderedImages', () => {
        vm = productFormEditVM(key)
        const dto = vm.getDto()
        expect(dto.orderedImages?.length).toBe(1)
        expect(dto.orderedImages?.[0].source).toStrictEqual({
          type: 'existing',
          url: dolodent.images[0]
        })
      })
    })
    describe('For a dto after adding new images', () => {
      it('should include both existing and new images in orderedImages', async () => {
        const uuidGenerator = new SequentialUuidGenerator('dto-img')
        const initializer = new ExistingProductFormInitializer(
          key,
          uuidGenerator
        )
        const getter = new ProductFormFieldsReader(key)
        const setter = new ProductFormFieldsWriter(key, getter)
        vm = new ProductFormEditVM(initializer, getter, setter, uuidGenerator)

        const newFile = new File(['data1'], 'File 1', { type: 'image/png' })
        await vm.addImages([newFile])

        const dto = vm.getDto()
        expect(dto.orderedImages?.length).toBe(2)
      })
    })
    describe('For a dto after removing an image', () => {
      it('should not include removed image in orderedImages', () => {
        const uuidGenerator = new SequentialUuidGenerator('dto-img')
        const initializer = new ExistingProductFormInitializer(
          key,
          uuidGenerator
        )
        const getter = new ProductFormFieldsReader(key)
        const setter = new ProductFormFieldsWriter(key, getter)
        vm = new ProductFormEditVM(initializer, getter, setter, uuidGenerator)

        vm.removeImageById('dto-img-0')

        const dto = vm.getDto()
        expect(dto.orderedImages).toStrictEqual([])
      })
    })
    describe('For a dto after reordering images', () => {
      it('should return images in new order', () => {
        productStore.current = { product: hemoclar }
        const uuidGenerator = new SequentialUuidGenerator('dto-img')
        const initializer = new ExistingProductFormInitializer(
          key,
          uuidGenerator
        )
        const getter = new ProductFormFieldsReader(key)
        const setter = new ProductFormFieldsWriter(key, getter)
        vm = new ProductFormEditVM(initializer, getter, setter, uuidGenerator)

        vm.reorderImages(2, 0)

        const dto = vm.getDto()
        expect(dto.orderedImages?.[0].id).toBe('dto-img-2')
        expect(dto.orderedImages?.[1].id).toBe('dto-img-0')
        expect(dto.orderedImages?.[2].id).toBe('dto-img-1')
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
      productStore.isLoading = true
      expect(vm.isLoading()).toBe(true)
    })
    it('should be aware when not loading', () => {
      productStore.isLoading = false
      expect(vm.isLoading()).toBe(false)
    })
  })

  describe('ProductImage operations', () => {
    const uuidGenerator = new SequentialUuidGenerator('img')

    beforeEach(() => {
      uuidGenerator.reset()
      productStore.current = { product: hemoclar }
      locationStore.items = [zoneGeo]
      categoryStore.items = [baby]
      laboratoryStore.items = [sanofiAventis]
      vm = productFormEditVM(key)
    })

    describe('removeImageById', () => {
      it('should remove image by ID and recalculate order', () => {
        const productImages = formStore.get(key)
          .productImages as Array<ProductImage>
        const imageIdToRemove = productImages[1].id

        vm.removeImageById(imageIdToRemove)

        const updatedImages = formStore.get(key)
          .productImages as Array<ProductImage>
        expect(updatedImages.length).toBe(2)
      })

      it('should preserve remaining images with correct order after removal', () => {
        const productImages = formStore.get(key)
          .productImages as Array<ProductImage>
        const imageIdToRemove = productImages[1].id

        vm.removeImageById(imageIdToRemove)

        const updatedImages = formStore.get(key)
          .productImages as Array<ProductImage>
        expect(updatedImages[0].order).toBe(0)
      })

      it('should preserve remaining images with updated order for second element', () => {
        const productImages = formStore.get(key)
          .productImages as Array<ProductImage>
        const imageIdToRemove = productImages[1].id

        vm.removeImageById(imageIdToRemove)

        const updatedImages = formStore.get(key)
          .productImages as Array<ProductImage>
        expect(updatedImages[1].order).toBe(1)
      })
    })

    describe('reorderImages', () => {
      it('should move image from first position to last', () => {
        vm.reorderImages(0, 2)

        const updatedImages = formStore.get(key)
          .productImages as Array<ProductImage>
        expect(updatedImages[2].source).toStrictEqual({
          type: 'existing',
          url: 'https://fakeimg.pl/300/'
        })
      })

      it('should update order values after reordering', () => {
        vm.reorderImages(0, 2)

        const updatedImages = formStore.get(key)
          .productImages as Array<ProductImage>
        expect(updatedImages.map((img) => img.order)).toStrictEqual([0, 1, 2])
      })
    })

    describe('addImages', () => {
      it('should add new images with correct order after existing ones', async () => {
        const newFiles = [
          new File(['data1'], 'new1.png', { type: 'image/png' }),
          new File(['data2'], 'new2.png', { type: 'image/png' })
        ]

        await vm.addImages(newFiles)

        const updatedImages = formStore.get(key)
          .productImages as Array<ProductImage>
        expect(updatedImages.length).toBe(5)
      })

      it('should assign new images with type new', async () => {
        const newFiles = [
          new File(['data1'], 'new1.png', { type: 'image/png' })
        ]

        await vm.addImages(newFiles)

        const updatedImages = formStore.get(key)
          .productImages as Array<ProductImage>
        expect(updatedImages[3].source.type).toBe('new')
      })

      it('should assign correct order to newly added images', async () => {
        const newFiles = [
          new File(['data1'], 'new1.png', { type: 'image/png' }),
          new File(['data2'], 'new2.png', { type: 'image/png' })
        ]

        await vm.addImages(newFiles)

        const updatedImages = formStore.get(key)
          .productImages as Array<ProductImage>
        expect(updatedImages[3].order).toBe(3)
      })
    })
  })

  describe('Full scenario: A,B,C → remove B → add D → reorder D,C,A', () => {
    const scenarioKey = 'full-scenario-key'
    const uuidGenerator = new SequentialUuidGenerator('scenario')

    beforeEach(() => {
      uuidGenerator.reset()
      productStore.current = { product: hemoclar }
      locationStore.items = [zoneGeo]
      categoryStore.items = [baby]
      laboratoryStore.items = [sanofiAventis]
    })

    it('should produce final order D,C,A after remove B, add D, reorder', async () => {
      const initializer = new ExistingProductFormInitializer(
        scenarioKey,
        uuidGenerator
      )
      const getter = new ProductFormFieldsReader(scenarioKey)
      const setter = new ProductFormFieldsWriter(scenarioKey, getter)
      vm = new ProductFormEditVM(initializer, getter, setter, uuidGenerator)

      vm.removeImageById('scenario-1')

      const fileD = new File(['dataD'], 'imageD.png', { type: 'image/png' })
      await vm.addImages([fileD])

      vm.reorderImages(2, 0)
      vm.reorderImages(2, 1)

      const dto = vm.getDto()
      expect(dto.orderedImages?.map((img) => img.id)).toStrictEqual([
        'scenario-3',
        'scenario-2',
        'scenario-0'
      ])
    })

    it('should have correct image sources after full scenario', async () => {
      const initializer = new ExistingProductFormInitializer(
        scenarioKey,
        uuidGenerator
      )
      const getter = new ProductFormFieldsReader(scenarioKey)
      const setter = new ProductFormFieldsWriter(scenarioKey, getter)
      vm = new ProductFormEditVM(initializer, getter, setter, uuidGenerator)

      vm.removeImageById('scenario-1')

      const fileD = new File(['dataD'], 'imageD.png', { type: 'image/png' })
      await vm.addImages([fileD])

      vm.reorderImages(2, 0)
      vm.reorderImages(2, 1)

      const dto = vm.getDto()
      expect(dto.orderedImages?.[0].source.type).toBe('new')
    })

    it('should maintain correct order values after full scenario', async () => {
      const initializer = new ExistingProductFormInitializer(
        scenarioKey,
        uuidGenerator
      )
      const getter = new ProductFormFieldsReader(scenarioKey)
      const setter = new ProductFormFieldsWriter(scenarioKey, getter)
      vm = new ProductFormEditVM(initializer, getter, setter, uuidGenerator)

      vm.removeImageById('scenario-1')

      const fileD = new File(['dataD'], 'imageD.png', { type: 'image/png' })
      await vm.addImages([fileD])

      vm.reorderImages(2, 0)
      vm.reorderImages(2, 1)

      const dto = vm.getDto()
      expect(dto.orderedImages?.map((img) => img.order)).toStrictEqual([
        0, 1, 2
      ])
    })
  })
})

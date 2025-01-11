import { useFormStore } from '@store/formStore'
import type { Field } from '@adapters/primary/view-models/promotions/promotion-form/promotionFormCreateVM'
import type { Category } from '@core/entities/category'
import {
  CreateProductCategoriesVM,
  CreateProductLaboratoriesVM,
  CreateProductLocationsVM
} from '@adapters/primary/view-models/products/product-form/productFormCreateVM'
import { useProductStore } from '@store/productStore'
import { useCategoryStore } from '@store/categoryStore'
import { addTaxToPrice } from '@utils/price'
import { useLocationStore } from '@store/locationStore'
import { Location, sortLocationByOrder } from '@core/entities/location'
import { ReductionType } from '@core/entities/promotion'
import { priceFormatter, timestampToLocaleString } from '@utils/formatters'
import { useLaboratoryStore } from '@store/laboratoryStore'
import { isProductActive } from '@core/entities/product'

export interface GetProductPromotionVM {
  href: string
  type: string
  amount: string
  startDate: string
  startDatetime: Date
  endDate: string
  endDatetime: Date
}

export class FormFieldsReader {
  protected readonly key: string
  protected formStore: any

  constructor(key: string) {
    this.key = key
    this.formStore = useFormStore()
  }

  get(fieldName: string): any {
    return this.formStore.get(this.key)[fieldName]
  }
}

export interface FormInitializer {
  init(): void
}

export class ProductFormFieldsReader extends FormFieldsReader {
  protected categoryStore: any
  protected locationStore: any
  protected laboratoryStore: any

  constructor(key: string) {
    super(key)
    this.categoryStore = useCategoryStore()
    this.locationStore = useLocationStore()
    this.laboratoryStore = useLaboratoryStore()
  }

  getAvailableCategories(): CreateProductCategoriesVM {
    const categories = this.categoryStore.items
    return categories.map((c: Category) => {
      return {
        uuid: c.uuid,
        name: c.name
      }
    })
  }

  getAvailableLocations(): CreateProductLocationsVM {
    const locations = this.locationStore.items
    return locations.sort(sortLocationByOrder).map((l: Location) => {
      return {
        uuid: l.uuid,
        name: l.name
      }
    })
  }

  getAvailableLaboratories(): CreateProductLaboratoriesVM {
    const laboratories = this.laboratoryStore.items
    return laboratories.map((l: Location) => {
      return {
        uuid: l.uuid,
        name: l.name
      }
    })
  }
}

export class ExistingProductFormInitializer implements FormInitializer {
  protected readonly key: string
  protected formStore: any
  protected productStore: any
  protected locationStore: any

  constructor(key: string) {
    this.key = key
    this.formStore = useFormStore()
    this.productStore = useProductStore()
    this.locationStore = useLocationStore()
  }

  init() {
    let product = this.productStore.current?.product
    if (product) {
      product = JSON.parse(JSON.stringify(product))
    }
    this.formStore.set(this.key, {
      name: product.name,
      status: product.status,
      isActive: isProductActive(product),
      categoryUuids: product.categories.map((c) => c.uuid),
      cip7: product.cip7,
      cip13: product.cip13,
      ean13: product.ean13,
      priceWithoutTax: (product.priceWithoutTax / 100).toFixed(2),
      percentTaxRate: product.percentTaxRate,
      priceWithTax:
        addTaxToPrice(product.priceWithoutTax / 100, product.percentTaxRate)
          .toFixed(2)
          .toString() || undefined,
      laboratory: product.laboratory?.uuid || '',
      locations: product.locations,
      availableStock: product.availableStock,
      miniature: product.miniature,
      newMiniature: undefined,
      newImages: [],
      images: product.images || [],
      initialImages: JSON.parse(JSON.stringify(product.images || [])),
      description: product.description,
      instructionsForUse: product.instructionsForUse,
      composition: product.composition,
      weight: (product.weight / 1000).toString(),
      maxQuantityForOrder: product.maxQuantityForOrder,
      isMedicine: product.isMedicine
    })
  }

  private getProductLocations(locations: object): Array<any> {
    const allLocations = this.locationStore.items
    return allLocations.sort(sortLocationByOrder).map((location) => {
      return {
        uuid: location.uuid,
        label: location.name,
        value: locations[location.uuid]
      }
    })
  }
}

export class ProductFormVM {
  isLoading(): boolean {
    const productStore = useProductStore()
    return productStore.isLoading
  }
}

export class ProductFormGetVM extends ProductFormVM {
  protected initializer: ExistingProductFormInitializer
  protected fieldsReader: ProductFormFieldsReader

  constructor(
    initializer: ExistingProductFormInitializer,
    fieldReader: ProductFormFieldsReader
  ) {
    super()
    this.initializer = initializer
    this.fieldsReader = fieldReader
    initializer.init()
  }

  get(fieldName: string): any {
    return this.createField(fieldName)
  }

  private createField<T>(fieldName: string): Field<T> {
    return {
      value: this.fieldsReader.get(fieldName),
      canEdit: false
    }
  }

  getAvailableCategories(): CreateProductCategoriesVM {
    return this.fieldsReader.getAvailableCategories()
  }

  getAvailableLocations(): CreateProductLocationsVM {
    return this.fieldsReader.getAvailableLocations()
  }

  getAvailableLaboratories(): CreateProductLaboratoriesVM {
    return this.fieldsReader.getAvailableLaboratories()
  }

  getPromotion(): GetProductPromotionVM | undefined {
    const productStore = useProductStore()
    if (!productStore.current?.promotion) return undefined
    const promotion = productStore.current?.promotion
    const formatter = priceFormatter('fr-FR', 'EUR')
    return {
      href: `/promotions/get/${promotion.uuid}`,
      type: promotion.type === ReductionType.Fixed ? 'FIXE' : 'POURCENTAGE',
      amount: formatter.format(promotion.amount / 100),
      startDate: promotion.startDate
        ? timestampToLocaleString(promotion.startDate, 'fr-FR')
        : '',
      startDatetime: new Date(promotion.startDate || ''),
      endDate: promotion.endDate
        ? timestampToLocaleString(promotion.endDate, 'fr-FR')
        : '',
      endDatetime: new Date(promotion.endDate || '')
    }
  }

  getDisplayValidate(): boolean {
    return false
  }

  getCanValidate(): boolean {
    return false
  }
}

export const productFormGetVM = (key: string): ProductFormGetVM => {
  const initVM = new ExistingProductFormInitializer(key)
  const getForm = new ProductFormFieldsReader(key)
  return new ProductFormGetVM(initVM, getForm)
}

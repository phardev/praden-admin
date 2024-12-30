import {
  ExistingProductFormInitializer,
  GetProductPromotionVM,
  ProductFormFieldsReader,
  ProductFormVM
} from '@adapters/primary/view-models/products/product-form/productFormGetVM'
import {
  CreateProductCategoriesVM,
  CreateProductLaboratoriesVM,
  CreateProductLocationsVM,
  ProductFormFieldsWriter
} from '@adapters/primary/view-models/products/product-form/productFormCreateVM'
import type { Field } from '@adapters/primary/view-models/promotions/promotion-form/promotionFormCreateVM'
import { useProductStore } from '@store/productStore'
import { priceFormatter, timestampToLocaleString } from '@utils/formatters'
import { ReductionType } from '@core/entities/promotion'
import { UUID } from '@core/types/types'
import { useLaboratoryStore } from '@store/laboratoryStore'
import { EditProductDTO } from '@core/usecases/product/product-edition/editProduct'

export class ProductFormEditVM extends ProductFormVM {
  private fieldsReader: ProductFormFieldsReader
  private fieldsWriter: ProductFormFieldsWriter

  constructor(
    initializer: ExistingProductFormInitializer,
    fieldsReader: ProductFormFieldsReader,
    fieldsWriter: ProductFormFieldsWriter
  ) {
    super()
    initializer.init()
    this.fieldsReader = fieldsReader
    this.fieldsWriter = fieldsWriter
  }

  get(fieldName: string): any {
    return this.createField(fieldName)
  }

  toggleCategory(uuid: UUID): void {
    const categoryUuids = this.fieldsReader.get('categoryUuids')
    const index = categoryUuids.indexOf(uuid)
    if (index < 0) {
      categoryUuids.push(uuid)
    } else {
      categoryUuids.splice(index, 1)
    }
    this.fieldsWriter.set('categoryUuids', categoryUuids)
  }

  private createField<T>(fieldName: string): Field<T> {
    return {
      value: this.fieldsReader.get(fieldName),
      canEdit: true
    }
  }

  async set(fieldName: string, value: any): Promise<void> {
    await this.fieldsWriter.set(fieldName, value)
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

  getDto(): EditProductDTO {
    const priceWithoutTax = this.fieldsReader.get('priceWithoutTax')
      ? parseFloat(this.fieldsReader.get('priceWithoutTax')) * 100
      : undefined
    const percentTaxRate = this.fieldsReader.get('percentTaxRate')
      ? parseFloat(this.fieldsReader.get('percentTaxRate'))
      : undefined
    const availableStock = this.fieldsReader.get('availableStock')
      ? parseInt(this.fieldsReader.get('availableStock'))
      : undefined
    const laboratoryStore = useLaboratoryStore()
    const laboratory = laboratoryStore.getByUuid(
      this.fieldsReader.get('laboratory')
    )
    return {
      name: this.fieldsReader.get('name'),
      cip7: this.fieldsReader.get('cip7'),
      cip13: this.fieldsReader.get('cip13'),
      ean13: this.fieldsReader.get('ean13'),
      categoryUuids: this.fieldsReader.get('categoryUuids'),
      laboratory,
      miniature: this.fieldsReader.get('newMiniature'),
      newImages: this.fieldsReader.get('newImages'),
      priceWithoutTax,
      percentTaxRate,
      locations: this.fieldsReader.get('locations'),
      availableStock,
      description: this.fieldsReader.get('description'),
      instructionsForUse: this.fieldsReader.get('instructionsForUse'),
      composition: this.fieldsReader.get('composition'),
      weight: +this.fieldsReader.get('weight') * 1000,
      maxQuantityForOrder: this.fieldsReader.get('maxQuantityForOrder')
        ? +this.fieldsReader.get('maxQuantityForOrder')
        : undefined
    }
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
    return true
  }

  getCanValidate(): boolean {
    return true
  }
}

export const productFormEditVM = (key: string) => {
  const initializer = new ExistingProductFormInitializer(key)
  const getter = new ProductFormFieldsReader(key)
  const setter = new ProductFormFieldsWriter(key, getter)
  return new ProductFormEditVM(initializer, getter, setter)
}

import type { Field } from '@adapters/primary/view-models/promotions/promotion-form/promotionFormCreateVM'
import { UUID } from '@core/types/types'
import { Product } from '@core/entities/product'
import { useProductStore } from '@store/productStore'
import { useSearchStore } from '@store/searchStore'
import {
  ExistingLaboratoryFormInitializer,
  LaboratoryFormFieldsReader,
  LaboratoryProductItemVM
} from './laboratoryFormGetVM'
import { LaboratoryFormFieldsWriter } from '@adapters/primary/view-models/laboratories/laboratory-form/laboratoryFormCreateVM'
import { LaboratoryFormVM } from '@adapters/primary/view-models/laboratories/laboratory-form/laboratoryFormVM'
import { EditLaboratoryDTO } from '@core/usecases/laboratories/laboratory-edition/editLaboratory'

export class LaboratoryFormEditVM extends LaboratoryFormVM {
  private fieldsWriter: LaboratoryFormFieldsWriter
  private initialProducts: Array<Product>

  constructor(
    initializer: ExistingLaboratoryFormInitializer,
    fieldsReader: LaboratoryFormFieldsReader,
    fieldsWriter: LaboratoryFormFieldsWriter,
    key: string
  ) {
    super(fieldsReader, key)
    initializer.init()
    this.fieldsWriter = fieldsWriter
    this.initialProducts = JSON.parse(
      JSON.stringify(this.fieldsReader.get('products'))
    )
  }

  get(fieldName: string): any {
    return this.createField(fieldName)
  }

  createField<T>(fieldName: string): Field<T> {
    return {
      value: this.fieldsReader.get(fieldName),
      canEdit: true
    }
  }

  getProducts(): Field<Array<LaboratoryProductItemVM>> {
    return {
      value: super.getProductsVM(),
      canEdit: true
    }
  }

  async set(fieldName: string, value: any): Promise<void> {
    await this.fieldsWriter.set(fieldName, value)
  }

  addProducts(uuids: Array<UUID>) {
    const products = this.fieldsReader.get('products')
    const productStore = useProductStore()
    const searchStore = useSearchStore()
    const searchResult = searchStore.get(this.key)
    const alreadyAdded = products.map((p: Product) => p.uuid)
    uuids
      .filter((uuid) => !alreadyAdded.includes(uuid))
      .forEach((uuid) => {
        let product = productStore.getByUuid(uuid)
        if (!product) {
          product = searchResult.find((p) => p.uuid === uuid)
        }
        products.push(product)
      })
    this.fieldsWriter.addProducts(uuids)
  }

  removeProducts(uuids: Array<UUID>) {
    this.fieldsWriter.removeProducts(uuids)
  }

  getDto(): EditLaboratoryDTO {
    const products = this.fieldsReader.get('products')
    const initialProductsUuids = this.initialProducts.map(
      (p: Product) => p.uuid
    )
    const productsUuids = products.map((p: Product) => p.uuid)
    const productsAdded = productsUuids.filter(
      (uuid: UUID) => !initialProductsUuids.includes(uuid)
    )
    const productsRemoved = initialProductsUuids.filter(
      (uuid: UUID) => !productsUuids.includes(uuid)
    )
    return {
      name: this.fieldsReader.get('name'),
      description: this.fieldsReader.get('description'),
      miniature: this.fieldsReader.get('oldMiniature'),
      newMiniature: this.fieldsReader.get('newMiniature'),
      image: this.fieldsReader.get('oldImage'),
      newImage: this.fieldsReader.get('newImage'),
      productsAdded,
      productsRemoved
    }
  }

  getDisplayValidate(): boolean {
    return true
  }

  getCanValidate(): boolean {
    return true
  }
}

export const laboratoryFormEditVM = (key: string) => {
  const initializer = new ExistingLaboratoryFormInitializer(key)
  const reader = new LaboratoryFormFieldsReader(key)
  const writer = new LaboratoryFormFieldsWriter(key, reader)
  return new LaboratoryFormEditVM(initializer, reader, writer, key)
}

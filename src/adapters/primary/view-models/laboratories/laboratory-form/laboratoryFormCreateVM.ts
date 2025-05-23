import type { Field } from '@adapters/primary/view-models/promotions/promotion-form/promotionFormCreateVM'
import { FormInitializer } from '@adapters/primary/view-models/products/product-form/productFormGetVM'
import { useFormStore } from '@store/formStore'
import {
  FieldHandler,
  FormFieldsWriter
} from '@adapters/primary/view-models/products/product-form/productFormCreateVM'
import { UUID } from '@core/types/types'
import { getFileContent } from '@utils/file'
import { Product } from '@core/entities/product'
import { useProductStore } from '@store/productStore'
import { useSearchStore } from '@store/searchStore'
import {
  LaboratoryFormFieldsReader,
  LaboratoryProductItemVM
} from '@adapters/primary/view-models/laboratories/laboratory-form/laboratoryFormGetVM'
import { LaboratoryFormVM } from '@adapters/primary/view-models/laboratories/laboratory-form/laboratoryFormVM'
import { CreateLaboratoryDTO } from '@core/usecases/laboratories/laboratory-creation/createLaboratory'

export class LaboratoryFormFieldsWriter extends FormFieldsWriter {
  protected fieldsReader: LaboratoryFormFieldsReader
  private readonly fieldHandlers: Record<string, FieldHandler>

  constructor(key: string, fieldsReader: LaboratoryFormFieldsReader) {
    super(key)
    this.fieldsReader = fieldsReader

    this.fieldHandlers = {
      miniature: this.setMiniature.bind(this),
      image: this.setImage.bind(this)
    }
  }

  override async set(fieldName: string, value: any): Promise<any> {
    const handler =
      this.fieldHandlers[fieldName] || super.set.bind(this, fieldName)
    await handler(value)
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
    super.set('products', products)
  }

  removeProducts(uuids: Array<UUID>) {
    let products = this.fieldsReader.get('products')
    products = products.filter((p: Product) => !uuids.includes(p.uuid))
    super.set('products', products)
  }

  async setMiniature(miniature: File): Promise<void> {
    const data = await getFileContent(miniature)
    super.set('miniature', data)
    super.set('newMiniature', miniature)
  }

  async setImage(image: File): Promise<void> {
    const data = await getFileContent(image)
    super.set('image', data)
    super.set('newImage', image)
  }
}

export class NewLaboratoryFormInitializer implements FormInitializer {
  protected readonly key: string
  protected formStore: any

  constructor(key: string) {
    this.key = key
    this.formStore = useFormStore()
  }

  init() {
    this.formStore.set(this.key, {
      name: '',
      description: '',
      parentUuid: undefined,
      miniature: undefined,
      image: undefined,
      products: []
    })
  }
}

export class LaboratoryFormCreateVM extends LaboratoryFormVM {
  private fieldsWriter: LaboratoryFormFieldsWriter

  constructor(
    initializer: NewLaboratoryFormInitializer,
    fieldsReader: LaboratoryFormFieldsReader,
    fieldsWriter: LaboratoryFormFieldsWriter,
    key: string
  ) {
    super(fieldsReader, key)
    initializer.init()
    this.fieldsWriter = fieldsWriter
  }

  get(fieldName: string): any {
    return this.createField(fieldName)
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

  getProducts(): Field<Array<LaboratoryProductItemVM>> {
    return {
      value: super.getProductsVM(),
      canEdit: true
    }
  }

  addProducts(uuids: Array<UUID>) {
    this.fieldsWriter.addProducts(uuids)
  }

  removeProducts(cip13: Array<string>) {
    this.fieldsWriter.removeProducts(cip13)
  }

  getDto(): CreateLaboratoryDTO {
    const products: Array<Product> = this.fieldsReader.get('products')
    const productsAdded = products.map((p: Product) => p.uuid)
    return {
      name: this.fieldsReader.get('name'),
      description: this.fieldsReader.get('description'),
      productsAdded,
      miniature: this.fieldsReader.get('newMiniature'),
      image: this.fieldsReader.get('newImage')
    }
  }

  getDisplayValidate(): boolean {
    return true
  }

  getCanValidate(): boolean {
    return true
  }
}

export const laboratoryFormCreateVM = (key: string): LaboratoryFormCreateVM => {
  const initializer = new NewLaboratoryFormInitializer(key)
  const reader = new LaboratoryFormFieldsReader(key)
  const writer = new LaboratoryFormFieldsWriter(key, reader)
  return new LaboratoryFormCreateVM(initializer, reader, writer, key)
}

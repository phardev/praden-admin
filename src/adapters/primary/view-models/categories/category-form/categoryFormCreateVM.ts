import type { Field } from '@adapters/primary/view-models/promotions/promotion-form/promotionFormCreateVM'
import { CreateCategoryDTO } from '@core/usecases/categories/category-creation/createCategory'
import { CategoryFormFieldsReader } from '@adapters/primary/view-models/categories/category-form/categoryFormGetVM'
import { FormInitializer } from '@adapters/primary/view-models/products/product-form/productFormGetVM'
import { useFormStore } from '@store/formStore'
import {
  FieldHandler,
  FormFieldsWriter
} from '@adapters/primary/view-models/products/product-form/productFormCreateVM'
import {
  CategoryFormVM,
  CategoryProductItemVM
} from '@adapters/primary/view-models/categories/category-form/categoryFormVM'
import { UUID } from '@core/types/types'
import { getFileContent } from '@utils/file'
import { Product } from '@core/entities/product'
import { useProductStore } from '@store/productStore'
import { useSearchStore } from '@store/searchStore'

export class CategoryFormFieldsWriter extends FormFieldsWriter {
  protected fieldsReader: CategoryFormFieldsReader
  private readonly fieldHandlers: Record<string, FieldHandler>

  constructor(key: string, fieldsReader: CategoryFormFieldsReader) {
    super(key)
    this.fieldsReader = fieldsReader

    this.fieldHandlers = {
      miniature: this.setMiniature.bind(this),
      image: this.setImage.bind(this)
    }
  }

  async set(fieldName: string, value: any): Promise<any> {
    const handler =
      this.fieldHandlers[fieldName] || super.set.bind(this, fieldName)
    await handler(value)
  }

  addProducts(uuids: Array<UUID>) {
    const products = this.fieldsReader.get('products')
    const productStore = useProductStore()
    const searchStore = useSearchStore()
    const searchResult = searchStore.get(this.key)
    const alreadyAdded = products.map((p) => p.uuid)
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

export class NewCategoryFormInitializer implements FormInitializer {
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

export class CategoryFormCreateVM extends CategoryFormVM {
  private fieldsWriter: CategoryFormFieldsWriter

  constructor(
    initializer: NewCategoryFormInitializer,
    fieldsReader: CategoryFormFieldsReader,
    fieldsWriter: CategoryFormFieldsWriter,
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

  getAvailableCategories(): any {
    return this.fieldsReader.getAvailableCategories()
  }

  getProducts(): Field<Array<CategoryProductItemVM>> {
    return {
      value: super.getCategoryProductsVM(),
      canEdit: true
    }
  }

  addProducts(uuids: Array<UUID>) {
    this.fieldsWriter.addProducts(uuids)
  }

  removeProducts(cip13: Array<string>) {
    this.fieldsWriter.removeProducts(cip13)
  }

  getDto(): CreateCategoryDTO {
    const products: Array<Product> = this.fieldsReader.get('products')
    const productsAdded = products.map((p: Product) => p.uuid)
    return {
      name: this.fieldsReader.get('name'),
      parentUuid: this.fieldsReader.get('parentUuid'),
      description: this.fieldsReader.get('description'),
      productsAdded,
      miniature: this.fieldsReader.get('miniature'),
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

export const categoryFormCreateVM = (key: string): CategoryFormCreateVM => {
  const initializer = new NewCategoryFormInitializer(key)
  const reader = new CategoryFormFieldsReader(key)
  const writer = new CategoryFormFieldsWriter(key, reader)
  return new CategoryFormCreateVM(initializer, reader, writer, key)
}

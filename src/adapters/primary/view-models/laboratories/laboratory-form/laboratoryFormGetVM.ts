import {
  FormFieldsReader,
  FormInitializer
} from '@adapters/primary/view-models/products/product-form/productFormGetVM'
import { Field } from '@adapters/primary/view-models/promotions/promotion-form/promotionFormCreateVM'
import { UUID } from '@core/types/types'
import { useFormStore } from '@store/formStore'
import { useLaboratoryStore } from '@store/laboratoryStore'
import { LaboratoryFormVM } from './laboratoryFormVM'

export interface LaboratoryProductItemVM {
  uuid: UUID
  name: string
  reference: string
  categories: Array<string>
}

export class ExistingLaboratoryFormInitializer implements FormInitializer {
  protected readonly key: string
  protected formStore: any
  protected laboratoryStore: any

  constructor(key: string) {
    this.key = key
    this.formStore = useFormStore()
    this.laboratoryStore = useLaboratoryStore()
  }

  init() {
    let laboratory = this.laboratoryStore.current?.laboratory
    if (laboratory) {
      laboratory = JSON.parse(JSON.stringify(laboratory))
    }
    this.formStore.set(this.key, {
      name: laboratory.name,
      description: laboratory.description,
      oldMiniature: laboratory.miniature,
      miniature: laboratory.miniature,
      image: laboratory.image,
      oldImage: laboratory.image,
      products: this.laboratoryStore.current?.products || []
    })
  }
}

export class LaboratoryFormFieldsReader extends FormFieldsReader {
  constructor(key: string) {
    super(key)
  }
}

export class LaboratoryFormGetVM extends LaboratoryFormVM {
  protected initializer: ExistingLaboratoryFormInitializer

  constructor(
    initializer: ExistingLaboratoryFormInitializer,
    fieldReader: LaboratoryFormFieldsReader,
    key: string
  ) {
    super(fieldReader, key)
    this.initializer = initializer
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

  getProducts(): Field<Array<LaboratoryProductItemVM>> {
    return {
      value: super.getProductsVM(),
      canEdit: false
    }
  }

  getDisplayValidate(): boolean {
    return false
  }

  getCanValidate(): boolean {
    return false
  }
}

export const laboratoryFormGetVM = (key: string): LaboratoryFormGetVM => {
  const initializer = new ExistingLaboratoryFormInitializer(key)
  const reader = new LaboratoryFormFieldsReader(key)
  return new LaboratoryFormGetVM(initializer, reader, key)
}

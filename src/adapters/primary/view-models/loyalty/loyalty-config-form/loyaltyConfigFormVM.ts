import { FormFieldsWriter } from '@adapters/primary/view-models/products/product-form/productFormCreateVM'
import {
  FormFieldsReader,
  FormInitializer
} from '@adapters/primary/view-models/products/product-form/productFormGetVM'
import type { Field } from '@adapters/primary/view-models/promotions/promotion-form/promotionFormCreateVM'
import type { UpdateLoyaltyConfigDTO } from '@core/gateways/loyaltyGateway'
import { useFormStore } from '@store/formStore'
import { useLoyaltyStore } from '@store/loyaltyStore'

export class LoyaltyConfigFormFieldsWriter extends FormFieldsWriter {
  constructor(key: string) {
    super(key)
  }
}

class LoyaltyConfigFormInitializer implements FormInitializer {
  protected readonly key: string
  protected formStore: any

  constructor(key: string) {
    this.key = key
    this.formStore = useFormStore()
  }

  init() {
    const loyaltyStore = useLoyaltyStore()
    const config = loyaltyStore.config
    this.formStore.set(this.key, {
      pointsPerEuro: config?.pointsPerEuro ?? 1,
      isActive: config?.isActive ?? false
    })
  }
}

export class LoyaltyConfigFormFieldsReader extends FormFieldsReader {
  constructor(key: string) {
    super(key)
  }
}

export class LoyaltyConfigFormVM {
  private readonly key: string
  protected fieldsReader: LoyaltyConfigFormFieldsReader
  private fieldsWriter: LoyaltyConfigFormFieldsWriter

  constructor(
    initializer: LoyaltyConfigFormInitializer,
    fieldsReader: LoyaltyConfigFormFieldsReader,
    fieldsWriter: LoyaltyConfigFormFieldsWriter,
    key: string
  ) {
    this.fieldsReader = fieldsReader
    this.fieldsWriter = fieldsWriter
    this.key = key
    initializer.init()
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

  getDto(): UpdateLoyaltyConfigDTO {
    return {
      pointsPerEuro: this.fieldsReader.get('pointsPerEuro'),
      isActive: this.fieldsReader.get('isActive')
    }
  }

  getCanValidate(): boolean {
    const pointsPerEuro = this.fieldsReader.get('pointsPerEuro')
    return (
      pointsPerEuro !== undefined && pointsPerEuro >= 0 && pointsPerEuro <= 100
    )
  }
}

export const loyaltyConfigFormVM = (key: string): LoyaltyConfigFormVM => {
  const initializer = new LoyaltyConfigFormInitializer(key)
  const reader = new LoyaltyConfigFormFieldsReader(key)
  const writer = new LoyaltyConfigFormFieldsWriter(key)
  return new LoyaltyConfigFormVM(initializer, reader, writer, key)
}

import {
  FieldHandler,
  FormFieldsWriter
} from '@adapters/primary/view-models/products/product-form/productFormCreateVM'
import {
  FormFieldsReader,
  FormInitializer
} from '@adapters/primary/view-models/products/product-form/productFormGetVM'
import type { Field } from '@adapters/primary/view-models/promotions/promotion-form/promotionFormCreateVM'
import type { CreateDeliveryPriceRuleDTO } from '@core/entities/deliveryPriceRule'
import { useFormStore } from '@store/formStore'

class DeliveryPriceRuleFormFieldsReader extends FormFieldsReader {
  constructor(key: string) {
    super(key)
  }
}

class DeliveryPriceRuleFormFieldsWriter extends FormFieldsWriter {
  protected fieldsReader: DeliveryPriceRuleFormFieldsReader
  private readonly fieldHandlers: Record<string, FieldHandler>

  constructor(key: string, fieldsReader: DeliveryPriceRuleFormFieldsReader) {
    super(key)
    this.fieldsReader = fieldsReader
    this.fieldHandlers = {
      priceInEuros: this.setPriceInEuros.bind(this),
      minOrderValueInEuros: this.setMinOrderValueInEuros.bind(this),
      maxWeightInKg: this.setMaxWeightInKg.bind(this)
    }
  }

  override set(fieldName: string, value: any): void {
    const handler =
      this.fieldHandlers[fieldName] || super.set.bind(this, fieldName)
    handler(value)
  }

  private setPriceInEuros(priceInEuros: number): void {
    super.set('price', Math.round(priceInEuros * 100))
  }

  private setMinOrderValueInEuros(minOrderValueInEuros: number): void {
    super.set('minOrderValue', Math.round(minOrderValueInEuros * 100))
  }

  private setMaxWeightInKg(maxWeightInKg: number): void {
    super.set('maxWeight', maxWeightInKg * 1000)
  }
}

class NewDeliveryPriceRuleFormInitializer implements FormInitializer {
  protected readonly key: string
  protected formStore: ReturnType<typeof useFormStore>

  constructor(key: string) {
    this.key = key
    this.formStore = useFormStore()
  }

  init(): void {
    this.formStore.set(this.key, {
      deliveryMethodUuid: '',
      name: '',
      price: 0,
      minOrderValue: 0,
      maxWeight: 5000,
      priority: 0,
      startDate: null,
      endDate: null,
      isActive: true
    })
  }
}

export class DeliveryPriceRuleFormCreateVM {
  private fieldsReader: DeliveryPriceRuleFormFieldsReader
  private fieldsWriter: DeliveryPriceRuleFormFieldsWriter

  constructor(
    initializer: NewDeliveryPriceRuleFormInitializer,
    fieldsReader: DeliveryPriceRuleFormFieldsReader,
    fieldsWriter: DeliveryPriceRuleFormFieldsWriter
  ) {
    this.fieldsReader = fieldsReader
    this.fieldsWriter = fieldsWriter
    initializer.init()
  }

  get(fieldName: string): Field<any> {
    return {
      value: this.fieldsReader.get(fieldName),
      canEdit: true
    }
  }

  async set(fieldName: string, value: any): Promise<void> {
    this.fieldsWriter.set(fieldName, value)
  }

  getDto(): CreateDeliveryPriceRuleDTO {
    return {
      deliveryMethodUuid: this.fieldsReader.get('deliveryMethodUuid'),
      name: this.fieldsReader.get('name'),
      price: this.fieldsReader.get('price'),
      minOrderValue: this.fieldsReader.get('minOrderValue'),
      maxWeight: this.fieldsReader.get('maxWeight'),
      priority: this.fieldsReader.get('priority'),
      startDate: this.fieldsReader.get('startDate'),
      endDate: this.fieldsReader.get('endDate'),
      isActive: this.fieldsReader.get('isActive')
    }
  }

  isValid(): boolean {
    const name = this.fieldsReader.get('name')
    const deliveryMethodUuid = this.fieldsReader.get('deliveryMethodUuid')
    return name !== '' && deliveryMethodUuid !== ''
  }
}

export const deliveryPriceRuleFormCreateVM = (
  key: string
): DeliveryPriceRuleFormCreateVM => {
  const initializer = new NewDeliveryPriceRuleFormInitializer(key)
  const reader = new DeliveryPriceRuleFormFieldsReader(key)
  const writer = new DeliveryPriceRuleFormFieldsWriter(key, reader)
  return new DeliveryPriceRuleFormCreateVM(initializer, reader, writer)
}

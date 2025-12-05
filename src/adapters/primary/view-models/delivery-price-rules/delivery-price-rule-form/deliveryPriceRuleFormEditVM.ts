import {
  FieldHandler,
  FormFieldsWriter
} from '@adapters/primary/view-models/products/product-form/productFormCreateVM'
import {
  FormFieldsReader,
  FormInitializer
} from '@adapters/primary/view-models/products/product-form/productFormGetVM'
import type { Field } from '@adapters/primary/view-models/promotions/promotion-form/promotionFormCreateVM'
import type { EditDeliveryPriceRuleDTO } from '@core/entities/deliveryPriceRule'
import { useDeliveryPriceRuleStore } from '@store/deliveryPriceRuleStore'
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

class ExistingDeliveryPriceRuleFormInitializer implements FormInitializer {
  protected readonly key: string
  protected formStore: ReturnType<typeof useFormStore>
  private deliveryPriceRuleStore: ReturnType<typeof useDeliveryPriceRuleStore>
  private originalValues: Record<string, any> = {}

  constructor(key: string) {
    this.key = key
    this.formStore = useFormStore()
    this.deliveryPriceRuleStore = useDeliveryPriceRuleStore()
  }

  init(): Record<string, any> {
    const rule = this.deliveryPriceRuleStore.current
    if (!rule) {
      throw new Error('No delivery price rule found in store')
    }
    const ruleCopy = JSON.parse(JSON.stringify(rule))
    this.originalValues = {
      deliveryMethodUuid: ruleCopy.deliveryMethodUuid,
      name: ruleCopy.name,
      price: ruleCopy.price,
      minOrderValue: ruleCopy.minOrderValue,
      maxWeight: ruleCopy.maxWeight,
      priority: ruleCopy.priority,
      startDate: ruleCopy.startDate,
      endDate: ruleCopy.endDate,
      isActive: ruleCopy.isActive
    }
    this.formStore.set(this.key, { ...this.originalValues })
    return this.originalValues
  }
}

export class DeliveryPriceRuleFormEditVM {
  private fieldsReader: DeliveryPriceRuleFormFieldsReader
  private fieldsWriter: DeliveryPriceRuleFormFieldsWriter
  private originalValues: Record<string, any>

  constructor(
    initializer: ExistingDeliveryPriceRuleFormInitializer,
    fieldsReader: DeliveryPriceRuleFormFieldsReader,
    fieldsWriter: DeliveryPriceRuleFormFieldsWriter
  ) {
    this.fieldsReader = fieldsReader
    this.fieldsWriter = fieldsWriter
    this.originalValues = initializer.init()
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

  getDto(): EditDeliveryPriceRuleDTO {
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

  getChangedDto(): EditDeliveryPriceRuleDTO {
    const result: EditDeliveryPriceRuleDTO = {}
    const fields = [
      'deliveryMethodUuid',
      'name',
      'price',
      'minOrderValue',
      'maxWeight',
      'priority',
      'startDate',
      'endDate',
      'isActive'
    ] as const

    for (const field of fields) {
      const currentValue = this.fieldsReader.get(field)
      if (currentValue !== this.originalValues[field]) {
        ;(result as any)[field] = currentValue
      }
    }

    return result
  }

  hasChanges(): boolean {
    return Object.keys(this.getChangedDto()).length > 0
  }

  isValid(): boolean {
    const name = this.fieldsReader.get('name')
    const deliveryMethodUuid = this.fieldsReader.get('deliveryMethodUuid')
    return name !== '' && deliveryMethodUuid !== ''
  }
}

export const deliveryPriceRuleFormEditVM = (
  key: string
): DeliveryPriceRuleFormEditVM => {
  const initializer = new ExistingDeliveryPriceRuleFormInitializer(key)
  const reader = new DeliveryPriceRuleFormFieldsReader(key)
  const writer = new DeliveryPriceRuleFormFieldsWriter(key, reader)
  return new DeliveryPriceRuleFormEditVM(initializer, reader, writer)
}

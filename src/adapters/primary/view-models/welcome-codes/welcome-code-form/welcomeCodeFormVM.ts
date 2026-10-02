import { FormFieldsWriter } from '@adapters/primary/view-models/products/product-form/productFormCreateVM'
import { FormFieldsReader } from '@adapters/primary/view-models/products/product-form/productFormGetVM'
import { ReductionType } from '@core/entities/promotion'
import { PromotionScope } from '@core/entities/promotionCode'
import { WelcomeCode, WelcomeCodeDTO } from '@core/entities/welcomeCode'
import { UUID } from '@core/types/types'
import { useDeliveryMethodStore } from '@store/deliveryMethodStore'
import { useFormStore } from '@store/formStore'
import { useWelcomeCodeStore } from '@store/welcomeCodeStore'
import { Field } from '../../promotions/promotion-form/promotionFormCreateVM'

const CENTS_PER_EURO = 100
const GRAMS_PER_KILOGRAM = 1000
const MAX_PERCENTAGE = 100
const SUGGESTED_DELIVERY_MAX_WEIGHT_IN_KILOGRAMS = 5

export const WelcomeCodeValidationHint = {
  CodeRequired: 'welcomeCode.hints.codeRequired',
  AmountMustBePositive: 'welcomeCode.hints.amountMustBePositive',
  PercentageTooHigh: 'welcomeCode.hints.percentageTooHigh',
  EndDateMustFollowStartDate: 'welcomeCode.hints.endDateMustFollowStartDate'
} as const

export interface WelcomeCodeTypeChoiceVM {
  type: ReductionType
  labelKey: string
}

export interface WelcomeCodeScopeChoiceVM {
  scope: PromotionScope
  labelKey: string
}

export interface WelcomeCodeDeliveryMethodVM {
  uuid: UUID
  name: string
}

interface WelcomeCodeFormFields {
  code: string
  reductionType: ReductionType
  scope: PromotionScope
  amount?: number
  minimumAmount?: number
  deliveryMethodUuids: Array<UUID>
  maxWeight?: number
  startDate?: number
  endDate?: number
}

const emptyFields = (): WelcomeCodeFormFields => ({
  code: '',
  reductionType: ReductionType.Fixed,
  scope: PromotionScope.Products,
  amount: undefined,
  minimumAmount: undefined,
  deliveryMethodUuids: [],
  maxWeight: undefined,
  startDate: undefined,
  endDate: undefined
})

const displayedAmountOf = ({ reductionType, amount }: WelcomeCode): number =>
  reductionType === ReductionType.Fixed ? amount / CENTS_PER_EURO : amount

const fieldsOf = (welcomeCode: WelcomeCode): WelcomeCodeFormFields => {
  const { minimumAmount, deliveryMethodUuids, maxWeight } =
    welcomeCode.conditions
  return {
    code: welcomeCode.code,
    reductionType: welcomeCode.reductionType,
    scope: welcomeCode.scope,
    amount: displayedAmountOf(welcomeCode),
    minimumAmount: minimumAmount ? minimumAmount / CENTS_PER_EURO : undefined,
    deliveryMethodUuids: deliveryMethodUuids ?? [],
    maxWeight: maxWeight ? maxWeight / GRAMS_PER_KILOGRAM : undefined,
    startDate: welcomeCode.startDate,
    endDate: welcomeCode.endDate
  }
}

export class WelcomeCodeFormVM {
  private readonly fieldsReader: FormFieldsReader
  private readonly fieldsWriter: FormFieldsWriter
  private readonly ready: boolean

  constructor(key: string, fields?: WelcomeCodeFormFields) {
    useFormStore().set(key, fields ?? emptyFields())
    this.ready = fields !== undefined
    this.fieldsReader = new FormFieldsReader(key)
    this.fieldsWriter = new FormFieldsWriter(key)
  }

  isReady(): boolean {
    return this.ready
  }

  get(fieldName: string): Field<any> {
    return { value: this.fieldsReader.get(fieldName), canEdit: true }
  }

  set(fieldName: string, value: any): void {
    if (fieldName === 'reductionType') {
      this.fieldsWriter.set('amount', undefined)
    }
    if (fieldName === 'scope') {
      this.fieldsWriter.set(
        'maxWeight',
        value === PromotionScope.Delivery
          ? SUGGESTED_DELIVERY_MAX_WEIGHT_IN_KILOGRAMS
          : undefined
      )
    }
    this.fieldsWriter.set(fieldName, value)
  }

  getAvailableTypeChoices(): Array<WelcomeCodeTypeChoiceVM> {
    return Object.values(ReductionType).map((type) => ({
      type,
      labelKey: `welcomeCode.types.${type}`
    }))
  }

  getAvailableScopeChoices(): Array<WelcomeCodeScopeChoiceVM> {
    return Object.values(PromotionScope).map((scope) => ({
      scope,
      labelKey: `welcomeCode.scopes.${scope}`
    }))
  }

  getAvailableDeliveryMethods(): Array<WelcomeCodeDeliveryMethodVM> {
    return useDeliveryMethodStore().items.map(({ uuid, name }) => ({
      uuid,
      name
    }))
  }

  getValidationHints(): Array<string> {
    const hints: Array<string> = []
    const amount = +this.fieldsReader.get('amount')
    if (!this.trimmedCode()) {
      hints.push(WelcomeCodeValidationHint.CodeRequired)
    }
    if (!(amount > 0)) {
      hints.push(WelcomeCodeValidationHint.AmountMustBePositive)
    }
    if (this.isPercentage() && amount > MAX_PERCENTAGE) {
      hints.push(WelcomeCodeValidationHint.PercentageTooHigh)
    }
    if (this.endsBeforeItStarts()) {
      hints.push(WelcomeCodeValidationHint.EndDateMustFollowStartDate)
    }
    return hints
  }

  getCanValidate(): boolean {
    return this.getValidationHints().length === 0 && !this.isSaving()
  }

  isSaving(): boolean {
    return useWelcomeCodeStore().isSaving
  }

  getDto(): WelcomeCodeDTO {
    const amount = +this.fieldsReader.get('amount')
    const dto: WelcomeCodeDTO = {
      code: this.trimmedCode(),
      reductionType: this.fieldsReader.get('reductionType'),
      scope: this.fieldsReader.get('scope'),
      amount: this.isPercentage()
        ? amount
        : Math.round(amount * CENTS_PER_EURO),
      conditions: {}
    }
    const minimumAmount = this.fieldsReader.get('minimumAmount')
    if (minimumAmount) {
      dto.conditions.minimumAmount = Math.round(+minimumAmount * CENTS_PER_EURO)
    }
    const deliveryMethodUuids = this.fieldsReader.get('deliveryMethodUuids')
    if (deliveryMethodUuids?.length > 0) {
      dto.conditions.deliveryMethodUuids = deliveryMethodUuids
    }
    const maxWeight = this.fieldsReader.get('maxWeight')
    if (maxWeight) {
      dto.conditions.maxWeight = Math.round(+maxWeight * GRAMS_PER_KILOGRAM)
    }
    const startDate = this.fieldsReader.get('startDate')
    if (startDate) {
      dto.startDate = startDate
    }
    const endDate = this.fieldsReader.get('endDate')
    if (endDate) {
      dto.endDate = endDate
    }
    return dto
  }

  private trimmedCode(): string {
    return String(this.fieldsReader.get('code') ?? '').trim()
  }

  private isPercentage(): boolean {
    return this.fieldsReader.get('reductionType') === ReductionType.Percentage
  }

  private endsBeforeItStarts(): boolean {
    const startDate = this.fieldsReader.get('startDate')
    const endDate = this.fieldsReader.get('endDate')
    return !!startDate && !!endDate && endDate <= startDate
  }
}

export const welcomeCodeFormCreateVM = (key: string): WelcomeCodeFormVM =>
  new WelcomeCodeFormVM(key, emptyFields())

export const welcomeCodeFormEditVM = (
  key: string,
  uuid: UUID
): WelcomeCodeFormVM => {
  const welcomeCode = useWelcomeCodeStore().items.find((w) => w.uuid === uuid)
  return new WelcomeCodeFormVM(
    key,
    welcomeCode ? fieldsOf(welcomeCode) : undefined
  )
}

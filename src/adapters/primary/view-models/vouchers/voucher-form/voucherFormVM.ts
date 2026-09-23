import {
  CreateVoucherDTO,
  canVoucherBeChanged,
  VoucherCustomer
} from '@core/entities/voucher'
import { DateProvider } from '@core/gateways/dateProvider'
import { Timestamp } from '@core/types/types'
import { useVoucherStore } from '@store/voucherStore'
import { timestampToLocaleString } from '@utils/formatters'
import { Field } from '../../promotions/promotion-form/promotionFormCreateVM'
import { voucherCustomerLabel } from './voucherCustomerLabel'
import { VoucherFormFieldsReader } from './voucherFormGetVM'

export const VoucherValidationHint = {
  SelectCustomer: 'voucher.hints.selectCustomer',
  AmountMustBePositive: 'voucher.hints.amountMustBePositive'
} as const

export abstract class VoucherFormVM {
  protected fieldsReader: VoucherFormFieldsReader
  protected dateProvider: DateProvider

  protected constructor(
    fieldsReader: VoucherFormFieldsReader,
    dateProvider: DateProvider
  ) {
    this.fieldsReader = fieldsReader
    this.dateProvider = dateProvider
  }

  abstract get(fieldName: string): Field<any>

  abstract set(fieldName: string, value: any): void

  getCustomer(): VoucherCustomer | undefined {
    return this.fieldsReader.get('customer')
  }

  getCustomerLabel(): string {
    const customer = this.getCustomer()
    return customer ? voucherCustomerLabel(customer) : ''
  }

  getExpirationDateLabel(): string {
    const expirationDate: Timestamp | undefined =
      this.fieldsReader.get('expirationDate')
    return expirationDate
      ? timestampToLocaleString(expirationDate, 'fr-FR')
      : ''
  }

  getMinExpirationDate(): Timestamp {
    return new Date(this.dateProvider.now()).setHours(0, 0, 0, 0)
  }

  getValidationHints(): Array<string> {
    const hints: Array<string> = []
    if (!this.getCustomer()) {
      hints.push(VoucherValidationHint.SelectCustomer)
    }
    if (!(+this.fieldsReader.get('amount') > 0)) {
      hints.push(VoucherValidationHint.AmountMustBePositive)
    }
    return hints
  }

  getCanValidate(): boolean {
    return this.getValidationHints().length === 0 && !this.isSaving()
  }

  getDisplayValidate(): boolean {
    return true
  }

  isSaving(): boolean {
    const voucherStore = useVoucherStore()
    return voucherStore.isSaving
  }

  canBeChanged(): boolean {
    const voucherStore = useVoucherStore()
    const current = voucherStore.current
    return !!current && canVoucherBeChanged(current)
  }

  getDto(): CreateVoucherDTO {
    const customer: VoucherCustomer = this.fieldsReader.get('customer')
    const res: CreateVoucherDTO = {
      amount: Math.round(+this.fieldsReader.get('amount') * 100),
      customerUuid: customer.uuid
    }
    const code = this.fieldsReader.get('code')
    if (code) {
      res.code = code
    }
    const expirationDate = this.fieldsReader.get('expirationDate')
    if (expirationDate) {
      res.expirationDate = expirationDate
    }
    return res
  }
}

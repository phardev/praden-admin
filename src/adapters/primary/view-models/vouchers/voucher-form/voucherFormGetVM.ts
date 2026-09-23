import {
  FormFieldsReader,
  FormInitializer
} from '@adapters/primary/view-models/products/product-form/productFormGetVM'
import {
  isVoucherExpired,
  isVoucherUsed,
  Voucher
} from '@core/entities/voucher'
import { DateProvider } from '@core/gateways/dateProvider'
import { useFormStore } from '@store/formStore'
import { useVoucherStore } from '@store/voucherStore'
import { timestampToLocaleString } from '@utils/formatters'
import { Field } from '../../promotions/promotion-form/promotionFormCreateVM'
import { VoucherFormVM } from './voucherFormVM'

export interface VoucherStatusVM {
  key: string
  params?: { date: string }
}

export class VoucherFormFieldsReader extends FormFieldsReader {}

export class ExistingVoucherFormInitializer implements FormInitializer {
  private readonly key: string

  constructor(key: string) {
    this.key = key
  }

  init(): void {
    const voucherStore = useVoucherStore()
    const formStore = useFormStore()
    const current = voucherStore.current
    formStore.set(this.key, {
      code: current?.code,
      amount: current ? current.amount / 100 : undefined,
      customer: current?.customer,
      expirationDate: current?.expirationDate,
      usedAt: current?.usedAt,
      orderUuid: current?.orderUuid
    })
  }
}

const datedStatus = (key: string, timestamp: number): VoucherStatusVM => ({
  key,
  params: { date: timestampToLocaleString(timestamp, 'fr-FR') }
})

const statusOf = (voucher: Voucher, now: number): VoucherStatusVM => {
  if (isVoucherUsed(voucher)) {
    return datedStatus('voucher.status.used', voucher.usedAt!)
  }
  if (isVoucherExpired(voucher, now)) {
    return datedStatus('voucher.status.expired', voucher.expirationDate!)
  }
  return { key: 'voucher.status.unused' }
}

export class VoucherFormGetVM extends VoucherFormVM {
  constructor(
    initializer: FormInitializer,
    fieldsReader: VoucherFormFieldsReader,
    dateProvider: DateProvider
  ) {
    super(fieldsReader, dateProvider)
    initializer.init()
  }

  get(fieldName: string): Field<any> {
    return {
      value: this.fieldsReader.get(fieldName),
      canEdit: false
    }
  }

  set(): void {}

  override getCanValidate(): boolean {
    return false
  }

  override getDisplayValidate(): boolean {
    return false
  }

  getStatus(): VoucherStatusVM | undefined {
    const voucherStore = useVoucherStore()
    const current = voucherStore.current
    return current ? statusOf(current, this.dateProvider.now()) : undefined
  }

  getOrderUuid(): string | undefined {
    return this.fieldsReader.get('orderUuid')
  }
}

export const voucherFormGetVM = (key: string, dateProvider: DateProvider) => {
  const initializer = new ExistingVoucherFormInitializer(key)
  const reader = new VoucherFormFieldsReader(key)
  return new VoucherFormGetVM(initializer, reader, dateProvider)
}

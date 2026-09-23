import { FormInitializer } from '@adapters/primary/view-models/products/product-form/productFormGetVM'
import { DateProvider } from '@core/gateways/dateProvider'
import { EditVoucherDTO } from '@core/usecases/vouchers/voucher-edition/editVoucher'
import { Field } from '../../promotions/promotion-form/promotionFormCreateVM'
import { VoucherFormFieldsWriter } from './voucherFormCreateVM'
import {
  ExistingVoucherFormInitializer,
  VoucherFormFieldsReader
} from './voucherFormGetVM'
import { VoucherFormVM } from './voucherFormVM'

export class VoucherFormEditVM extends VoucherFormVM {
  private readonly fieldsWriter: VoucherFormFieldsWriter

  constructor(
    initializer: FormInitializer,
    fieldsReader: VoucherFormFieldsReader,
    fieldsWriter: VoucherFormFieldsWriter,
    dateProvider: DateProvider
  ) {
    super(fieldsReader, dateProvider)
    this.fieldsWriter = fieldsWriter
    initializer.init()
  }

  get(fieldName: string): Field<any> {
    return {
      value: this.fieldsReader.get(fieldName),
      canEdit: true
    }
  }

  set(fieldName: string, value: any): void {
    this.fieldsWriter.set(fieldName, value)
  }

  getEditDto(): EditVoucherDTO {
    const dto = this.getDto()
    return {
      code: dto.code,
      amount: dto.amount,
      customerUuid: dto.customerUuid,
      expirationDate: dto.expirationDate ?? null
    }
  }
}

export const voucherFormEditVM = (key: string, dateProvider: DateProvider) => {
  const initializer = new ExistingVoucherFormInitializer(key)
  const reader = new VoucherFormFieldsReader(key)
  const writer = new VoucherFormFieldsWriter(key)
  return new VoucherFormEditVM(initializer, reader, writer, dateProvider)
}

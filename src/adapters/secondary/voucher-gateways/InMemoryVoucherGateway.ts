import { Customer } from '@core/entities/customer'
import {
  CreateVoucherDTO,
  isVoucherUsed,
  statusOfVoucher,
  Voucher,
  VoucherCustomer,
  VoucherPagination,
  VoucherStatus
} from '@core/entities/voucher'
import { VoucherCannotBeAppliedError } from '@core/errors/VoucherCannotBeAppliedError'
import { VoucherCannotBeChangedError } from '@core/errors/VoucherCannotBeChangedError'
import { VoucherDoesNotExistsError } from '@core/errors/VoucherDoesNotExistsError'
import {
  VoucherCannotBeAppliedReason,
  VoucherErrorCode
} from '@core/errors/VoucherError'
import { VoucherWithSameCodeAlreadyExistsError } from '@core/errors/VoucherWithSameCodeAlreadyExistsError'
import { UuidGenerator } from '@core/gateways/uuidGenerator'
import { VoucherGateway } from '@core/gateways/voucherGateway'
import { UUID } from '@core/types/types'
import { ApplyVoucherDTO } from '@core/usecases/vouchers/voucher-application/applyVoucher'
import { EditVoucherDTO } from '@core/usecases/vouchers/voucher-edition/editVoucher'

const SUGGESTED_CODE = 'BON-SUGGESTED'

const copyOf = <T>(value: T): T => JSON.parse(JSON.stringify(value))

const normalizedCode = (code: string): string => code.trim().toUpperCase()

const byMostRecentUsage = (a: Voucher, b: Voucher): number =>
  (b.usedAt ?? 0) - (a.usedAt ?? 0)

export class InMemoryVoucherGateway implements VoucherGateway {
  private vouchers: Array<Voucher> = []
  private customers: Array<Customer> = []
  private readonly uuidGenerator: UuidGenerator

  constructor(uuidGenerator: UuidGenerator) {
    this.uuidGenerator = uuidGenerator
  }

  list(
    status: VoucherStatus,
    pagination: VoucherPagination
  ): Promise<Array<Voucher>> {
    const vouchers = this.vouchersWithStatus(status).slice(
      pagination.offset,
      pagination.offset + pagination.limit
    )
    return Promise.resolve(copyOf(vouchers))
  }

  getByUuid(uuid: UUID): Promise<Voucher> {
    return Promise.resolve(copyOf(this.findByUuid(uuid)))
  }

  create(dto: CreateVoucherDTO): Promise<Voucher> {
    const code = dto.code ?? SUGGESTED_CODE
    this.verifyThatCodeIsFree(code)
    const created: Voucher = {
      uuid: this.uuidGenerator.generate(),
      code,
      amount: dto.amount,
      customer: this.voucherCustomerOf(dto.customerUuid),
      ...(dto.expirationDate && { expirationDate: dto.expirationDate }),
      isAttachedToOrder: false
    }
    this.vouchers.push(created)
    return Promise.resolve(copyOf(created))
  }

  edit(uuid: UUID, dto: EditVoucherDTO): Promise<Voucher> {
    const existing = this.findChangeableByUuid(uuid)
    if (dto.code) {
      this.verifyThatCodeIsFree(dto.code, uuid)
    }
    const { expirationDate, customerUuid, ...rest } = dto
    const edited: Voucher = { ...existing, ...rest }
    if (expirationDate === null) {
      delete edited.expirationDate
    } else if (expirationDate) {
      edited.expirationDate = expirationDate
    }
    if (customerUuid) {
      edited.customer = this.voucherCustomerOf(customerUuid)
    }
    this.vouchers = this.vouchers.map((v) => (v.uuid === uuid ? edited : v))
    return Promise.resolve(copyOf(edited))
  }

  delete(uuid: UUID): Promise<void> {
    this.findChangeableByUuid(uuid)
    this.vouchers = this.vouchers.filter((v) => v.uuid !== uuid)
    return Promise.resolve()
  }

  suggestCode(): Promise<string> {
    return Promise.resolve(SUGGESTED_CODE)
  }

  apply(dto: ApplyVoucherDTO): Promise<number> {
    const voucher = this.vouchers.find(
      (v) => normalizedCode(v.code) === normalizedCode(dto.code)
    )
    if (!voucher) {
      return Promise.reject(new VoucherDoesNotExistsError(dto.code))
    }
    if (isVoucherUsed(voucher)) {
      return Promise.reject(
        new VoucherCannotBeAppliedError(
          dto.code,
          VoucherCannotBeAppliedReason.AlreadyUsed
        )
      )
    }
    if (voucher.customer.uuid !== dto.customerUuid) {
      return Promise.reject(
        new VoucherCannotBeAppliedError(
          dto.code,
          VoucherCannotBeAppliedReason.BelongsToAnotherCustomer
        )
      )
    }
    return Promise.resolve(voucher.amount)
  }

  feedWith(...vouchers: Array<Voucher>) {
    this.vouchers = vouchers
  }

  feedCustomersWith(...customers: Array<Customer>) {
    this.customers = customers
  }

  private vouchersWithStatus(status: VoucherStatus): Array<Voucher> {
    const vouchers = this.vouchers.filter((v) => statusOfVoucher(v) === status)
    return status === VoucherStatus.Used
      ? vouchers.sort(byMostRecentUsage)
      : vouchers
  }

  private findByUuid(uuid: UUID): Voucher {
    const voucher = this.vouchers.find((v) => v.uuid === uuid)
    if (!voucher) {
      throw new VoucherDoesNotExistsError(uuid)
    }
    return voucher
  }

  private findChangeableByUuid(uuid: UUID): Voucher {
    const voucher = this.findByUuid(uuid)
    if (isVoucherUsed(voucher)) {
      throw new VoucherCannotBeChangedError(uuid, VoucherErrorCode.AlreadyUsed)
    }
    if (voucher.isAttachedToOrder) {
      throw new VoucherCannotBeChangedError(
        uuid,
        VoucherErrorCode.AttachedToOrder
      )
    }
    return voucher
  }

  private verifyThatCodeIsFree(code: string, ownerUuid?: UUID) {
    const isTaken = this.vouchers.some(
      (v) =>
        normalizedCode(v.code) === normalizedCode(code) && v.uuid !== ownerUuid
    )
    if (isTaken) {
      throw new VoucherWithSameCodeAlreadyExistsError(code)
    }
  }

  private voucherCustomerOf(customerUuid: UUID): VoucherCustomer {
    const customer = this.customers.find((c) => c.uuid === customerUuid)
    return {
      uuid: customerUuid,
      email: customer?.email ?? '',
      ...(customer?.firstname && { firstname: customer.firstname }),
      ...(customer?.lastname && { lastname: customer.lastname })
    }
  }
}

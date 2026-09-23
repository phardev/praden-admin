import { VoucherCannotBeAppliedError } from '@core/errors/VoucherCannotBeAppliedError'
import { VoucherDoesNotExistsError } from '@core/errors/VoucherDoesNotExistsError'
import {
  VoucherCannotBeAppliedReason,
  VoucherErrorCode
} from '@core/errors/VoucherError'
import { unusedVoucher } from '@utils/testData/vouchers'
import { voucherErrorMessageKey } from './voucherErrorMessageVM'

describe('Voucher error message VM', () => {
  const apiError = (status: number, data: unknown) => ({
    response: { status, data }
  })

  describe('Given an API error with a known code', () => {
    it.each([
      [VoucherErrorCode.NotFound, 'voucher.errors.notFound'],
      [VoucherErrorCode.CodeAlreadyExists, 'voucher.errors.codeAlreadyExists'],
      [VoucherErrorCode.AlreadyUsed, 'voucher.errors.alreadyUsed'],
      [VoucherErrorCode.AttachedToOrder, 'voucher.errors.attachedToOrder'],
      [VoucherErrorCode.InvalidAmount, 'voucher.errors.invalidAmount'],
      [
        VoucherErrorCode.ExpirationInThePast,
        'voucher.errors.expirationInThePast'
      ],
      [VoucherErrorCode.CustomerNotFound, 'voucher.errors.customerNotFound'],
      [
        VoucherErrorCode.PromotionCodeCannotBeApplied,
        'voucher.errors.promotionCodeCannotBeApplied'
      ]
    ])('should translate %s', (code, expectedKey) => {
      expect(voucherErrorMessageKey(apiError(400, { code }))).toStrictEqual(
        expectedKey
      )
    })
  })

  describe('Given an API error refusing to apply the voucher', () => {
    it.each([
      [
        VoucherCannotBeAppliedReason.CustomerNotIdentified,
        'voucher.errors.cannotBeApplied.customerNotIdentified'
      ],
      [
        VoucherCannotBeAppliedReason.BelongsToAnotherCustomer,
        'voucher.errors.cannotBeApplied.belongsToAnotherCustomer'
      ],
      [
        VoucherCannotBeAppliedReason.AlreadyUsed,
        'voucher.errors.cannotBeApplied.alreadyUsed'
      ],
      [
        VoucherCannotBeAppliedReason.Expired,
        'voucher.errors.cannotBeApplied.expired'
      ],
      [
        VoucherCannotBeAppliedReason.InsufficientEligibleAmount,
        'voucher.errors.cannotBeApplied.insufficientEligibleAmount'
      ]
    ])('should translate the reason %s', (reason, expectedKey) => {
      expect(
        voucherErrorMessageKey(
          apiError(400, { code: VoucherErrorCode.CannotBeApplied, reason })
        )
      ).toStrictEqual(expectedKey)
    })

    it('should fall back on a generic refusal when the reason is unknown', () => {
      expect(
        voucherErrorMessageKey(
          apiError(400, { code: VoucherErrorCode.CannotBeApplied })
        )
      ).toStrictEqual('voucher.errors.cannotBeApplied.unknown')
    })
  })

  describe('Given an error raised by the application', () => {
    it('should translate its code', () => {
      expect(
        voucherErrorMessageKey(
          new VoucherDoesNotExistsError(unusedVoucher.uuid)
        )
      ).toStrictEqual('voucher.errors.notFound')
    })

    it('should translate its reason', () => {
      expect(
        voucherErrorMessageKey(
          new VoucherCannotBeAppliedError(
            unusedVoucher.code,
            VoucherCannotBeAppliedReason.Expired
          )
        )
      ).toStrictEqual('voucher.errors.cannotBeApplied.expired')
    })
  })

  describe('Given an error without a known code', () => {
    it.each([
      ['a server error', apiError(500, 'Internal Server Error')],
      ['a validation error', apiError(400, ['amount: Required'])],
      ['an unknown code', apiError(400, { code: 'SOMETHING_ELSE' })],
      ['a network error', { code: 'ERR_NETWORK' }],
      ['nothing', undefined]
    ])('should give a generic message for %s', (_label, error) => {
      expect(voucherErrorMessageKey(error)).toStrictEqual('error.unknown')
    })
  })
})

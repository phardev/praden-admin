import {
  isVoucherExpired,
  isVoucherUsable,
  isVoucherUsed
} from '@core/entities/voucher'
import {
  unusedVoucher,
  usedVoucher,
  voucherWithoutExpirationDate
} from '@utils/testData/vouchers'

describe('Voucher', () => {
  describe('Usage', () => {
    it('should be used when it has a usage date', () => {
      expect(isVoucherUsed(usedVoucher)).toBe(true)
    })

    it('should not be used when it has no usage date', () => {
      expect(isVoucherUsed(unusedVoucher)).toBe(false)
    })
  })

  describe('Expiration', () => {
    it('should never expire when it has no expiration date', () => {
      expect(
        isVoucherExpired(voucherWithoutExpirationDate, Number.MAX_SAFE_INTEGER)
      ).toBe(false)
    })

    it('should be expired after its expiration date', () => {
      expect(
        isVoucherExpired(unusedVoucher, unusedVoucher.expirationDate! + 1)
      ).toBe(true)
    })

    it('should not be expired before its expiration date', () => {
      expect(
        isVoucherExpired(unusedVoucher, unusedVoucher.expirationDate! - 1)
      ).toBe(false)
    })
  })

  describe('Usability', () => {
    it('should be usable when it is neither used nor expired', () => {
      expect(
        isVoucherUsable(unusedVoucher, unusedVoucher.expirationDate! - 1)
      ).toBe(true)
    })

    it('should not be usable when it is already used', () => {
      expect(isVoucherUsable(usedVoucher, usedVoucher.usedAt!)).toBe(false)
    })
  })
})

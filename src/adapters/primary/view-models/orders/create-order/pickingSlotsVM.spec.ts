import {
  availablePickingHours,
  combinePickingDateAndHour,
  PICKING_HOURS
} from './pickingSlotsVM'

describe('Picking slots VM', () => {
  const timestampOf = (isoDate: string) => new Date(isoDate).getTime()

  describe('The picking day is a future day', () => {
    it('should offer every pharmacy hour', () => {
      expect(
        availablePickingHours(
          timestampOf('2026-07-10T00:00:00'),
          timestampOf('2026-07-09T15:00:00')
        )
      ).toStrictEqual(PICKING_HOURS)
    })
  })

  describe('The picking day is today', () => {
    it('should only offer hours at least three hours away', () => {
      expect(
        availablePickingHours(
          timestampOf('2026-07-09T00:00:00'),
          timestampOf('2026-07-09T15:00:00')
        )
      ).toStrictEqual(['18:00', '18:30', '19:00', '19:30'])
    })
    it('should offer the last hour when it is exactly three hours away', () => {
      expect(
        availablePickingHours(
          timestampOf('2026-07-09T00:00:00'),
          timestampOf('2026-07-09T16:30:00')
        )
      ).toStrictEqual(['19:30'])
    })
    it('should offer no hour when the last one is less than three hours away', () => {
      expect(
        availablePickingHours(
          timestampOf('2026-07-09T00:00:00'),
          timestampOf('2026-07-09T16:31:00')
        )
      ).toStrictEqual([])
    })
  })

  describe('Combining a picking day with an hour', () => {
    it('should build the timestamp of the picking slot', () => {
      expect(
        combinePickingDateAndHour(timestampOf('2026-07-09T00:00:00'), '9:30')
      ).toStrictEqual(timestampOf('2026-07-09T09:30:00'))
    })
  })
})

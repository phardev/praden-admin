import {
  formatFileSize,
  KILO,
  MEGA
} from '@adapters/primary/view-models/assistance/shared/fileSize'

describe('File size label', () => {
  it('should count bytes below one kilobyte', () => {
    const bytes = KILO - 1
    expect(formatFileSize(bytes)).toStrictEqual({
      key: 'assistance.size.bytes',
      params: { n: bytes }
    })
  })

  it('should count kilobytes below one megabyte', () => {
    const kilobytes = 142
    expect(formatFileSize(kilobytes * KILO)).toStrictEqual({
      key: 'assistance.size.kilo',
      params: { n: kilobytes }
    })
  })

  it('should count megabytes from one megabyte', () => {
    const megabytes = 3
    expect(formatFileSize(megabytes * MEGA)).toStrictEqual({
      key: 'assistance.size.mega',
      params: { n: megabytes }
    })
  })
})

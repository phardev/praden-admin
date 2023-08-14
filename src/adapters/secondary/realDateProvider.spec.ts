import { vi } from 'vitest'
import { RealDateProvider } from '@adapters/secondary/RealDateProvider'

describe('Real date provider', () => {
  it('should provide now date', () => {
    const dateProvider = new RealDateProvider()
    const now = 1675732421533
    givenNowIs(now)
    expect(dateProvider.now()).toBe(now)
  })
  it('should provide another now date', () => {
    const dateProvider = new RealDateProvider()
    const now = 1675432421533
    givenNowIs(now)
    expect(dateProvider.now()).toBe(now)
  })

  const givenNowIs = (now: number) => {
    const dateNowStub = vi.fn(() => now)
    global.Date.now = dateNowStub
  }
})

import { RealDateProvider } from '@adapters/secondary/date-providers/RealDateProvider'

export const useDateProvider = () => {
  // const dateProvider = new FakeDateProvider()
  // dateProvider.feedWith(1690417000000)
  // return dateProvider
  return new RealDateProvider()
}

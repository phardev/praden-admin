import { RealDateProvider } from '@adapters/secondary/date-providers/RealDateProvider'

export const useDateProvider = () => {
  return new RealDateProvider()
}

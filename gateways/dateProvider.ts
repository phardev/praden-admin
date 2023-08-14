import { RealDateProvider } from '@adapters/secondary/RealDateProvider'

export const useDateProvider = () => {
  return new RealDateProvider()
}

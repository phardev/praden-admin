import { RealDateProvider } from '@adapters/secondary/realDateProvider'

export const useDateProvider = () => {
  return new RealDateProvider()
}

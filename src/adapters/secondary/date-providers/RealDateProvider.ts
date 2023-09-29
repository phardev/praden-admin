import { DateProvider } from '@core/gateways/dateProvider'

export class RealDateProvider implements DateProvider {
  now(): number {
    return Date.now()
  }
}

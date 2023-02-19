import { DateProvider } from '@core/gateways/dateProvider'

export class FakeDateProvider implements DateProvider {
  private date = 0

  now(): number {
    return this.date
  }

  feedWith(date: number) {
    this.date = date
  }
}

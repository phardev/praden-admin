import { ShowcaseKind, ShowcaseProduct } from '@core/entities/homepageShowcase'
import { HomepageShowcaseGateway } from '@core/gateways/homepageShowcaseGateway'

export class InMemoryHomepageShowcaseGateway
  implements HomepageShowcaseGateway
{
  private showcases = new Map<ShowcaseKind, Array<ShowcaseProduct>>()
  private error: Error | null = null

  get(kind: ShowcaseKind): Promise<Array<ShowcaseProduct>> {
    if (this.error) {
      return Promise.reject(this.error)
    }
    return Promise.resolve(
      JSON.parse(JSON.stringify(this.showcases.get(kind) ?? []))
    )
  }

  update(kind: ShowcaseKind, products: Array<ShowcaseProduct>): Promise<void> {
    if (this.error) {
      return Promise.reject(this.error)
    }
    this.showcases.set(kind, JSON.parse(JSON.stringify(products)))
    return Promise.resolve()
  }

  feedWith(kind: ShowcaseKind, ...products: Array<ShowcaseProduct>) {
    this.showcases.set(kind, JSON.parse(JSON.stringify(products)))
    this.error = null
  }

  feedWithError(error: Error) {
    this.error = error
  }
}

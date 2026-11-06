import { ShowcaseKind, ShowcaseProduct } from '@core/entities/homepageShowcase'

export interface HomepageShowcaseGateway {
  get(kind: ShowcaseKind): Promise<Array<ShowcaseProduct>>
  update(kind: ShowcaseKind, products: Array<ShowcaseProduct>): Promise<void>
}

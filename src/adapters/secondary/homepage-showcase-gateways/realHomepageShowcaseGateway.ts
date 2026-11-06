import { axiosWithBearer } from '@adapters/primary/nuxt/utils/axios'
import { RealGateway } from '@adapters/secondary/order-gateways/RealOrderGateway'
import { ShowcaseKind, ShowcaseProduct } from '@core/entities/homepageShowcase'
import { HomepageShowcaseGateway } from '@core/gateways/homepageShowcaseGateway'

export class RealHomepageShowcaseGateway
  extends RealGateway
  implements HomepageShowcaseGateway
{
  constructor(url: string) {
    super(url)
  }

  async get(kind: ShowcaseKind): Promise<Array<ShowcaseProduct>> {
    const res = await axiosWithBearer.get(`${this.baseUrl}/${kind}`)
    const items = res.data.items || []
    return items.map((item: any) => ({
      uuid: item.productUuid,
      name: item.name,
      miniature: item.miniature,
      priceWithoutTax: item.priceWithoutTax,
      percentTaxRate: item.percentTaxRate,
      promotions: item.promotions || []
    }))
  }

  async update(
    kind: ShowcaseKind,
    products: Array<ShowcaseProduct>
  ): Promise<void> {
    await axiosWithBearer.post(`${this.baseUrl}/${kind}`, {
      productUuids: products.map((product) => product.uuid)
    })
  }
}

import { axiosWithBearer } from '@adapters/primary/nuxt/utils/axios'
import { RealGateway } from '@adapters/secondary/order-gateways/RealOrderGateway'
import { PharmacistSelection } from '@core/entities/pharmacistSelection'
import { PharmacistSelectionGateway } from '@core/gateways/pharmacistSelectionGateway'

export class RealPharmacistSelectionGateway
  extends RealGateway
  implements PharmacistSelectionGateway
{
  constructor(url: string) {
    super(url)
  }

  async get(): Promise<Array<PharmacistSelection>> {
    const res = await axiosWithBearer.get(
      `${this.baseUrl}/pharmacist-selection`
    )
    const items = res.data.items || []
    return items.map((item: any) => ({
      uuid: item.productUuid,
      name: item.name,
      miniature: item.miniature,
      priceWithoutTax: item.priceWithoutTax,
      percentTaxRate: item.percentTaxRate,
      price: item.price,
      availableStock: item.availableStock,
      weight: item.weight,
      laboratory: item.laboratory,
      isMedicine: item.isMedicine,
      flags: item.flags || {},
      promotions: item.promotions || [],
      order: item.order,
      ...(item.maxQuantityForOrder !== undefined && {
        maxQuantityForOrder: item.maxQuantityForOrder
      })
    }))
  }

  async update(selection: Array<PharmacistSelection>): Promise<void> {
    await axiosWithBearer.post(`${this.baseUrl}/pharmacist-selection`, {
      productUuids: selection.map((item) => item.uuid)
    })
  }
}

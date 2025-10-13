import { RealGateway } from '@adapters/secondary/order-gateways/RealOrderGateway'
import { PharmacistSelectionGateway } from '@core/gateways/pharmacistSelectionGateway'
import { PharmacistSelection } from '@core/entities/pharmacistSelection'
import { UUID } from '@core/types/types'
import { axiosWithBearer } from '@adapters/primary/nuxt/utils/axios'

export class RealPharmacistSelectionGateway
  extends RealGateway
  implements PharmacistSelectionGateway
{
  constructor(url: string) {
    super(url)
  }

  async get(): Promise<PharmacistSelection> {
    const res = await axiosWithBearer.get(`${this.baseUrl}/products/selection`)
    return {
      productUuids: res.data.productUuids || []
    }
  }

  async update(productUuids: Array<UUID>): Promise<PharmacistSelection> {
    const res = await axiosWithBearer.put(
      `${this.baseUrl}/products/selection`,
      {
        productUuids
      }
    )
    return {
      productUuids: res.data.productUuids || []
    }
  }
}

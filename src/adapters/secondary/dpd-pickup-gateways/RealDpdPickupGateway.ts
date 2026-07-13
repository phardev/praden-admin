import { axiosWithBearer } from '@adapters/primary/nuxt/utils/axios'
import { RealGateway } from '@adapters/secondary/order-gateways/RealOrderGateway'
import { RelayPoint, RelayPointSearchParams } from '@core/entities/relayPoint'
import { DpdPickupGateway } from '@core/gateways/dpdPickupGateway'

export class RealDpdPickupGateway
  extends RealGateway
  implements DpdPickupGateway
{
  constructor(url: string) {
    super(url)
  }

  async search(params: RelayPointSearchParams): Promise<Array<RelayPoint>> {
    const res = await axiosWithBearer.post(
      `${this.baseUrl}/dpd/pickup`,
      this.buildBody(params)
    )
    const pudoList = res.data?.data?.pudoList ?? res.data?.pudoList ?? []
    return pudoList.map(this.convertToRelayPoint)
  }

  private buildBody(params: RelayPointSearchParams): Record<string, string> {
    const body: Record<string, string> = {
      zipCode: params.zipCode,
      city: params.city
    }
    if (params.address) {
      body.address = params.address
    }
    if (params.weight !== undefined) {
      body.weight = String(params.weight)
    }
    return body
  }

  private convertToRelayPoint(pudo: any): RelayPoint {
    const point: RelayPoint = {
      id: pudo.PUDO_ID,
      name: pudo.NAME,
      address: `${pudo.STREETNUM ?? ''} ${pudo.ADDRESS1 ?? ''}`.trim(),
      zipCode: pudo.ZIPCODE,
      city: pudo.CITY
    }
    if (pudo.DISTANCE !== undefined && pudo.DISTANCE !== null) {
      point.distanceInMeters = Math.round(Number(pudo.DISTANCE))
    }
    return point
  }
}

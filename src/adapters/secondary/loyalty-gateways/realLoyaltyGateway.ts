import { axiosWithBearer } from '@adapters/primary/nuxt/utils/axios'
import { RealGateway } from '@adapters/secondary/order-gateways/RealOrderGateway'
import type {
  CustomerLoyalty,
  LoyaltyConfig,
  LoyaltyTransaction
} from '@core/entities/loyalty'
import type { LoyaltyGateway } from '@core/gateways/loyaltyGateway'

interface LoyaltyConfigResponse {
  item: {
    uuid?: string
    eurosPerPoint: number
    createdAt: number
    createdBy: string
    updatedAt: number
    updatedBy: string
  }
}

interface CustomerLoyaltyResponse {
  item: {
    balance: number
    totalEarned: number
    transactions: Array<{
      uuid: string
      orderUuid: string
      points: number
      earnedAt: number
      expiresAt: number
      isExpired: boolean
    }>
  }
}

export class RealLoyaltyGateway extends RealGateway implements LoyaltyGateway {
  constructor(url: string) {
    super(url)
  }

  async getConfig(): Promise<LoyaltyConfig> {
    const res = await axiosWithBearer.get<LoyaltyConfigResponse>(
      `${this.baseUrl}/loyalty/config`
    )
    return this.mapConfigToEntity(res.data.item)
  }

  async updateConfig(eurosPerPoint: number): Promise<LoyaltyConfig> {
    const res = await axiosWithBearer.post<LoyaltyConfigResponse>(
      `${this.baseUrl}/loyalty/config`,
      { eurosPerPoint }
    )
    return this.mapConfigToEntity(res.data.item)
  }

  async getCustomerLoyalty(customerUuid: string): Promise<CustomerLoyalty> {
    const res = await axiosWithBearer.get<CustomerLoyaltyResponse>(
      `${this.baseUrl}/customers/${customerUuid}/loyalty`
    )
    return this.mapCustomerLoyaltyToEntity(res.data.item)
  }

  private mapConfigToEntity(
    data: LoyaltyConfigResponse['item']
  ): LoyaltyConfig {
    return {
      eurosPerPoint: data.eurosPerPoint,
      createdAt: data.createdAt ? new Date(data.createdAt).toISOString() : '',
      updatedAt: data.updatedAt ? new Date(data.updatedAt).toISOString() : ''
    }
  }

  private mapCustomerLoyaltyToEntity(
    data: CustomerLoyaltyResponse['item']
  ): CustomerLoyalty {
    return {
      balance: data.balance,
      totalEarned: data.totalEarned,
      transactions: data.transactions.map(
        (t): LoyaltyTransaction => ({
          uuid: t.uuid,
          orderUuid: t.orderUuid,
          points: t.points,
          earnedAt: new Date(t.earnedAt).toISOString(),
          expiresAt: new Date(t.expiresAt).toISOString(),
          isExpired: t.isExpired
        })
      )
    }
  }
}

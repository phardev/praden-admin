import { RealGateway } from '@adapters/secondary/order-gateways/RealOrderGateway'
import { UserProfileGateway } from '@core/gateways/userProfileGateway'
import { UserProfile } from '@core/entities/userProfile'
import { axiosWithBearer } from '@adapters/primary/nuxt/utils/axios'

export class RealUserProfileGateway
  extends RealGateway
  implements UserProfileGateway
{
  constructor(baseUrl: string) {
    super(baseUrl)
  }

  async getCurrentUserProfile(): Promise<UserProfile> {
    const res = await axiosWithBearer.get(`${this.baseUrl}/profile`)
    return res.data
  }
}

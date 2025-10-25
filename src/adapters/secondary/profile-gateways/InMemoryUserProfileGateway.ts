import { UserProfile } from '@core/entities/userProfile'
import { UserProfileGateway } from '@core/gateways/userProfileGateway'

export class InMemoryUserProfileGateway implements UserProfileGateway {
  private profiles: Array<UserProfile> = []

  async getCurrentUserProfile(): Promise<UserProfile> {
    return this.profiles[0]
  }

  feedWith(...profiles: Array<UserProfile>) {
    this.profiles = profiles
  }
}

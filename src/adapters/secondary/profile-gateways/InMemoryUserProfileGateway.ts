import { UserProfileGateway } from '@core/gateways/userProfileGateway'
import { UserProfile } from '@core/entities/userProfile'

export class InMemoryUserProfileGateway implements UserProfileGateway {
  private profiles: Array<UserProfile> = []

  async getCurrentUserProfile(): Promise<UserProfile> {
    return this.profiles[0]
  }

  feedWith(...profiles: Array<UserProfile>) {
    this.profiles = profiles
  }
}

import type { UserProfile } from '@core/entities/userProfile'

export interface UserProfileGateway {
  getCurrentUserProfile(): Promise<UserProfile>
}

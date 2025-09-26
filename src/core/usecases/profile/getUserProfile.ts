import type { UserProfileGateway } from '@core/gateways/userProfileGateway'
import { useUserProfileStore } from '@store/userProfileStore'

export const getUserProfile = async (
  userProfileGateway: UserProfileGateway
): Promise<void> => {
  const userProfileStore = useUserProfileStore()

  userProfileStore.setLoading(true)

  try {
    const profile = await userProfileGateway.getCurrentUserProfile()
    userProfileStore.setCurrent(profile)
  } catch (error) {
    userProfileStore.setError(
      error instanceof Error ? error.message : 'Failed to load profile'
    )
    throw error
  } finally {
    userProfileStore.setLoading(false)
  }
}

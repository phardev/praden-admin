import { InMemoryUserProfileGateway } from '@adapters/secondary/profile-gateways/InMemoryUserProfileGateway'
import type { UserProfile } from '@core/entities/userProfile'
import { getUserProfile } from '@core/usecases/profile/getUserProfile'
import { useUserProfileStore } from '@store/userProfileStore'
import { createPinia, setActivePinia } from 'pinia'

describe('Get user profile', () => {
  let userProfileStore: any
  let userProfileGateway: InMemoryUserProfileGateway

  beforeEach(() => {
    setActivePinia(createPinia())
    userProfileStore = useUserProfileStore()
    userProfileGateway = new InMemoryUserProfileGateway()
  })

  it('should load user profile into store', async () => {
    const mockProfile: UserProfile = {
      uuid: 'user-123',
      email: 'admin@phardev.fr',
      role: {
        uuid: 'admin',
        name: 'Admin',
        permissions: [
          { resource: 'dashboard' },
          { resource: 'newsletter' },
          { resource: 'administration' }
        ],
        order: 1
      }
    }

    givenUserProfile(mockProfile)
    await whenGetUserProfile()
    expectUserProfileInStore(mockProfile)
  })

  describe('Loading', () => {
    beforeEach(() => {
      givenUserProfile({
        uuid: 'user-456',
        email: 'user@phardev.fr',
        role: {
          uuid: 'user',
          name: 'User',
          permissions: [{ resource: 'dashboard' }],
          order: 2
        }
      })
    })

    it('should be aware during loading', async () => {
      const unsubscribe = userProfileStore.$subscribe(
        (mutation: any, state: any) => {
          expect(state.isLoading).toBe(true)
          unsubscribe()
        }
      )
      await whenGetUserProfile()
    })

    it('should be aware that loading is over', async () => {
      await whenGetUserProfile()
      expect(userProfileStore.isLoading).toBe(false)
    })
  })

  const givenUserProfile = (profile: UserProfile) => {
    userProfileGateway.feedWith(profile)
  }

  const whenGetUserProfile = async () => {
    await getUserProfile(userProfileGateway)
  }

  const expectUserProfileInStore = (expectedProfile: UserProfile) => {
    expect(userProfileStore.current).toStrictEqual(expectedProfile)
  }
})

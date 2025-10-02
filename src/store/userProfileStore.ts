import { defineStore } from 'pinia'
import type { UserProfile } from '@core/entities/userProfile'

export const useUserProfileStore = defineStore('UserProfileStore', {
  state: () => {
    return {
      current: null as UserProfile | null,
      isLoading: false,
      error: null as string | null
    }
  },
  getters: {
    hasPermission: (state) => {
      return (resource: string): boolean => {
        if (!state.current?.role?.permissions) return false
        return state.current.role.permissions.some(
          (permission) => permission.resource === resource
        )
      }
    },
    permissions: (state) => {
      return state.current?.role?.permissions || []
    },
    isAuthenticated: (state) => {
      return state.current !== null
    }
  },
  actions: {
    setCurrent(profile: UserProfile) {
      this.current = profile
      this.error = null
    },
    setLoading(isLoading: boolean) {
      this.isLoading = isLoading
    },
    setError(error: string) {
      this.error = error
      this.isLoading = false
    },
    clear() {
      this.current = null
      this.error = null
      this.isLoading = false
    }
  }
})

import { defineStore } from 'pinia'
import { Role } from '@core/entities/role'
import { UUID } from '@core/types/types'

export const useRoleStore = defineStore('RoleStore', {
  state: () => {
    return {
      items: [] as Array<Role>,
      isLoading: false
    }
  },
  getters: {
    getByUuid: (state) => {
      return (uuid: UUID): Role => {
        const role = state.items.find((r) => r.uuid === uuid)
        return role!
      }
    }
  },
  actions: {
    list(roles: Array<Role>) {
      this.items = roles
    },
    edit(role: Role) {
      this.items = this.items.map((r) => {
        return r.uuid === role.uuid ? role : r
      })
    },
    startLoading() {
      this.isLoading = true
    },
    stopLoading() {
      this.isLoading = false
    }
  }
})

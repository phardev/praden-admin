import { Staff } from '@core/entities/staff'
import { UUID } from '@core/types/types'
import { defineStore } from 'pinia'

export const useStaffStore = defineStore('StaffStore', {
  state: () => {
    return {
      items: [] as Array<Staff>,
      current: undefined as Staff | undefined,
      isLoading: false
    }
  },
  getters: {
    getByUuid: (state) => {
      return (uuid: UUID): Staff | undefined => {
        return state.items.find((s) => s.uuid === uuid)
      }
    }
  },
  actions: {
    list(staff: Array<Staff>) {
      this.items = staff
    },
    add(staff: Staff) {
      this.items.push(staff)
    },
    setCurrent(staff: Staff) {
      this.current = staff
    },
    update(staff: Staff) {
      this.items = this.items.map((s) => {
        return s.uuid === staff.uuid ? staff : s
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

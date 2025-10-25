import { getRolesVM } from '@adapters/primary/view-models/roles/get-roles/getRolesVM'
import { useRoleStore } from '@store/roleStore'
import { adminRole, assistantRole, pharmacistRole } from '@utils/testData/roles'
import { createPinia, setActivePinia } from 'pinia'

describe('Get roles VM', () => {
  let roleStore: any

  beforeEach(() => {
    setActivePinia(createPinia())
    roleStore = useRoleStore()
  })

  describe('There are no roles', () => {
    it('should list nothing', () => {
      const vm = getRolesVM()
      const expectedVM = {
        items: [],
        isLoading: false
      }
      expect(vm).toStrictEqual(expectedVM)
    })
  })

  describe('There are some roles', () => {
    beforeEach(() => {
      roleStore.items = [adminRole, pharmacistRole, assistantRole]
    })
    it('should list all of them as options', () => {
      const vm = getRolesVM()
      const expectedVM = {
        items: [
          {
            uuid: adminRole.uuid,
            name: adminRole.name
          },
          {
            uuid: pharmacistRole.uuid,
            name: pharmacistRole.name
          },
          {
            uuid: assistantRole.uuid,
            name: assistantRole.name
          }
        ],
        isLoading: false
      }
      expect(vm).toStrictEqual(expectedVM)
    })
  })
})

import { createPinia, setActivePinia } from 'pinia'
import { useStaffStore } from '@store/staffStore'
import { getStaffVM } from '@adapters/primary/view-models/staff/get-staff/getStaffVM'
import { johnDoe, janeDupont, marcMartin } from '@utils/testData/staff'

describe('Get staff VM', () => {
  let staffStore: any

  beforeEach(() => {
    setActivePinia(createPinia())
    staffStore = useStaffStore()
  })

  describe('There is no staff', () => {
    it('should list nothing', () => {
      const vm = getStaffVM()
      const expectedVM = {
        items: [],
        isLoading: false
      }
      expect(vm).toStrictEqual(expectedVM)
    })
  })

  describe('There is some staff', () => {
    beforeEach(() => {
      staffStore.items = [johnDoe, janeDupont, marcMartin]
    })
    it('should list all of them', () => {
      const vm = getStaffVM()
      const expectedVM = {
        items: [
          {
            uuid: johnDoe.uuid,
            firstname: johnDoe.firstname,
            lastname: johnDoe.lastname,
            email: johnDoe.email,
            roleUuid: johnDoe.role.uuid,
            roleName: johnDoe.role.name
          },
          {
            uuid: janeDupont.uuid,
            firstname: janeDupont.firstname,
            lastname: janeDupont.lastname,
            email: janeDupont.email,
            roleUuid: janeDupont.role.uuid,
            roleName: janeDupont.role.name
          },
          {
            uuid: marcMartin.uuid,
            firstname: marcMartin.firstname,
            lastname: marcMartin.lastname,
            email: marcMartin.email,
            roleUuid: marcMartin.role.uuid,
            roleName: marcMartin.role.name
          }
        ],
        isLoading: false
      }
      expect(vm).toStrictEqual(expectedVM)
    })
  })
})

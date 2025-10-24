import { getStaffVM } from '@adapters/primary/view-models/staff/get-staff/getStaffVM'
import { useStaffStore } from '@store/staffStore'
import {
  emailOnlyStaff,
  firstnameOnlyStaff,
  janeDupont,
  johnDoe,
  marcMartin
} from '@utils/testData/staff'
import { createPinia, setActivePinia } from 'pinia'

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
            displayName: 'John Doe',
            roleUuid: johnDoe.role.uuid,
            roleName: johnDoe.role.name
          },
          {
            uuid: janeDupont.uuid,
            firstname: janeDupont.firstname,
            lastname: janeDupont.lastname,
            email: janeDupont.email,
            displayName: 'Jane Dupont',
            roleUuid: janeDupont.role.uuid,
            roleName: janeDupont.role.name
          },
          {
            uuid: marcMartin.uuid,
            firstname: marcMartin.firstname,
            lastname: marcMartin.lastname,
            email: marcMartin.email,
            displayName: 'Marc Martin',
            roleUuid: marcMartin.role.uuid,
            roleName: marcMartin.role.name
          }
        ],
        isLoading: false
      }
      expect(vm).toStrictEqual(expectedVM)
    })
  })

  describe('Staff with optional firstname/lastname', () => {
    it('should handle staff with email only', () => {
      staffStore.items = [emailOnlyStaff]
      const vm = getStaffVM()

      expect(vm.items[0]).toStrictEqual({
        uuid: emailOnlyStaff.uuid,
        firstname: undefined,
        lastname: undefined,
        email: emailOnlyStaff.email,
        displayName: 'support@praden.com',
        roleUuid: emailOnlyStaff.role.uuid,
        roleName: emailOnlyStaff.role.name
      })
    })

    it('should handle staff with firstname only', () => {
      staffStore.items = [firstnameOnlyStaff]
      const vm = getStaffVM()

      expect(vm.items[0]).toStrictEqual({
        uuid: firstnameOnlyStaff.uuid,
        firstname: firstnameOnlyStaff.firstname,
        lastname: undefined,
        email: firstnameOnlyStaff.email,
        displayName: 'Alex',
        roleUuid: firstnameOnlyStaff.role.uuid,
        roleName: firstnameOnlyStaff.role.name
      })
    })
  })
})

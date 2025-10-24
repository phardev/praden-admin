import { InMemoryStaffGateway } from '@adapters/secondary/staff-gateways/InMemoryStaffGateway'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import { Staff } from '@core/entities/staff'
import { useStaffStore } from '@store/staffStore'
import { janeDupont, johnDoe, marcMartin } from '@utils/testData/staff'
import { createPinia, setActivePinia } from 'pinia'
import { listStaff } from './listStaff'

describe('List staff', () => {
  let staffStore: any
  let staffGateway: InMemoryStaffGateway

  beforeEach(() => {
    setActivePinia(createPinia())
    staffStore = useStaffStore()
    staffGateway = new InMemoryStaffGateway(new FakeUuidGenerator())
  })

  describe('There is no staff', () => {
    it('should list nothing', async () => {
      await whenListStaff()
      expectStaffStoreToContains()
    })
  })

  describe('There is some staff', () => {
    it('should list all of them', async () => {
      givenExistingStaff(johnDoe, janeDupont, marcMartin)
      await whenListStaff()
      expectStaffStoreToContains(johnDoe, janeDupont, marcMartin)
    })
  })

  describe('Loading', () => {
    it('should be aware during loading', async () => {
      const unsubscribe = staffStore.$subscribe((mutation: any, state: any) => {
        expect(state.isLoading).toBe(true)
        unsubscribe()
      })
      await whenListStaff()
    })
    it('should be aware when loading is done', async () => {
      await whenListStaff()
      expect(staffStore.isLoading).toBe(false)
    })
  })

  const givenExistingStaff = (...staff: Array<Staff>) => {
    staffGateway.feedWith(...staff)
  }

  const whenListStaff = async () => {
    await listStaff(staffGateway)
  }

  const expectStaffStoreToContains = (...staff: Array<Staff>) => {
    expect(staffStore.items).toStrictEqual(staff)
  }
})

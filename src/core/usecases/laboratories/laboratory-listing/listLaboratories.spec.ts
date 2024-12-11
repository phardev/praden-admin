import { createPinia, setActivePinia } from 'pinia'
import { InMemoryLaboratoryGateway } from '@adapters/secondary/laboratory-gateways/inMemoryLaboratoryGateway'
import { useLaboratoryStore } from '@store/laboratoryStore'
import { listLaboratories } from './listLaboratories'
import { Laboratory } from '@core/entities/laboratory'
import { avene, gilbert, sanofiAventis } from '@utils/testData/laboratories'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'

describe('Laboratory listing', () => {
  let laboratoryStore: any
  let laboratoryGateway: InMemoryLaboratoryGateway

  beforeEach(() => {
    setActivePinia(createPinia())
    laboratoryStore = useLaboratoryStore()
    laboratoryGateway = new InMemoryLaboratoryGateway(new FakeUuidGenerator())
  })

  describe('There is no laboratory', () => {
    it('should list nothing', async () => {
      await whenListLaboratories()
      expectStoreToEqual()
    })
  })

  describe('There is some laboratories', () => {
    it('should list all of them', async () => {
      givenExistingLaboratories(avene, gilbert)
      await whenListLaboratories()
      expectStoreToEqual(avene, gilbert)
    })
  })
  describe('Loading', () => {
    beforeEach(() => {
      laboratoryGateway.feedWith(sanofiAventis)
    })
    it('should be aware during loading', async () => {
      const unsubscribe = laboratoryStore.$subscribe(
        (mutation: any, state: any) => {
          expect(state.isLoading).toBe(true)
          unsubscribe()
        }
      )
      await whenListLaboratories()
    })
    it('should be aware that loading is over', async () => {
      await whenListLaboratories()
      expect(laboratoryStore.isLoading).toBe(false)
    })
  })

  const givenExistingLaboratories = (...laboratories: Array<Laboratory>) => {
    laboratoryGateway.feedWith(...laboratories)
  }

  const whenListLaboratories = async () => {
    await listLaboratories(laboratoryGateway)
  }

  const expectStoreToEqual = (...laboratories: Array<Laboratory>) => {
    expect(laboratoryStore.items).toStrictEqual(laboratories)
  }
})

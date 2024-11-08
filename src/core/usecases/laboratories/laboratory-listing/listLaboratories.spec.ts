import { createPinia, setActivePinia } from 'pinia'
import { InMemoryLaboratoryGateway } from '@core/usecases/laboratories/laboratory-listing/inMemoryLaboratoryGateway'
import { useLaboratoryStore } from '@store/laboratoryStore'
import { listLaboratories } from './listLaboratories'
import { Laboratory } from '@core/usecases/laboratories/laboratory-listing/laboratory'
import { avene, gilbert } from '@utils/testData/laboratories'

describe('Laboratory listing', () => {
  let laboratoryStore: any
  let laboratoryGateway: InMemoryLaboratoryGateway

  beforeEach(() => {
    setActivePinia(createPinia())
    laboratoryStore = useLaboratoryStore()
    laboratoryGateway = new InMemoryLaboratoryGateway()
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

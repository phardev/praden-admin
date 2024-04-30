import { PickingSortType } from '@adapters/primary/view-models/preparations/start-preparations/startPreparationsVM'
import { createPinia, setActivePinia } from 'pinia'
import { useSettingStore } from '@store/settingStore'
import { getSettings } from '@core/usecases/settings/get-settings/getSettings'
import { InMemorySettingGateway } from '@core/usecases/settings/get-settings/InMemorySettingGateway'

describe('Get settings', () => {
  let settingStore: any
  let settingGateway: InMemorySettingGateway

  beforeEach(() => {
    setActivePinia(createPinia())
    settingStore = useSettingStore()
    settingGateway = new InMemorySettingGateway()
  })

  describe('Picking sort type', () => {
    it('should return sort by location if not defined', async () => {
      await whenGetSettings()
      expectPickingSortToEqual(PickingSortType.Location)
    })
    it('should return sort by location if defined', async () => {
      givenPickingSortType(PickingSortType.Location)
      await whenGetSettings()
      expectPickingSortToEqual(PickingSortType.Location)
    })
    it('should return sort by product name if defined', async () => {
      givenPickingSortType(PickingSortType.Name)
      await whenGetSettings()
      expectPickingSortToEqual(PickingSortType.Name)
    })
  })

  const givenPickingSortType = (pickingSortType: PickingSortType) => {
    settingGateway.feedWith({ pickingSortType })
  }
  const whenGetSettings = async () => {
    await getSettings(settingGateway)
  }
  const expectPickingSortToEqual = (pickingSort: PickingSortType) => {
    expect(settingStore.get('picking-sort')).toStrictEqual(pickingSort)
  }
})

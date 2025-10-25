import { SettingGateway } from '@core/usecases/settings/get-settings/settingGateway'
import { useSettingStore } from '@store/settingStore'

export const getSettings = async (settingGateway: SettingGateway) => {
  const pickingSort = await settingGateway.getPickingSortType()
  const settingStore = useSettingStore()
  settingStore.set('picking-sort', pickingSort)
}

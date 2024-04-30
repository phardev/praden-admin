import { useSettingStore } from '@store/settingStore'
import { SettingGateway } from '@core/usecases/settings/get-settings/settingGateway'

export const getSettings = async (settingGateway: SettingGateway) => {
  const pickingSort = await settingGateway.getPickingSortType()
  const settingStore = useSettingStore()
  settingStore.set('picking-sort', pickingSort)
}

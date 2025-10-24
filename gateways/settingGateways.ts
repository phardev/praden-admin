import { PickingSortType } from '@adapters/primary/view-models/preparations/start-preparations/startPreparationsVM'
import { InMemorySettingGateway } from '@core/usecases/settings/get-settings/InMemorySettingGateway'
import { SettingGateway } from '@core/usecases/settings/get-settings/settingGateway'

export const useSettingsGateway = (): SettingGateway => {
  const gateway = new InMemorySettingGateway()
  gateway.feedWith({ pickingSortType: PickingSortType.Name })
  return gateway
}

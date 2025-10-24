import { PickingSortType } from '@adapters/primary/view-models/preparations/start-preparations/startPreparationsVM'
import { SettingGateway } from '@core/usecases/settings/get-settings/settingGateway'
import { Settings } from '@core/usecases/settings/get-settings/settings'

export class InMemorySettingGateway implements SettingGateway {
  private settings: Partial<Settings> = {}

  getPickingSortType(): Promise<PickingSortType> {
    return Promise.resolve(
      this.settings.pickingSortType || PickingSortType.Location
    )
  }

  feedWith(settings: Partial<Settings>) {
    this.settings = settings
  }
}

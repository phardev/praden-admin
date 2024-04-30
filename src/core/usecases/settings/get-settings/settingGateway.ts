import { PickingSortType } from '@adapters/primary/view-models/preparations/start-preparations/startPreparationsVM'

export interface SettingGateway {
  getPickingSortType(): Promise<PickingSortType>
}

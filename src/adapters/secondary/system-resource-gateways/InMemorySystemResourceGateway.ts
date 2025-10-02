import { SystemResourceGateway } from '@core/gateways/systemResourceGateway'

export class InMemorySystemResourceGateway implements SystemResourceGateway {
  private systemResources: Array<string> = []

  async list(): Promise<Array<string>> {
    return this.systemResources
  }

  feedWith(...systemResources: Array<string>) {
    this.systemResources = systemResources
  }
}

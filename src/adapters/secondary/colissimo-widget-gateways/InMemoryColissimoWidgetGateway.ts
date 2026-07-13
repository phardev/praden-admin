import { ColissimoWidgetGateway } from '@core/gateways/colissimoWidgetGateway'

export class InMemoryColissimoWidgetGateway implements ColissimoWidgetGateway {
  private token = 'in-memory-colissimo-token'

  getToken(): Promise<string> {
    return Promise.resolve(this.token)
  }

  feedWith(token: string) {
    this.token = token
  }
}

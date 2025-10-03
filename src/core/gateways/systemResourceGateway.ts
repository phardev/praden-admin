export interface SystemResourceGateway {
  list(): Promise<Array<string>>
}

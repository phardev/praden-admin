export interface ProductGateway {
  list(): Promise<Array<any>>
}

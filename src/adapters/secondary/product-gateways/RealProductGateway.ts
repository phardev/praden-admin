import { RealGateway } from '@adapters/secondary/order-gateways/RealOrderGateway'
import { ProductGateway } from '@core/gateways/productGateway'
import { Product } from '@core/entities/product'
import axios from 'axios'
import { CreateProductDTO } from '@core/usecases/product/product-creation/createProduct'

export class RealProductGateway extends RealGateway implements ProductGateway {
  constructor(url: string) {
    super(url)
  }

  async batch(cip13s: Array<string>): Promise<Array<Product>> {
    const productRes = await fetch(`${this.baseUrl}/products/batch/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ cip13s })
    })
    const jsonRes = await productRes.json()
    return jsonRes.items as Array<Product>
  }

  async list(): Promise<Array<Product>> {
    const res = await axios.get(`${this.baseUrl}/products/`)
    return Promise.resolve(res.data.items)
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  create(dto: CreateProductDTO): Promise<Product> {
    throw Error('Method not implemented')
  }
}

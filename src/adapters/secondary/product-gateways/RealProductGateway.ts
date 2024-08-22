import { RealGateway } from '@adapters/secondary/order-gateways/RealOrderGateway'
import { ProductGateway } from '@core/gateways/productGateway'
import { Product } from '@core/entities/product'
import axios from 'axios'
import { CreateProductDTO } from '@core/usecases/product/product-creation/createProduct'
import { UUID } from '@core/types/types'
import { EditProductDTO } from '@core/usecases/product/product-edition/editProduct'

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
    const res = await axios.get(`${this.baseUrl}/products`)
    return Promise.resolve(res.data.items)
  }

  async getByUuid(uuid: UUID): Promise<Product> {
    const res = await axios.get(`${this.baseUrl}/products/get/${uuid}`)
    return Promise.resolve(res.data.item)
  }

  async edit(uuid: UUID, dto: EditProductDTO): Promise<Product> {
    const formData = this.createFormData(dto)
    formData.append('uuid', uuid)
    const res = await axios.patch(`${this.baseUrl}/products/edit`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return Promise.resolve(res.data.item)
  }

  async create(dto: CreateProductDTO): Promise<Product> {
    console.log('dto: ', dto)
    const formData = this.createFormData(dto)
    const res = await axios.post(`${this.baseUrl}/products`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return Promise.resolve(res.data.item)
  }
}

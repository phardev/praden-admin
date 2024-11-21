import { RealGateway } from '@adapters/secondary/order-gateways/RealOrderGateway'
import { ProductGateway } from '@core/gateways/productGateway'
import { Product } from '@core/entities/product'
import axios from 'axios'
import { CreateProductDTO } from '@core/usecases/product/product-creation/createProduct'
import { UUID } from '@core/types/types'
import { EditProductDTO } from '@core/usecases/product/product-edition/editProduct'
import { Category } from '@core/entities/category'

export class RealProductGateway extends RealGateway implements ProductGateway {
  constructor(url: string) {
    super(url)
  }

  async bulkEdit(
    dto: EditProductDTO,
    uuids: Array<UUID>
  ): Promise<Array<Product>> {
    const data: any = {
      productUuids: uuids
    }
    if (dto.laboratory === null) {
      data.laboratoryUuid = null
    } else if (dto.laboratory) {
      data.laboratoryUuid = dto.laboratory.uuid
    }
    const res = await axios.patch(`${this.baseUrl}/products/bulk-edit`, data)
    return res.data.items
  }

  async addProductsToCategory(
    category: Category,
    productUuids: Array<UUID>
  ): Promise<Array<Product>> {
    const res = await axios.post(
      `${this.baseUrl}/products/add-category`,
      {
        categoryUuid: category.uuid,
        productUuids: productUuids
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
    return Promise.resolve(res.data.items)
  }

  async removeProductsFromCategory(
    category: Category,
    productUuids: Array<UUID>
  ): Promise<Array<Product>> {
    const res = await axios.post(
      `${this.baseUrl}/products/remove-category`,
      {
        categoryUuid: category.uuid,
        productUuids: productUuids
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
    return Promise.resolve(res.data.items)
  }

  async getByCategoryUuid(uuid: UUID): Promise<Array<Product>> {
    const res = await axios.get(`${this.baseUrl}/categories/${uuid}/products`)
    return Promise.resolve(res.data.items)
  }

  async getByLaboratoryUuid(uuid: UUID): Promise<Array<Product>> {
    const res = await axios.get(`${this.baseUrl}/laboratories/${uuid}/products`)
    return Promise.resolve(res.data.items)
  }

  async batch(ean13s: Array<string>): Promise<Array<Product>> {
    const res = await axios.post(`${this.baseUrl}/products/batch`, {
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ean13s })
    })
    return Promise.resolve(res.data.items)
  }

  async list(limit: number, offset: number): Promise<Array<Product>> {
    const res = await axios.get(`${this.baseUrl}/products`, {
      params: {
        limit,
        offset
      }
    })
    return Promise.resolve(res.data.items)
  }

  async count(): Promise<number> {
    const res = await axios.get(`${this.baseUrl}/count/products`)
    return res.data
  }

  async getByUuid(uuid: UUID): Promise<Product> {
    const res = await axios.get(`${this.baseUrl}/products/${uuid}`)
    return Promise.resolve(res.data.item)
  }

  async edit(uuid: UUID, dto: EditProductDTO): Promise<Product> {
    const { laboratory, ...productDto } = dto
    const formData = this.createFormData(productDto)
    if (laboratory) {
      formData.append('laboratoryUuid', laboratory.uuid)
    }
    const res = await axios.patch(
      `${this.baseUrl}/products/edit/${uuid}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    )
    return Promise.resolve(res.data.item)
  }

  async create(dto: CreateProductDTO): Promise<Product> {
    const { laboratory, ...productDto } = dto
    const formData = this.createFormData(productDto)
    if (laboratory) {
      formData.append('laboratoryUuid', laboratory.uuid)
    }
    const res = await axios.post(`${this.baseUrl}/products`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return Promise.resolve(res.data.item)
  }
}

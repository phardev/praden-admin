import { RealGateway } from '@adapters/secondary/order-gateways/RealOrderGateway'
import { ProductGateway } from '@core/gateways/productGateway'
import { Product } from '@core/entities/product'
import { CreateProductDTO } from '@core/usecases/product/product-creation/createProduct'
import { UUID } from '@core/types/types'
import { EditProductDTO } from '@core/usecases/product/product-edition/editProduct'
import { Category } from '@core/entities/category'
import { axiosWithBearer } from '@adapters/primary/nuxt/utils/axios'

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
    if (dto.flags) {
      data.flags = dto.flags
    }
    const res = await axiosWithBearer.patch(
      `${this.baseUrl}/products/bulk-edit`,
      data
    )
    return res.data.items
  }

  async addProductsToCategory(
    category: Category,
    productUuids: Array<UUID>
  ): Promise<Array<Product>> {
    const res = await axiosWithBearer.post(
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
    return Promise.resolve(
      res.data.items.sort(
        (a: any, b: any) => b.availableStock - a.availableStock
      )
    )
  }

  async removeProductsFromCategory(
    category: Category,
    productUuids: Array<UUID>
  ): Promise<Array<Product>> {
    const res = await axiosWithBearer.post(
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
    return Promise.resolve(
      res.data.items.sort(
        (a: Product, b: Product) => b.availableStock - a.availableStock
      )
    )
  }

  async getByCategoryUuid(
    limit: number,
    offset: number,
    uuid: UUID
  ): Promise<Array<Product>> {
    const res = await axiosWithBearer.get(
      `${this.baseUrl}/categories/${uuid}/products`,
      {
        params: {
          limit,
          offset
        }
      }
    )
    return Promise.resolve(
      res.data.items.sort(
        (a: Product, b: Product) => b.availableStock - a.availableStock
      )
    )
  }

  async getByLaboratoryUuid(uuid: UUID): Promise<Array<Product>> {
    const res = await axiosWithBearer.get(
      `${this.baseUrl}/laboratories/${uuid}/products`
    )
    return Promise.resolve(
      res.data.items.sort(
        (a: Product, b: Product) => b.availableStock - a.availableStock
      )
    )
  }

  async batch(uuids: Array<string>): Promise<Array<Product>> {
    const res = await axiosWithBearer.post(
      `${this.baseUrl}/products/batch`,
      { uuids },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
    return Promise.resolve(
      res.data.items.sort(
        (a: Product, b: Product) => b.availableStock - a.availableStock
      )
    )
  }

  async list(limit: number, offset: number): Promise<Array<Product>> {
    const res = await axiosWithBearer.get(`${this.baseUrl}/products`, {
      params: {
        limit,
        offset
      }
    })
    return Promise.resolve(
      res.data.items.sort(
        (a: Product, b: Product) => b.availableStock - a.availableStock
      )
    )
  }

  async count(): Promise<number> {
    const res = await axiosWithBearer.get(`${this.baseUrl}/count/products`)
    return res.data
  }

  async getByUuid(uuid: UUID): Promise<Product> {
    const res = await axiosWithBearer.get(`${this.baseUrl}/products/${uuid}`)
    return Promise.resolve(res.data.item)
  }

  async edit(uuid: UUID, dto: EditProductDTO): Promise<Product> {
    const { laboratory, flags, ...productDto } = dto
    const formData = this.createFormData(productDto)
    if (laboratory) {
      formData.append('laboratoryUuid', laboratory.uuid)
    }
    if (flags?.arePromotionsAllowed) {
      formData.append('arePromotionsAllowed', 'on')
    }
    const res = await axiosWithBearer.patch(
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
    const { laboratory, flags, ...productDto } = dto
    const formData = this.createFormData(productDto)
    if (flags.arePromotionsAllowed) {
      formData.append('arePromotionsAllowed', 'on')
    }
    if (laboratory) {
      formData.append('laboratoryUuid', laboratory.uuid)
    }
    const res = await axiosWithBearer.post(
      `${this.baseUrl}/products`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    )
    return Promise.resolve(res.data.item)
  }
}

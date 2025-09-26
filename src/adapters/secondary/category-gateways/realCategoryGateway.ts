import { RealGateway } from '@adapters/secondary/order-gateways/RealOrderGateway'
import { CategoryGateway } from '@core/gateways/categoryGateway'
import { Category } from '@core/entities/category'
import { CreateCategoryDTO } from '@core/usecases/categories/category-creation/createCategory'
import { UUID } from '@core/types/types'
import { EditCategoryDTO } from '@core/usecases/categories/category-edition/editCategory'
import { axiosWithBearer } from '@adapters/primary/nuxt/utils/axios'

export class RealCategoryGateway
  extends RealGateway
  implements CategoryGateway
{
  constructor(url: string) {
    super(url)
  }

  async list(): Promise<Array<Category>> {
    const res = await axiosWithBearer.get(`${this.baseUrl}/categories/`)
    return res.data.items
  }

  async create(dto: CreateCategoryDTO): Promise<Category> {
    const formData = this.createFormData(dto)
    const res = await axiosWithBearer.post(
      `${this.baseUrl}/categories`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    )
    return res.data.item
  }

  async edit(uuid: UUID, dto: EditCategoryDTO): Promise<Category> {
    delete dto.image
    delete dto.miniature
    const formData = this.createFormData(dto)
    formData.append('uuid', uuid)
    if (dto.newImage) {
      formData.append('image', dto.newImage)
    }
    if (dto.newMiniature) {
      formData.append('miniature', dto.newMiniature)
    }
    const res = await axiosWithBearer.patch(
      `${this.baseUrl}/categories/edit`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    )
    return res.data.item
  }

  async getByUuid(uuid: UUID): Promise<Category> {
    const res = await axiosWithBearer.get(`${this.baseUrl}/categories/${uuid}`)
    return res.data.item
  }
}

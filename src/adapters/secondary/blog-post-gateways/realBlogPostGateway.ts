import { axiosWithBearer } from '@adapters/primary/nuxt/utils/axios'
import { RealGateway } from '@adapters/secondary/order-gateways/RealOrderGateway'
import { BlogPost, BlogPostListItem } from '@core/entities/blogPost'
import {
  BlogPostContentDTO,
  BlogPostGateway,
  CreateBlogPostDTO,
  EditBlogPostDTO
} from '@core/gateways/blogPostGateway'
import { UUID } from '@core/types/types'

export class RealBlogPostGateway
  extends RealGateway
  implements BlogPostGateway
{
  constructor(url: string) {
    super(url)
  }

  async list(): Promise<Array<BlogPostListItem>> {
    const res = await axiosWithBearer.get(`${this.blogPostsUrl()}`)
    return res.data.items
  }

  async getByUuid(uuid: UUID): Promise<BlogPost> {
    const res = await axiosWithBearer.get(`${this.blogPostsUrl()}/${uuid}`)
    return res.data.item
  }

  async create(dto: CreateBlogPostDTO): Promise<BlogPost> {
    const formData = this.toFormData(dto)
    formData.append('slug', dto.slug)
    const res = await axiosWithBearer.post(this.blogPostsUrl(), formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return res.data.item
  }

  async edit(uuid: UUID, dto: EditBlogPostDTO): Promise<BlogPost> {
    const res = await axiosWithBearer.put(
      `${this.blogPostsUrl()}/${uuid}`,
      this.toFormData(dto),
      { headers: { 'Content-Type': 'multipart/form-data' } }
    )
    return res.data.item
  }

  async delete(uuid: UUID): Promise<BlogPost> {
    const res = await axiosWithBearer.delete(`${this.blogPostsUrl()}/${uuid}`)
    return res.data.item
  }

  async publish(uuid: UUID): Promise<BlogPost> {
    const res = await axiosWithBearer.post(
      `${this.blogPostsUrl()}/${uuid}/publish`
    )
    return res.data.item
  }

  async unpublish(uuid: UUID): Promise<BlogPost> {
    const res = await axiosWithBearer.post(
      `${this.blogPostsUrl()}/${uuid}/unpublish`
    )
    return res.data.item
  }

  async setHighlights(blogPostUuids: Array<UUID>): Promise<void> {
    await axiosWithBearer.post(`${this.blogPostsUrl()}/highlights`, {
      blogPostUuids
    })
  }

  private blogPostsUrl(): string {
    return `${this.baseUrl}/blog-posts`
  }

  private toFormData(dto: BlogPostContentDTO): FormData {
    const formData = new FormData()
    formData.append('title', dto.title)
    if (dto.metaTitle) formData.append('metaTitle', dto.metaTitle)
    formData.append('metaDescription', dto.metaDescription)
    if (dto.imageUrl) formData.append('imageUrl', dto.imageUrl)
    if (dto.image) formData.append('image', dto.image)
    formData.append('publishedAt', String(dto.publishedAt))
    dto.tags.forEach((tag) => formData.append('tags', tag))
    formData.append('html', dto.html)
    return formData
  }
}

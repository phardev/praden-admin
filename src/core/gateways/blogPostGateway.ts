import { BlogPost, BlogPostListItem } from '@core/entities/blogPost'
import { Timestamp, UUID } from '@core/types/types'

export interface BlogPostContentDTO {
  title: string
  metaTitle?: string
  metaDescription: string
  imageUrl?: string
  image?: File
  publishedAt: Timestamp
  tags: Array<string>
  html: string
}

export interface CreateBlogPostDTO extends BlogPostContentDTO {
  slug: string
}

export type EditBlogPostDTO = BlogPostContentDTO

export interface BlogPostGateway {
  list(): Promise<Array<BlogPostListItem>>
  getByUuid(uuid: UUID): Promise<BlogPost>
  create(dto: CreateBlogPostDTO): Promise<BlogPost>
  edit(uuid: UUID, dto: EditBlogPostDTO): Promise<BlogPost>
  delete(uuid: UUID): Promise<BlogPost>
  publish(uuid: UUID): Promise<BlogPost>
  unpublish(uuid: UUID): Promise<BlogPost>
  setHighlights(blogPostUuids: Array<UUID>): Promise<void>
}

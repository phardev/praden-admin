import {
  BlogPost,
  BlogPostListItem,
  BlogPostStatus
} from '@core/entities/blogPost'
import {
  BlogPostGateway,
  CreateBlogPostDTO,
  EditBlogPostDTO
} from '@core/gateways/blogPostGateway'
import { UUID } from '@core/types/types'

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value))

export class InMemoryBlogPostGateway implements BlogPostGateway {
  private blogPosts: Array<BlogPost> = []
  private highlightedUuids: Array<UUID> = []
  private nextUuid = 'new-blog-post-uuid'

  async list(): Promise<Array<BlogPostListItem>> {
    return clone(
      [...this.blogPosts]
        .sort((a, b) => b.publishedAt - a.publishedAt)
        .map((blogPost) => this.toListItem(blogPost))
    )
  }

  async getByUuid(uuid: UUID): Promise<BlogPost> {
    return clone(this.findByUuid(uuid))
  }

  async create(dto: CreateBlogPostDTO): Promise<BlogPost> {
    const created: BlogPost = {
      uuid: this.nextUuid,
      slug: dto.slug,
      title: dto.title,
      metaTitle: dto.metaTitle,
      metaDescription: dto.metaDescription,
      imageUrl: dto.image ? `uploaded/${dto.image.name}` : (dto.imageUrl ?? ''),
      publishedAt: dto.publishedAt,
      tags: dto.tags,
      status: BlogPostStatus.DRAFT,
      html: dto.html
    }
    this.blogPosts.push(clone(created))
    return created
  }

  async edit(uuid: UUID, dto: EditBlogPostDTO): Promise<BlogPost> {
    const existing = this.findByUuid(uuid)
    const edited: BlogPost = {
      ...existing,
      title: dto.title,
      metaTitle: dto.metaTitle,
      metaDescription: dto.metaDescription,
      imageUrl: dto.image ? `uploaded/${dto.image.name}` : (dto.imageUrl ?? ''),
      publishedAt: dto.publishedAt,
      tags: dto.tags,
      html: dto.html
    }
    return this.replace(edited)
  }

  async delete(uuid: UUID): Promise<BlogPost> {
    const existing = this.findByUuid(uuid)
    this.blogPosts = this.blogPosts.filter((post) => post.uuid !== uuid)
    return existing
  }

  async publish(uuid: UUID): Promise<BlogPost> {
    return this.replace({
      ...this.findByUuid(uuid),
      status: BlogPostStatus.PUBLISHED
    })
  }

  async unpublish(uuid: UUID): Promise<BlogPost> {
    return this.replace({
      ...this.findByUuid(uuid),
      status: BlogPostStatus.DRAFT
    })
  }

  async setHighlights(blogPostUuids: Array<UUID>): Promise<void> {
    this.highlightedUuids = [...blogPostUuids]
  }

  listHighlights(): Array<UUID> {
    return [...this.highlightedUuids]
  }

  feedWith(...blogPosts: Array<BlogPost>) {
    this.blogPosts = clone(blogPosts)
  }

  highlightWith(...blogPostUuids: Array<UUID>) {
    this.highlightedUuids = [...blogPostUuids]
  }

  withNextUuid(uuid: UUID) {
    this.nextUuid = uuid
  }

  private findByUuid(uuid: UUID): BlogPost {
    const blogPost = this.blogPosts.find((post) => post.uuid === uuid)
    if (!blogPost) throw new Error(`Blog post does not exist: ${uuid}`)
    return clone(blogPost)
  }

  private replace(blogPost: BlogPost): BlogPost {
    const index = this.blogPosts.findIndex(
      (post) => post.uuid === blogPost.uuid
    )
    this.blogPosts.splice(index, 1, clone(blogPost))
    return blogPost
  }

  private toListItem(blogPost: BlogPost): BlogPostListItem {
    const order = this.highlightedUuids.indexOf(blogPost.uuid)
    return {
      uuid: blogPost.uuid,
      slug: blogPost.slug,
      title: blogPost.title,
      imageUrl: blogPost.imageUrl,
      status: blogPost.status,
      publishedAt: blogPost.publishedAt,
      updatedAt: blogPost.publishedAt,
      updatedBy: {
        kind: 'staff',
        email: 'agnes@praden.fr',
        firstname: 'Agnès',
        lastname: 'Praden'
      },
      highlightOrder: order === -1 ? undefined : order
    }
  }
}

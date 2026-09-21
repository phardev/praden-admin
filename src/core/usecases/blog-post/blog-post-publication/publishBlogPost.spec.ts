import { InMemoryBlogPostGateway } from '@adapters/secondary/blog-post-gateways/inMemoryBlogPostGateway'
import { BlogPostStatus } from '@core/entities/blogPost'
import { publishBlogPost } from '@core/usecases/blog-post/blog-post-publication/publishBlogPost'
import { unpublishBlogPost } from '@core/usecases/blog-post/blog-post-publication/unpublishBlogPost'
import { listBlogPosts } from '@core/usecases/blog-post/list-blog-posts/listBlogPosts'
import { useBlogPostStore } from '@store/blogPostStore'
import {
  anticelluliteBlogPost,
  autobronzantsBlogPost,
  stressBlogPost
} from '@utils/testData/blogPosts'
import { createPinia, setActivePinia } from 'pinia'

describe('Blog post publication from the list', () => {
  let blogPostGateway: InMemoryBlogPostGateway
  let blogPostStore: any

  beforeEach(async () => {
    setActivePinia(createPinia())
    blogPostGateway = new InMemoryBlogPostGateway()
    blogPostStore = useBlogPostStore()
    blogPostGateway.feedWith(anticelluliteBlogPost, stressBlogPost)
    await listBlogPosts(blogPostGateway)
  })

  describe('A draft is published', () => {
    it('should mark it as published in the list', async () => {
      await publishBlogPost(stressBlogPost.uuid, blogPostGateway)
      expect(statusOf(stressBlogPost.uuid)).toStrictEqual(
        BlogPostStatus.PUBLISHED
      )
    })
  })

  describe('A published blog post is unpublished', () => {
    it('should mark it as draft in the list', async () => {
      await unpublishBlogPost(anticelluliteBlogPost.uuid, blogPostGateway)
      expect(statusOf(anticelluliteBlogPost.uuid)).toStrictEqual(
        BlogPostStatus.DRAFT
      )
    })
  })

  describe('The other blog posts', () => {
    it('should keep their status', async () => {
      await publishBlogPost(stressBlogPost.uuid, blogPostGateway)
      expect(statusOf(anticelluliteBlogPost.uuid)).toStrictEqual(
        BlogPostStatus.PUBLISHED
      )
    })
  })

  const statusOf = (uuid: string) =>
    blogPostStore.items.find((item: { uuid: string }) => item.uuid === uuid)
      .status
})

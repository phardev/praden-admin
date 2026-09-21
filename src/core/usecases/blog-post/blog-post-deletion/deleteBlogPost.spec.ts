import { InMemoryBlogPostGateway } from '@adapters/secondary/blog-post-gateways/inMemoryBlogPostGateway'
import { BlogPostStatus } from '@core/entities/blogPost'
import { deleteBlogPost } from '@core/usecases/blog-post/blog-post-deletion/deleteBlogPost'
import { listBlogPosts } from '@core/usecases/blog-post/list-blog-posts/listBlogPosts'
import { useBlogPostStore } from '@store/blogPostStore'
import {
  anticelluliteBlogPost,
  autobronzantsBlogPost,
  stressBlogPost
} from '@utils/testData/blogPosts'
import { createPinia, setActivePinia } from 'pinia'

describe('Blog post deletion', () => {
  let blogPostGateway: InMemoryBlogPostGateway
  let blogPostStore: any

  beforeEach(async () => {
    setActivePinia(createPinia())
    blogPostGateway = new InMemoryBlogPostGateway()
    blogPostStore = useBlogPostStore()
    blogPostGateway.feedWith(anticelluliteBlogPost, autobronzantsBlogPost)
    await listBlogPosts(blogPostGateway)
  })

  describe('A blog post is deleted', () => {
    beforeEach(async () => {
      await deleteBlogPost(anticelluliteBlogPost.uuid, blogPostGateway)
    })

    it('should drop it from the list', () => {
      expect(
        blogPostStore.items.map((item: { slug: string }) => item.slug)
      ).toStrictEqual([autobronzantsBlogPost.slug])
    })

    it('should stop deleting once done', () => {
      expect(blogPostStore.isDeleting).toBe(false)
    })
  })
})

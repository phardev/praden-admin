import { InMemoryBlogPostGateway } from '@adapters/secondary/blog-post-gateways/inMemoryBlogPostGateway'
import { BlogPostStatus } from '@core/entities/blogPost'
import { getBlogPost } from '@core/usecases/blog-post/get-blog-post/getBlogPost'
import { useBlogPostStore } from '@store/blogPostStore'
import {
  anticelluliteBlogPost,
  autobronzantsBlogPost,
  stressBlogPost
} from '@utils/testData/blogPosts'
import { createPinia, setActivePinia } from 'pinia'

describe('Blog post details', () => {
  let blogPostGateway: InMemoryBlogPostGateway
  let blogPostStore: any

  beforeEach(() => {
    setActivePinia(createPinia())
    blogPostGateway = new InMemoryBlogPostGateway()
    blogPostStore = useBlogPostStore()
    blogPostGateway.feedWith(anticelluliteBlogPost, stressBlogPost)
  })

  describe('The blog post exists', () => {
    beforeEach(async () => {
      await getBlogPost(anticelluliteBlogPost.uuid, blogPostGateway)
    })

    it('should store it as the current blog post', () => {
      expect(blogPostStore.current).toStrictEqual(anticelluliteBlogPost)
    })

    it('should stop loading once done', () => {
      expect(blogPostStore.isLoading).toBe(false)
    })
  })

  describe('The blog post does not exist', () => {
    beforeEach(async () => {
      await getBlogPost('unknown-blog-post-uuid', blogPostGateway).catch(
        () => undefined
      )
    })

    it('should stop loading even when it fails', () => {
      expect(blogPostStore.isLoading).toBe(false)
    })
  })
})

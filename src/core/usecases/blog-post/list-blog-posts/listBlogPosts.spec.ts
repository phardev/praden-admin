import { InMemoryBlogPostGateway } from '@adapters/secondary/blog-post-gateways/inMemoryBlogPostGateway'
import { BlogPostStatus } from '@core/entities/blogPost'
import { listBlogPosts } from '@core/usecases/blog-post/list-blog-posts/listBlogPosts'
import { useBlogPostStore } from '@store/blogPostStore'
import {
  anticelluliteBlogPost,
  autobronzantsBlogPost,
  stressBlogPost
} from '@utils/testData/blogPosts'
import { createPinia, setActivePinia } from 'pinia'

describe('Blog posts listing', () => {
  let blogPostGateway: InMemoryBlogPostGateway
  let blogPostStore: any

  beforeEach(() => {
    setActivePinia(createPinia())
    blogPostGateway = new InMemoryBlogPostGateway()
    blogPostStore = useBlogPostStore()
    blogPostGateway.feedWith(
      anticelluliteBlogPost,
      autobronzantsBlogPost,
      stressBlogPost
    )
  })

  describe('One blog post is highlighted', () => {
    beforeEach(async () => {
      blogPostGateway.highlightWith(anticelluliteBlogPost.uuid)
      await listBlogPosts(blogPostGateway)
    })

    it('should store them from the most recently published', () => {
      expect(
        blogPostStore.items.map((item: { slug: string }) => item.slug)
      ).toStrictEqual([
        autobronzantsBlogPost.slug,
        anticelluliteBlogPost.slug,
        stressBlogPost.slug
      ])
    })

    it('should expose the rank of the highlighted one', () => {
      expect(
        blogPostStore.items.map(
          (item: { highlightOrder?: number }) => item.highlightOrder
        )
      ).toStrictEqual([undefined, 0, undefined])
    })

    it('should stop loading once done', () => {
      expect(blogPostStore.isLoading).toBe(false)
    })
  })
})

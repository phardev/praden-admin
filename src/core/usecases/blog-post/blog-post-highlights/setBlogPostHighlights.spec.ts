import { InMemoryBlogPostGateway } from '@adapters/secondary/blog-post-gateways/inMemoryBlogPostGateway'
import { BlogPostStatus } from '@core/entities/blogPost'
import { setBlogPostHighlights } from '@core/usecases/blog-post/blog-post-highlights/setBlogPostHighlights'
import { listBlogPosts } from '@core/usecases/blog-post/list-blog-posts/listBlogPosts'
import { useBlogPostStore } from '@store/blogPostStore'
import {
  anticelluliteBlogPost,
  autobronzantsBlogPost,
  stressBlogPost
} from '@utils/testData/blogPosts'
import { createPinia, setActivePinia } from 'pinia'

describe('Blog post highlights', () => {
  let blogPostGateway: InMemoryBlogPostGateway
  let blogPostStore: any

  beforeEach(async () => {
    setActivePinia(createPinia())
    blogPostGateway = new InMemoryBlogPostGateway()
    blogPostStore = useBlogPostStore()
    blogPostGateway.feedWith(
      anticelluliteBlogPost,
      autobronzantsBlogPost,
      stressBlogPost
    )
    blogPostGateway.highlightWith(anticelluliteBlogPost.uuid)
    await listBlogPosts(blogPostGateway)
  })

  describe('The pharmacy reorders the front page', () => {
    beforeEach(async () => {
      await setBlogPostHighlights(
        [autobronzantsBlogPost.uuid, anticelluliteBlogPost.uuid],
        blogPostGateway
      )
    })

    it('should send the submitted order', () => {
      expect(blogPostGateway.listHighlights()).toStrictEqual([
        autobronzantsBlogPost.uuid,
        anticelluliteBlogPost.uuid
      ])
    })

    it('should rank the list items accordingly', () => {
      expect(
        blogPostStore.items.map(
          (item: { slug: string; highlightOrder?: number }) => [
            item.slug,
            item.highlightOrder
          ]
        )
      ).toStrictEqual([
        [autobronzantsBlogPost.slug, 0],
        [anticelluliteBlogPost.slug, 1],
        [stressBlogPost.slug, undefined]
      ])
    })
  })

  describe('The pharmacy empties the front page', () => {
    it('should leave no ranked blog post', async () => {
      await setBlogPostHighlights([], blogPostGateway)
      expect(
        blogPostStore.items.map(
          (item: { highlightOrder?: number }) => item.highlightOrder
        )
      ).toStrictEqual([undefined, undefined, undefined])
    })
  })
})

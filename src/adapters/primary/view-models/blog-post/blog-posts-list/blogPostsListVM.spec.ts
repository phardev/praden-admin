import { blogPostsListVM } from '@adapters/primary/view-models/blog-post/blog-posts-list/blogPostsListVM'
import { InMemoryBlogPostGateway } from '@adapters/secondary/blog-post-gateways/inMemoryBlogPostGateway'
import { BlogPostStatus } from '@core/entities/blogPost'
import { listBlogPosts } from '@core/usecases/blog-post/list-blog-posts/listBlogPosts'
import {
  anticelluliteBlogPost,
  autobronzantsBlogPost,
  stressBlogPost
} from '@utils/testData/blogPosts'
import { createPinia, setActivePinia } from 'pinia'

describe('Blog posts list VM', () => {
  let blogPostGateway: InMemoryBlogPostGateway

  beforeEach(() => {
    setActivePinia(createPinia())
    blogPostGateway = new InMemoryBlogPostGateway()
    blogPostGateway.feedWith(
      anticelluliteBlogPost,
      autobronzantsBlogPost,
      stressBlogPost
    )
  })

  describe('Two blog posts are highlighted in an order of their own', () => {
    beforeEach(async () => {
      blogPostGateway.highlightWith(
        stressBlogPost.uuid,
        anticelluliteBlogPost.uuid
      )
      await listBlogPosts(blogPostGateway)
    })

    it('should expose the highlighted ones in the chosen order', () => {
      expect(
        blogPostsListVM().highlighted.map((item) => item.slug)
      ).toStrictEqual([stressBlogPost.slug, anticelluliteBlogPost.slug])
    })

    it('should expose the others from the most recently published', () => {
      expect(blogPostsListVM().others.map((item) => item.slug)).toStrictEqual([
        autobronzantsBlogPost.slug
      ])
    })

    it('should expose the highlighted uuids ready to be reordered', () => {
      expect(blogPostsListVM().highlightedUuids).toStrictEqual([
        stressBlogPost.uuid,
        anticelluliteBlogPost.uuid
      ])
    })
  })

  describe('A blog post is displayed', () => {
    beforeEach(async () => {
      blogPostGateway.feedWith(anticelluliteBlogPost)
      await listBlogPosts(blogPostGateway)
    })

    it('should expose everything the row needs', () => {
      expect(blogPostsListVM().others).toStrictEqual([
        {
          uuid: anticelluliteBlogPost.uuid,
          slug: anticelluliteBlogPost.slug,
          title: anticelluliteBlogPost.title,
          imageUrl: anticelluliteBlogPost.imageUrl,
          status: BlogPostStatus.PUBLISHED,
          isPublished: true,
          publishedAt: '24 avr. 2025',
          updatedAt: '24 avr. 2025',
          authorKind: 'staff',
          authorName: 'Agnès Praden',
          isHighlighted: false
        }
      ])
    })
  })

  describe('A draft is highlighted', () => {
    it('should still expose it as not published', async () => {
      blogPostGateway.feedWith(stressBlogPost)
      blogPostGateway.highlightWith(stressBlogPost.uuid)
      await listBlogPosts(blogPostGateway)
      expect(blogPostsListVM().highlighted[0].isPublished).toBe(false)
    })
  })

  describe('Nothing was listed yet', () => {
    it('should expose empty sections', () => {
      expect(blogPostsListVM()).toStrictEqual({
        isLoading: false,
        isSaving: false,
        isDeleting: false,
        highlighted: [],
        others: [],
        highlightedUuids: []
      })
    })
  })
})

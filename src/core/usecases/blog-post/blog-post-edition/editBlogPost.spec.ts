import { InMemoryBlogPostGateway } from '@adapters/secondary/blog-post-gateways/inMemoryBlogPostGateway'
import { BlogPostStatus } from '@core/entities/blogPost'
import type { EditBlogPostDTO } from '@core/gateways/blogPostGateway'
import { editBlogPost } from '@core/usecases/blog-post/blog-post-edition/editBlogPost'
import { useBlogPostStore } from '@store/blogPostStore'
import {
  anticelluliteBlogPost,
  autobronzantsBlogPost,
  stressBlogPost
} from '@utils/testData/blogPosts'
import { createPinia, setActivePinia } from 'pinia'

describe('Blog post edition', () => {
  let blogPostGateway: InMemoryBlogPostGateway
  let blogPostStore: any
  let dto: EditBlogPostDTO

  beforeEach(() => {
    setActivePinia(createPinia())
    blogPostGateway = new InMemoryBlogPostGateway()
    blogPostStore = useBlogPostStore()
    blogPostGateway.feedWith(anticelluliteBlogPost)
    dto = {
      title: 'Titre mis à jour',
      metaTitle: anticelluliteBlogPost.metaTitle,
      metaDescription: anticelluliteBlogPost.metaDescription,
      imageUrl: anticelluliteBlogPost.imageUrl,
      publishedAt: anticelluliteBlogPost.publishedAt,
      tags: anticelluliteBlogPost.tags,
      html: anticelluliteBlogPost.html
    }
  })

  describe('The content is edited', () => {
    beforeEach(async () => {
      await editBlogPost(anticelluliteBlogPost.uuid, dto, blogPostGateway)
    })

    it('should store the edited blog post', () => {
      expect(blogPostStore.current).toStrictEqual({
        ...anticelluliteBlogPost,
        title: 'Titre mis à jour'
      })
    })

    it('should stop saving once done', () => {
      expect(blogPostStore.isSaving).toBe(false)
    })
  })

  describe('The blog post is a draft', () => {
    it('should leave the publication state untouched', async () => {
      blogPostGateway.feedWith(stressBlogPost)
      await editBlogPost(stressBlogPost.uuid, dto, blogPostGateway)
      expect(blogPostStore.current.status).toStrictEqual(BlogPostStatus.DRAFT)
    })
  })
})

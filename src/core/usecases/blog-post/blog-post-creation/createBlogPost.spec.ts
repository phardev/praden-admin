import { InMemoryBlogPostGateway } from '@adapters/secondary/blog-post-gateways/inMemoryBlogPostGateway'
import type { CreateBlogPostDTO } from '@core/gateways/blogPostGateway'
import { createBlogPost } from '@core/usecases/blog-post/blog-post-creation/createBlogPost'
import { useBlogPostStore } from '@store/blogPostStore'
import {
  anticelluliteBlogPost,
  autobronzantsBlogPost,
  stressBlogPost
} from '@utils/testData/blogPosts'
import { createPinia, setActivePinia } from 'pinia'

describe('Blog post creation', () => {
  let blogPostGateway: InMemoryBlogPostGateway
  let blogPostStore: any
  let dto: CreateBlogPostDTO
  const uuid = 'new-blog-post-uuid'

  beforeEach(() => {
    setActivePinia(createPinia())
    blogPostGateway = new InMemoryBlogPostGateway()
    blogPostStore = useBlogPostStore()
    blogPostGateway.withNextUuid(uuid)
    dto = {
      slug: 'nouvel-article',
      title: 'Nouvel article',
      metaTitle: 'Nouvel article - Conseils',
      metaDescription: 'Description SEO du nouvel article.',
      imageUrl: 'https://cdn.example.com/image.png',
      publishedAt: Date.UTC(2026, 0, 15),
      tags: ['Santé'],
      html: '<h1>Nouvel article</h1><p>Contenu.</p>'
    }
  })

  describe('The form is submitted', () => {
    beforeEach(async () => {
      await createBlogPost(dto, blogPostGateway)
    })

    it('should store the blog post exactly as the backend returned it', async () => {
      expect(blogPostStore.current).toStrictEqual(
        await blogPostGateway.getByUuid(uuid)
      )
    })

    it('should carry every field of the form to the backend', async () => {
      const created = await blogPostGateway.getByUuid(uuid)
      expect(dto).toStrictEqual({
        slug: created.slug,
        title: created.title,
        metaTitle: created.metaTitle,
        metaDescription: created.metaDescription,
        imageUrl: created.imageUrl,
        publishedAt: created.publishedAt,
        tags: created.tags,
        html: created.html
      })
    })

    it('should stop saving once done', () => {
      expect(blogPostStore.isSaving).toBe(false)
    })
  })
})

import type { BlogPostFormVM } from '@adapters/primary/view-models/blog-post/blog-post-form/blogPostFormVM'
import { blogPostFormVM } from '@adapters/primary/view-models/blog-post/blog-post-form/blogPostFormVM'
import { FakeDateProvider } from '@adapters/secondary/date-providers/FakeDateProvider'
import { BlogPostStatus } from '@core/entities/blogPost'
import { useBlogPostStore } from '@store/blogPostStore'
import { anticelluliteBlogPost } from '@utils/testData/blogPosts'
import { createPinia, setActivePinia } from 'pinia'

describe('Blog post form VM', () => {
  let dateProvider: FakeDateProvider
  let vm: BlogPostFormVM
  const today = Date.UTC(2026, 8, 21)

  beforeEach(() => {
    setActivePinia(createPinia())
    dateProvider = new FakeDateProvider()
    dateProvider.feedWith(today)
  })

  describe('Creating a blog post', () => {
    beforeEach(() => {
      vm = blogPostFormVM(dateProvider)
    })

    it('should start as a draft', () => {
      expect(vm.get('status').value).toStrictEqual(BlogPostStatus.DRAFT)
    })

    it('should default the publication date to today', () => {
      expect(vm.get('publishedAt').value).toStrictEqual(today)
    })

    it('should drop the time of day so the shop displays the expected date', () => {
      dateProvider.feedWith(Date.UTC(2026, 8, 21, 23, 45))
      vm = blogPostFormVM(dateProvider)
      expect(vm.get('publishedAt').value).toStrictEqual(Date.UTC(2026, 8, 21))
    })

    it('should drop the time of day of a date picked in the calendar', () => {
      vm.set('publishedAt', Date.UTC(2026, 8, 15, 23, 45))
      expect(vm.get('publishedAt').value).toStrictEqual(Date.UTC(2026, 8, 15))
    })

    it('should start with an empty form', () => {
      expect(vm.getCreateDto()).toStrictEqual({
        slug: '',
        title: '',
        metaTitle: undefined,
        metaDescription: '',
        imageUrl: undefined,
        image: undefined,
        publishedAt: today,
        tags: [],
        html: ''
      })
    })

    it('should let the slug be edited', () => {
      expect(vm.get('slug').canEdit).toBe(true)
    })

    it('should expose the public path being composed', () => {
      vm.set('title', 'Bien choisir sa crème solaire')
      expect(vm.getPublicPath()).toStrictEqual(
        '/blog/bien-choisir-sa-creme-solaire'
      )
    })

    it('should expose the bare prefix while the slug is empty', () => {
      expect(vm.getPublicPath()).toStrictEqual('/blog/')
    })

    it('should not be submittable yet', () => {
      expect(vm.getCanValidate()).toBe(false)
    })

    describe('Typing a title', () => {
      beforeEach(() => {
        vm.set('title', 'Bien choisir sa crème solaire')
      })

      it('should propose a slug derived from it', () => {
        expect(vm.get('slug').value).toStrictEqual(
          'bien-choisir-sa-creme-solaire'
        )
      })

      describe('Then refining the title', () => {
        it('should keep the slug in step', () => {
          vm.set('title', 'Bien choisir sa crème solaire en 2026')
          expect(vm.get('slug').value).toStrictEqual(
            'bien-choisir-sa-creme-solaire-en-2026'
          )
        })
      })

      describe('Then editing the slug by hand', () => {
        beforeEach(() => {
          vm.set('slug', 'creme-solaire')
        })

        it('should stop deriving it from the title', () => {
          vm.set('title', 'Bien choisir sa crème solaire en 2026')
          expect(vm.get('slug').value).toStrictEqual('creme-solaire')
        })
      })
    })

    describe('The form is entirely filled', () => {
      beforeEach(() => {
        givenAFilledForm()
      })

      it('should be submittable', () => {
        expect(vm.getCanValidate()).toBe(true)
      })

      it('should expose the creation payload', () => {
        expect(vm.getCreateDto()).toStrictEqual({
          slug: 'bien-choisir-sa-creme-solaire',
          title: 'Bien choisir sa crème solaire',
          metaTitle: undefined,
          metaDescription: 'Nos conseils pour choisir une protection solaire.',
          imageUrl: 'https://cdn.example.com/solaire.png',
          image: undefined,
          publishedAt: today,
          tags: [],
          html: '<h1>Bien choisir sa crème solaire</h1>'
        })
      })
    })

    describe('The slug is not usable in an url', () => {
      it('should not be submittable', () => {
        givenAFilledForm()
        vm.set('slug', 'Crème Solaire')
        expect(vm.getCanValidate()).toBe(false)
      })
    })

    describe('No cover image is given', () => {
      it('should not be submittable', () => {
        givenAFilledForm()
        vm.set('imageUrl', '')
        expect(vm.getCanValidate()).toBe(false)
      })
    })

    describe('A cover image is uploaded instead of a url', () => {
      it('should be submittable', () => {
        givenAFilledForm()
        vm.set('imageUrl', '')
        vm.set('image', new File(['content'], 'solaire.png'))
        expect(vm.getCanValidate()).toBe(true)
      })
    })

    describe('Tagging the blog post', () => {
      it('should keep the tags in the order they were added', () => {
        vm.addTag('Solaire')
        vm.addTag('Été')
        expect(vm.get('tags').value).toStrictEqual(['Solaire', 'Été'])
      })

      it('should ignore a tag already present', () => {
        vm.addTag('Solaire')
        vm.addTag('Solaire')
        expect(vm.get('tags').value).toStrictEqual(['Solaire'])
      })

      it('should ignore an empty tag', () => {
        vm.addTag('   ')
        expect(vm.get('tags').value).toStrictEqual([])
      })

      it('should trim the tag', () => {
        vm.addTag('  Solaire  ')
        expect(vm.get('tags').value).toStrictEqual(['Solaire'])
      })

      it('should remove a tag', () => {
        vm.addTag('Solaire')
        vm.addTag('Été')
        vm.removeTag('Solaire')
        expect(vm.get('tags').value).toStrictEqual(['Été'])
      })
    })
  })

  describe('Editing an existing blog post', () => {
    beforeEach(() => {
      useBlogPostStore().setCurrent(anticelluliteBlogPost)
      vm = blogPostFormVM(dateProvider, anticelluliteBlogPost.uuid)
    })

    it('should fill the form with the stored blog post', () => {
      expect(vm.getEditDto()).toStrictEqual({
        title: anticelluliteBlogPost.title,
        metaTitle: undefined,
        metaDescription: anticelluliteBlogPost.metaDescription,
        imageUrl: anticelluliteBlogPost.imageUrl,
        image: undefined,
        publishedAt: anticelluliteBlogPost.publishedAt,
        tags: anticelluliteBlogPost.tags,
        html: anticelluliteBlogPost.html
      })
    })

    it('should lock the slug', () => {
      expect(vm.get('slug').canEdit).toBe(false)
    })

    it('should still expose the slug for display', () => {
      expect(vm.get('slug').value).toStrictEqual(anticelluliteBlogPost.slug)
    })

    it('should expose the public path of the article', () => {
      expect(vm.getPublicPath()).toStrictEqual(
        `/blog/${anticelluliteBlogPost.slug}`
      )
    })

    it('should report no change yet', () => {
      expect(vm.hasChanges).toBe(false)
    })

    it('should report a change once edited', () => {
      vm.set('title', 'Un autre titre')
      expect(vm.hasChanges).toBe(true)
    })

    it('should report a change when the status is flipped', () => {
      vm.set('status', BlogPostStatus.DRAFT)
      expect(vm.hasChanges).toBe(true)
    })

    it('should ask for no transition while the status is untouched', () => {
      expect(vm.getStatusTransition()).toBeUndefined()
    })

    it('should ask for an unpublication once the status is flipped', () => {
      vm.set('status', BlogPostStatus.DRAFT)
      expect(vm.getStatusTransition()).toStrictEqual(BlogPostStatus.DRAFT)
    })

    it('should ask for no transition when the status is flipped back', () => {
      vm.set('status', BlogPostStatus.DRAFT)
      vm.set('status', anticelluliteBlogPost.status)
      expect(vm.getStatusTransition()).toBeUndefined()
    })

    it('should keep the status out of the content payload', () => {
      vm.set('status', BlogPostStatus.DRAFT)
      expect(Object.keys(vm.getEditDto())).not.toContain('status')
    })

    it('should never derive the slug from the title', () => {
      vm.set('title', 'Un autre titre')
      expect(vm.get('slug').value).toStrictEqual(anticelluliteBlogPost.slug)
    })
  })

  const givenAFilledForm = () => {
    vm.set('title', 'Bien choisir sa crème solaire')
    vm.set(
      'metaDescription',
      'Nos conseils pour choisir une protection solaire.'
    )
    vm.set('imageUrl', 'https://cdn.example.com/solaire.png')
    vm.set('html', '<h1>Bien choisir sa crème solaire</h1>')
  }
})

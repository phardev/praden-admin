import {
  ContentPageFormVM,
  contentPageFormVM,
  NO_FOOTER_SECTION
} from '@adapters/primary/view-models/content-page/content-page-form/contentPageFormVM'
import {
  CONTENT_PAGE_MAX_META_DESCRIPTION_LENGTH,
  CONTENT_PAGE_MAX_NAME_LENGTH,
  ContentPageStatus
} from '@core/entities/contentPage'
import { FooterSection } from '@core/entities/footer'
import { useContentPageStore } from '@store/contentPageStore'
import {
  cgvContentPage,
  deliveryContentPage,
  pharmacieContentPage
} from '@utils/testData/contentPages'
import { createPinia, setActivePinia } from 'pinia'

describe('Content page form VM', () => {
  let vm: ContentPageFormVM

  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('Creating a content page', () => {
    beforeEach(() => {
      vm = contentPageFormVM()
    })

    it('should start with empty content', () => {
      expect(vm.getCreateDto()).toStrictEqual({
        slug: '',
        name: '',
        title: '',
        metaDescription: '',
        html: ''
      })
    })

    it('should start as a draft', () => {
      expect(vm.get('status').value).toStrictEqual(ContentPageStatus.DRAFT)
    })

    it('should start outside the footer', () => {
      expect(vm.get('footerSection').value).toStrictEqual(NO_FOOTER_SECTION)
    })

    it('should let the slug be edited', () => {
      expect(vm.get('slug').canEdit).toBe(true)
    })

    it('should derive the slug from the name', () => {
      vm.set('name', 'Livraison & Retours')
      expect(vm.get('slug').value).toStrictEqual('livraison-retours')
    })

    it('should keep a slug typed by hand when the name changes', () => {
      vm.set('name', 'Livraison')
      vm.set('slug', 'modes-de-livraison')
      vm.set('name', 'Livraison et retours')
      expect(vm.get('slug').value).toStrictEqual('modes-de-livraison')
    })

    it('should offer both statuses', () => {
      expect(vm.getStatusOptions()).toStrictEqual([
        ContentPageStatus.DRAFT,
        ContentPageStatus.PUBLISHED
      ])
    })

    it('should offer every footer section and none', () => {
      expect(vm.getFooterSectionOptions()).toStrictEqual([
        NO_FOOTER_SECTION,
        FooterSection.PHARMACY,
        FooterSection.LEGAL
      ])
    })

    it('should not ask for a status change while it stays a draft', () => {
      expect(vm.getStatusTransition()).toBeUndefined()
    })

    it('should ask for a publication once published is chosen', () => {
      vm.set('status', ContentPageStatus.PUBLISHED)
      expect(vm.getStatusTransition()).toStrictEqual(
        ContentPageStatus.PUBLISHED
      )
    })

    it('should ask for a footer placement once a section is chosen', () => {
      vm.set('footerSection', FooterSection.LEGAL)
      expect(vm.getFooterTransition()).toStrictEqual(FooterSection.LEGAL)
    })

    it('should forbid saving while the slug is not in kebab case', () => {
      fillValidContent()
      vm.set('slug', 'Livraison Express')
      expect(vm.getCanValidate()).toBe(false)
    })

    it('should allow saving once every field is filled', () => {
      fillValidContent()
      expect(vm.getCanValidate()).toBe(true)
    })

    it('should forbid saving when the name is too long', () => {
      fillValidContent()
      vm.set('name', 'a'.repeat(CONTENT_PAGE_MAX_NAME_LENGTH + 1))
      expect(vm.getCanValidate()).toBe(false)
    })

    it('should expose the public path of the page', () => {
      vm.set('name', 'Livraison')
      expect(vm.getPublicPath()).toStrictEqual('/livraison')
    })

    const fillValidContent = () => {
      vm.set('name', 'Livraison')
      vm.set('title', 'Modes et délais de livraison')
      vm.set('metaDescription', 'Les modes et délais de livraison.')
      vm.set('html', '<h1>Livraison</h1>')
    }
  })

  describe('Editing a regular content page', () => {
    beforeEach(() => {
      useContentPageStore().setCurrent(pharmacieContentPage)
      vm = contentPageFormVM(pharmacieContentPage.slug)
    })

    it('should prefill the content from the current content page', () => {
      expect(vm.getEditDto()).toStrictEqual({
        name: pharmacieContentPage.name,
        title: pharmacieContentPage.title,
        metaDescription: pharmacieContentPage.metaDescription,
        html: pharmacieContentPage.html
      })
    })

    it('should lock the slug', () => {
      expect(vm.get('slug')).toStrictEqual({
        value: pharmacieContentPage.slug,
        canEdit: false
      })
    })

    it('should keep the slug when the name changes', () => {
      vm.set('name', 'La pharmacie')
      expect(vm.get('slug').value).toStrictEqual(pharmacieContentPage.slug)
    })

    it('should prefill its footer section', () => {
      expect(vm.get('footerSection').value).toStrictEqual(
        FooterSection.PHARMACY
      )
    })

    it('should not be mandatory', () => {
      expect(vm.isMandatory()).toBe(false)
    })

    it('should ask for an unpublication once draft is chosen', () => {
      vm.set('status', ContentPageStatus.DRAFT)
      expect(vm.getStatusTransition()).toStrictEqual(ContentPageStatus.DRAFT)
    })

    it('should ask for a footer removal once none is chosen', () => {
      vm.set('footerSection', NO_FOOTER_SECTION)
      expect(vm.getFooterTransition()).toStrictEqual(NO_FOOTER_SECTION)
    })

    it('should not ask for a footer change while the section is unchanged', () => {
      expect(vm.getFooterTransition()).toBeUndefined()
    })

    it('should not mutate the store', () => {
      vm.set('html', '<p>Nouveau contenu</p>')
      expect(useContentPageStore().current!.html).toStrictEqual(
        pharmacieContentPage.html
      )
    })

    it('should count the characters of the meta description', () => {
      vm.set('metaDescription', 'abcde')
      expect(vm.getMetaDescriptionLength()).toStrictEqual('abcde'.length)
    })

    it('should allow saving when every field is filled', () => {
      expect(vm.getCanValidate()).toBe(true)
    })

    it('should forbid saving when the html is blank', () => {
      vm.set('html', '   ')
      expect(vm.getCanValidate()).toBe(false)
    })

    it('should forbid saving when the meta description is too long', () => {
      vm.set(
        'metaDescription',
        'a'.repeat(CONTENT_PAGE_MAX_META_DESCRIPTION_LENGTH + 1)
      )
      expect(vm.getCanValidate()).toBe(false)
    })

    it('should not report changes before any edition', () => {
      expect(vm.hasChanges).toBe(false)
    })

    it('should report changes once a field is edited', () => {
      vm.set('html', `${pharmacieContentPage.html}<p>Ajout</p>`)
      expect(vm.hasChanges).toBe(true)
    })

    it('should report changes once the footer section is changed', () => {
      vm.set('footerSection', FooterSection.LEGAL)
      expect(vm.hasChanges).toBe(true)
    })
  })

  describe('Editing a content page outside the footer', () => {
    it('should show no footer section', () => {
      useContentPageStore().setCurrent(deliveryContentPage)
      vm = contentPageFormVM(deliveryContentPage.slug)
      expect(vm.get('footerSection').value).toStrictEqual(NO_FOOTER_SECTION)
    })
  })

  describe('Editing a mandatory content page', () => {
    beforeEach(() => {
      useContentPageStore().setCurrent(cgvContentPage)
      vm = contentPageFormVM(cgvContentPage.slug)
    })

    it('should be mandatory', () => {
      expect(vm.isMandatory()).toBe(true)
    })

    it('should only offer the published status', () => {
      expect(vm.getStatusOptions()).toStrictEqual([ContentPageStatus.PUBLISHED])
    })

    it('should not offer to leave the footer', () => {
      expect(vm.getFooterSectionOptions()).toStrictEqual([
        FooterSection.PHARMACY,
        FooterSection.LEGAL
      ])
    })
  })
})

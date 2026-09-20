import {
  ContentPageFormVM,
  contentPageFormVM
} from '@adapters/primary/view-models/content-page/content-page-form/contentPageFormVM'
import { ContentPageSlug } from '@core/entities/contentPage'
import { useContentPageStore } from '@store/contentPageStore'
import { cgvContentPage } from '@utils/testData/contentPages'
import { createPinia, setActivePinia } from 'pinia'

describe('Content page form VM', () => {
  let vm: ContentPageFormVM

  beforeEach(() => {
    setActivePinia(createPinia())
    useContentPageStore().setCurrent(cgvContentPage)
    vm = contentPageFormVM(ContentPageSlug.CGV)
  })

  describe('Initialization', () => {
    it('should prefill the fields from the current content page', () => {
      expect(vm.getDto()).toStrictEqual({
        title: cgvContentPage.title,
        metaDescription: cgvContentPage.metaDescription,
        html: cgvContentPage.html
      })
    })

    it('should expose every field as editable', () => {
      expect(vm.get('title')).toStrictEqual({
        value: cgvContentPage.title,
        canEdit: true
      })
    })
  })

  describe('Editing a field', () => {
    it('should keep the new value', () => {
      vm.set('html', '<p>Nouveau contenu</p>')
      expect(vm.get('html').value).toStrictEqual('<p>Nouveau contenu</p>')
    })

    it('should not mutate the store', () => {
      vm.set('html', '<p>Nouveau contenu</p>')
      expect(useContentPageStore().current!.html).toStrictEqual(
        cgvContentPage.html
      )
    })
  })

  describe('Meta description length', () => {
    it('should count the current characters', () => {
      vm.set('metaDescription', 'abcde')
      expect(vm.getMetaDescriptionLength()).toStrictEqual(5)
    })
  })

  describe('Validation', () => {
    it('should allow saving when every field is filled', () => {
      expect(vm.getCanValidate()).toBe(true)
    })

    it('should forbid saving when the html is blank', () => {
      vm.set('html', '   ')
      expect(vm.getCanValidate()).toBe(false)
    })

    it('should forbid saving when the title is blank', () => {
      vm.set('title', '')
      expect(vm.getCanValidate()).toBe(false)
    })

    it('should forbid saving when the meta description is too long', () => {
      vm.set('metaDescription', 'a'.repeat(321))
      expect(vm.getCanValidate()).toBe(false)
    })
  })

  describe('Unsaved changes', () => {
    it('should not report changes before any edition', () => {
      expect(vm.hasChanges).toBe(false)
    })

    it('should report changes once a field is edited', () => {
      vm.set('html', `${cgvContentPage.html}<p>Ajout</p>`)
      expect(vm.hasChanges).toBe(true)
    })

    it('should not report changes when the edited value equals the initial one', () => {
      vm.set('title', cgvContentPage.title)
      expect(vm.hasChanges).toBe(false)
    })
  })
})

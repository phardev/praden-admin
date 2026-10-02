import { getContentPagesVM } from '@adapters/primary/view-models/content-page/get-content-pages/getContentPagesVM'
import { ContentPageStatus } from '@core/entities/contentPage'
import { useContentPageStore } from '@store/contentPageStore'
import {
  cgvContentPageListItem,
  deliveryContentPageListItem,
  pharmacieContentPageListItem
} from '@utils/testData/contentPages'
import { createPinia, setActivePinia } from 'pinia'

describe('Get content pages VM', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('There are a mandatory page, a regular page and a draft', () => {
    it('should return them formatted for display, in the order of the store', () => {
      useContentPageStore().list([
        pharmacieContentPageListItem,
        cgvContentPageListItem,
        deliveryContentPageListItem
      ])
      expect(getContentPagesVM()).toStrictEqual({
        isLoading: false,
        isDeleting: false,
        items: [
          {
            slug: 'pharmacie',
            name: 'Agnès Praden Alès',
            title: 'Pharmacie Agnès Praden Alès',
            status: ContentPageStatus.PUBLISHED,
            isMandatory: false,
            canDelete: true,
            updatedAt: '1 janv. 2025',
            authorKind: 'system',
            authorName: ''
          },
          {
            slug: 'cgv',
            name: 'CGV',
            title: 'Conditions Générales de Vente',
            status: ContentPageStatus.PUBLISHED,
            isMandatory: true,
            canDelete: false,
            updatedAt: '11 déc. 2024',
            authorKind: 'staff',
            authorName: 'Agnès Praden'
          },
          {
            slug: 'livraison',
            name: 'Livraison',
            title: 'Modes et délais de livraison',
            status: ContentPageStatus.DRAFT,
            isMandatory: false,
            canDelete: true,
            updatedAt: '1 janv. 2025',
            authorKind: 'staff',
            authorName: 'agnes@praden.fr'
          }
        ]
      })
    })
  })

  describe('The author is no longer a staff member', () => {
    it('should report an unknown author', () => {
      useContentPageStore().list([
        { ...cgvContentPageListItem, updatedBy: { kind: 'unknown' } }
      ])
      expect(getContentPagesVM().items[0].authorKind).toStrictEqual('unknown')
    })
  })

  describe('The store is empty', () => {
    it('should return an empty list', () => {
      expect(getContentPagesVM()).toStrictEqual({
        isLoading: false,
        isDeleting: false,
        items: []
      })
    })
  })

  describe('Pages are loading', () => {
    it('should expose the loading state', () => {
      useContentPageStore().startLoading()
      expect(getContentPagesVM().isLoading).toBe(true)
    })
  })

  describe('A page is being deleted', () => {
    it('should expose the deleting state', () => {
      useContentPageStore().startDeleting()
      expect(getContentPagesVM().isDeleting).toBe(true)
    })
  })
})

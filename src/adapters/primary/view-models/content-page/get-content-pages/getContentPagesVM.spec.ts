import { getContentPagesVM } from '@adapters/primary/view-models/content-page/get-content-pages/getContentPagesVM'
import { ContentPageSlug } from '@core/entities/contentPage'
import { useContentPageStore } from '@store/contentPageStore'
import {
  cgvContentPageListItem,
  pharmacieContentPageListItem
} from '@utils/testData/contentPages'
import { createPinia, setActivePinia } from 'pinia'

describe('Get content pages VM', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('The pages were edited by a staff member and by the system', () => {
    it('should return them formatted for display', () => {
      useContentPageStore().list([
        pharmacieContentPageListItem,
        cgvContentPageListItem
      ])
      expect(getContentPagesVM()).toStrictEqual({
        isLoading: false,
        items: [
          {
            slug: 'cgv',
            title: 'Conditions Générales de Vente',
            updatedAt: '11 déc. 2024',
            authorKind: 'staff',
            authorName: 'Agnès Praden'
          },
          {
            slug: 'pharmacie',
            title: 'Pharmacie Agnès Praden Alès',
            updatedAt: '1 janv. 2025',
            authorKind: 'system',
            authorName: ''
          }
        ]
      })
    })
  })

  describe('The staff member has no first name nor last name', () => {
    it('should fall back to the email', () => {
      useContentPageStore().list([
        {
          ...cgvContentPageListItem,
          updatedBy: { kind: 'staff', email: 'agnes@praden.fr' }
        }
      ])
      expect(getContentPagesVM().items[0].authorName).toStrictEqual(
        'agnes@praden.fr'
      )
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

  describe('The store holds the pages out of order', () => {
    it('should order them by slug', () => {
      useContentPageStore().list([
        pharmacieContentPageListItem,
        cgvContentPageListItem
      ])
      expect(getContentPagesVM().items.map((i) => i.slug)).toStrictEqual([
        ContentPageSlug.CGV,
        ContentPageSlug.PHARMACIE
      ])
    })
  })

  describe('The store is empty', () => {
    it('should return an empty list', () => {
      expect(getContentPagesVM()).toStrictEqual({
        isLoading: false,
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
})

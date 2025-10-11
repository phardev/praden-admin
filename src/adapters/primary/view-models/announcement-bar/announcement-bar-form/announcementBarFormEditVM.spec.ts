import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { announcementBarFormEditVM } from './announcementBarFormEditVM'
import { useAnnouncementBarStore } from '@store/announcementBarStore'
import {
  announcementBarNoDates,
  announcementBarWithBothDates
} from '@utils/testData/announcementBars'

describe('announcementBarFormEditVM', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('Given existing announcement bar, when initializing form, then populates fields from store', () => {
    const announcementBarStore = useAnnouncementBarStore()
    announcementBarStore.setCurrent(announcementBarWithBothDates)
    const vm = announcementBarFormEditVM('test-form')

    const result = vm.get('text')

    expect(result).toStrictEqual({
      value: "☀️ Soldes d'été : jusqu'à -50% sur une sélection de produits",
      canEdit: true
    })
  })

  it('Given announcement bar with dates, when getting DTO, then converts timestamps to ISO strings', () => {
    const announcementBarStore = useAnnouncementBarStore()
    announcementBarStore.setCurrent(announcementBarWithBothDates)
    const vm = announcementBarFormEditVM('test-form')

    const result = vm.getDto()

    expect(result).toStrictEqual({
      text: "☀️ Soldes d'été : jusqu'à -50% sur une sélection de produits",
      isActive: true,
      startDate: '2024-07-01T00:00:00.000Z',
      endDate: '2024-08-01T00:00:00.000Z'
    })
  })

  it('Given announcement bar without dates, when getting DTO, then returns undefined for date fields', () => {
    const announcementBarStore = useAnnouncementBarStore()
    announcementBarStore.setCurrent(announcementBarNoDates)
    const vm = announcementBarFormEditVM('test-form')

    const result = vm.getDto()

    expect(result).toStrictEqual({
      text: '🎄 Offre de Noël : -20% sur tous les compléments alimentaires',
      isActive: true,
      startDate: undefined,
      endDate: undefined
    })
  })
})

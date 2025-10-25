import { FakeDateProvider } from '@adapters/secondary/date-providers/FakeDateProvider'
import { useAnnouncementBarStore } from '@store/announcementBarStore'
import {
  announcementBar1,
  announcementBar4
} from '@utils/testData/announcementBars'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import { getAnnouncementBarsVM } from './getAnnouncementBarsVM'

describe('getAnnouncementBarsVM', () => {
  let dateProvider: FakeDateProvider

  beforeEach(() => {
    setActivePinia(createPinia())
    dateProvider = new FakeDateProvider()
  })

  it('Given no announcement bars, when getting announcement bars, then returns three empty groups', () => {
    const announcementBarStore = useAnnouncementBarStore()
    announcementBarStore.list([])
    dateProvider.feedWith(1735689600000)

    const result = getAnnouncementBarsVM(dateProvider)

    expect(result).toStrictEqual({
      'En cours': {
        items: []
      },
      Terminées: {
        items: []
      },
      Tous: {
        items: []
      }
    })
  })

  it('Given one announcement bar without dates, when getting announcement bars, then returns it in all tabs', () => {
    const announcementBarStore = useAnnouncementBarStore()
    announcementBarStore.list([announcementBar1])
    dateProvider.feedWith(1735689600000)

    const result = getAnnouncementBarsVM(dateProvider)

    expect(result).toStrictEqual({
      'En cours': {
        items: [
          {
            uuid: 'announcement-winter-promo-2024',
            text: '🎄 Offre de Noël : -20% sur tous les compléments alimentaires',
            isActive: true,
            startDate: '',
            startDatetime: new Date(''),
            endDate: '',
            endDatetime: new Date(''),
            isInProgress: true,
            isFuture: false
          }
        ]
      },
      Terminées: {
        items: []
      },
      Tous: {
        items: [
          {
            uuid: 'announcement-winter-promo-2024',
            text: '🎄 Offre de Noël : -20% sur tous les compléments alimentaires',
            isActive: true,
            startDate: '',
            startDatetime: new Date(''),
            endDate: '',
            endDatetime: new Date(''),
            isInProgress: true,
            isFuture: false
          }
        ]
      }
    })
  })

  it('Given announcement bar with end date in the past, when getting announcement bars, then returns it in Terminées and Tous tabs', () => {
    const announcementBarStore = useAnnouncementBarStore()
    announcementBarStore.list([announcementBar4])
    dateProvider.feedWith(1735689600000)

    const result = getAnnouncementBarsVM(dateProvider)

    expect(result).toStrictEqual({
      'En cours': {
        items: []
      },
      Terminées: {
        items: [
          {
            uuid: 'announcement-summer-sales-2024',
            text: "☀️ Soldes d'été : jusqu'à -50% sur une sélection de produits",
            isActive: true,
            startDate: '1 juil. 2024',
            startDatetime: new Date(1719792000000),
            endDate: '1 août 2024',
            endDatetime: new Date(1722470400000),
            isInProgress: false,
            isFuture: false
          }
        ]
      },
      Tous: {
        items: [
          {
            uuid: 'announcement-summer-sales-2024',
            text: "☀️ Soldes d'été : jusqu'à -50% sur une sélection de produits",
            isActive: true,
            startDate: '1 juil. 2024',
            startDatetime: new Date(1719792000000),
            endDate: '1 août 2024',
            endDatetime: new Date(1722470400000),
            isInProgress: false,
            isFuture: false
          }
        ]
      }
    })
  })
})

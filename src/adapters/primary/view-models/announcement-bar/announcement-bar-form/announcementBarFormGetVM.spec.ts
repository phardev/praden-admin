import { useAnnouncementBarStore } from '@store/announcementBarStore'
import { announcementBar4 } from '@utils/testData/announcementBars'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import { announcementBarFormGetVM } from './announcementBarFormGetVM'

describe('announcementBarFormGetVM', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('Given existing announcement bar, when getting field, then returns field with canEdit false', () => {
    const announcementBarStore = useAnnouncementBarStore()
    announcementBarStore.setCurrent(announcementBar4)
    const vm = announcementBarFormGetVM('test-form')

    const result = vm.get('text')

    expect(result).toStrictEqual({
      value: "☀️ Soldes d'été : jusqu'à -50% sur une sélection de produits",
      canEdit: false
    })
  })
})

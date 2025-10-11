import { createPinia, setActivePinia } from 'pinia'
import { useAnnouncementBarStore } from '@store/announcementBarStore'
import {
  announcementBar1,
  announcementBar4
} from '@utils/testData/announcementBars'
import { announcementBarFormVM } from './announcementBarFormVM'

describe('Announcement Bar Form VM', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should initialize form fields from store data', () => {
    const store = useAnnouncementBarStore()
    store.setAnnouncementBar(announcementBar4)

    const vm = announcementBarFormVM()

    expect(vm.get('text')).toStrictEqual({
      value: announcementBar4.text,
      canEdit: true
    })
  })

  it('should get isActive field with value and canEdit', () => {
    const store = useAnnouncementBarStore()
    store.setAnnouncementBar(announcementBar4)

    const vm = announcementBarFormVM()

    expect(vm.get('isActive')).toStrictEqual({
      value: announcementBar4.isActive,
      canEdit: true
    })
  })

  it('should get startDate as ISO string from timestamp', () => {
    const store = useAnnouncementBarStore()
    store.setAnnouncementBar(announcementBar4)

    const vm = announcementBarFormVM()

    expect(vm.get('startDate')).toStrictEqual({
      value: '2024-07-01T00:00',
      canEdit: true
    })
  })

  it('should get endDate as ISO string from timestamp', () => {
    const store = useAnnouncementBarStore()
    store.setAnnouncementBar(announcementBar4)

    const vm = announcementBarFormVM()

    expect(vm.get('endDate')).toStrictEqual({
      value: '2024-08-01T00:00',
      canEdit: true
    })
  })

  it('should handle empty startDate gracefully', () => {
    const store = useAnnouncementBarStore()
    store.setAnnouncementBar(announcementBar1)

    const vm = announcementBarFormVM()

    expect(vm.get('startDate')).toStrictEqual({
      value: '',
      canEdit: true
    })
  })

  it('should set text field value', () => {
    const store = useAnnouncementBarStore()
    store.setAnnouncementBar(announcementBar4)
    const vm = announcementBarFormVM()

    vm.set('text', 'New announcement text')

    expect(vm.get('text')).toStrictEqual({
      value: 'New announcement text',
      canEdit: true
    })
  })

  it('should set isActive field value', () => {
    const store = useAnnouncementBarStore()
    store.setAnnouncementBar(announcementBar4)
    const vm = announcementBarFormVM()

    vm.set('isActive', false)

    expect(vm.get('isActive')).toStrictEqual({
      value: false,
      canEdit: true
    })
  })

  it('should set startDate field value', () => {
    const store = useAnnouncementBarStore()
    store.setAnnouncementBar(announcementBar4)
    const vm = announcementBarFormVM()

    vm.set('startDate', '2024-12-25T10:30')

    expect(vm.get('startDate')).toStrictEqual({
      value: '2024-12-25T10:30',
      canEdit: true
    })
  })

  it('should set endDate field value', () => {
    const store = useAnnouncementBarStore()
    store.setAnnouncementBar(announcementBar4)
    const vm = announcementBarFormVM()

    vm.set('endDate', '2024-12-31T23:59')

    expect(vm.get('endDate')).toStrictEqual({
      value: '2024-12-31T23:59',
      canEdit: true
    })
  })

  it('should format display date in French locale', () => {
    const store = useAnnouncementBarStore()
    store.setAnnouncementBar(announcementBar4)
    const vm = announcementBarFormVM()

    const formatted = vm.formatDisplayDate('2024-01-15T10:00')

    expect(formatted).toBe('15 janvier 2024')
  })

  it('should return DTO with timestamps for submission', () => {
    const store = useAnnouncementBarStore()
    store.setAnnouncementBar(announcementBar4)
    const vm = announcementBarFormVM()

    const dto = vm.getDto()

    expect(dto).toStrictEqual({
      text: "☀️ Soldes d'été : jusqu'à -50% sur une sélection de produits",
      isActive: true,
      startDate: 1719792000000,
      endDate: 1722470400000
    })
  })

  it('should handle empty dates in DTO', () => {
    const store = useAnnouncementBarStore()
    store.setAnnouncementBar(announcementBar1)
    const vm = announcementBarFormVM()

    const dto = vm.getDto()

    expect(dto).toStrictEqual({
      text: '🎄 Offre de Noël : -20% sur tous les compléments alimentaires',
      isActive: true,
      startDate: undefined,
      endDate: undefined
    })
  })

  it('should reflect loading state from store', () => {
    const store = useAnnouncementBarStore()
    store.setAnnouncementBar(announcementBar1)
    store.startLoading()

    const vm = announcementBarFormVM()

    expect(vm.isLoading).toBe(true)
  })
})

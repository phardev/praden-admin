import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { announcementBarFormCreateVM } from './announcementBarFormCreateVM'

describe('announcementBarFormCreateVM', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('Given new form, when init, then stores form in formStore', () => {
    const vm = announcementBarFormCreateVM('test-form')

    const result = vm.getDto()

    expect(result).toStrictEqual({
      text: '',
      isActive: true
    })
  })

  it('Given form with all fields filled, when getting DTO, then returns complete DTO with ISO strings', async () => {
    const vm = announcementBarFormCreateVM('test-form')
    await vm.set('text', 'Test announcement')
    await vm.set('isActive', false)
    await vm.set('startDate', 1719792000000)
    await vm.set('endDate', 1722470400000)

    const result = vm.getDto()

    expect(result).toStrictEqual({
      text: 'Test announcement',
      isActive: false,
      startDate: '2024-07-01T00:00:00.000Z',
      endDate: '2024-08-01T00:00:00.000Z'
    })
  })

  it('Given form without dates, when getting DTO, then omits date fields', async () => {
    const vm = announcementBarFormCreateVM('test-form')
    await vm.set('text', 'Test announcement')
    await vm.set('isActive', true)

    const result = vm.getDto()

    expect(result).toStrictEqual({
      text: 'Test announcement',
      isActive: true
    })
  })

  it('Given form with previous values including dates, when creating new form with same key, then resets all fields', async () => {
    const firstVm = announcementBarFormCreateVM('test-form-reset')
    await firstVm.set('text', 'Previous announcement')
    await firstVm.set('isActive', false)
    await firstVm.set('startDate', 1719792000000)
    await firstVm.set('endDate', 1722470400000)

    const secondVm = announcementBarFormCreateVM('test-form-reset')

    const result = secondVm.getDto()

    expect(result).toStrictEqual({
      text: '',
      isActive: true
    })
  })
})

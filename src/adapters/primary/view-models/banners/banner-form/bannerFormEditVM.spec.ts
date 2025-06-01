import { useFormStore } from '@store/formStore'
import { createPinia, setActivePinia } from 'pinia'
import { Field } from '@adapters/primary/view-models/promotions/promotion-form/promotionFormCreateVM'
import { banner1, banner2, banner5 } from '@utils/testData/banners'
import { useBannerStore } from '@store/bannerStore'
import { Banner } from '@core/entities/banner'
import { BannerFormEditVM, bannerFormEditVM } from './bannerFormEditVM'
import { EditBannerDTO } from '@core/usecases/banners/banner-edition/editBanner'

describe('Banner form edit VM', () => {
  let formStore: any
  const key = 'edit-banner-form'
  let vm: BannerFormEditVM

  beforeEach(() => {
    setActivePinia(createPinia())
    formStore = useFormStore()
  })

  describe.each([
    { banner: banner1 },
    { banner: banner2 },
    { banner: banner5 }
  ])('Initial VM', ({ banner }) => {
    beforeEach(() => {
      givenCurrentBannerIs(banner)
      vm = getVM()
    })
    describe.each([
      { field: 'img', expected: banner.img },
      { field: 'order', expected: banner.order + 1 },
      { field: 'isActive', expected: banner.isActive },
      { field: 'href', expected: banner.href },
      { field: 'startDate', expected: banner.startDate },
      { field: 'endDate', expected: banner.endDate }
    ])('Initial field value', ({ field, expected }) => {
      it(`should have ${field} to be "${expected}"`, () => {
        const expectedField: Field<any> = {
          value: expected,
          canEdit: true
        }
        expect(vm.get(field)).toStrictEqual(expectedField)
      })
      it(`should save the ${field} value in form store`, () => {
        expect(formStore.get(key)[field]).toStrictEqual(expected)
      })
    })
  })

  describe('Update fields', () => {
    beforeEach(() => {
      givenCurrentBannerIs(banner1)
      vm = getVM()
    })
    describe.each([
      { field: 'order', value: '2', expected: '2' },
      { field: 'isActive', value: false, expected: false },
      {
        field: 'href',
        value: 'https://href.com',
        expected: 'https://href.com'
      },
      { field: 'startDate', value: 1690416000000, expected: 1690416000000 },
      { field: 'endDate', value: 1693094400000, expected: 1693094400000 }
    ])('Update simple fields', ({ field, value, expected }) => {
      it(`should update ${field} value in form store`, async () => {
        await vm.set(field, value)
        expect(formStore.get(key)[field]).toStrictEqual(expected)
      })
      it(`should update ${field} field`, async () => {
        await vm.set(field, value)
        const expectedField: Field<any> = {
          value: expected,
          canEdit: true
        }
        expect(vm.get(field)).toStrictEqual(expectedField)
      })
    })
    describe('Update image', () => {
      beforeEach(async () => {
        await vm.set('img', new File(['img'], 'IMG 1', { type: 'image/jpg' }))
      })
      describe('Img data', () => {
        const expectedValue = 'data:image/jpg;base64,aW1n'
        it('should update the img field', () => {
          expect(vm.get('img')).toStrictEqual({
            canEdit: true,
            value: expectedValue
          })
        })
        it('should update the img field in store', () => {
          expect(formStore.get(key)['img']).toStrictEqual(expectedValue)
        })
      })
    })
  })

  describe('DTO', () => {
    describe('For a simple dto', () => {
      it('should prepare the dto', async () => {
        givenCurrentBannerIs(banner1)
        const expectedDTO: EditBannerDTO = {
          img: new File(['img'], 'IMG 1', { type: 'image/jpg' }),
          order: banner1.order,
          href: 'https://an-href.com',
          isActive: banner1.isActive,
          startDate: banner1.startDate,
          endDate: banner1.endDate
        }
        vm = getVM()
        await vm.set('img', new File(['img'], 'IMG 1', { type: 'image/jpg' }))
        await vm.set('href', expectedDTO.href)
        expect(vm.getDto()).toStrictEqual(expectedDTO)
      })
    })
    describe('For a dto with all fields', () => {
      it('should prepare the dto', async () => {
        givenCurrentBannerIs(banner5)
        const expectedDTO: EditBannerDTO = {
          img: new File(['img'], 'IMG 1', { type: 'image/jpg' }),
          href: 'https://an-href.com',
          order: 1,
          isActive: false,
          startDate: 1234567890,
          endDate: 2345678901
        }
        vm = getVM()
        await vm.set('img', new File(['img'], 'IMG 1', { type: 'image/jpg' }))
        await vm.set('href', expectedDTO.href)
        await vm.set('order', '2')
        await vm.set('isActive', expectedDTO.isActive)
        await vm.set('startDate', expectedDTO.startDate)
        await vm.set('endDate', expectedDTO.endDate)
        expect(vm.getDto()).toStrictEqual(expectedDTO)
      })
    })
  })
  describe('Validation', () => {
    describe('Display validate', () => {
      it('should always display the validate button', () => {
        expect(vm.getDisplayValidate()).toBe(true)
      })
    })
    describe('Can validate', () => {
      it('should allow to validate', () => {
        expect(vm.getCanValidate()).toBe(true)
      })
    })
  })

  const givenCurrentBannerIs = (banner: Banner) => {
    const bannerStore = useBannerStore()
    bannerStore.current = banner
  }

  const getVM = (): BannerFormEditVM => {
    return bannerFormEditVM(key)
  }
})

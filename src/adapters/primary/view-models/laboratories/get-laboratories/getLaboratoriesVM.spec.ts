import { Header } from '../../preparations/get-orders-to-prepare/getPreparationsVM'
import { createPinia, setActivePinia } from 'pinia'
import { useLaboratoryStore } from '@store/laboratoryStore'
import { getLaboratoriesVM } from '@adapters/primary/view-models/laboratories/get-laboratories/getLaboratoriesVM'
import {
  avene,
  gilbert,
  laboratoryWithoutImage
} from '@utils/testData/laboratories'

describe('Get laboratories VM', () => {
  let laboratoryStore: any

  const expectedHeaders: Array<Header> = [
    {
      name: 'Miniature',
      value: 'miniature'
    },
    {
      name: 'Nom',
      value: 'name'
    }
  ]

  beforeEach(() => {
    setActivePinia(createPinia())
    laboratoryStore = useLaboratoryStore()
  })

  describe('There is no laboratory', () => {
    it('should list nothing', () => {
      const vm = getLaboratoriesVM()
      const expectedVM = {
        headers: expectedHeaders,
        items: [],
        isLoading: false
      }
      expect(vm).toStrictEqual(expectedVM)
    })
  })

  describe('There is some laboratories', () => {
    beforeEach(() => {
      laboratoryStore.items = [avene, gilbert]
    })
    it('should list nothing', () => {
      const vm = getLaboratoriesVM()
      const expectedVM = {
        headers: expectedHeaders,
        items: [
          {
            uuid: avene.uuid,
            miniature: avene.miniature,
            name: avene.name
          },
          {
            uuid: gilbert.uuid,
            miniature: gilbert.miniature,
            name: gilbert.name
          }
        ],
        isLoading: false
      }
      expect(vm).toStrictEqual(expectedVM)
    })
  })
  describe('There is some laboratories without miniature', () => {
    beforeEach(() => {
      laboratoryStore.items = [laboratoryWithoutImage]
    })
    it('should list nothing', () => {
      const vm = getLaboratoriesVM()
      const expectedVM = {
        headers: expectedHeaders,
        items: [
          {
            uuid: laboratoryWithoutImage.uuid,
            miniature: '',
            name: laboratoryWithoutImage.name
          }
        ],
        isLoading: false
      }
      expect(vm).toStrictEqual(expectedVM)
    })
  })
  describe('Loading', () => {
    it('should be aware during loading', () => {
      laboratoryStore.isLoading = true
      const vm = getLaboratoriesVM()
      expect(vm.isLoading).toBe(true)
    })
  })
})

import { Header } from '../../preparations/get-orders-to-prepare/getPreparationsVM'
import { createPinia, setActivePinia } from 'pinia'
import { useDeliveryStore } from '@store/deliveryStore'
import { getDeliveriesVM } from './getDeliveriesVM'
import {
  deliveryOrderDelivered2,
  deliveryOrderToPrepare1,
  deliveryOrderToPrepare3
} from '@utils/testData/deliveries'

describe('Get deliveries VM', () => {
  let deliveryStore: any

  const expectedHeaders: Array<Header> = [
    {
      name: 'Méthode',
      value: 'method'
    },
    {
      name: 'Client',
      value: 'client'
    },
    {
      name: 'Numéro de suivi',
      value: 'trackingNumber'
    },
    {
      name: 'Statut',
      value: 'status'
    }
  ]

  beforeEach(() => {
    setActivePinia(createPinia())
    deliveryStore = useDeliveryStore()
  })

  describe('There is no delivery', () => {
    it('should list nothing', () => {
      const vm = getDeliveriesVM()
      const expectedVM = {
        headers: expectedHeaders,
        items: [],
        isLoading: false
      }
      expect(vm).toStrictEqual(expectedVM)
    })
  })

  describe('There is some deliveries', () => {
    beforeEach(() => {
      deliveryStore.items = [
        deliveryOrderToPrepare1,
        deliveryOrderToPrepare3,
        deliveryOrderDelivered2
      ]
    })
    it('should list nothing', () => {
      const vm = getDeliveriesVM()
      const expectedVM = {
        headers: expectedHeaders,
        items: [
          {
            uuid: deliveryOrderToPrepare1.uuid,
            method: deliveryOrderToPrepare1.method.name,
            client: 'Jean Bon',
            trackingNumber: '',
            status: deliveryOrderToPrepare1.status
          },
          {
            uuid: deliveryOrderToPrepare3.uuid,
            method: deliveryOrderToPrepare3.method.name,
            client: "Jeanne D'arc",
            trackingNumber: deliveryOrderToPrepare3.trackingNumber,
            status: deliveryOrderToPrepare3.status
          },
          {
            uuid: deliveryOrderDelivered2.uuid,
            method: deliveryOrderDelivered2.method.name,
            client: "Jeanne D'arc",
            trackingNumber: '',
            status: deliveryOrderDelivered2.status
          }
        ],
        isLoading: false
      }
      expect(vm).toStrictEqual(expectedVM)
    })
  })
  describe('Loading', () => {
    it('should be aware during loading', () => {
      deliveryStore.isLoading = true
      const vm = getDeliveriesVM()
      expect(vm.isLoading).toBe(true)
    })
  })
})

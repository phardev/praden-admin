import { Header } from '../../preparations/get-orders-to-prepare/getPreparationsVM'
import { createPinia, setActivePinia } from 'pinia'
import { useDeliveryStore } from '@store/deliveryStore'
import { GetDeliveriesVM, getDeliveriesVM } from './getDeliveriesVM'
import {
  deliveryOrderDelivered2,
  deliveryOrderToPrepare1,
  deliveryOrderToPrepare3
} from '@utils/testData/deliveries'
import { useCarrierStore } from '@store/carrierStore'
import { colissimo, dpd, pharmacy } from '@utils/testData/carriers'

describe('Get deliveries VM', () => {
  let deliveryStore: any
  let carrierStore: any

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
      name: 'Poids (kg)',
      value: 'weight'
    },
    {
      name: 'Statut',
      value: 'status'
    }
  ]

  beforeEach(() => {
    setActivePinia(createPinia())
    deliveryStore = useDeliveryStore()
    carrierStore = useCarrierStore()
    carrierStore.items = [pharmacy, colissimo, dpd]
  })

  describe('There is no delivery', () => {
    it('should list nothing', () => {
      const vm = getDeliveriesVM()
      const expectedVM = {
        items: {
          Colissimo: {
            count: 0,
            table: {
              headers: expectedHeaders,
              items: []
            }
          },
          Dpd: {
            count: 0,
            table: {
              headers: expectedHeaders,
              items: []
            }
          }
        },
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
    it('should list them', () => {
      const vm = getDeliveriesVM()
      const expectedVM: GetDeliveriesVM = {
        items: {
          Colissimo: {
            count: 1,
            table: {
              headers: expectedHeaders,
              items: [
                {
                  uuid: deliveryOrderToPrepare3.uuid,
                  method: deliveryOrderToPrepare3.method.name,
                  client: "Jeanne D'arc",
                  trackingNumber: deliveryOrderToPrepare3.trackingNumber!,
                  weight: 1.5,
                  status: deliveryOrderToPrepare3.status
                }
              ]
            }
          },
          Dpd: {
            count: 1,
            table: {
              headers: expectedHeaders,
              items: [
                {
                  uuid: deliveryOrderDelivered2.uuid,
                  method: deliveryOrderDelivered2.method.name,
                  client: "Jeanne D'arc",
                  trackingNumber: '',
                  weight: 2.2,
                  status: deliveryOrderDelivered2.status
                }
              ]
            }
          }
        },
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

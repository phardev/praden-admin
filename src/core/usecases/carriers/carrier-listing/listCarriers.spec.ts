import { InMemoryCarrierGateway } from '@adapters/secondary/carrier-gateways/InMemoryCarrierGateway'
import { useCarrierStore } from '@store/carrierStore'
import { setActivePinia, createPinia } from 'pinia'
import { listCarriers } from './listCarriers'
import { colissimo, dpd, pharmacy } from '@utils/testData/carriers'

describe('Carrier listing', () => {
  let carrierStore: any
  let carrierGateway: InMemoryCarrierGateway

  beforeEach(() => {
    setActivePinia(createPinia())
    carrierStore = useCarrierStore()
    carrierGateway = new InMemoryCarrierGateway()
  })

  describe('There is no carrier', () => {
    it('should list nothing', async () => {
      await whenListCarriers()
      expect(carrierStore.items).toStrictEqual([])
    })
  })

  describe('There is some carriers', () => {
    it('should list them', async () => {
      carrierGateway.feedWith(pharmacy, colissimo, dpd)
      await whenListCarriers()
      expect(carrierStore.items).toStrictEqual([pharmacy, colissimo, dpd])
    })
  })

  describe('Loading', () => {
    it('should be aware during loading', async () => {
      const unsubscribe = carrierStore.$subscribe(
        (mutation: any, state: any) => {
          expect(state.isLoading).toBe(true)
          unsubscribe()
        }
      )
      carrierGateway.feedWith(pharmacy, colissimo, dpd)
      await whenListCarriers()
    })
    it('should be aware that loading is over', async () => {
      carrierGateway.feedWith(pharmacy, colissimo, dpd)
      await whenListCarriers()
      expect(carrierStore.isLoading).toBe(false)
    })
  })

  const whenListCarriers = async () => {
    await listCarriers(carrierGateway)
  }
})

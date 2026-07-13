import { InMemoryColissimoWidgetGateway } from '@adapters/secondary/colissimo-widget-gateways/InMemoryColissimoWidgetGateway'
import { useColissimoWidgetStore } from '@store/colissimoWidgetStore'
import { createPinia, setActivePinia } from 'pinia'
import { getColissimoWidgetToken } from './getColissimoWidgetToken'

describe('Colissimo widget token retrieval', () => {
  let colissimoWidgetStore: any
  let colissimoWidgetGateway: InMemoryColissimoWidgetGateway

  beforeEach(() => {
    setActivePinia(createPinia())
    colissimoWidgetStore = useColissimoWidgetStore()
    colissimoWidgetGateway = new InMemoryColissimoWidgetGateway()
  })

  describe('The token is available', () => {
    it('should store the token', async () => {
      colissimoWidgetGateway.feedWith('colissimo-widget-token')
      await whenGetColissimoWidgetToken()
      expect(colissimoWidgetStore.token).toStrictEqual('colissimo-widget-token')
    })
  })

  describe('Loading', () => {
    it('should be aware during loading', async () => {
      const unsubscribe = colissimoWidgetStore.$subscribe(
        (mutation: any, state: any) => {
          expect(state.isLoading).toBe(true)
          unsubscribe()
        }
      )
      await whenGetColissimoWidgetToken()
    })
    it('should be aware that loading is over', async () => {
      await whenGetColissimoWidgetToken()
      expect(colissimoWidgetStore.isLoading).toBe(false)
    })
  })

  const whenGetColissimoWidgetToken = async () => {
    await getColissimoWidgetToken(colissimoWidgetGateway)
  }
})

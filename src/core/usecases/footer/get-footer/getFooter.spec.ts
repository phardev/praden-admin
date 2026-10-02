import { InMemoryFooterGateway } from '@adapters/secondary/footer-gateways/inMemoryFooterGateway'
import { getFooter } from '@core/usecases/footer/get-footer/getFooter'
import { useFooterStore } from '@store/footerStore'
import { footer } from '@utils/testData/footer'
import { createPinia, setActivePinia } from 'pinia'

describe('Footer get', () => {
  let footerGateway: InMemoryFooterGateway
  let footerStore: any

  beforeEach(async () => {
    setActivePinia(createPinia())
    footerGateway = new InMemoryFooterGateway()
    footerGateway.feedWith(footer)
    footerStore = useFooterStore()
    await getFooter(footerGateway)
  })

  it('should store the footer', () => {
    expect(footerStore.footer).toStrictEqual(footer)
  })

  it('should stop loading once done', () => {
    expect(footerStore.isLoading).toBe(false)
  })
})

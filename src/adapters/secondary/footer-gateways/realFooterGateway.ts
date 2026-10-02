import { axiosWithBearer } from '@adapters/primary/nuxt/utils/axios'
import { RealGateway } from '@adapters/secondary/order-gateways/RealOrderGateway'
import { Footer, FooterSection } from '@core/entities/footer'
import { FooterGateway } from '@core/gateways/footerGateway'
import { UUID } from '@core/types/types'

export class RealFooterGateway extends RealGateway implements FooterGateway {
  constructor(url: string) {
    super(url)
  }

  async get(): Promise<Footer> {
    const res = await axiosWithBearer.get(`${this.baseUrl}/footer`)
    return res.data.item
  }

  async reorderSection(
    section: FooterSection,
    uuids: Array<UUID>
  ): Promise<void> {
    await axiosWithBearer.post(`${this.baseUrl}/footer/reorder`, {
      section,
      uuids
    })
  }
}

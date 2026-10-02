import { Footer, FooterSection } from '@core/entities/footer'
import { UUID } from '@core/types/types'

export interface FooterGateway {
  get(): Promise<Footer>
  reorderSection(section: FooterSection, uuids: Array<UUID>): Promise<void>
}

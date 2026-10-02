import { Footer, FooterSection } from '@core/entities/footer'
import { FooterGateway } from '@core/gateways/footerGateway'
import { UUID } from '@core/types/types'

export class InMemoryFooterGateway implements FooterGateway {
  private footer: Footer = { sections: [] }

  async get(): Promise<Footer> {
    return Promise.resolve(JSON.parse(JSON.stringify(this.footer)))
  }

  async reorderSection(
    section: FooterSection,
    uuids: Array<UUID>
  ): Promise<void> {
    this.footer = {
      sections: this.footer.sections.map((current) =>
        current.section === section
          ? {
              ...current,
              entries: [...current.entries].sort(
                (a, b) => uuids.indexOf(a.uuid) - uuids.indexOf(b.uuid)
              )
            }
          : current
      )
    }
  }

  feedWith(footer: Footer) {
    this.footer = JSON.parse(JSON.stringify(footer))
  }
}

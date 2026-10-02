import { FooterSection } from '@core/entities/footer'
import type { FooterGateway } from '@core/gateways/footerGateway'
import { UUID } from '@core/types/types'
import { useFooterStore } from '@store/footerStore'

export const reorderFooterSection = async (
  section: FooterSection,
  uuids: Array<UUID>,
  footerGateway: FooterGateway
) => {
  const footerStore = useFooterStore()
  footerStore.startSaving()
  try {
    await footerGateway.reorderSection(section, uuids)
    footerStore.reorderSection(section, uuids)
  } finally {
    footerStore.stopSaving()
  }
}

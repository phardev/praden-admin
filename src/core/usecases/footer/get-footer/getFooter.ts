import type { FooterGateway } from '@core/gateways/footerGateway'
import { useFooterStore } from '@store/footerStore'

export const getFooter = async (footerGateway: FooterGateway) => {
  const footerStore = useFooterStore()
  footerStore.startLoading()
  try {
    const footer = await footerGateway.get()
    footerStore.set(footer)
  } finally {
    footerStore.stopLoading()
  }
}

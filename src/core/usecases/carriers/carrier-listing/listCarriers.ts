import { CarrierGateway } from '@core/gateways/carrierGateway'
import { useCarrierStore } from '@store/carrierStore'

export const listCarriers = async (carrierGateway: CarrierGateway) => {
  const carrierStore = useCarrierStore()
  try {
    carrierStore.startLoading()
    const carriers = await carrierGateway.list()
    carrierStore.list(carriers)
  } finally {
    carrierStore.stopLoading()
  }
}

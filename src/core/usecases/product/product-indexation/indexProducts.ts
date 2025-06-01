import { SearchGateway } from '@core/gateways/searchGateway'
import { useIndexStore } from '@store/indexStore'

export const indexProducts = async (
  limit: number,
  offset: number,
  searchGateway: SearchGateway
) => {
  const res = await searchGateway.indexProducts(limit, offset)
  const indexStore = useIndexStore()
  indexStore.addIndexedProducts(res)
}

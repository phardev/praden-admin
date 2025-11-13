import { PromotionGateway } from '@core/gateways/promotionGateway'
import { UUID } from '@core/types/types'
import { usePromotionStore } from '@store/promotionStore'

export const getPromotionStats = async (
  uuid: UUID,
  promotionGateway: PromotionGateway
): Promise<void> => {
  const promotionStore = usePromotionStore()
  promotionStore.startLoading()
  const stats = await promotionGateway.getStats(uuid)
  promotionStore.setStats(stats)
  promotionStore.stopLoading()
}

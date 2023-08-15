import { usePromotionStore } from '@store/promotionStore'
import { CreatePromotionVM } from '../create-promotion/createPromotionVM'
import { NoPromotionSelectedError } from '@adapters/primary/view-models/promotions/edit-promotion/editPromotionVM.spec'

export class EditPromotionVM extends CreatePromotionVM {
  constructor(key: string) {
    super(key)
    const promotionStore = usePromotionStore()
    let promotion = promotionStore.current
    if (promotion) {
      promotion = JSON.parse(JSON.stringify(promotion))
    }
    if (!promotion) throw new NoPromotionSelectedError()
    this.formStore.set(this.key, {
      name: JSON.parse(JSON.stringify(promotion.name)),
      type: JSON.parse(JSON.stringify(promotion.type)),
      products: promotion.products,
      startDate: promotion.startDate,
      endDate: promotion.endDate,
      amount: promotion.amount.toString()
    })
  }
}

export const editPromotionVM = (key: string) => {
  return new EditPromotionVM(key)
}

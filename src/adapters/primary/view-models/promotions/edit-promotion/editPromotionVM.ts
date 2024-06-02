import { PromotionFormCreateVM } from '../promotion-form/promotionFormCreateVM'

export class EditPromotionVM extends PromotionFormCreateVM {
  constructor(key: string) {
    super(key)
  }
}

export const editPromotionVM = (key: string) => {
  return new EditPromotionVM(key)
}

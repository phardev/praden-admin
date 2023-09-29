import { CreatePromotionVM } from '../create-promotion/createPromotionVM'

export class EditPromotionVM extends CreatePromotionVM {
  constructor(key: string) {
    super(key)
  }
}

export const editPromotionVM = (key: string) => {
  return new EditPromotionVM(key)
}

import { usePromotionStore } from '@store/promotionStore'
import { useFormStore } from '@store/formStore'
import { ReductionType } from '@core/entities/promotion'
import {
  Field,
  PromotionProductItemVM,
  TypeChoiceVM
} from '@adapters/primary/view-models/promotions/create-promotion/createPromotionVM'
import { Timestamp } from '@core/types/types'
import { useProductStore } from '@store/productStore'
import { Product } from '@core/entities/product'
import { Header } from '@adapters/primary/view-models/preparations/get-orders-to-prepare/getPreparationsVM'

export class GetPromotionVM {
  protected readonly key: string
  protected formStore: any

  constructor(key: string) {
    this.key = key
    this.formStore = useFormStore()
    const promotionStore = usePromotionStore()
    let promotion = promotionStore.current
    if (promotion) {
      promotion = JSON.parse(JSON.stringify(promotion))
    }
    this.formStore.set(this.key, {
      name: promotion ? promotion.name : '',
      type: promotion ? promotion.type : ReductionType.Fixed,
      products: promotion ? promotion.products : [],
      startDate: promotion ? promotion.startDate : undefined,
      endDate: promotion ? promotion.endDate : undefined,
      amount: promotion ? promotion.amount.toString() : undefined
    })
  }
  get availableTypeChoices(): Array<TypeChoiceVM> {
    return Object.values(ReductionType).map((type) => {
      const text = this.getTypeText(type)
      return {
        type,
        text
      }
    })
  }
  private getTypeText(type: ReductionType): string {
    if (type === ReductionType.Percentage) {
      return 'Pourcentage'
    }
    return 'Euros'
  }

  get type(): Field<ReductionType> {
    return {
      value: this.formStore.get(this.key).type,
      canEdit: false
    }
  }

  get name(): Field<string> {
    return {
      value: this.formStore.get(this.key).name,
      canEdit: false
    }
  }

  get amount(): Field<string | undefined> {
    return {
      value: this.formStore.get(this.key).amount,
      canEdit: false
    }
  }

  get startDate(): Field<Timestamp | undefined> {
    return {
      value: this.formStore.get(this.key).startDate,
      canEdit: false
    }
  }

  get endDate(): Field<Timestamp | undefined> {
    return {
      value: this.formStore.get(this.key).endDate,
      canEdit: false
    }
  }

  get productsHeaders(): Array<Header> {
    return [
      {
        name: 'Nom',
        value: 'name'
      },
      {
        name: 'Référence',
        value: 'reference'
      },
      {
        name: 'Catégorie',
        value: 'category'
      },
      {
        name: 'Laboratoire',
        value: 'laboratory'
      }
    ]
  }

  get availableProducts(): Field<Array<PromotionProductItemVM>> {
    return {
      value: [],
      canEdit: false
    }
  }

  get products(): Field<Array<PromotionProductItemVM>> {
    const addedProducts = this.formStore.get(this.key).products
    const productStore = useProductStore()
    const allProducts: Array<Product> = productStore.items
    const value = addedProducts.map((cip13: string) => {
      const p: Product = allProducts.find((p) => p.cip13 === cip13)
      return {
        name: p.name,
        reference: p.cip13,
        category: '',
        laboratory: p.laboratory
      }
    })
    return {
      value,
      canEdit: false
    }
  }

  get canValidate(): boolean {
    return false
  }

  get displayValidate(): boolean {
    return false
  }
}

export const getPromotionVM = (key: string) => {
  return new GetPromotionVM(key)
}

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
import { Category } from '@core/entities/category'
import { useCategoryStore } from '@store/categoryStore'

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
      amount: promotion ? promotion.amount : undefined
    })
  }
  getAvailableTypeChoices(): Array<TypeChoiceVM> {
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

  getType(): Field<ReductionType> {
    return {
      value: this.formStore.get(this.key).type,
      canEdit: false
    }
  }

  getName(): Field<string> {
    return {
      value: this.formStore.get(this.key).name,
      canEdit: false
    }
  }

  getAmount(): Field<number | undefined> {
    return {
      value: this.formStore.get(this.key).amount.toString(),
      canEdit: false
    }
  }

  getStartDate(): Field<Timestamp | undefined> {
    return {
      value: this.formStore.get(this.key).startDate,
      canEdit: false
    }
  }

  getEndDate(): Field<Timestamp | undefined> {
    return {
      value: this.formStore.get(this.key).endDate,
      canEdit: false
    }
  }

  getProductsHeaders(): Array<Header> {
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

  getAvailableProducts(): Field<Array<PromotionProductItemVM>> {
    return {
      value: [],
      canEdit: false
    }
  }

  getProducts(): Field<Array<PromotionProductItemVM>> {
    const addedProducts = this.formStore.get(this.key).products
    const productStore = useProductStore()
    const allProducts: Array<Product> = productStore.items
    const categoryStore = useCategoryStore()
    const categories: Array<Category> = categoryStore.items
    const value = addedProducts.map((cip13: string) => {
      const p: Product = allProducts.find((p) => p.cip13 === cip13)
      const c: Category = categories.find((c) => c.uuid === p.categoryUuid)
      return {
        name: p.name,
        reference: p.cip13,
        category: c.name,
        laboratory: p.laboratory
      }
    })
    return {
      value,
      canEdit: false
    }
  }

  getCanValidate(): boolean {
    return false
  }

  getDisplayValidate(): boolean {
    return false
  }
}

export const getPromotionVM = (key: string) => {
  return new GetPromotionVM(key)
}

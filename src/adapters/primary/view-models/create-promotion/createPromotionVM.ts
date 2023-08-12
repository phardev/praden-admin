import { ReductionType } from '@core/usecases/promotions/promotions-listing/promotion'
import { Product } from '@core/entities/product'
import { Timestamp } from '@core/types/types'
import { useProductStore } from '@store/productStore'
import { Header } from '@adapters/primary/view-models/get-orders-to-prepare/getPreparationsVM'
import { useSearchStore } from '@store/searchStore'
import { useFormStore } from '@store/formStore'

export interface TypeChoiceVM {
  type: ReductionType
  text: string
}

export interface PromotionProductItemVM {
  name: string
  reference: string
  category: string
  laboratory: string
}

export interface Field<T> {
  value: T
  canEdit: boolean
}

export class CreatePromotionVM {
  private readonly key: string
  private formStore: any
  constructor(key: string) {
    this.key = key
    this.formStore = useFormStore()
    this.formStore.set(this.key, {
      name: '',
      type: ReductionType.Fixed,
      products: []
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
      canEdit: true
    }
  }

  setType(type: ReductionType): void {
    this.formStore.set(this.key, { type, amount: undefined })
  }

  get name(): Field<string> {
    return {
      value: this.formStore.get(this.key).name,
      canEdit: true
    }
  }
  setName(name: string): void {
    this.formStore.set(this.key, { name })
  }

  get amount(): Field<string | undefined> {
    return {
      value: this.formStore.get(this.key).amount,
      canEdit: true
    }
  }
  setAmount(amount: number | undefined): void {
    this.formStore.set(this.key, { amount })
  }

  get startDate(): Field<Timestamp | undefined> {
    return {
      value: this.formStore.get(this.key).startDate,
      canEdit: true
    }
  }
  setStartDate(startDate: Timestamp): void {
    this.formStore.set(this.key, { startDate })
  }
  get endDate(): Field<Timestamp | undefined> {
    return {
      value: this.formStore.get(this.key).endDate,
      canEdit: true
    }
  }
  setEndDate(endDate: Timestamp): void {
    this.formStore.set(this.key, { endDate })
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
  get availableProducts() {
    const productStore = useProductStore()
    const allProducts: Array<Product> = productStore.items
    const searchStore = useSearchStore()
    const filteredProducts: Array<Product> = searchStore.get(this.key)
    const addedProducts = this.formStore.get(this.key).products
    const res = (filteredProducts || allProducts).filter(
      (p) => !addedProducts.includes(p.cip13)
    )
    return res.map((p: Product) => {
      return {
        name: p.name,
        reference: p.cip13,
        category: '',
        laboratory: p.laboratory
      }
    })
  }

  get products(): Array<PromotionProductItemVM> {
    const addedProducts = this.formStore.get(this.key).products
    const productStore = useProductStore()
    const allProducts: Array<Product> = productStore.items
    return addedProducts.map((cip13: string) => {
      const p: Product = allProducts.find((p) => p.cip13 === cip13)
      return {
        name: p.name,
        reference: p.cip13,
        category: '',
        laboratory: p.laboratory
      }
    })
  }

  addProducts(cip13: Array<string>) {
    const products = this.formStore.get(this.key).products
    products.push(...cip13)
    this.formStore.set(this.key, { products })
  }

  removeProducts(cip13: Array<string>) {
    let products = this.formStore.get(this.key).products
    products = products.filter((p: string) => !cip13.includes(p))
    this.formStore.set(this.key, { products })
  }

  get canValidate(): boolean {
    if (!this.formStore.get(this.key).name.length) return false
    if (!this.formStore.get(this.key).amount) return false
    if (!this.formStore.get(this.key).products.length) return false
    return true
  }
}

export const createPromotionVM = (key: string) => {
  return new CreatePromotionVM(key)
}

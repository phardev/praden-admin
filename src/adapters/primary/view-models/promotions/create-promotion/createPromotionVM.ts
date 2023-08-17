import { CreatePromotionDTO, ReductionType } from '@core/entities/promotion'
import { Product } from '@core/entities/product'
import { Timestamp } from '@core/types/types'
import { useProductStore } from '@store/productStore'
import { useSearchStore } from '@store/searchStore'
import { useFormStore } from '@store/formStore'
import { GetPromotionVM } from '@adapters/primary/view-models/promotions/get-promotion/getPromotionVM'

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

export class CreatePromotionVM extends GetPromotionVM {
  protected readonly key: string
  protected formStore: any
  constructor(key: string) {
    super(key)
    this.key = key
    this.formStore = useFormStore()
  }

  get type(): Field<ReductionType> {
    return {
      ...super.type,
      canEdit: true
    }
  }

  setType(type: ReductionType): void {
    this.formStore.set(this.key, { type, amount: undefined })
  }

  get name(): Field<string> {
    return {
      ...super.name,
      canEdit: true
    }
  }
  setName(name: string): void {
    this.formStore.set(this.key, { name })
  }

  get amount(): Field<string | undefined> {
    return {
      ...super.amount,
      canEdit: true
    }
  }
  setAmount(amount: string | undefined): void {
    this.formStore.set(this.key, { amount })
  }

  get startDate(): Field<Timestamp | undefined> {
    return {
      ...super.startDate,
      canEdit: true
    }
  }
  setStartDate(startDate: Timestamp): void {
    this.formStore.set(this.key, { startDate })
  }
  get endDate(): Field<Timestamp | undefined> {
    return {
      ...super.endDate,
      canEdit: true
    }
  }
  setEndDate(endDate: Timestamp): void {
    this.formStore.set(this.key, { endDate })
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
    return {
      value: res.map((p: Product) => {
        return {
          name: p.name,
          reference: p.cip13,
          category: '',
          laboratory: p.laboratory
        }
      }),
      canEdit: true
    }
  }

  get products(): Field<Array<PromotionProductItemVM>> {
    return {
      ...super.products,
      canEdit: true
    }
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

  get dto(): CreatePromotionDTO {
    const formValue = this.formStore.get(this.key)
    let amount = parseFloat(formValue.amount.replace(',', '.'))
    const type = formValue.type
    if (formValue.type === ReductionType.Fixed) {
      amount *= 100
    }
    const res: CreatePromotionDTO = {
      name: formValue.name,
      products: formValue.products,
      type,
      amount
    }
    if (formValue.startDate) {
      res.startDate = formValue.startDate
    }
    if (formValue.endDate) {
      res.endDate = formValue.endDate
    }
    return res
  }

  get displayValidate(): boolean {
    return true
  }
}

export const createPromotionVM = (key: string) => {
  return new CreatePromotionVM(key)
}

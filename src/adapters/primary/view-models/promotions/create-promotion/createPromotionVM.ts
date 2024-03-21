import { CreatePromotionDTO, ReductionType } from '@core/entities/promotion'
import { Product } from '@core/entities/product'
import { Timestamp } from '@core/types/types'
import { useProductStore } from '@store/productStore'
import { useSearchStore } from '@store/searchStore'
import { useFormStore } from '@store/formStore'
import { GetPromotionVM } from '@adapters/primary/view-models/promotions/get-promotion/getPromotionVM'
import { useCategoryStore } from '@store/categoryStore'
import { Category } from '@core/entities/category'

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

  getType(): Field<ReductionType> {
    return {
      ...super.getType(),
      canEdit: true
    }
  }

  setType(type: ReductionType): void {
    this.formStore.set(this.key, { type, amount: undefined })
  }

  getName(): Field<string> {
    return {
      ...super.getName(),
      canEdit: true
    }
  }
  setName(name: string): void {
    this.formStore.set(this.key, { name })
  }

  getAmount(): Field<number | undefined> {
    return {
      ...super.getAmount(),
      canEdit: true
    }
  }
  setAmount(amount: number | undefined): void {
    this.formStore.set(this.key, { amount })
  }

  getStartDate(): Field<Timestamp | undefined> {
    return {
      ...super.getStartDate(),
      canEdit: true
    }
  }
  setStartDate(startDate: Timestamp): void {
    this.formStore.set(this.key, { startDate })
  }
  getEndDate(): Field<Timestamp | undefined> {
    return {
      ...super.getEndDate(),
      canEdit: true
    }
  }
  setEndDate(endDate: Timestamp): void {
    this.formStore.set(this.key, { endDate })
  }

  getAvailableProducts() {
    const productStore = useProductStore()
    const allProducts: Array<Product> = productStore.items
    const searchStore = useSearchStore()
    const filteredProducts: Array<Product> = searchStore.get(this.key)
    const addedProducts = this.formStore.get(this.key).products
    const res = (filteredProducts || allProducts).filter(
      (p) => !addedProducts.includes(p.cip13)
    )
    const categoryStore = useCategoryStore()
    const categories: Array<Category> = categoryStore.items
    return {
      value: res.map((p: Product) => {
        const c: Category = categories.find((c) => c.uuid === p.categoryUuid)
        return {
          name: p.name,
          reference: p.cip13,
          category: c.name,
          laboratory: p.laboratory
        }
      }),
      canEdit: true
    }
  }

  getProducts(): Field<Array<PromotionProductItemVM>> {
    return {
      ...super.getProducts(),
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

  getCanValidate(): boolean {
    if (!this.formStore.get(this.key).name.length) return false
    if (!this.formStore.get(this.key).amount) return false
    if (!this.formStore.get(this.key).products.length) return false
    return true
  }

  getDto(): CreatePromotionDTO {
    const formValue = this.formStore.get(this.key)
    console.log('formValue: ', formValue)
    let amount = formValue.amount
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

  getDisplayValidate(): boolean {
    return true
  }
}

export const createPromotionVM = (key: string) => {
  return new CreatePromotionVM(key)
}

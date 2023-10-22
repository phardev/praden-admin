import { useFormStore } from '@store/formStore'
import { Category } from '@core/entities/category'
import { useCategoryStore } from '@store/categoryStore'
import { Field } from '@adapters/primary/view-models/promotions/create-promotion/createPromotionVM'
import { UUID } from '@core/types/types'

export type CreateProductCategoriesVM = Array<Pick<Category, 'uuid' | 'name'>>

export class CreateProductVM {
  protected readonly key: string
  protected formStore: any
  protected categoryStore: any

  constructor(key: string) {
    this.key = key
    this.formStore = useFormStore()
    this.categoryStore = useCategoryStore()
    this.formStore.set(this.key, {
      name: '',
      categoryUuid: undefined,
      cip13: '',
      priceWithoutTax: undefined,
      percentTaxRate: undefined,
      laboratory: '',
      location: ''
    })
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

  get categoryUuid(): Field<UUID | undefined> {
    return {
      value: this.formStore.get(this.key).categoryUuid,
      canEdit: true
    }
  }
  setCategoryUuid(categoryUuid: UUID | undefined): void {
    this.formStore.set(this.key, { categoryUuid })
  }

  get availableCategories(): CreateProductCategoriesVM {
    const categories = this.categoryStore.items
    return categories.map((c: Category) => {
      return {
        uuid: c.uuid,
        name: c.name
      }
    })
  }

  get cip13(): Field<string> {
    return {
      value: this.formStore.get(this.key).cip13,
      canEdit: true
    }
  }
  setCip13(cip13: string): void {
    this.formStore.set(this.key, { cip13 })
  }

  get priceWithoutTax(): Field<string | undefined> {
    return {
      value: this.formStore.get(this.key).priceWithoutTax,
      canEdit: true
    }
  }
  setPriceWithoutTax(priceWithoutTax: string | undefined): void {
    this.formStore.set(this.key, { priceWithoutTax })
  }

  get percentTaxRate(): Field<string | undefined> {
    return {
      value: this.formStore.get(this.key).percentTaxRate,
      canEdit: true
    }
  }
  setPercentTaxRate(percentTaxRate: string | undefined): void {
    this.formStore.set(this.key, { percentTaxRate })
  }

  get laboratory(): Field<string | undefined> {
    return {
      value: this.formStore.get(this.key).laboratory,
      canEdit: true
    }
  }
  setLaboratory(laboratory: string): void {
    this.formStore.set(this.key, { laboratory })
  }

  get location(): Field<string | undefined> {
    return {
      value: this.formStore.get(this.key).location,
      canEdit: true
    }
  }
  setLocation(location: string): void {
    this.formStore.set(this.key, { location })
  }
}

export const createProductVM = (key: string) => {
  return new CreateProductVM(key)
}

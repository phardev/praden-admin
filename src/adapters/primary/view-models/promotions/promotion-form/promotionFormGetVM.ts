import { usePromotionStore } from '@store/promotionStore'
import { useFormStore } from '@store/formStore'
import { ReductionType } from '@core/entities/promotion'
import {
  Field,
  PromotionProductItemVM,
  TypeChoiceVM
} from '@adapters/primary/view-models/promotions/promotion-form/promotionFormCreateVM'
import { useProductStore } from '@store/productStore'
import { Product } from '@core/entities/product'
import { Header } from '@adapters/primary/view-models/preparations/get-orders-to-prepare/getPreparationsVM'
import { Category } from '@core/entities/category'
import { useCategoryStore } from '@store/categoryStore'
import {
  FormFieldsReader,
  FormInitializer
} from '@adapters/primary/view-models/products/product-form/productFormGetVM'
import { PromotionFormVM } from '@adapters/primary/view-models/promotions/promotion-form/promotionFormVM'

export class ExistingPromotionFormInitializer implements FormInitializer {
  protected readonly key: string
  protected formStore: any
  protected promotionStore: any

  constructor(key: string) {
    this.key = key
    this.formStore = useFormStore()
    this.promotionStore = usePromotionStore()
  }

  init() {
    let promotion = this.promotionStore.current
    if (promotion) {
      promotion = JSON.parse(JSON.stringify(promotion))
    }
    this.formStore.set(this.key, {
      name: promotion ? promotion.name : '',
      type: promotion ? promotion.type : ReductionType.Fixed,
      products: promotion ? promotion.products : [],
      startDate: promotion ? promotion.startDate : undefined,
      endDate: promotion ? promotion.endDate : undefined,
      amount: promotion
        ? promotion.type === ReductionType.Fixed
          ? (promotion.amount / 100).toString()
          : promotion.amount.toString()
        : undefined
    })
  }
}

export class PromotionFormFieldsReader extends FormFieldsReader {
  constructor(key: string) {
    super(key)
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
}

export class PromotionFormGetVM extends PromotionFormVM {
  protected readonly key: string
  protected formStore: any

  constructor(
    initializer: ExistingPromotionFormInitializer,
    fieldReader: PromotionFormFieldsReader
  ) {
    super(fieldReader)
    initializer.init()
  }

  get(fieldName: string): any {
    return this.createField(fieldName)
  }

  private createField<T>(fieldName: string): Field<T> {
    return {
      value: this.fieldsReader.get(fieldName),
      canEdit: false
    }
  }

  getAvailableTypeChoices(): Array<TypeChoiceVM> {
    return this.fieldsReader.getAvailableTypeChoices()
  }

  getAvailableProducts(): Field<Array<PromotionProductItemVM>> {
    return {
      value: [],
      canEdit: false
    }
  }

  getProducts(): Field<Array<PromotionProductItemVM>> {
    const addedProducts = this.fieldsReader.get('products')
    const productStore = useProductStore()
    const allProducts: Array<Product> = productStore.items
    const categoryStore = useCategoryStore()
    const categories: Array<Category> = categoryStore.items
    const value = addedProducts.map((uuid: string) => {
      const p: Product = allProducts.find((p) => p.uuid === uuid)
      const c: Category = categories.find((c) => c.uuid === p.categoryUuid)
      return {
        uuid: p.uuid,
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

export const promotionFormGetVM = (key: string): PromotionFormGetVM => {
  const initializer = new ExistingPromotionFormInitializer(key)
  const reader = new PromotionFormFieldsReader(key)
  return new PromotionFormGetVM(initializer, reader)
}

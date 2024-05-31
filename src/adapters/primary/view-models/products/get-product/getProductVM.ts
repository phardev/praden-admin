import { useFormStore } from '@store/formStore'
import type { Field } from '@adapters/primary/view-models/promotions/create-promotion/createPromotionVM'
import type { UUID } from '@core/types/types'
import type { Category } from '@core/entities/category'
import { CreateProductCategoriesVM } from '@adapters/primary/view-models/products/create-product/createProductVM'
import { useProductStore } from '@store/productStore'
import { useCategoryStore } from '@store/categoryStore'
import { addTaxToPrice } from '@utils/price'

export class GetProductVM {
  protected readonly key: string
  protected formStore: any
  protected productStore: any
  protected categoryStore: any
  protected images: Array<string> = []

  constructor(key: string) {
    this.key = key
    this.formStore = useFormStore()
    this.productStore = useProductStore()
    this.categoryStore = useCategoryStore()
    let product = this.productStore.current
    if (product) {
      product = JSON.parse(JSON.stringify(product))
      this.images = product.images
    }
    this.formStore.set(this.key, {
      name: product.name || '',
      categoryUuid: product.categoryUuid || undefined,
      cip7: product.cip7 || '',
      cip13: product.cip13 || '',
      ean13: product.ean13 || '',
      priceWithoutTax: (product.priceWithoutTax / 100).toString() || undefined,
      percentTaxRate: product.percentTaxRate || undefined,
      priceWithTax:
        addTaxToPrice(product.priceWithoutTax / 100, product.percentTaxRate)
          .toFixed(2)
          .toString() || undefined,
      laboratory: product.laboratory || '',
      location: product.location || '',
      availableStock: product.availableStock || '',
      newImages: product.newImages || [],
      images: product.images || [],
      description: product.description || '',
      instructionsForUse: product.instructionsForUse || '',
      composition: product.composition || ''
    })
  }

  getName(): Field<string> {
    return {
      value: this.formStore.get(this.key).name,
      canEdit: false
    }
  }

  getCategoryUuid(): Field<UUID | undefined> {
    return {
      value: this.formStore.get(this.key).categoryUuid,
      canEdit: false
    }
  }

  getAvailableCategories(): CreateProductCategoriesVM {
    const categories = this.categoryStore.items
    return categories.map((c: Category) => {
      return {
        uuid: c.uuid,
        name: c.name
      }
    })
  }

  getCip7(): Field<string> {
    return {
      value: this.formStore.get(this.key).cip7,
      canEdit: false
    }
  }

  getCip13(): Field<string> {
    return {
      value: this.formStore.get(this.key).cip13,
      canEdit: false
    }
  }

  getEan13(): Field<string> {
    return {
      value: this.formStore.get(this.key).ean13,
      canEdit: false
    }
  }

  getPriceWithoutTax(): Field<string | undefined> {
    return {
      value: this.formStore.get(this.key).priceWithoutTax,
      canEdit: false
    }
  }

  getPercentTaxRate(): Field<number | undefined> {
    return {
      value: this.formStore.get(this.key).percentTaxRate,
      canEdit: false
    }
  }

  getPriceWithTax(): Field<string | undefined> {
    return {
      value: this.formStore.get(this.key).priceWithTax,
      canEdit: false
    }
  }
  getLaboratory(): Field<string | undefined> {
    return {
      value: this.formStore.get(this.key).laboratory,
      canEdit: false
    }
  }

  getLocation(): Field<string | undefined> {
    return {
      value: this.formStore.get(this.key).location,
      canEdit: false
    }
  }

  getAvailableStock(): Field<string> {
    return {
      value: this.formStore.get(this.key).availableStock,
      canEdit: false
    }
  }
  getImages(): Array<string> {
    return this.images
  }

  getNewImages(): Field<Array<File>> {
    return {
      value: this.formStore.get(this.key).newImages,
      canEdit: false
    }
  }

  getDescription(): Field<string> {
    return {
      value: this.formStore.get(this.key).description,
      canEdit: false
    }
  }

  getInstructionsForUse(): Field<string> {
    return {
      value: this.formStore.get(this.key).instructionsForUse,
      canEdit: false
    }
  }

  getComposition(): Field<string> {
    return {
      value: this.formStore.get(this.key).composition,
      canEdit: false
    }
  }

  getDisplayValidate(): boolean {
    return false
  }

  getCanValidate(): boolean {
    return false
  }
}

export const getProductVM = (key: string): GetProductVM => {
  return new GetProductVM(key)
}

import { PromotionFormFieldsReader } from '@adapters/primary/view-models/promotions/promotion-form/promotionFormGetVM'
import { Header } from '@adapters/primary/view-models/preparations/get-orders-to-prepare/getPreparationsVM'
import { ReductionType } from '@core/entities/promotion'
import {
  Field,
  PromotionProductItemVM,
  TypeChoiceVM
} from '@adapters/primary/view-models/promotions/promotion-form/promotionFormCreateVM'
import { Product } from '@core/entities/product'

export abstract class PromotionFormVM {
  protected fieldsReader: PromotionFormFieldsReader

  protected constructor(fieldsReader: PromotionFormFieldsReader) {
    this.fieldsReader = fieldsReader
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

  getProducts(): Field<Array<PromotionProductItemVM>> {
    const addedProducts = this.fieldsReader.get('products')
    const value = addedProducts.map((product: Product) => {
      return {
        uuid: product.uuid,
        name: product.name,
        reference: product.ean13,
        categories: product.categories.map((c) => c.name),
        laboratory: product.laboratory
      }
    })
    return {
      value,
      canEdit: true
    }
  }
}

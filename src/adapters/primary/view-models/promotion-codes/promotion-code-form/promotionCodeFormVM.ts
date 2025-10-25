import { DeliveryMethod } from '@core/entities/order'
import { Product } from '@core/entities/product'
import { ReductionType } from '@core/entities/promotion'
import {
  CreatePromotionCodeDTO,
  PromotionScope
} from '@core/entities/promotionCode'
import { UUID } from '@core/types/types'
import { useDeliveryMethodStore } from '@store/deliveryMethodStore'
import { usePromotionCodeStore } from '@store/promotionCodeStore'
import { Header } from '../../preparations/get-orders-to-prepare/getPreparationsVM'
import {
  Field,
  TypeChoiceVM
} from '../../promotions/promotion-form/promotionFormCreateVM'
import {
  AvailableDeliveryMethodsVM,
  PromotionCodeFormFieldsReader,
  PromotionScopeChoiceVM
} from './promotionCodeFormGetVM'

export interface PromotionCodeProductItemVM {
  uuid: UUID
  name: string
  reference: string
  categories: Array<string>
  laboratory: string
}

export abstract class PromotionCodeFormVM {
  protected fieldsReader: PromotionCodeFormFieldsReader

  protected constructor(fieldsReader: PromotionCodeFormFieldsReader) {
    this.fieldsReader = fieldsReader
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

  getAvailableDeliveryMethods(): AvailableDeliveryMethodsVM {
    const deliveryMethodStore = useDeliveryMethodStore()
    const deliveryMethods = deliveryMethodStore.items
    return deliveryMethods.map((deliveryMethod: DeliveryMethod) => {
      return {
        uuid: deliveryMethod.uuid,
        name: deliveryMethod.name
      }
    })
  }

  getAvailableScopeChoices(): Array<PromotionScopeChoiceVM> {
    return Object.values(PromotionScope).map((scope) => {
      const text = this.getScopeText(scope)
      return {
        scope,
        text
      }
    })
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

  getProducts(): Field<Array<PromotionCodeProductItemVM>> {
    const addedProducts = this.fieldsReader.get('products')
    const value = addedProducts.map((product: Product) => {
      return {
        uuid: product.uuid,
        name: product.name,
        reference: product.ean13,
        categories: product.categories.map((c) => c.name),
        laboratory: product.laboratory ? product.laboratory.name : ''
      }
    })
    return {
      value,
      canEdit: true
    }
  }

  getCanValidate(): boolean {
    const code = this.fieldsReader.get('code')
    if (!code || !code.length) return false
    if (!this.fieldsReader.get('amount')) return false
    return true
  }

  getDto(): CreatePromotionCodeDTO {
    let amount = +this.fieldsReader.get('amount')
    const reductionType = this.fieldsReader.get('reductionType')
    if (reductionType === ReductionType.Fixed) {
      amount *= 100
    }
    const res: CreatePromotionCodeDTO = {
      code: this.fieldsReader.get('code'),
      scope: this.fieldsReader.get('scope'),
      reductionType,
      amount,
      conditions: {}
    }
    const startDate = this.fieldsReader.get('startDate')
    if (startDate) {
      res.startDate = startDate
    }
    const endDate = this.fieldsReader.get('endDate')
    if (endDate) {
      res.endDate = endDate
    }
    const maximumUsage = this.fieldsReader.get('maximumUsage')
    if (maximumUsage) {
      res.conditions.maximumUsage = +maximumUsage
    }
    const minimumAmount = this.fieldsReader.get('minimumAmount')
    if (minimumAmount) {
      res.conditions.minimumAmount = +minimumAmount * 100
    }
    const deliveryMethodUuid = this.fieldsReader.get('deliveryMethodUuid')
    if (deliveryMethodUuid) {
      res.conditions.deliveryMethodUuid = deliveryMethodUuid
    }
    const products = this.fieldsReader.get('products')
    if (products.length) {
      res.conditions.products = products
    }
    return res
  }

  getDisplayValidate(): boolean {
    return true
  }

  isLoading(): boolean {
    const promotionCodeStore = usePromotionCodeStore()
    return promotionCodeStore.isLoading
  }

  private getTypeText(type: ReductionType): string {
    if (type === ReductionType.Percentage) {
      return 'Pourcentage'
    }
    return 'Euros'
  }

  private getScopeText(scope: PromotionScope): string {
    if (scope === PromotionScope.Products) {
      return 'Produits'
    }
    return 'Livraison'
  }
}

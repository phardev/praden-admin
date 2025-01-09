import { ReductionType } from '@core/entities/promotion'
import { TypeChoiceVM } from '../../promotions/promotion-form/promotionFormCreateVM'
import {
  AvailableDeliveryMethodsVM,
  PromotionCodeFormFieldsReader,
  PromotionScopeChoiceVM
} from './promotionCodeFormGetVM'
import { useDeliveryMethodStore } from '@store/deliveryMethodStore'
import { PromotionScope } from '@core/usecases/promotion-codes/promotion-code-listing/promotionCode'

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
    return deliveryMethods.map((deliveryMethod) => {
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

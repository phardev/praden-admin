import { ReductionType } from '@core/entities/promotion'
import { TypeChoiceVM } from '../../promotions/promotion-form/promotionFormCreateVM'
import {
  AvailableDeliveryMethodsVM,
  PromotionCodeFormFieldsReader
} from './promotionCodeFormGetVM'
import { useDeliveryMethodStore } from '@store/deliveryMethodStore'

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

  private getTypeText(type: ReductionType): string {
    if (type === ReductionType.Percentage) {
      return 'Pourcentage'
    }
    return 'Euros'
  }
}

import { ReductionType } from '@core/entities/promotion'
import { TypeChoiceVM } from '../../promotions/promotion-form/promotionFormCreateVM'
import {
  AvailableDeliveryMethodsVM,
  PromotionCodeFormFieldsReader,
  PromotionScopeChoiceVM
} from './promotionCodeFormGetVM'
import { useDeliveryMethodStore } from '@store/deliveryMethodStore'
import {
  CreatePromotionCodeDTO,
  PromotionScope
} from '@core/usecases/promotion-codes/promotion-code-listing/promotionCode'
import { usePromotionCodeStore } from '@store/promotionCodeStore'

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

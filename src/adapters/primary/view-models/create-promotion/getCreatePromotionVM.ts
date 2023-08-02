import { ReductionType } from '@core/usecases/promotions/promotions-listing/promotion'
import { Product } from '@core/entities/product'
import { Timestamp } from '@core/types/types'

export interface PromotionVM {
  name: string
  startDate?: Timestamp
  endDate?: Timestamp
  type: ReductionType
  products: Array<Product>
}

export class CreatePromotionVM {
  private _name = ''
  private _startDate: Timestamp | undefined
  private _endDate: Timestamp | undefined
  private _type: ReductionType = ReductionType.Fixed
  private _products: Array<Product> = []

  get name(): string {
    return this._name
  }
  set name(n: string) {
    this._name = n
  }
  get startDate(): Timestamp | undefined {
    return this._startDate
  }
  set startDate(date: Timestamp | undefined) {
    this._startDate = date
  }
  get endDate(): Timestamp | undefined {
    return this._endDate
  }
  set endDate(date: Timestamp | undefined) {
    this._endDate = date
  }
  get products(): Array<Product> {
    return this._products
  }
  addProducts(products: Array<Product>) {
    this._products.push(...products)
  }
  get type(): ReductionType {
    return this._type
  }
}

export const getCreatePromotionVM = () => {
  return new CreatePromotionVM()
}

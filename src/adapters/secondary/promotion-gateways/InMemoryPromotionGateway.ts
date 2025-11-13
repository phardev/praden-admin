import {
  CreatePromotionDTO,
  EditPromotionDTO,
  Promotion
} from '@core/entities/promotion'
import { PromotionStats } from '@core/entities/promotionStats'
import { PromotionDoesNotExistsError } from '@core/errors/PromotionDoesNotExistsError'
import { PromotionGateway } from '@core/gateways/promotionGateway'
import { UuidGenerator } from '@core/gateways/uuidGenerator'
import { UUID } from '@core/types/types'
import { PromotionListItem } from '@core/usecases/promotions/promotions-listing/promotionListItem'

export class InMemoryPromotionGateway implements PromotionGateway {
  private promotions: Array<Promotion> = []
  private promotionsListItem: Array<PromotionListItem> = []
  private statsMap: Map<UUID, PromotionStats> = new Map()
  private pdfBlobMap: Map<UUID, Blob> = new Map()
  private uuidGenerator: UuidGenerator

  constructor(uuidGenerator: UuidGenerator) {
    this.uuidGenerator = uuidGenerator
  }

  list(): Promise<Array<PromotionListItem>> {
    return Promise.resolve(JSON.parse(JSON.stringify(this.promotionsListItem)))
  }

  create(promotion: CreatePromotionDTO): Promise<Promotion> {
    const p: Promotion = {
      ...promotion,
      uuid: this.uuidGenerator.generate()
    }
    this.promotions.push(p)
    const listItem: PromotionListItem = {
      uuid: p.uuid,
      name: p.name,
      type: p.type,
      amount: p.amount,
      startDate: p.startDate,
      endDate: p.endDate,
      productCount: p.products.length
    }
    this.promotionsListItem.push(listItem)
    return Promise.resolve(p)
  }

  edit(uuid: UUID, promotion: Partial<EditPromotionDTO>): Promise<Promotion> {
    const index = this.promotions.findIndex((p) => p.uuid === uuid)
    if (index < 0) throw new PromotionDoesNotExistsError(uuid)
    this.promotions[index] = Object.assign(this.promotions[index], promotion)
    const listItem: PromotionListItem = {
      uuid: this.promotions[index].uuid,
      name: this.promotions[index].name,
      type: this.promotions[index].type,
      amount: this.promotions[index].amount,
      startDate: this.promotions[index].startDate,
      endDate: this.promotions[index].endDate,
      productCount: this.promotions[index].products.length
    }
    this.promotionsListItem[index] = listItem
    return Promise.resolve(this.promotions[index])
  }

  getByUuid(uuid: UUID): Promise<Promotion> {
    const res = this.promotions.find((p) => p.uuid === uuid)
    if (!res) throw new PromotionDoesNotExistsError(uuid)
    return Promise.resolve(JSON.parse(JSON.stringify(res)))
  }

  getPromotionsForProduct(productUUID: UUID): Promise<Array<Promotion>> {
    const res = this.promotions.filter((p) =>
      p.products.map((product) => product.uuid).includes(productUUID)
    )
    return Promise.resolve(res)
  }

  feedWith(...promotions: Array<Promotion>) {
    this.promotions = promotions
    this.promotionsListItem = promotions.map((p) => ({
      uuid: p.uuid,
      name: p.name,
      type: p.type,
      amount: p.amount,
      startDate: p.startDate,
      endDate: p.endDate,
      productCount: p.products.length
    }))
  }

  feedListItemWith(...promotionsListItem: Array<PromotionListItem>) {
    this.promotionsListItem = promotionsListItem
  }

  getStats(uuid: UUID): Promise<PromotionStats> {
    const stats = this.statsMap.get(uuid)
    if (!stats) throw new Error(`No stats found for promotion ${uuid}`)
    return Promise.resolve(JSON.parse(JSON.stringify(stats)))
  }

  exportStatsPDF(uuid: UUID): Promise<Blob> {
    const blob = this.pdfBlobMap.get(uuid)
    if (!blob) throw new Error(`No PDF blob found for promotion ${uuid}`)
    return Promise.resolve(blob)
  }

  feedStatsFor(uuid: UUID, stats: PromotionStats) {
    this.statsMap.set(uuid, stats)
  }

  feedPDFBlobFor(uuid: UUID, blob: Blob) {
    this.pdfBlobMap.set(uuid, blob)
  }
}

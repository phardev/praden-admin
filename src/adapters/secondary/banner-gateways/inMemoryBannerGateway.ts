import {
  Banner,
  BannerListItem,
  sortByOrder,
  toBanner
} from '@core/entities/banner'
import { BannerDoesNotExistsError } from '@core/errors/BannerDoesNotExistsError'
import { BannerGateway } from '@core/gateways/bannerGateway'
import { UuidGenerator } from '@core/gateways/uuidGenerator'
import { UUID } from '@core/types/types'
import { CreateBannerDTO } from '@core/usecases/banners/banner-creation/createBanner'
import { EditBannerDTO } from '@core/usecases/banners/banner-edition/editBanner'
import { getFileContent } from '@utils/file'

export class InMemoryBannerGateway implements BannerGateway {
  private banners: Array<BannerListItem> = []
  private uuidGenerator: UuidGenerator

  constructor(uuidGenerator: UuidGenerator) {
    this.uuidGenerator = uuidGenerator
  }

  async list(): Promise<Array<BannerListItem>> {
    return Promise.resolve(JSON.parse(JSON.stringify(this.banners)))
  }

  async reorder(bannerUuids: Array<UUID>): Promise<Array<BannerListItem>> {
    for (const uuid of bannerUuids) {
      const i = bannerUuids.indexOf(uuid)
      await this.edit(uuid, { order: i })
    }
    this.banners = this.banners.sort(sortByOrder)
    return Promise.resolve(JSON.parse(JSON.stringify(this.banners)))
  }

  async delete(uuid: UUID): Promise<Banner> {
    this.banners.sort(sortByOrder)
    const index = this.banners.findIndex((b) => b.uuid === uuid)
    const deleted = this.banners.splice(index, 1)
    this.banners.forEach((b, i) => {
      b.order = i
    })
    return Promise.resolve(toBanner(deleted[0]))
  }

  async create(dto: CreateBannerDTO): Promise<Array<BannerListItem>> {
    const newBanner: BannerListItem = {
      uuid: this.uuidGenerator.generate(),
      img: await getFileContent(dto.img),
      order: dto.order !== undefined ? dto.order : this.banners.length,
      isActive: dto.isActive !== undefined ? dto.isActive : true,
      clickCount: 0,
      href: dto.href,
      startDate: dto.startDate,
      endDate: dto.endDate
    }
    this.banners.splice(newBanner.order, 0, newBanner)
    await this.reorder(this.banners.map((b) => b.uuid))
    return Promise.resolve(JSON.parse(JSON.stringify(this.banners)))
  }

  async edit(uuid: UUID, dto: EditBannerDTO): Promise<Banner> {
    const index = this.banners.findIndex((c) => c.uuid === uuid)
    const updated: BannerListItem = Object.assign(this.banners[index], dto)
    this.banners.splice(index, 1)
    this.banners.splice(updated.order, 0, updated)
    this.banners.forEach((b, i) => {
      b.order = i
    })
    return Promise.resolve(toBanner(updated))
  }

  get(uuid: UUID): Promise<Banner> {
    const banner = this.banners.find((c) => c.uuid === uuid)
    if (!banner) throw new BannerDoesNotExistsError(uuid)
    return Promise.resolve(toBanner(banner))
  }

  feedWith(...banners: Array<BannerListItem>) {
    this.banners = JSON.parse(JSON.stringify(banners))
  }
}

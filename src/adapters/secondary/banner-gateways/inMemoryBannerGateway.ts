import { Banner, sortByOrder } from '@core/entities/banner'
import { BannerDoesNotExistsError } from '@core/errors/BannerDoesNotExistsError'
import { BannerGateway } from '@core/gateways/bannerGateway'
import { UuidGenerator } from '@core/gateways/uuidGenerator'
import { UUID } from '@core/types/types'
import { CreateBannerDTO } from '@core/usecases/banners/banner-creation/createBanner'
import { EditBannerDTO } from '@core/usecases/banners/banner-edition/editBanner'
import { getFileContent } from '@utils/file'

export class InMemoryBannerGateway implements BannerGateway {
  private banners: Array<Banner> = []
  private uuidGenerator: UuidGenerator

  constructor(uuidGenerator: UuidGenerator) {
    this.uuidGenerator = uuidGenerator
  }

  async list(): Promise<Array<Banner>> {
    return Promise.resolve(JSON.parse(JSON.stringify(this.banners)))
  }

  async reorder(bannerUuids: Array<UUID>): Promise<Array<Banner>> {
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
    return Promise.resolve(deleted[0])
  }

  async create(dto: CreateBannerDTO): Promise<Array<Banner>> {
    const newBanner: Banner = {
      uuid: this.uuidGenerator.generate(),
      img: await getFileContent(dto.img),
      order: dto.order !== undefined ? dto.order : this.banners.length,
      isActive: dto.isActive !== undefined ? dto.isActive : true,
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
    const updated: Banner = Object.assign(this.banners[index], dto)
    this.banners.splice(index, 1)
    this.banners.splice(updated.order, 0, updated)
    this.banners.forEach((b, i) => {
      b.order = i
    })
    return Promise.resolve(JSON.parse(JSON.stringify(updated)))
  }

  get(uuid: UUID): Promise<Banner> {
    const banner = this.banners.find((c) => c.uuid === uuid)
    if (!banner) throw new BannerDoesNotExistsError(uuid)
    return Promise.resolve(JSON.parse(JSON.stringify(banner)))
  }

  feedWith(...banners: Array<Banner>) {
    this.banners = JSON.parse(JSON.stringify(banners))
  }
}

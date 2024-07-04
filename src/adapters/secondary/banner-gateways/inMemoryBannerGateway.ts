import { BannerGateway } from '@core/gateways/bannerGateway'
import { Banner, sortByOrder } from '@core/usecases/banners/list-banners/banner'
import { UUID } from '@core/types/types'
import { UuidGenerator } from '@core/gateways/uuidGenerator'
import { getFileContent } from '@utils/file'
import { EditBannerDTO } from '@core/usecases/banners/banner-edition/editBanner'

export class InMemoryBannerGateway implements BannerGateway {
  private banners: Array<Banner> = []
  private uuidGenerator: UuidGenerator

  constructor(uuidGenerator: UuidGenerator) {
    this.uuidGenerator = uuidGenerator
  }

  async list(): Promise<Array<Banner>> {
    return Promise.resolve(JSON.parse(JSON.stringify(this.banners)))
  }

  async reorder(banners: Array<Banner>): Promise<Array<Banner>> {
    banners.forEach((b, i) => (b.order = i))
    this.banners = banners
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

  async create(file: File): Promise<Banner> {
    const newBanner = {
      uuid: this.uuidGenerator.generate(),
      img: await getFileContent(file),
      order: this.banners.length,
      isActive: true
    }
    this.banners.push(newBanner)
    return Promise.resolve(JSON.parse(JSON.stringify(newBanner)))
  }

  edit(uuid: UUID, dto: EditBannerDTO): Promise<Banner> {
    const index = this.banners.findIndex((c) => c.uuid === uuid)
    this.banners[index] = Object.assign(this.banners[index], dto)
    return Promise.resolve(JSON.parse(JSON.stringify(this.banners[index])))
  }

  feedWith(...banners: Array<Banner>) {
    this.banners = JSON.parse(JSON.stringify(banners))
  }
}

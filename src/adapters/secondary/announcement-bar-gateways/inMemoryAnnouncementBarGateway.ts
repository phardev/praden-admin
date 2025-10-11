import {
  AnnouncementBarGateway,
  CreateAnnouncementBarDTO,
  EditAnnouncementBarDTO
} from '@core/gateways/announcementBarGateway'
import { AnnouncementBar, sortByOrder } from '@core/entities/announcementBar'
import { UUID } from '@core/types/types'
import { UuidGenerator } from '@core/gateways/uuidGenerator'
import { AnnouncementBarDoesNotExistsError } from '@core/errors/AnnouncementBarDoesNotExistsError'

export class InMemoryAnnouncementBarGateway implements AnnouncementBarGateway {
  private announcementBars: Array<AnnouncementBar> = []
  private uuidGenerator: UuidGenerator

  constructor(uuidGenerator: UuidGenerator) {
    this.uuidGenerator = uuidGenerator
  }

  async list(): Promise<Array<AnnouncementBar>> {
    return Promise.resolve(JSON.parse(JSON.stringify(this.announcementBars)))
  }

  async create(dto: CreateAnnouncementBarDTO): Promise<AnnouncementBar> {
    const newAnnouncementBar: AnnouncementBar = {
      uuid: this.uuidGenerator.generate(),
      text: dto.text,
      order: this.announcementBars.length,
      isActive: dto.isActive,
      startDate: dto.startDate ? new Date(dto.startDate).getTime() : undefined,
      endDate: dto.endDate ? new Date(dto.endDate).getTime() : undefined
    }
    this.announcementBars.push(newAnnouncementBar)
    return Promise.resolve(JSON.parse(JSON.stringify(newAnnouncementBar)))
  }

  async edit(
    uuid: UUID,
    dto: EditAnnouncementBarDTO
  ): Promise<AnnouncementBar> {
    const index = this.announcementBars.findIndex((ab) => ab.uuid === uuid)
    if (index === -1) throw new AnnouncementBarDoesNotExistsError(uuid)

    const updated: AnnouncementBar = {
      ...this.announcementBars[index],
      text: dto.text,
      isActive: dto.isActive
    }

    if (dto.startDate !== undefined) {
      updated.startDate = new Date(dto.startDate).getTime()
    }
    if (dto.endDate !== undefined) {
      updated.endDate = new Date(dto.endDate).getTime()
    }

    this.announcementBars[index] = updated
    return Promise.resolve(JSON.parse(JSON.stringify(updated)))
  }

  async delete(uuid: UUID): Promise<void> {
    this.announcementBars.sort(sortByOrder)
    const index = this.announcementBars.findIndex((ab) => ab.uuid === uuid)
    if (index === -1) throw new AnnouncementBarDoesNotExistsError(uuid)

    this.announcementBars.splice(index, 1)
    this.announcementBars.forEach((ab, i) => {
      ab.order = i
    })
    return Promise.resolve()
  }

  async getByUuid(uuid: UUID): Promise<AnnouncementBar> {
    const announcementBar = this.announcementBars.find((ab) => ab.uuid === uuid)
    if (!announcementBar) throw new AnnouncementBarDoesNotExistsError(uuid)
    return Promise.resolve(JSON.parse(JSON.stringify(announcementBar)))
  }

  feedWith(...announcementBars: Array<AnnouncementBar>) {
    this.announcementBars = JSON.parse(JSON.stringify(announcementBars))
  }
}

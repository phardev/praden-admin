import {
  AnnouncementBar,
  AnnouncementBarImpact,
  AnnouncementBarSchedule,
  AnnouncementBarsListing,
  EMPTY_ANNOUNCEMENT_BAR_SCHEDULE,
  NO_ANNOUNCEMENT_BAR_IMPACT
} from '@core/entities/announcementBar'
import { AnnouncementBarDoesNotExistsError } from '@core/errors/AnnouncementBarDoesNotExistsError'
import {
  AnnouncementBarDraft,
  AnnouncementBarGateway,
  CreateAnnouncementBarDTO,
  EditAnnouncementBarDTO
} from '@core/gateways/announcementBarGateway'
import { UuidGenerator } from '@core/gateways/uuidGenerator'
import { UUID } from '@core/types/types'

export class InMemoryAnnouncementBarGateway implements AnnouncementBarGateway {
  private announcementBars: Array<AnnouncementBar> = []
  private displayedUuid: UUID | undefined
  private schedule: AnnouncementBarSchedule = EMPTY_ANNOUNCEMENT_BAR_SCHEDULE
  private impacts: Array<{
    draft: AnnouncementBarDraft
    impact: AnnouncementBarImpact
  }> = []
  private uuidGenerator: UuidGenerator

  constructor(uuidGenerator: UuidGenerator) {
    this.uuidGenerator = uuidGenerator
  }

  async list(): Promise<AnnouncementBarsListing> {
    return Promise.resolve({
      items: JSON.parse(JSON.stringify(this.announcementBars)),
      displayedUuid: this.displayedUuid,
      schedule: JSON.parse(JSON.stringify(this.schedule))
    })
  }

  async create(dto: CreateAnnouncementBarDTO): Promise<AnnouncementBar> {
    const newAnnouncementBar: AnnouncementBar = {
      uuid: this.uuidGenerator.generate(),
      text: dto.text,
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
    const index = this.announcementBars.findIndex((ab) => ab.uuid === uuid)
    if (index === -1) throw new AnnouncementBarDoesNotExistsError(uuid)

    this.announcementBars.splice(index, 1)
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

  async previewSchedule(
    draft: AnnouncementBarDraft
  ): Promise<AnnouncementBarImpact> {
    const found = this.impacts.find(
      (candidate) => JSON.stringify(candidate.draft) === JSON.stringify(draft)
    )
    return Promise.resolve(found?.impact ?? NO_ANNOUNCEMENT_BAR_IMPACT)
  }

  feedDisplayedWith(uuid: UUID) {
    this.displayedUuid = uuid
  }

  feedScheduleWith(schedule: AnnouncementBarSchedule) {
    this.schedule = schedule
  }

  feedImpactWith(draft: AnnouncementBarDraft, impact: AnnouncementBarImpact) {
    this.impacts.push({ draft, impact })
  }
}

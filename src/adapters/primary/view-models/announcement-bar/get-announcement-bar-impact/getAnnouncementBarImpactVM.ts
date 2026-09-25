import { AnnouncementBarImpactPeriod } from '@core/entities/announcementBar'
import { useAnnouncementBarStore } from '@store/announcementBarStore'
import { timestampToLocaleString } from '@utils/formatters'

export interface AnnouncementBarImpactPeriodVM {
  text: string
  startLabel: string
  endLabel: string
}

export interface GetAnnouncementBarImpactVM {
  replaces: Array<AnnouncementBarImpactPeriodVM>
  maskedBy: Array<AnnouncementBarImpactPeriodVM>
}

const toPeriodVM = (
  period: AnnouncementBarImpactPeriod
): AnnouncementBarImpactPeriodVM => ({
  text: period.text,
  startLabel: timestampToLocaleString(period.from, 'fr-FR'),
  endLabel: timestampToLocaleString(period.to - 1, 'fr-FR')
})

export const getAnnouncementBarImpactVM = (): GetAnnouncementBarImpactVM => {
  const { impact } = useAnnouncementBarStore()
  return {
    replaces: impact.replaces.map(toPeriodVM),
    maskedBy: impact.maskedBy.map(toPeriodVM)
  }
}

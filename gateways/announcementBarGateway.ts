import { InMemoryAnnouncementBarGateway } from '@adapters/secondary/announcement-bar-gateways/inMemoryAnnouncementBarGateway'
import { RealAnnouncementBarGateway } from '@adapters/secondary/announcement-bar-gateways/realAnnouncementBarGateway'
import { isLocalEnv } from '@utils/env'
import * as announcementBars from '@utils/testData/announcementBars'
import { useUuidGenerator } from './uuidGenerator'

const announcementBarGateway = new InMemoryAnnouncementBarGateway(
  useUuidGenerator()
)
announcementBarGateway.feedWith(
  announcementBars.announcementBarNoDates,
  announcementBars.announcementBarWithStartDate,
  announcementBars.announcementBarWithEndDate,
  announcementBars.announcementBarWithBothDates
)

export const useAnnouncementBarGateway = () => {
  if (isLocalEnv()) {
    return announcementBarGateway
  }
  const { BACKEND_URL } = useRuntimeConfig().public
  return new RealAnnouncementBarGateway(BACKEND_URL)
}

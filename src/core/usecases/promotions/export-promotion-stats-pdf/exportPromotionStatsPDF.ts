import { DateProvider } from '@core/gateways/dateProvider'
import { FileDownloadService } from '@core/gateways/fileDownloadService'
import { PromotionGateway } from '@core/gateways/promotionGateway'
import { UUID } from '@core/types/types'

export const exportPromotionStatsPDF = async (
  uuid: UUID,
  promotionGateway: PromotionGateway,
  fileDownloadService: FileDownloadService,
  dateProvider: DateProvider
): Promise<void> => {
  const blob = await promotionGateway.exportStatsPDF(uuid)
  const date = new Date(dateProvider.now())
  const formattedDate = date.toISOString().split('T')[0]
  const filename = `promotion-stats-${uuid}-${formattedDate}.pdf`
  fileDownloadService.downloadFile(blob, filename)
}

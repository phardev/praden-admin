import { FakeDateProvider } from '@adapters/secondary/date-providers/FakeDateProvider'
import { InMemoryFileDownloadService } from '@adapters/secondary/file-download-services/InMemoryFileDownloadService'
import { InMemoryPromotionGateway } from '@adapters/secondary/promotion-gateways/InMemoryPromotionGateway'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import { UUID } from '@core/types/types'
import { exportPromotionStatsPDF } from '@core/usecases/promotions/export-promotion-stats-pdf/exportPromotionStatsPDF'

describe('Export promotion stats PDF', () => {
  let promotionGateway: InMemoryPromotionGateway
  let fileDownloadService: InMemoryFileDownloadService
  let dateProvider: FakeDateProvider

  beforeEach(() => {
    promotionGateway = new InMemoryPromotionGateway(new FakeUuidGenerator())
    fileDownloadService = new InMemoryFileDownloadService()
    dateProvider = new FakeDateProvider()
  })

  describe('The promotion has stats', () => {
    const pdfBlob = new Blob(['PDF content'], { type: 'application/pdf' })

    beforeEach(() => {
      promotionGateway.feedPDFBlobFor('promotion-summer', pdfBlob)
    })

    it('should download PDF with correct blob', async () => {
      await whenExportPromotionStatsPDF('promotion-summer')
      const downloadedFile = fileDownloadService.getLastDownloadedFile()
      expect(downloadedFile?.blob).toStrictEqual(pdfBlob)
    })

    it('should download PDF with correct filename', async () => {
      dateProvider.feedWith(1609459200000)
      await whenExportPromotionStatsPDF('promotion-summer')
      const downloadedFile = fileDownloadService.getLastDownloadedFile()
      expect(downloadedFile?.filename).toStrictEqual(
        'promotion-stats-promotion-summer-2021-01-01.pdf'
      )
    })
  })

  const whenExportPromotionStatsPDF = async (uuid: UUID): Promise<void> => {
    return await exportPromotionStatsPDF(
      uuid,
      promotionGateway,
      fileDownloadService,
      dateProvider
    )
  }
})

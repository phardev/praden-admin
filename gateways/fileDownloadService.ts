import { BrowserFileDownloadService } from '@adapters/secondary/file-download-services/BrowserFileDownloadService'

export const useFileDownloadService = () => {
  return new BrowserFileDownloadService()
}

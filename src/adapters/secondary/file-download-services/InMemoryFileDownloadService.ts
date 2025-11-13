import { FileDownloadService } from '@core/gateways/fileDownloadService'

interface DownloadedFile {
  blob: Blob
  filename: string
}

export class InMemoryFileDownloadService implements FileDownloadService {
  private downloadedFiles: Array<DownloadedFile> = []

  downloadFile(blob: Blob, filename: string): void {
    this.downloadedFiles.push({ blob, filename })
  }

  getDownloadedFiles(): Array<DownloadedFile> {
    return this.downloadedFiles
  }

  getLastDownloadedFile(): DownloadedFile | undefined {
    return this.downloadedFiles[this.downloadedFiles.length - 1]
  }
}

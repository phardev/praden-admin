export interface FileDownloadService {
  downloadFile(blob: Blob, filename: string): void
}

import { useNewsletterStore } from '@store/newsletterStore'
import { readFileAsText } from '@utils/file'
import { parseEmailColumns, pickMainEmailColumn } from './parseEmailColumns'

export const startNewsletterUnsubscriptionImport = async (file: File) => {
  const columns = parseEmailColumns(await readFileAsText(file))
  useNewsletterStore().setUnsubscriptionImport({
    fileName: file.name,
    columns,
    selectedPosition: pickMainEmailColumn(columns)?.position,
    isUnsubscribing: false
  })
}

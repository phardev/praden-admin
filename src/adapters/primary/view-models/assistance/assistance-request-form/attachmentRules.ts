export type AssistanceAttachmentError = 'tooMany' | 'notImage' | 'tooLarge'

export const MAX_ATTACHMENTS = 5
export const MAX_ATTACHMENT_SIZE_BYTES = 10 * 1024 * 1024

const isImage = (file: File): boolean => file.type.startsWith('image/')

const isTooLarge = (file: File): boolean =>
  file.size > MAX_ATTACHMENT_SIZE_BYTES

export const attachmentErrorFor = (
  existingCount: number,
  files: Array<File>
): AssistanceAttachmentError | undefined => {
  if (files.some((file) => !isImage(file))) return 'notImage'
  if (files.some(isTooLarge)) return 'tooLarge'
  if (existingCount + files.length > MAX_ATTACHMENTS) return 'tooMany'
  return undefined
}

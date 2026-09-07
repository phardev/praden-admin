export interface FileSizeLabelVM {
  key: string
  params: { n: number }
}

export const KILO = 1024
export const MEGA = KILO * KILO

const label = (suffix: string, n: number): FileSizeLabelVM => ({
  key: `assistance.size.${suffix}`,
  params: { n }
})

export const formatFileSize = (bytes: number): FileSizeLabelVM => {
  if (bytes < KILO) return label('bytes', bytes)
  if (bytes < MEGA) return label('kilo', Math.round(bytes / KILO))
  return label('mega', Math.round(bytes / MEGA))
}

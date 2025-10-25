import { useAnnouncementBarStore } from '@store/announcementBarStore'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

interface Field<T> {
  value: T
  canEdit: boolean
}

interface AnnouncementBarFormDTO {
  text: string
  isActive: boolean
  startDate?: number
  endDate?: number
}

interface AnnouncementBarFormVM {
  get(field: string): Field<any>
  set(field: string, value: any): void
  formatDisplayDate(dateString: string): string
  getDto(): AnnouncementBarFormDTO
  isLoading: boolean
}

const timestampToISOString = (timestamp?: number): string => {
  if (!timestamp) return ''
  return new Date(timestamp).toISOString().slice(0, 16)
}

const isoStringToTimestamp = (isoString: string): number | undefined => {
  if (!isoString) return undefined
  return new Date(isoString).getTime()
}

export const announcementBarFormVM = (): AnnouncementBarFormVM => {
  const store = useAnnouncementBarStore()
  const formState: Record<string, any> = {
    text: store.announcementBar?.text,
    isActive: store.announcementBar?.isActive,
    startDate: timestampToISOString(store.announcementBar?.startDate),
    endDate: timestampToISOString(store.announcementBar?.endDate)
  }

  return {
    get: (field: string) => {
      return {
        value: formState[field],
        canEdit: true
      }
    },
    set: (field: string, value: any) => {
      formState[field] = value
    },
    formatDisplayDate: (dateString: string) => {
      return format(new Date(dateString), 'd MMMM yyyy', { locale: fr })
    },
    getDto: () => {
      return {
        text: formState.text,
        isActive: formState.isActive,
        startDate: isoStringToTimestamp(formState.startDate),
        endDate: isoStringToTimestamp(formState.endDate)
      }
    },
    isLoading: store.isLoading
  }
}

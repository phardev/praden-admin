import { useSystemResourceStore } from '@store/systemResourceStore'

export interface GetSystemResourcesVM {
  items: Array<string>
  isLoading: boolean
}

export const getSystemResourcesVM = (): GetSystemResourcesVM => {
  const systemResourceStore = useSystemResourceStore()

  return {
    items: systemResourceStore.items,
    isLoading: systemResourceStore.isLoading
  }
}

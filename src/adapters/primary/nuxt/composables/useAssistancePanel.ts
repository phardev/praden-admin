const isOpen = ref(false)

export const useAssistancePanel = () => {
  const open = () => {
    isOpen.value = true
  }
  const close = () => {
    isOpen.value = false
  }
  return { isOpen: readonly(isOpen), open, close }
}

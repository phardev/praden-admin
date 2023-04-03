export const useDialog = () => {
  const status = ref(false)

  const isOpened = () => {
    return status.value
  }

  const close = () => {
    status.value = false
  }

  const open = () => {
    status.value = true
  }

  return { isOpened, open, close }
}

export const isLocalEnv = (): boolean => {
  const { ENV } = useRuntimeConfig().public
  return ENV === 'LOCAL'
}

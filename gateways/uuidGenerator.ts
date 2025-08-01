import { RealUuidGenerator } from '@adapters/secondary/uuid-generators/RealUuidGenerator'

export const useUuidGenerator = () => {
  return new RealUuidGenerator()
}

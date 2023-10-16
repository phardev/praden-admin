import { RealCategoryGateway } from '@adapters/secondary/category-gateways/realCategoryGateway'

export const useCategoryGateway = () => {
  // const categoryGateway = new InMemoryCategoryGateway()
  // categoryGateway.feedWith(...Object.values(categories))
  // return categoryGateway
  const { BACKEND_URL } = useRuntimeConfig().public
  return new RealCategoryGateway(BACKEND_URL)
}

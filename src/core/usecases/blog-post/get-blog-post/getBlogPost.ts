import type { BlogPostGateway } from '@core/gateways/blogPostGateway'
import { UUID } from '@core/types/types'
import { useBlogPostStore } from '@store/blogPostStore'

export const getBlogPost = async (
  uuid: UUID,
  blogPostGateway: BlogPostGateway
) => {
  const blogPostStore = useBlogPostStore()
  blogPostStore.startLoading()
  try {
    blogPostStore.setCurrent(await blogPostGateway.getByUuid(uuid))
  } finally {
    blogPostStore.stopLoading()
  }
}

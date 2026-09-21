import type { BlogPostGateway } from '@core/gateways/blogPostGateway'
import { UUID } from '@core/types/types'
import { useBlogPostStore } from '@store/blogPostStore'

export const deleteBlogPost = async (
  uuid: UUID,
  blogPostGateway: BlogPostGateway
) => {
  const blogPostStore = useBlogPostStore()
  blogPostStore.startDeleting()
  try {
    await blogPostGateway.delete(uuid)
    blogPostStore.remove(uuid)
  } finally {
    blogPostStore.stopDeleting()
  }
}

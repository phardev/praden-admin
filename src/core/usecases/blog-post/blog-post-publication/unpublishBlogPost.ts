import type { BlogPostGateway } from '@core/gateways/blogPostGateway'
import { UUID } from '@core/types/types'
import { useBlogPostStore } from '@store/blogPostStore'

export const unpublishBlogPost = async (
  uuid: UUID,
  blogPostGateway: BlogPostGateway
) => {
  const blogPostStore = useBlogPostStore()
  blogPostStore.startSaving()
  try {
    const drafted = await blogPostGateway.unpublish(uuid)
    blogPostStore.applyStatus(uuid, drafted.status)
  } finally {
    blogPostStore.stopSaving()
  }
}

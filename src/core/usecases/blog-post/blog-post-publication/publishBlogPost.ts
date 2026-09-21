import type { BlogPostGateway } from '@core/gateways/blogPostGateway'
import { UUID } from '@core/types/types'
import { useBlogPostStore } from '@store/blogPostStore'

export const publishBlogPost = async (
  uuid: UUID,
  blogPostGateway: BlogPostGateway
) => {
  const blogPostStore = useBlogPostStore()
  blogPostStore.startSaving()
  try {
    const published = await blogPostGateway.publish(uuid)
    blogPostStore.applyStatus(uuid, published.status)
  } finally {
    blogPostStore.stopSaving()
  }
}

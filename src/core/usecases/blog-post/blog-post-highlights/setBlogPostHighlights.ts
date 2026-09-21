import type { BlogPostGateway } from '@core/gateways/blogPostGateway'
import { UUID } from '@core/types/types'
import { useBlogPostStore } from '@store/blogPostStore'

export const setBlogPostHighlights = async (
  blogPostUuids: Array<UUID>,
  blogPostGateway: BlogPostGateway
) => {
  const blogPostStore = useBlogPostStore()
  blogPostStore.startSaving()
  try {
    await blogPostGateway.setHighlights(blogPostUuids)
    blogPostStore.highlightInOrder(blogPostUuids)
  } finally {
    blogPostStore.stopSaving()
  }
}

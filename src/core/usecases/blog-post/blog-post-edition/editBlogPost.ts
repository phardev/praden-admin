import type {
  BlogPostGateway,
  EditBlogPostDTO
} from '@core/gateways/blogPostGateway'
import { UUID } from '@core/types/types'
import { useBlogPostStore } from '@store/blogPostStore'

export const editBlogPost = async (
  uuid: UUID,
  dto: EditBlogPostDTO,
  blogPostGateway: BlogPostGateway
) => {
  const blogPostStore = useBlogPostStore()
  blogPostStore.startSaving()
  try {
    blogPostStore.setCurrent(await blogPostGateway.edit(uuid, dto))
  } finally {
    blogPostStore.stopSaving()
  }
}

import type {
  BlogPostGateway,
  CreateBlogPostDTO
} from '@core/gateways/blogPostGateway'
import { useBlogPostStore } from '@store/blogPostStore'

export const createBlogPost = async (
  dto: CreateBlogPostDTO,
  blogPostGateway: BlogPostGateway
) => {
  const blogPostStore = useBlogPostStore()
  blogPostStore.startSaving()
  try {
    blogPostStore.setCurrent(await blogPostGateway.create(dto))
  } finally {
    blogPostStore.stopSaving()
  }
}

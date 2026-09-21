import type { BlogPostGateway } from '@core/gateways/blogPostGateway'
import { useBlogPostStore } from '@store/blogPostStore'

export const listBlogPosts = async (blogPostGateway: BlogPostGateway) => {
  const blogPostStore = useBlogPostStore()
  blogPostStore.startLoading()
  try {
    blogPostStore.list(await blogPostGateway.list())
  } finally {
    blogPostStore.stopLoading()
  }
}

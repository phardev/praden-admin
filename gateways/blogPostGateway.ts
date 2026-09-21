import { InMemoryBlogPostGateway } from '@adapters/secondary/blog-post-gateways/inMemoryBlogPostGateway'
import { RealBlogPostGateway } from '@adapters/secondary/blog-post-gateways/realBlogPostGateway'
import { isLocalEnv } from '@utils/env'
import {
  anticelluliteBlogPost,
  autobronzantsBlogPost,
  stressBlogPost
} from '@utils/testData/blogPosts'

const blogPostGateway = new InMemoryBlogPostGateway()
blogPostGateway.feedWith(
  anticelluliteBlogPost,
  autobronzantsBlogPost,
  stressBlogPost
)
blogPostGateway.highlightWith(
  anticelluliteBlogPost.uuid,
  autobronzantsBlogPost.uuid
)

export const useBlogPostGateway = () => {
  if (isLocalEnv()) {
    return blogPostGateway
  }
  const { BACKEND_URL } = useRuntimeConfig().public
  return new RealBlogPostGateway(BACKEND_URL)
}

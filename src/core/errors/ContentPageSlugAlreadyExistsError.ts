export class ContentPageSlugAlreadyExistsError extends Error {
  constructor(slug: string) {
    super(`Content page slug ${slug} already exists`)
  }
}

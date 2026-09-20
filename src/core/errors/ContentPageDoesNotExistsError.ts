export class ContentPageDoesNotExistsError extends Error {
  constructor(slug: string) {
    super(`Content page ${slug} does not exists`)
  }
}

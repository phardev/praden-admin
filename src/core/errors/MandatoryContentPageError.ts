export class MandatoryContentPageError extends Error {
  constructor(slug: string) {
    super(`Content page ${slug} is mandatory`)
  }
}

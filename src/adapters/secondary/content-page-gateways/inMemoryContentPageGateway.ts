import {
  ContentPage,
  ContentPageListItem,
  ContentPageSlug
} from '@core/entities/contentPage'
import { ContentPageDoesNotExistsError } from '@core/errors/ContentPageDoesNotExistsError'
import {
  ContentPageGateway,
  EditContentPageDTO
} from '@core/gateways/contentPageGateway'

export class InMemoryContentPageGateway implements ContentPageGateway {
  private contentPages: Array<ContentPage> = []

  async list(): Promise<Array<ContentPageListItem>> {
    return Promise.resolve(
      this.contentPages.map((page) => ({
        slug: page.slug,
        title: page.title,
        updatedAt: page.updatedAt,
        updatedBy:
          page.updatedBy === 'system'
            ? { kind: 'system' as const }
            : {
                kind: 'staff' as const,
                email: `${page.updatedBy}@praden.fr`,
                firstname: 'Agnès',
                lastname: 'Praden'
              }
      }))
    )
  }

  async getBySlug(slug: ContentPageSlug): Promise<ContentPage> {
    const contentPage = this.contentPages.find((p) => p.slug === slug)
    if (!contentPage) throw new ContentPageDoesNotExistsError(slug)
    return Promise.resolve(JSON.parse(JSON.stringify(contentPage)))
  }

  async edit(
    slug: ContentPageSlug,
    dto: EditContentPageDTO
  ): Promise<ContentPage> {
    const index = this.contentPages.findIndex((p) => p.slug === slug)
    if (index === -1) throw new ContentPageDoesNotExistsError(slug)

    const updated: ContentPage = {
      ...this.contentPages[index],
      title: dto.title,
      metaDescription: dto.metaDescription,
      html: dto.html
    }
    this.contentPages[index] = updated
    return Promise.resolve(JSON.parse(JSON.stringify(updated)))
  }

  feedWith(...contentPages: Array<ContentPage>) {
    this.contentPages = JSON.parse(JSON.stringify(contentPages))
  }
}

import {
  ContentPage,
  ContentPageListItem,
  ContentPageStatus
} from '@core/entities/contentPage'
import { FooterSection } from '@core/entities/footer'
import { ContentPageDoesNotExistsError } from '@core/errors/ContentPageDoesNotExistsError'
import { ContentPageSlugAlreadyExistsError } from '@core/errors/ContentPageSlugAlreadyExistsError'
import { MandatoryContentPageError } from '@core/errors/MandatoryContentPageError'
import {
  ContentPageGateway,
  CreateContentPageDTO,
  EditContentPageDTO
} from '@core/gateways/contentPageGateway'
import { DateProvider } from '@core/gateways/dateProvider'

const IN_MEMORY_AUTHOR = 'staff-agnes'

export class InMemoryContentPageGateway implements ContentPageGateway {
  private contentPages: Array<ContentPage> = []

  constructor(private readonly dateProvider: DateProvider) {}

  async list(): Promise<Array<ContentPageListItem>> {
    return Promise.resolve(
      this.copy(
        this.contentPages.map((page) => ({
          slug: page.slug,
          name: page.name,
          title: page.title,
          status: page.status,
          isMandatory: page.isMandatory,
          footerSection: page.footerSection,
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
    )
  }

  async getBySlug(slug: string): Promise<ContentPage> {
    return Promise.resolve(this.copy(this.existing(slug)))
  }

  async create(dto: CreateContentPageDTO): Promise<ContentPage> {
    if (this.contentPages.some((p) => p.slug === dto.slug)) {
      throw new ContentPageSlugAlreadyExistsError(dto.slug)
    }
    const created: ContentPage = {
      ...dto,
      status: ContentPageStatus.DRAFT,
      isMandatory: false,
      updatedAt: this.dateProvider.now(),
      updatedBy: IN_MEMORY_AUTHOR
    }
    this.contentPages.push(created)
    return Promise.resolve(this.copy(created))
  }

  async edit(slug: string, dto: EditContentPageDTO): Promise<ContentPage> {
    return this.replace(slug, (page) => ({ ...page, ...dto }))
  }

  async delete(slug: string): Promise<void> {
    this.ensureIsNotMandatory(this.existing(slug))
    this.contentPages = this.contentPages.filter((p) => p.slug !== slug)
  }

  async publish(slug: string): Promise<ContentPage> {
    return this.replace(slug, (page) => ({
      ...page,
      status: ContentPageStatus.PUBLISHED
    }))
  }

  async unpublish(slug: string): Promise<ContentPage> {
    this.ensureIsNotMandatory(this.existing(slug))
    return this.replace(slug, (page) => ({
      ...page,
      status: ContentPageStatus.DRAFT
    }))
  }

  async placeInFooter(slug: string, section: FooterSection): Promise<void> {
    await this.replace(slug, (page) => ({ ...page, footerSection: section }))
  }

  async removeFromFooter(slug: string): Promise<void> {
    this.ensureIsNotMandatory(this.existing(slug))
    await this.replace(slug, (page) => ({ ...page, footerSection: undefined }))
  }

  feedWith(...contentPages: Array<ContentPage>) {
    this.contentPages = this.copy(contentPages)
  }

  private existing(slug: string): ContentPage {
    const contentPage = this.contentPages.find((p) => p.slug === slug)
    if (!contentPage) throw new ContentPageDoesNotExistsError(slug)
    return contentPage
  }

  private ensureIsNotMandatory(contentPage: ContentPage): void {
    if (contentPage.isMandatory) {
      throw new MandatoryContentPageError(contentPage.slug)
    }
  }

  private replace(
    slug: string,
    change: (page: ContentPage) => ContentPage
  ): Promise<ContentPage> {
    const updated = change(this.existing(slug))
    this.contentPages = this.contentPages.map((page) =>
      page.slug === slug ? updated : page
    )
    return Promise.resolve(this.copy(updated))
  }

  private copy<T>(value: T): T {
    return JSON.parse(JSON.stringify(value))
  }
}

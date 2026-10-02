import { ContentPage, ContentPageListItem } from '@core/entities/contentPage'
import { FooterSection } from '@core/entities/footer'

export interface EditContentPageDTO {
  name: string
  title: string
  metaDescription: string
  html: string
}

export interface CreateContentPageDTO extends EditContentPageDTO {
  slug: string
}

export interface ContentPageGateway {
  list(): Promise<Array<ContentPageListItem>>
  getBySlug(slug: string): Promise<ContentPage>
  create(dto: CreateContentPageDTO): Promise<ContentPage>
  edit(slug: string, dto: EditContentPageDTO): Promise<ContentPage>
  delete(slug: string): Promise<void>
  publish(slug: string): Promise<ContentPage>
  unpublish(slug: string): Promise<ContentPage>
  placeInFooter(slug: string, section: FooterSection): Promise<void>
  removeFromFooter(slug: string): Promise<void>
}

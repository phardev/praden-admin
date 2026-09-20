import {
  ContentPage,
  ContentPageListItem,
  ContentPageSlug
} from '@core/entities/contentPage'

export interface EditContentPageDTO {
  title: string
  metaDescription: string
  html: string
}

export interface ContentPageGateway {
  list(): Promise<Array<ContentPageListItem>>
  getBySlug(slug: ContentPageSlug): Promise<ContentPage>
  edit(slug: ContentPageSlug, dto: EditContentPageDTO): Promise<ContentPage>
}

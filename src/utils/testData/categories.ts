import { Category } from '@core/entities/category'

export const dents: Category = {
  uuid: 'category-dents',
  name: 'Dents',
  description: 'La categorie des dents',
  miniature: 'https://fakeimg.pl/50/ff0000',
  image: 'https://fakeimg.pl/300x100/ff0000'
}

export const mum: Category = {
  uuid: 'category-mum',
  name: 'Maman',
  description: 'La categorie des mamans',
  miniature: 'https://fakeimg.pl/50/00ff00',
  image: 'https://fakeimg.pl/300x100/00ff00'
}

export const baby: Category = {
  uuid: 'category-baby',
  name: 'Bébé',
  description: 'La categorie des bébés',
  parentUuid: mum.uuid,
  miniature: 'https://fakeimg.pl/50/0000ff',
  image: 'https://fakeimg.pl/300x100/0000ff'
}

export const diarrhee: Category = {
  uuid: 'category-diarrhee',
  name: 'Diarrhée',
  description: 'La categorie des diarrhées',
  miniature: 'https://fakeimg.pl/50/f0f0f0',
  image: 'https://fakeimg.pl/300x100/f0f0f0'
}

export const minceur: Category = {
  uuid: 'category-minceur',
  name: 'Minceur',
  description: 'La categorie minceur',
  miniature: 'https://fakeimg.pl/50/ffffff',
  image: 'https://fakeimg.pl/300x100/ffffff'
}

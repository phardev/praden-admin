import { Category } from '@core/entities/category'

export const dents: Category = {
  uuid: 'category-dents',
  name: 'Dents',
  description: 'La categorie des dents'
}

export const mum: Category = {
  uuid: 'category-mum',
  name: 'Maman',
  description: 'La categorie des mamans'
}

export const baby: Category = {
  uuid: 'category-baby',
  name: 'Bébé',
  description: 'La categorie des bébés',
  parentUuid: mum.uuid
}

export const diarrhee: Category = {
  uuid: 'category-diarrhee',
  name: 'Diarrhée',
  description: 'La categorie des diarrhées'
}

export const minceur: Category = {
  uuid: 'category-minceur',
  name: 'Minceur',
  description: 'La categorie minceur'
}

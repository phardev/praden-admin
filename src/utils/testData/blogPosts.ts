import { BlogPost, BlogPostStatus } from '@core/entities/blogPost'

export const anticelluliteBlogPost: BlogPost = {
  uuid: '45ff9362-bdea-49b8-ab1c-338e9c244ee7',
  slug: 'anticellulite',
  title:
    'Quels sont les meilleurs produits anti-cellulite pour une peau lisse ?',
  metaDescription: 'Conseils et solutions pour combattre la cellulite.',
  imageUrl: 'https://i.postimg.cc/V6WbM1qt/4.png',
  publishedAt: Date.UTC(2025, 3, 24),
  tags: ['Cellulite', 'Cosmétique'],
  status: BlogPostStatus.PUBLISHED,
  html: '<h1>Anti-cellulite</h1><p>Conseils.</p>'
}

export const autobronzantsBlogPost: BlogPost = {
  uuid: 'dc05197d-c93d-4679-a7eb-58c25a34a987',
  slug: 'autobronzants',
  title: 'Autobronzants corps & visage',
  metaTitle: 'Autobronzants corps & visage - Conseils et Produits',
  metaDescription: 'Un bronzage sans exposition au soleil.',
  imageUrl: 'https://i.postimg.cc/R0m8dLrH/3.png',
  publishedAt: Date.UTC(2025, 4, 1),
  tags: ['Autobronzants', 'Corps'],
  status: BlogPostStatus.PUBLISHED,
  html: '<h1>Autobronzant</h1><p>Un teint hâlé.</p>'
}

export const stressBlogPost: BlogPost = {
  uuid: 'b4863cd1-69c8-4803-b8df-1ced8e14271d',
  slug: 'gerer-son-stress',
  title: 'Gérer efficacement son stress',
  metaTitle: 'Gérer efficacement son stress - Astuces et Produits',
  metaDescription: 'Nos conseils pour gérer le stress au quotidien.',
  imageUrl: 'https://storage.letudiant.fr/stress.jpg',
  publishedAt: Date.UTC(2024, 11, 1),
  tags: ['Stress', 'Bien Etre'],
  status: BlogPostStatus.DRAFT,
  html: '<h1>Gérer efficacement son stress</h1><p>Conseils.</p>'
}

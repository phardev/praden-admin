import {
  ContentPage,
  ContentPageListItem,
  ContentPageSlug
} from '@core/entities/contentPage'

export const cgvContentPage: ContentPage = {
  slug: ContentPageSlug.CGV,
  title: 'Conditions Générales de Vente',
  metaDescription: 'Les conditions générales de vente de la pharmacie.',
  html: '<h2>Article 1 - Objet</h2><p>Les présentes CGV régissent les ventes.</p>',
  updatedAt: 1733875200000,
  updatedBy: 'staff-agnes'
}

export const pharmacieContentPage: ContentPage = {
  slug: ContentPageSlug.PHARMACIE,
  title: 'Pharmacie Agnès Praden Alès',
  metaDescription: 'Adresse, horaires et services de la pharmacie.',
  html: '<h2>Adresse</h2><p>198 Avenue des Frères Lumières</p><iframe src="https://www.google.com/maps/embed?pb=test"></iframe>',
  updatedAt: 1735689600000,
  updatedBy: 'system'
}

export const cgvContentPageListItem: ContentPageListItem = {
  slug: ContentPageSlug.CGV,
  title: 'Conditions Générales de Vente',
  updatedAt: 1733875200000,
  updatedBy: {
    kind: 'staff',
    email: 'agnes@praden.fr',
    firstname: 'Agnès',
    lastname: 'Praden'
  }
}

export const pharmacieContentPageListItem: ContentPageListItem = {
  slug: ContentPageSlug.PHARMACIE,
  title: 'Pharmacie Agnès Praden Alès',
  updatedAt: 1735689600000,
  updatedBy: { kind: 'system' }
}

export const mentionsLegalesContentPage: ContentPage = {
  slug: ContentPageSlug.MENTIONS_LEGALES,
  title: 'Mentions légales',
  metaDescription: "Informations sur l'éditeur et l'hébergeur du site.",
  html: '<h1>Mentions légales</h1><p><strong>Éditeur :</strong> Pharmacie Agnes Praden</p>',
  updatedAt: 1733875200000,
  updatedBy: 'staff-agnes'
}

export const confidentialiteContentPage: ContentPage = {
  slug: ContentPageSlug.CONFIDENTIALITE,
  title: 'Politique de confidentialité',
  metaDescription: 'Traitement des données personnelles des clients.',
  html: '<h1>Politique de confidentialité</h1><div class="section"><h2>1. IDENTIFICATION</h2><p>Pharmacie Agnes Praden.</p></div>',
  updatedAt: 1735689600000,
  updatedBy: 'system'
}

export const paiementContentPage: ContentPage = {
  slug: ContentPageSlug.PAIEMENT,
  title: 'Paiement sécurisé',
  metaDescription: 'Moyens de paiement acceptés et sécurité des transactions.',
  html: '<h1>Paiement Sécurisé</h1><div class="introduction"><p>Réglez vos achats par carte bancaire.</p></div>',
  updatedAt: 1733875200000,
  updatedBy: 'staff-agnes'
}

export const engagementContentPage: ContentPage = {
  slug: ContentPageSlug.ENGAGEMENT,
  title: 'Nos engagements',
  metaDescription: 'Les engagements de la pharmacie envers ses clients.',
  html: '<h1>Nos engagements</h1><h2>Le service</h2><p>Une réponse adaptée à chaque passage.</p>',
  updatedAt: 1735689600000,
  updatedBy: 'staff-agnes'
}

export const recrutementContentPage: ContentPage = {
  slug: ContentPageSlug.RECRUTEMENT,
  title: 'Recrutement',
  metaDescription: "Les offres d'emploi de la pharmacie.",
  html: '<h1>Recrutement</h1><div class="offres-emploi"><h2>Nos offres d\'emploi</h2><div class="jobs-grid"><div class="job-card"><h3>DOCTEUR EN PHARMACIE H/F</h3></div></div></div>',
  updatedAt: 1733875200000,
  updatedBy: 'staff-agnes'
}

export const articleContentPage: ContentPage = {
  slug: ContentPageSlug.ARTICLE,
  title: 'On parle de nous',
  metaDescription: 'Les retombées presse de la pharmacie.',
  html: '<h1>On parle de nous</h1><div class="articles"><div class="article-card"><h2>Une réussite régionale innovante</h2></div></div>',
  updatedAt: 1735689600000,
  updatedBy: 'system'
}

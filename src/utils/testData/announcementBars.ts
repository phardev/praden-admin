import { AnnouncementBar } from '@core/entities/announcementBar'

export const announcementBarNoDates: AnnouncementBar = {
  uuid: 'announcement-winter-promo-2024',
  text: '🎄 Offre de Noël : -20% sur tous les compléments alimentaires',
  order: 0,
  isActive: true
}

export const announcementBarWithStartDate: AnnouncementBar = {
  uuid: 'announcement-free-delivery-2024',
  text: '🚚 Livraison gratuite à partir de 49€ dès maintenant !',
  order: 1,
  isActive: false,
  startDate: 1733875200000
}

export const announcementBarWithEndDate: AnnouncementBar = {
  uuid: 'announcement-click-collect-2024',
  text: '⚡ Nouveau : Commandez en ligne et retirez en 2h en pharmacie',
  order: 2,
  isActive: true,
  endDate: 1738454400000
}

export const announcementBarWithBothDates: AnnouncementBar = {
  uuid: 'announcement-summer-sales-2024',
  text: "☀️ Soldes d'été : jusqu'à -50% sur une sélection de produits",
  order: 3,
  isActive: true,
  startDate: 1719792000000,
  endDate: 1722470400000
}

export const announcementBar1 = announcementBarNoDates
export const announcementBar2 = announcementBarWithStartDate
export const announcementBar3 = announcementBarWithEndDate
export const announcementBar4 = announcementBarWithBothDates

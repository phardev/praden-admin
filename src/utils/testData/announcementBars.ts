import {
  AnnouncementBar,
  AnnouncementBarSchedule
} from '@core/entities/announcementBar'

export const announcementBarNoDates: AnnouncementBar = {
  uuid: 'announcement-winter-promo-2024',
  text: '🎄 Offre de Noël : -20% sur tous les compléments alimentaires',
  isActive: true
}

export const announcementBarWithStartDate: AnnouncementBar = {
  uuid: 'announcement-free-delivery-2024',
  text: '🚚 Livraison gratuite à partir de 49€ dès maintenant !',
  isActive: false,
  startDate: 1733875200000
}

export const announcementBarWithEndDate: AnnouncementBar = {
  uuid: 'announcement-click-collect-2024',
  text: '⚡ Nouveau : Commandez en ligne et retirez en 2h en pharmacie',
  isActive: true,
  endDate: 1738454400000
}

export const announcementBarWithBothDates: AnnouncementBar = {
  uuid: 'announcement-summer-sales-2024',
  text: "☀️ Soldes d'été : jusqu'à -50% sur une sélection de produits",
  isActive: true,
  startDate: 1719792000000,
  endDate: 1722470400000
}

export const announcementBar1 = announcementBarNoDates
export const announcementBar2 = announcementBarWithStartDate
export const announcementBar3 = announcementBarWithEndDate
export const announcementBar4 = announcementBarWithBothDates

export const longFreeDeliveryBar: AnnouncementBar = {
  uuid: 'announcement-long-free-delivery',
  text: "Livraison offerte dès 49 € d'achat en parapharmacie",
  isActive: true,
  startDate: 1774994400000,
  endDate: 1801436399999
}

export const weekendPromoBar: AnnouncementBar = {
  uuid: 'announcement-weekend-promo',
  text: 'Ce week-end, livraison offerte en point relais',
  isActive: true,
  startDate: 1790287200000,
  endDate: 1790459999999
}

export const blackFridayBar: AnnouncementBar = {
  uuid: 'announcement-black-friday',
  text: '15% de remise sur tout le site avec le code BLACK15',
  isActive: true,
  startDate: 1795734000000,
  endDate: 1796165999999
}

export const pausedSeptemberBar: AnnouncementBar = {
  uuid: 'announcement-paused-september',
  text: 'Nouveautés de la rentrée',
  isActive: false,
  startDate: 1788300000000,
  endDate: 1790805599999
}

const NINETY_DAYS = 90 * 24 * 60 * 60 * 1000
const scheduleFrom = weekendPromoBar.startDate!
const scheduleTo = scheduleFrom + NINETY_DAYS

export const weekendThenLongSchedule: AnnouncementBarSchedule = {
  from: scheduleFrom,
  to: scheduleTo,
  segments: [
    {
      from: scheduleFrom,
      to: weekendPromoBar.endDate! + 1,
      displayedUuid: weekendPromoBar.uuid
    },
    {
      from: weekendPromoBar.endDate! + 1,
      to: blackFridayBar.startDate!,
      displayedUuid: longFreeDeliveryBar.uuid
    },
    {
      from: blackFridayBar.startDate!,
      to: blackFridayBar.endDate! + 1,
      displayedUuid: blackFridayBar.uuid
    },
    {
      from: blackFridayBar.endDate! + 1,
      to: scheduleTo,
      displayedUuid: longFreeDeliveryBar.uuid
    }
  ]
}

export const weekendThenNothingSchedule: AnnouncementBarSchedule = {
  from: scheduleFrom,
  to: scheduleTo,
  segments: [
    {
      from: scheduleFrom,
      to: weekendPromoBar.endDate! + 1,
      displayedUuid: weekendPromoBar.uuid
    },
    {
      from: weekendPromoBar.endDate! + 1,
      to: scheduleTo,
      displayedUuid: undefined
    }
  ]
}

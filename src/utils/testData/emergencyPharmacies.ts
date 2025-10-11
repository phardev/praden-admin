import { EmergencyPharmacy } from '@core/entities/emergencyPharmacy'

export const emergencyPharmacy1: EmergencyPharmacy = {
  uuid: 'emergency-pharmacy-centre-2024-12-24',
  name: 'Pharmacie Agnès Praden',
  address: '123 Avenue des Champs-Élysées, 75008 Paris',
  phone: '01 45 62 03 47',
  date: 1735084800000,
  isActive: true
}

export const emergencyPharmacy2: EmergencyPharmacy = {
  uuid: 'emergency-pharmacy-stmichel-2024-12-25',
  name: 'Pharmacie Saint-Michel',
  address: '45 Boulevard Saint-Michel, 75005 Paris',
  phone: '01 43 29 87 52',
  date: 1735171200000,
  isActive: true
}

export const emergencyPharmacy3: EmergencyPharmacy = {
  uuid: 'emergency-pharmacy-gare-2024-12-26',
  name: 'Pharmacie de la Gare Montparnasse',
  address: '3 Place Raoul Dautry, 75015 Paris',
  phone: '01 45 75 62 41',
  date: 1735257600000,
  isActive: false
}

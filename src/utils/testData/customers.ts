import { Customer } from '@core/entities/customer'
import { elodieDurandNewsletterSubscription } from './newsletterSubscriptions'

export const elodieDurand: Customer = {
  uuid: 'customer-elodiedurand',
  firstname: 'Élodie',
  lastname: 'Durand',
  email: 'elodie.durand@example.com',
  phone: '+33612345678',
  ordersCount: 2,
  ordersTotal: 10000,
  lastOrderDate: '2024-03-15T10:30:00.000Z',
  newsletterSubscription: elodieDurandNewsletterSubscription
}

export const lucasLefevre: Customer = {
  uuid: 'customer-lucaslefevre',
  firstname: 'Lucas',
  lastname: 'Lefèvre',
  email: 'lucas.lefevre@example.com',
  phone: '+33687654321',
  ordersCount: 1,
  ordersTotal: 5000,
  lastOrderDate: '2024-02-20T14:15:00.000Z'
}

export const sophieMartinez: Customer = {
  uuid: 'customer-sophiemartinez',
  firstname: 'Sophie',
  lastname: 'Martinez',
  email: 'sophie.martinez@example.com',
  phone: '+33698765432',
  ordersCount: 0,
  ordersTotal: 0
}

export const pierreBernard: Customer = {
  uuid: 'customer-pierrebernard',
  firstname: 'Pierre',
  lastname: 'Bernard',
  email: 'pierre.bernard@example.com',
  phone: '+33654321987',
  ordersCount: 3,
  ordersTotal: 15000
}

export const marcLeblanc: Customer = {
  uuid: 'customer-marcleblanc',
  firstname: 'Marc',
  lastname: 'Leblanc',
  email: 'marc.leblanc@example.com',
  phone: '+33676543210',
  ordersCount: 1,
  ordersTotal: 7500
}

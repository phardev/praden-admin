import { Customer } from '@core/entities/customer'

export const elodieDurand: Customer = {
  uuid: 'customer-elodiedurand',
  firstname: 'Élodie',
  lastname: 'Durand',
  email: 'elodie.durand@example.com',
  phone: '+33612345678',
  ordersCount: 2,
  ordersTotal: 10000
}

export const lucasLefevre: Customer = {
  uuid: 'customer-lucaslefevre',
  firstname: 'Lucas',
  lastname: 'Lefèvre',
  email: 'lucas.lefevre@example.com',
  phone: '+33687654321',
  ordersCount: 1,
  ordersTotal: 5000
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

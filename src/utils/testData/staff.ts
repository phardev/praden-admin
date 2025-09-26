import { Staff } from '@core/entities/staff'
import { adminRole, pharmacistRole, assistantRole } from './roles'

export const johnDoe: Staff = {
  uuid: 'staff-john',
  firstname: 'John',
  lastname: 'Doe',
  email: 'john.doe@praden.com',
  role: adminRole
}

export const janeDupont: Staff = {
  uuid: 'staff-jane',
  firstname: 'Jane',
  lastname: 'Dupont',
  email: 'jane.dupont@praden.com',
  role: pharmacistRole
}

export const marcMartin: Staff = {
  uuid: 'staff-marc',
  firstname: 'Marc',
  lastname: 'Martin',
  email: 'marc.martin@praden.com',
  role: assistantRole
}

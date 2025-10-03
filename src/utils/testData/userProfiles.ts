import { UserProfile } from '@core/entities/userProfile'
import { adminRole, pharmacistRole, assistantRole } from '@utils/testData/roles'

export const adminUserProfile: UserProfile = {
  uuid: 'user-admin',
  email: 'admin@phardev.fr',
  role: adminRole
}

export const pharmacistUserProfile: UserProfile = {
  uuid: 'user-pharmacist',
  email: 'pharmacist@phardev.fr',
  role: pharmacistRole
}

export const assistantUserProfile: UserProfile = {
  uuid: 'user-assistant',
  email: 'assistant@phardev.fr',
  role: assistantRole
}

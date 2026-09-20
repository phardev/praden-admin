export interface NamedStaff {
  firstname?: string
  lastname?: string
  email: string
}

export const getStaffDisplayName = (staff: NamedStaff): string => {
  if (staff.firstname && staff.lastname) {
    return `${staff.firstname} ${staff.lastname}`
  }
  if (staff.firstname) return staff.firstname
  if (staff.lastname) return staff.lastname
  return staff.email
}

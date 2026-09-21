export interface NamedPerson {
  firstname?: string
  lastname?: string
  email: string
}

export const getDisplayName = (person: NamedPerson): string => {
  if (person.firstname && person.lastname) {
    return `${person.firstname} ${person.lastname}`
  }
  if (person.firstname) return person.firstname
  if (person.lastname) return person.lastname
  return person.email
}

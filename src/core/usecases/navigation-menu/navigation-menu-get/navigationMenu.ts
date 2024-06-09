export interface NavigationMenuSectionLink {
  name: string
  icon: string
  href: string
}

export interface NavigationMenuSection {
  title: string
  links: Array<NavigationMenuSectionLink>
}

export interface NavigationMenu {
  logo: string
  title: string
  sections: Array<NavigationMenuSection>
}

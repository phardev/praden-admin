import {
  Footer,
  FooterEntryKind,
  FooterSection,
  PageFooterEntry,
  SystemFooterEntry
} from '@core/entities/footer'
import {
  cgvContentPage,
  deliveryContentPage,
  pharmacieContentPage
} from '@utils/testData/contentPages'

export const pharmacieFooterEntry: PageFooterEntry = {
  uuid: 'footer-entry-pharmacie',
  kind: FooterEntryKind.PAGE,
  pageSlug: pharmacieContentPage.slug,
  name: pharmacieContentPage.name,
  status: pharmacieContentPage.status,
  isMandatory: pharmacieContentPage.isMandatory
}

export const contactFooterEntry: SystemFooterEntry = {
  uuid: 'footer-entry-contact',
  kind: FooterEntryKind.SYSTEM,
  systemKey: 'contact'
}

export const deliveryFooterEntry: PageFooterEntry = {
  uuid: 'footer-entry-livraison',
  kind: FooterEntryKind.PAGE,
  pageSlug: deliveryContentPage.slug,
  name: deliveryContentPage.name,
  status: deliveryContentPage.status,
  isMandatory: deliveryContentPage.isMandatory
}

export const cgvFooterEntry: PageFooterEntry = {
  uuid: 'footer-entry-cgv',
  kind: FooterEntryKind.PAGE,
  pageSlug: cgvContentPage.slug,
  name: cgvContentPage.name,
  status: cgvContentPage.status,
  isMandatory: cgvContentPage.isMandatory
}

export const cookieSettingsFooterEntry: SystemFooterEntry = {
  uuid: 'footer-entry-cookie-settings',
  kind: FooterEntryKind.SYSTEM,
  systemKey: 'cookie-settings'
}

export const footer: Footer = {
  sections: [
    {
      section: FooterSection.PHARMACY,
      entries: [pharmacieFooterEntry, contactFooterEntry, deliveryFooterEntry]
    },
    {
      section: FooterSection.LEGAL,
      entries: [cgvFooterEntry, cookieSettingsFooterEntry]
    }
  ]
}

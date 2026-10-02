import type { NewsletterUnsubscriptionImport } from '@core/entities/newsletterUnsubscriptionImport'
import { useNewsletterStore } from '@store/newsletterStore'
import {
  elodieDurandNewsletterSubscription,
  guestNewsletterSubscription
} from '@utils/testData/newsletterSubscriptions'
import { createPinia, setActivePinia } from 'pinia'
import { startNewsletterUnsubscriptionImport } from './startNewsletterUnsubscriptionImport'

describe('Start newsletter unsubscription import', () => {
  let newsletterStore: ReturnType<typeof useNewsletterStore>
  const elodie = elodieDurandNewsletterSubscription.email
  const guest = guestNewsletterSubscription.email
  const sender = 'contact@pharmacie.example.com'
  const fileName = 'unsubscriptions.csv'

  beforeEach(() => {
    setActivePinia(createPinia())
    newsletterStore = useNewsletterStore()
  })

  describe('The file is a bare list of emails', () => {
    it('should find the emails in the only column', async () => {
      await whenStartingImportWith(`${elodie}\n${guest}`)
      expectImportToEqual({
        fileName,
        columns: [{ position: 1, emails: [elodie, guest] }],
        selectedPosition: 1,
        isUnsubscribing: false
      })
    })
  })

  describe('The file has a header and a single column', () => {
    it('should name the column after its header', async () => {
      await whenStartingImportWith(`Adresse\n${elodie}\n${guest}`)
      expectImportToEqual({
        fileName,
        columns: [{ position: 1, name: 'Adresse', emails: [elodie, guest] }],
        selectedPosition: 1,
        isUnsubscribing: false
      })
    })
  })

  describe('The file is a Mailjet contact list export', () => {
    it('should find the email column among the statistics', async () => {
      await whenStartingImportWith(
        [
          'id,email,open,click,sent,hard_bounce,soft_bounce,blocked,spam,unsub,deferred,total',
          `12,${elodie},9,3,10,0,0,0,0,1,0,10`,
          `13,${guest},18,66,9,0,0,0,0,1,0,9`
        ].join('\n')
      )
      expectImportToEqual({
        fileName,
        columns: [{ position: 2, name: 'email', emails: [elodie, guest] }],
        selectedPosition: 2,
        isUnsubscribing: false
      })
    })
  })

  describe('The file is a Mailjet campaign export with a sender column', () => {
    it('should select the column holding the most emails', async () => {
      await whenStartingImportWith(
        [
          'Email,status,unsub,date,Sender,subject',
          `${elodie},opened,FALSE,2026-09-01,${sender},Promo`,
          `${guest},unsub,TRUE,2026-09-01,${sender},Promo`
        ].join('\n')
      )
      expectImportToEqual({
        fileName,
        columns: [
          { position: 1, name: 'Email', emails: [elodie, guest] },
          { position: 5, name: 'Sender', emails: [sender] }
        ],
        selectedPosition: 1,
        isUnsubscribing: false
      })
    })
  })

  describe('The file comes from a spreadsheet with semicolons, quotes, BOM and CRLF', () => {
    it('should find the emails', async () => {
      await whenStartingImportWith(
        `﻿"Nom";"Courriel"\r\n"Durand";"${elodie}"\r\n"Invité";"${guest}"\r\n`
      )
      expectImportToEqual({
        fileName,
        columns: [{ position: 2, name: 'Courriel', emails: [elodie, guest] }],
        selectedPosition: 2,
        isUnsubscribing: false
      })
    })
  })

  describe('A quoted cell contains the separator', () => {
    it('should not shift the email column', async () => {
      await whenStartingImportWith(
        `subject,email\n"Promo, dernière chance",${elodie}`
      )
      expectImportToEqual({
        fileName,
        columns: [{ position: 2, name: 'email', emails: [elodie] }],
        selectedPosition: 2,
        isUnsubscribing: false
      })
    })
  })

  describe('Emails are wrapped in a display name', () => {
    it('should extract the address', async () => {
      await whenStartingImportWith(`contact\nElodie Durand <${elodie}>`)
      expectImportToEqual({
        fileName,
        columns: [{ position: 1, name: 'contact', emails: [elodie] }],
        selectedPosition: 1,
        isUnsubscribing: false
      })
    })
  })

  describe('The same email appears several times with different cases', () => {
    it('should keep it once in lower case', async () => {
      await whenStartingImportWith(`${guest}\n${guest.toUpperCase()}`)
      expectImportToEqual({
        fileName,
        columns: [{ position: 1, emails: [guest] }],
        selectedPosition: 1,
        isUnsubscribing: false
      })
    })
  })

  describe('The file contains no email', () => {
    it('should find no column', async () => {
      await whenStartingImportWith('ean13;name\n3400930000000;Doliprane')
      expectImportToEqual({
        fileName,
        columns: [],
        selectedPosition: undefined,
        isUnsubscribing: false
      })
    })
  })

  describe('The file is empty', () => {
    it('should find no column', async () => {
      await whenStartingImportWith('')
      expectImportToEqual({
        fileName,
        columns: [],
        selectedPosition: undefined,
        isUnsubscribing: false
      })
    })
  })

  const whenStartingImportWith = async (content: string) => {
    await startNewsletterUnsubscriptionImport(
      new File([content], fileName, { type: 'text/csv' })
    )
  }

  const expectImportToEqual = (expected: NewsletterUnsubscriptionImport) => {
    expect(newsletterStore.unsubscriptionImport).toStrictEqual(expected)
  }
})

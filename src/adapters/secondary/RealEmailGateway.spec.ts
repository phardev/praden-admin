import { RealEmailGateway } from '@adapters/secondary/realEmailGateway'
import { vi } from 'vitest'
import axios from 'axios'
import { PreparationStartedMessage } from '@core/entities/emailMessage'

vi.mock('axios')

describe('Real email gateway', () => {
  let realEmailGateway: RealEmailGateway
  const postMock: any = vi.spyOn(axios, 'post')

  beforeEach(() => {
    vi.resetAllMocks()
  })
  describe('Send an email', () => {
    describe('Send order started', () => {
      it('should post the right message on the right url', async () => {
        const baseUrl = 'https://message-worker/sendEmail'
        const templateId = 'preparationStartedTemplateId'
        realEmailGateway = new RealEmailGateway(baseUrl, templateId)
        const preparationStartedMessageDTO: PreparationStartedMessage = {
          to: 'test@email.com',
          shippingAddress: {
            firstname: 'firstname',
            lastname: 'lastname',
            address: '12 rue des peupliers, 12345, PlopLand',
            phone: '1234567890',
            link: 'https://www.pharmacieagnespraden.com/'
          },
          billingAddress: {
            firstname: 'firstname',
            lastname: 'lastname',
            address: '12 rue des peupliers, 12345, PlopLand',
            phone: '1234567890'
          },
          lines: [
            {
              img: 'http://productA.png',
              name: 'ProductA',
              unitPrice: '1,00\u00A0€',
              quantity: 2,
              total: '2,00\u00A0€'
            },
            {
              img: 'http://productB.png',
              name: 'ProductB',
              unitPrice: '2,50\u00A0€',
              quantity: 3,
              total: '7,50\u00A0€'
            }
          ],
          totals: {
            productPrice: '9,50\u00A0€',
            shippingPrice: 'Gratuit',
            price: '9,50\u00A0€'
          }
        }
        await realEmailGateway.sendPreparationStartedMessage(
          preparationStartedMessageDTO
        )
        const expectedUrl = baseUrl
        const expectedBody = {
          to: 'test@email.com',
          templateId,
          data: {
            shipp: {
              first_name: 'firstname',
              last_name: 'lastname',
              address: '12 rue des peupliers, 12345, PlopLand',
              phone: '1234567890',
              link: 'https://www.pharmacieagnespraden.com/'
            },
            bill: {
              first_name: 'firstname',
              last_name: 'lastname',
              address: '12 rue des peupliers, 12345, PlopLand',
              phone: '1234567890'
            },
            lines: [
              {
                img: 'http://productA.png',
                name: 'ProductA',
                unitPrice: '1,00\u00A0€',
                quantity: 2,
                total: '2,00\u00A0€'
              },
              {
                img: 'http://productB.png',
                name: 'ProductB',
                unitPrice: '2,50\u00A0€',
                quantity: 3,
                total: '7,50\u00A0€'
              }
            ],
            total: {
              product_price: '9,50\u00A0€',
              shipping_price: 'Gratuit',
              price: '9,50\u00A0€'
            }
          }
        }
        const expectedHeaders = {
          headers: {
            'Content-Type': 'application/json'
          }
        }
        expect(postMock).toHaveBeenCalledWith(
          expectedUrl,
          expectedBody,
          expectedHeaders
        )
      })
      it('should post another message on another url', async () => {
        const baseUrl = 'https://another-message-worker/sendEmail'
        const templateId = 'anotherPreparationStartedTemplateId'
        realEmailGateway = new RealEmailGateway(baseUrl, templateId)
        const preparationStartedMessageDTO: PreparationStartedMessage = {
          to: 'another-test@email.com',
          shippingAddress: {
            firstname: 'another-firstname',
            lastname: 'another-lastname',
            address: 'another-12 rue des peupliers, 12345, PlopLand',
            phone: 'another-1234567890',
            link: 'another-https://www.pharmacieagnespraden.com/'
          },
          billingAddress: {
            firstname: 'another-firstname',
            lastname: 'another-lastname',
            address: 'another-12 rue des peupliers, 12345, PlopLand',
            phone: 'another-1234567890'
          },
          lines: [
            {
              img: 'another-http://productA.png',
              name: 'another-ProductA',
              unitPrice: '2,00\u00A0€',
              quantity: 3,
              total: '6,00\u00A0€'
            },
            {
              img: 'another-http://productB.png',
              name: 'another-ProductB',
              unitPrice: '2,50\u00A0€',
              quantity: 1,
              total: '2,50\u00A0€'
            }
          ],
          totals: {
            productPrice: '8,50\u00A0€',
            shippingPrice: '5,50\u00A0€',
            price: '14,00\u00A0€'
          }
        }
        await realEmailGateway.sendPreparationStartedMessage(
          preparationStartedMessageDTO
        )
        const expectedUrl = baseUrl
        const expectedBody = {
          to: 'another-test@email.com',
          templateId,
          data: {
            shipp: {
              first_name: 'another-firstname',
              last_name: 'another-lastname',
              address: 'another-12 rue des peupliers, 12345, PlopLand',
              phone: 'another-1234567890',
              link: 'another-https://www.pharmacieagnespraden.com/'
            },
            bill: {
              first_name: 'another-firstname',
              last_name: 'another-lastname',
              address: 'another-12 rue des peupliers, 12345, PlopLand',
              phone: 'another-1234567890'
            },
            lines: [
              {
                img: 'another-http://productA.png',
                name: 'another-ProductA',
                unitPrice: '2,00\u00A0€',
                quantity: 3,
                total: '6,00\u00A0€'
              },
              {
                img: 'another-http://productB.png',
                name: 'another-ProductB',
                unitPrice: '2,50\u00A0€',
                quantity: 1,
                total: '2,50\u00A0€'
              }
            ],
            total: {
              product_price: '8,50\u00A0€',
              shipping_price: '5,50\u00A0€',
              price: '14,00\u00A0€'
            }
          }
        }
        const expectedHeaders = {
          headers: {
            'Content-Type': 'application/json'
          }
        }
        expect(postMock).toHaveBeenCalledWith(
          expectedUrl,
          expectedBody,
          expectedHeaders
        )
      })
    })
  })
})

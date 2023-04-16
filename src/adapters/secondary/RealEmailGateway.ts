import { EmailGateway } from '@core/gateways/emailGateway'
import { PreparationStartedMessage } from '@core/entities/emailMessage'
import axios from 'axios'

export class RealEmailGateway implements EmailGateway {
  private readonly baseUrl: string
  private readonly preparationStartedTemplateID: string

  constructor(baseUrl: string, preparationStartedTemplateID: string) {
    this.baseUrl = baseUrl
    this.preparationStartedTemplateID = preparationStartedTemplateID
  }

  async sendPreparationStartedMessage(
    preparationStartedMessage: PreparationStartedMessage
  ) {
    const shippingAddress = preparationStartedMessage.shippingAddress
    const billingAddress = preparationStartedMessage.billingAddress
    const totals = preparationStartedMessage.totals
    const body = {
      to: preparationStartedMessage.to,
      templateId: this.preparationStartedTemplateID,
      data: {
        shipp: {
          first_name: shippingAddress.firstname,
          last_name: shippingAddress.lastname,
          address: shippingAddress.address,
          phone: shippingAddress.phone,
          link: shippingAddress.link
        },
        bill: {
          first_name: billingAddress.firstname,
          last_name: billingAddress.lastname,
          address: shippingAddress.address,
          phone: shippingAddress.phone
        },
        lines: preparationStartedMessage.lines,
        total: {
          product_price: totals.productPrice,
          shipping_price: totals.shippingPrice,
          price: totals.price
        }
      }
    }
    const headers = {
      'Content-Type': 'application/json'
    }
    await axios.post(this.baseUrl, body, { headers })
    return Promise.resolve()
  }
}

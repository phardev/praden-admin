import {
  orderPartiallyShipped1,
  orderVFASF,
  orderWaitingForClientAnswer1,
  orderXUKIJ
} from '@utils/testData/orders'
import { dolodent } from '@utils/testData/products'
import { DeliveryStatus, MessageContent } from '@core/entities/order'

export const mockOrderXUKIJ = {
  uuid: 'XUKIJ',
  lines: [
    {
      productUuid: 'abc123',
      name: 'Calmosine 100 ml',
      cip13: '1234567890123',
      img: 'https://i.ibb.co/TPq5YFS/calmosine.png',
      description:
        "CALMOSINE Digestion Bio est un complément alimentaire d’origine naturelle et doux.\nCALMOSINE Digestion Bio a une action particulièrement bénéfique chez les petits en cas d’inconfort digestif : apaisés, ils retrouvent leur calme et leurs pleurs diminuent.\n- Le fenouil améliore le confort digestif\n- le tilleul est connu pour ses vertus calmantes notamment au niveau digestif\n- la fleur d'oranger apporte son arôme délicat à la formule.",
      expectedQuantity: 1,
      preparedQuantity: 0,
      unitAmount: 810,
      percentTaxRate: 10,
      location: 'E2',
      deliveryStatus: 0,
      updatedAt: 1674273279000
    }
  ],
  deliveryAddress: orderXUKIJ.deliveryAddress,
  createdAt: orderXUKIJ.createdAt,
  contact: orderXUKIJ.contact,
  delivery: orderXUKIJ.delivery,
  messages: [],
  payment: orderXUKIJ.payment
}
export const mockOrderVFASF = {
  uuid: 'VFASF',
  lines: [
    {
      productUuid: 'abc123',
      name: 'Calmosine 100 ml',
      cip13: '1234567890123',
      img: 'https://i.ibb.co/TPq5YFS/calmosine.png',
      description:
        "CALMOSINE Digestion Bio est un complément alimentaire d’origine naturelle et doux.\nCALMOSINE Digestion Bio a une action particulièrement bénéfique chez les petits en cas d’inconfort digestif : apaisés, ils retrouvent leur calme et leurs pleurs diminuent.\n- Le fenouil améliore le confort digestif\n- le tilleul est connu pour ses vertus calmantes notamment au niveau digestif\n- la fleur d'oranger apporte son arôme délicat à la formule.",
      expectedQuantity: 2,
      preparedQuantity: 0,
      unitAmount: 810,
      percentTaxRate: 10,
      location: 'E2',
      deliveryStatus: 0,
      updatedAt: 1674273279000
    },
    {
      productUuid: 'product-hemoclar',
      name: 'Hemoclar 0,5% crème 30g',
      cip13: '098765432123',
      img: 'https://www.pharmacieagnespraden.com/66060-large_default/hemoclar-05-pour-cent-crme.jpg',
      description:
        "Ce médicament est préconisé en traitement local d'appoint des traumatismes bénins (bleus, coups) chez l'adulte et l'enfant à partir d'un an.",
      expectedQuantity: 3,
      preparedQuantity: 0,
      unitAmount: 590,
      percentTaxRate: 10,
      location: 'D2',
      deliveryStatus: 0,
      updatedAt: 1674273279000
    }
  ],
  deliveryAddress: orderVFASF.deliveryAddress,
  payment: orderVFASF.payment,
  createdAt: orderVFASF.createdAt,
  contact: orderVFASF.contact,
  delivery: orderVFASF.delivery,
  messages: []
}

export const mockOrderWaitingForClientAnswer1 = {
  uuid: orderWaitingForClientAnswer1.uuid,
  lines: [
    {
      productUuid: 'dolodent-uuid',
      name: dolodent.name,
      cip13: dolodent.cip13,
      img: dolodent.img,
      description: 'Dolodent description',
      expectedQuantity: 2,
      preparedQuantity: 0,
      unitAmount: dolodent.priceWithoutTax,
      percentTaxRate: dolodent.percentTaxRate,
      location: dolodent.location,
      deliveryStatus: DeliveryStatus.Processing,
      updatedAt: 1674273789000
    }
  ],
  deliveryAddress: orderWaitingForClientAnswer1.deliveryAddress,
  createdAt: orderWaitingForClientAnswer1.createdAt,
  contact: orderWaitingForClientAnswer1.contact,
  delivery: orderWaitingForClientAnswer1.delivery,
  messages: [
    {
      orderUuid: orderWaitingForClientAnswer1.uuid,
      content: {
        type: 'ASK_TO_CLIENT',
        data: {
          bar: 'bar'
        }
      },
      sentAt: 1674293789000
    }
  ],
  payment: orderWaitingForClientAnswer1.payment
}

export const mockOrderPartiallyShipped1 = {
  uuid: orderPartiallyShipped1.uuid,
  lines: [
    {
      productUuid: 'dolodent-uuid',
      name: dolodent.name,
      cip13: dolodent.cip13,
      img: dolodent.img,
      description: 'Dolodent description',
      expectedQuantity: 2,
      preparedQuantity: 1,
      unitAmount: dolodent.priceWithoutTax,
      percentTaxRate: dolodent.percentTaxRate,
      location: dolodent.location,
      deliveryStatus: DeliveryStatus.Shipped,
      updatedAt: 1674573778456
    },
    {
      productUuid: 'dolodent-uuid',
      name: dolodent.name,
      cip13: dolodent.cip13,
      img: dolodent.img,
      description: 'Dolodent description',
      expectedQuantity: -1,
      preparedQuantity: 0,
      unitAmount: dolodent.priceWithoutTax,
      percentTaxRate: dolodent.percentTaxRate,
      location: dolodent.location,
      deliveryStatus: DeliveryStatus.Shipped,
      updatedAt: 1674573778456
    }
  ],
  deliveryAddress: orderPartiallyShipped1.deliveryAddress,
  createdAt: orderPartiallyShipped1.createdAt,
  contact: orderPartiallyShipped1.contact,
  delivery: orderPartiallyShipped1.delivery,
  messages: [
    {
      orderUuid: orderPartiallyShipped1.uuid,
      content: {
        type: 'ASK_TO_CLIENT',
        data: {
          foo: 'foo'
        }
      },
      sentAt: 1674573878456
    },
    {
      orderUuid: orderPartiallyShipped1.uuid,
      content: {
        type: MessageContent.PartialShip
      },
      sentAt: 1674684178456
    }
  ],
  payment: orderPartiallyShipped1.payment
}

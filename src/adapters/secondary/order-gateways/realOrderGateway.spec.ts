import { vi } from 'vitest'
import axios from 'axios'
import { RealOrderGateway } from '@adapters/secondary/order-gateways/RealOrderGateway'
import {
  mockOrderPartiallyShipped1,
  mockOrderVFASF,
  mockOrderWaitingForClientAnswer1,
  mockOrderXUKIJ
} from '@utils/testData/mocks/mockOrders'
import {
  orderPartiallyShipped1,
  orderVFASF,
  orderWaitingForClientAnswer1,
  orderXUKIJ
} from '@utils/testData/orders'
import { MessageContent, Message, Order } from '@core/entities/order'

describe('Real order gateway', () => {
  const url = 'http://localhost:8787'
  let orderGateway: RealOrderGateway
  let res: any
  beforeEach(() => {
    vi.clearAllMocks()
    orderGateway = new RealOrderGateway(url)
  })

  describe('List orders to prepare', () => {
    describe('There is no orders to prepare', () => {
      beforeEach(async () => {
        vi.spyOn(axios, 'get').mockResolvedValue({
          data: []
        })
        res = await orderGateway.listOrdersToPrepare()
      })
      it('should return an empty list', () => {
        expect(res).toStrictEqual([])
      })
      it('should call the right url', () => {
        expect(axios.get).toHaveBeenCalledWith(`${url}/preparations/`)
      })
    })
    describe('There is some orders', () => {
      const anotherUrl = 'https://anotherurl'
      const ordersMock = [mockOrderVFASF, mockOrderXUKIJ]

      beforeEach(async () => {
        vi.spyOn(axios, 'get').mockResolvedValue({
          data: ordersMock
        })
        orderGateway = new RealOrderGateway(anotherUrl)
        res = await orderGateway.listOrdersToPrepare()
      })
      it('should return all orders', () => {
        expect(res).toStrictEqual([orderVFASF, orderXUKIJ])
      })
      it('should call the right url', () => {
        expect(axios.get).toHaveBeenCalledWith(`${anotherUrl}/preparations/`)
      })
    })
  })
  describe('Get order by uuid', () => {
    describe('The order exists', () => {
      const uuid = orderXUKIJ.uuid

      beforeEach(async () => {
        vi.spyOn(axios, 'get').mockResolvedValue({
          data: mockOrderXUKIJ
        })
        res = await orderGateway.getByUuid(uuid)
      })
      it('should return the order', () => {
        expect(res).toStrictEqual(orderXUKIJ)
      })
      it('call the right url', () => {
        expect(axios.get).toHaveBeenCalledWith(`${url}/orders/${uuid}/`)
      })
    })
    describe('An other order exists', () => {
      const uuid = orderVFASF.uuid

      beforeEach(async () => {
        const data = mockOrderVFASF
        vi.spyOn(axios, 'get').mockResolvedValue({
          data
        })
        res = await orderGateway.getByUuid(uuid)
      })
      it('should return the order', () => {
        expect(res).toStrictEqual(orderVFASF)
      })
      it('call the right url', () => {
        expect(axios.get).toHaveBeenCalledWith(`${url}/orders/${uuid}/`)
      })
    })
    describe('With messages', () => {
      describe('Ask to client message', () => {
        const uuid = orderWaitingForClientAnswer1.uuid

        beforeEach(async () => {
          const data = mockOrderWaitingForClientAnswer1
          vi.spyOn(axios, 'get').mockResolvedValue({
            data
          })
          res = await orderGateway.getByUuid(uuid)
        })
        it('should return the order', () => {
          expect(res).toStrictEqual(orderWaitingForClientAnswer1)
        })
        it('call the right url', () => {
          expect(axios.get).toHaveBeenCalledWith(`${url}/orders/${uuid}/`)
        })
      })
      describe('PartialShip message', () => {
        const uuid = mockOrderPartiallyShipped1.uuid

        beforeEach(async () => {
          const data = mockOrderPartiallyShipped1
          vi.spyOn(axios, 'get').mockResolvedValue({
            data
          })
          res = await orderGateway.getByUuid(uuid)
        })
        it('should return the order', () => {
          expect(res).toStrictEqual(orderPartiallyShipped1)
        })
        it('call the right url', () => {
          expect(axios.get).toHaveBeenCalledWith(`${url}/orders/${uuid}/`)
        })
      })
    })
  })
  describe('Start a preparation', () => {
    describe('The order exists', () => {
      const uuid = orderXUKIJ.uuid

      beforeEach(async () => {
        vi.spyOn(axios, 'post').mockResolvedValue({
          data: mockOrderXUKIJ
        })
        res = await orderGateway.startPreparation(uuid)
      })
      it('should return the order', () => {
        expect(res).toStrictEqual(orderXUKIJ)
      })
      it('call the right url', () => {
        expect(axios.post).toHaveBeenCalledWith(
          `${url}/start-preparation/`,
          JSON.stringify(uuid)
        )
      })
    })
    describe('An other order exists', () => {
      const uuid = orderVFASF.uuid

      beforeEach(async () => {
        const data = mockOrderVFASF
        vi.spyOn(axios, 'post').mockResolvedValue({
          data
        })
        res = await orderGateway.startPreparation(uuid)
      })
      it('should return the order', () => {
        expect(res).toStrictEqual(orderVFASF)
      })
      it('call the right url', () => {
        expect(axios.post).toHaveBeenCalledWith(
          `${url}/start-preparation/`,
          JSON.stringify(uuid)
        )
      })
    })
  })
  describe('Validate preparation', () => {
    beforeEach(async () => {
      const data = mockOrderVFASF
      vi.spyOn(axios, 'post').mockResolvedValue({
        data
      })
      res = await orderGateway.validatePreparation(orderVFASF)
    })
    it('should return the preparation', () => {
      expect(res).toStrictEqual(orderVFASF)
    })
    it('should call the right url', () => {
      expect(axios.post).toHaveBeenCalledWith(
        `${url}/validate-preparation/`,
        JSON.stringify({
          uuid: orderVFASF.uuid,
          lines: orderVFASF.lines
        })
      )
    })
  })
  describe('Save preparation', () => {
    beforeEach(async () => {
      const data = mockOrderVFASF
      vi.spyOn(axios, 'post').mockResolvedValue({
        data
      })
      res = await orderGateway.savePreparation(orderVFASF)
    })
    it('should return the preparation', () => {
      expect(res).toStrictEqual(orderVFASF)
    })
    it('should call the right url', () => {
      expect(axios.post).toHaveBeenCalledWith(
        `${url}/save-preparation/`,
        JSON.stringify(orderVFASF)
      )
    })
  })
  describe('Ask how to finish the preparation', () => {
    let data: any
    let expectedMessage: Message
    let expectedRes: Order
    beforeEach(async () => {
      data = JSON.parse(JSON.stringify(mockOrderVFASF))
      expectedMessage = {
        content: MessageContent.AskToClient,
        sentAt: 1234562366
      }
      data.messages.push({
        content: {
          type: MessageContent.AskToClient,
          data: {
            foo: 'foo'
          }
        },
        sentAt: 1234562366
      })
      vi.spyOn(axios, 'post').mockResolvedValue({
        data
      })
      expectedRes = JSON.parse(JSON.stringify(orderVFASF))
      expectedRes.messages.push(expectedMessage)
      res = await orderGateway.askHowToFinish(orderVFASF)
    })
    it('should return the preparation', () => {
      expect(res).toStrictEqual(expectedRes)
    })
    it('should call the right url', () => {
      const expectedBody: any = {
        orderUuid: orderVFASF.uuid
      }
      expect(axios.post).toHaveBeenCalledWith(
        `${url}/ask-how-to-finish/`,
        JSON.stringify(expectedBody)
      )
    })
  })
})

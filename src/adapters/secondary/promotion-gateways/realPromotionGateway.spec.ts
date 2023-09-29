import { vi } from 'vitest'
import axios from 'axios'
import { RealPromotionGateway } from '@adapters/secondary/promotion-gateways/RealPromotionGateway'
import {
  promotionFixedMultipleProducts,
  promotionPercentageDolodent
} from '@utils/testData/promotions'

describe('Real promotion gateway', () => {
  const url = 'http://localhost:8787'
  let promotionGateway: RealPromotionGateway
  let res: any
  beforeEach(() => {
    vi.clearAllMocks()
    promotionGateway = new RealPromotionGateway(url)
  })

  describe('List promotions', () => {
    describe('There is no promotions', () => {
      beforeEach(async () => {
        vi.spyOn(axios, 'get').mockResolvedValue({
          data: []
        })
        res = await promotionGateway.list()
      })
      it('should return an empty list', () => {
        expect(res).toStrictEqual([])
      })
      it('should call the right url', () => {
        expect(axios.get).toHaveBeenCalledWith(`${url}/promotions/`)
      })
    })
    describe('There is some promotions', () => {
      const anotherUrl = 'https://anotherurl'
      const promotionsMock = [
        promotionPercentageDolodent,
        promotionFixedMultipleProducts
      ]

      beforeEach(async () => {
        vi.spyOn(axios, 'get').mockResolvedValue({
          data: promotionsMock
        })
        promotionGateway = new RealPromotionGateway(anotherUrl)
        res = await promotionGateway.list()
      })
      it('should return all orders', () => {
        expect(res).toStrictEqual([
          promotionPercentageDolodent,
          promotionFixedMultipleProducts
        ])
      })
      it('should call the right url', () => {
        expect(axios.get).toHaveBeenCalledWith(`${anotherUrl}/promotions/`)
      })
    })
  })
  describe('Get promotion by uuid', () => {
    describe('The promotion exists', () => {
      const uuid = promotionPercentageDolodent.uuid

      beforeEach(async () => {
        vi.spyOn(axios, 'get').mockResolvedValue({
          data: promotionPercentageDolodent
        })
        res = await promotionGateway.getByUuid(uuid)
      })
      it('should return the order', () => {
        expect(res).toStrictEqual(promotionPercentageDolodent)
      })
      it('call the right url', () => {
        expect(axios.get).toHaveBeenCalledWith(`${url}/promotions/${uuid}/`)
      })
    })
    describe('An other promotion exists', () => {
      const uuid = promotionFixedMultipleProducts.uuid

      beforeEach(async () => {
        const data = promotionFixedMultipleProducts
        vi.spyOn(axios, 'get').mockResolvedValue({
          data
        })
        res = await promotionGateway.getByUuid(uuid)
      })
      it('should return the promotion', () => {
        expect(res).toStrictEqual(promotionFixedMultipleProducts)
      })
      it('call the right url', () => {
        expect(axios.get).toHaveBeenCalledWith(`${url}/promotions/${uuid}/`)
      })
    })
  })
  describe('Edit a promotion', () => {
    const dto = JSON.parse(JSON.stringify(promotionFixedMultipleProducts))
    delete dto.uuid
    beforeEach(async () => {
      vi.spyOn(axios, 'put').mockResolvedValue({
        data: promotionFixedMultipleProducts
      })
      promotionGateway = new RealPromotionGateway(url)
      res = await promotionGateway.edit(promotionPercentageDolodent.uuid, dto)
    })
    it('should return the edited promotion', () => {
      expect(res).toStrictEqual(promotionFixedMultipleProducts)
    })
    it('should call the right url', () => {
      expect(axios.put).toHaveBeenCalledWith(
        `${url}/promotions/${promotionPercentageDolodent.uuid}/`,
        JSON.stringify(dto)
      )
    })
  })
  describe('Create a promotion', () => {
    const dto = JSON.parse(JSON.stringify(promotionPercentageDolodent))
    delete dto.uuid
    beforeEach(async () => {
      vi.spyOn(axios, 'post').mockResolvedValue({
        data: promotionPercentageDolodent
      })
      promotionGateway = new RealPromotionGateway(url)
      res = await promotionGateway.create(dto)
    })
    it('should return the created promotion', () => {
      expect(res).toStrictEqual(promotionPercentageDolodent)
    })
    it('should call the right url', () => {
      expect(axios.post).toHaveBeenCalledWith(
        `${url}/promotions/`,
        JSON.stringify(dto)
      )
    })
  })
})

import { vi } from 'vitest'
import axios from 'axios'
import { RealProductGateway } from '@adapters/secondary/product-gateways/RealProductGateway'
import { dolodent } from '@utils/testData/products'
import { aspro } from '@utils/testData/productsDemoPraden'

describe('Real product gateway', () => {
  const url = 'http://localhost:8787'
  let productGateway: RealProductGateway
  let res: any
  beforeEach(() => {
    vi.clearAllMocks()
    productGateway = new RealProductGateway(url)
  })

  describe('List products', () => {
    describe('There is no products', () => {
      beforeEach(async () => {
        vi.spyOn(axios, 'get').mockResolvedValue({
          data: {
            items: []
          }
        })
        res = await productGateway.list()
      })
      it('should return an empty list', () => {
        expect(res).toStrictEqual([])
      })
      it('should call the right url', () => {
        expect(axios.get).toHaveBeenCalledWith(`${url}/products/`)
      })
    })
    describe('There is some products', () => {
      const anotherUrl = 'https://anotherurl'
      const productsMock = [dolodent, aspro]

      beforeEach(async () => {
        vi.spyOn(axios, 'get').mockResolvedValue({
          data: {
            items: productsMock
          }
        })
        productGateway = new RealProductGateway(anotherUrl)
        res = await productGateway.list()
      })
      it('should return all products', () => {
        expect(res).toStrictEqual([dolodent, aspro])
      })
      it('should call the right url', () => {
        expect(axios.get).toHaveBeenCalledWith(`${anotherUrl}/products/`)
      })
    })
  })
})

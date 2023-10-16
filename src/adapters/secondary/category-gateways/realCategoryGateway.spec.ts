import { vi } from 'vitest'
import axios from 'axios'
import {
  hygieneBuccoDentaire,
  medicaments
} from '@utils/testData/categoriesDemoPraden'
import { RealCategoryGateway } from '@adapters/secondary/category-gateways/realCategoryGateway'

describe('Real category gateway', () => {
  const url = 'http://localhost:8787'
  let categoryGateway: RealCategoryGateway
  let res: any
  beforeEach(() => {
    vi.clearAllMocks()
    categoryGateway = new RealCategoryGateway(url)
  })

  describe('List categories', () => {
    describe('There is no categories', () => {
      beforeEach(async () => {
        vi.spyOn(axios, 'get').mockResolvedValue({
          data: {
            items: []
          }
        })
        res = await categoryGateway.list()
      })
      it('should return an empty list', () => {
        expect(res).toStrictEqual([])
      })
      it('should call the right url', () => {
        expect(axios.get).toHaveBeenCalledWith(`${url}/categories/`)
      })
    })
    describe('There is some categories', () => {
      const anotherUrl = 'https://anotherurl'
      const categoriesMock = [medicaments, hygieneBuccoDentaire]

      beforeEach(async () => {
        vi.spyOn(axios, 'get').mockResolvedValue({
          data: {
            items: categoriesMock
          }
        })
        categoryGateway = new RealCategoryGateway(anotherUrl)
        res = await categoryGateway.list()
      })
      it('should return all categories', () => {
        expect(res).toStrictEqual([medicaments, hygieneBuccoDentaire])
      })
      it('should call the right url', () => {
        expect(axios.get).toHaveBeenCalledWith(`${anotherUrl}/categories/`)
      })
    })
  })
})

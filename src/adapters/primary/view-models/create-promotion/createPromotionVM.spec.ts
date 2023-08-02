import { ReductionType } from '@core/usecases/promotions/promotions-listing/promotion'
import {
  CreatePromotionVM,
  getCreatePromotionVM,
  PromotionVM
} from '@adapters/primary/view-models/create-promotion/getCreatePromotionVM'
import { anaca3Minceur, calmosine, dolodent } from '@utils/testData/products'

describe('Create promotion VM', () => {
  let vm: CreatePromotionVM
  beforeEach(() => {
    vm = getCreatePromotionVM()
  })
  describe('Initially', () => {
    it('should an empty VM', () => {
      const expectedVM: PromotionVM = {
        name: '',
        products: [],
        type: ReductionType.Fixed
      }
      expectVmToEqual(expectedVM)
    })
  })

  describe('Set name', () => {
    it('should allow to set the name', () => {
      const name = 'test'
      vm.name = name
      const expectedVM: Partial<PromotionVM> = {
        name
      }
      expectVmToEqual(expectedVM)
    })
  })

  describe('Set start date', () => {
    it('should allow to set the start date', () => {
      vm.startDate = 1690588800000
      const expectedVM: Partial<PromotionVM> = {
        startDate: 1690588800000
      }
      expectVmToEqual(expectedVM)
    })
  })
  describe('Set end date', () => {
    it('should allow to set the end date', () => {
      vm.endDate = 1697588800000
      const expectedVM: Partial<PromotionVM> = {
        endDate: 1697588800000
      }
      expectVmToEqual(expectedVM)
    })
  })

  describe('Manage products', () => {
    describe('Add products', () => {
      it('should allow to add a product', () => {
        const productsAdded = [dolodent]
        vm.addProducts(productsAdded)
        const expectedVM: Partial<PromotionVM> = {
          products: productsAdded
        }
        expectVmToEqual(expectedVM)
      })
      it('should allow to add multiple products', () => {
        const productsAdded = [dolodent, anaca3Minceur]
        vm.addProducts(productsAdded)
        const expectedVM: Partial<PromotionVM> = {
          products: productsAdded
        }
        expectVmToEqual(expectedVM)
      })
      it('should allow to add products in multiple steps', () => {
        const productsAdded1 = [dolodent, anaca3Minceur]
        const productsAdded2 = [calmosine]
        vm.addProducts(productsAdded1)
        vm.addProducts(productsAdded2)
        const expectedVM: Partial<PromotionVM> = {
          products: [...productsAdded1, ...productsAdded2]
        }
        expectVmToEqual(expectedVM)
      })
    })
  })

  const vmToObject = (vm: CreatePromotionVM): PromotionVM => {
    const res: PromotionVM = {
      name: vm.name,
      products: vm.products,
      type: vm.type
    }
    if (vm.startDate) {
      res.startDate = vm.startDate
    }
    if (vm.endDate) {
      res.endDate = vm.endDate
    }
    return res
  }

  const expectVmToEqual = (expectedVM: Partial<PromotionVM>) => {
    const defaultVM: PromotionVM = {
      name: '',
      products: [],
      type: ReductionType.Fixed
    }
    const expected: PromotionVM = {
      ...defaultVM,
      ...expectedVM
    }
    expect(vmToObject(vm)).toStrictEqual(expected)
  }
})

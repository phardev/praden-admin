import type { CreateManualOrderDTO } from '@core/usecases/order/manual-order-creation/createManualOrder'
import { useFormStore } from '@store/formStore'

export interface OrderLineVM {
  productUuid: string
  productName: string
  priceWithoutTax: number
  percentTaxRate: number
  quantity: number
  weight: number
}

interface StepDefinition {
  label: string
}

export interface CreateOrderVM {
  get(field: string): any
  set(field: string, value: any): void
  getStep(): number
  nextStep(): void
  prevStep(): void
  canGoNext(): boolean
  addLine(line: OrderLineVM): void
  removeLine(index: number): void
  setLineQuantity(index: number, quantity: number): void
  setLinePrice(index: number, price: number): void
  getLineTotalWithTax(index: number): number
  getOrderTotalWithTax(): number
  selectCustomer(customer: {
    uuid: string
    firstname: string
    lastname: string
    email: string
    phone: string
  }): void
  clearCustomer(): void
  copyDeliveryToBilling(): void
  getDto(): CreateManualOrderDTO
  getSteps(): Array<StepDefinition>
}

const EMPTY_ADDRESS = {
  name: '',
  address: '',
  zip: '',
  city: '',
  country: '',
  phone: ''
}

const EMPTY_CUSTOMER = {
  uuid: undefined,
  firstname: '',
  lastname: '',
  email: '',
  phone: ''
}

const STEPS: Array<StepDefinition> = [
  { label: 'orders.create.customerStep' },
  { label: 'orders.create.productsStep' },
  { label: 'orders.create.deliveryStep' },
  { label: 'orders.create.reviewStep' }
]

const calculateLineTotalWithTax = (line: OrderLineVM): number => {
  return Math.round(
    line.priceWithoutTax * (1 + line.percentTaxRate / 100) * line.quantity
  )
}

const isCustomerStepValid = (state: any): boolean => {
  const customer = state.customer
  const address = state.deliveryAddress
  return (
    !!customer.firstname &&
    !!customer.lastname &&
    !!customer.email &&
    !!customer.phone &&
    !!address.name &&
    !!address.address &&
    !!address.zip &&
    !!address.city &&
    !!address.country &&
    !!address.phone
  )
}

const isProductsStepValid = (state: any): boolean => {
  return state.lines.length > 0
}

const isDeliveryStepValid = (state: any): boolean => {
  return !!state.deliveryMethodUuid
}

export const createOrderVM = (key: string): CreateOrderVM => {
  const formStore = useFormStore()

  formStore.set(key, {
    currentStep: 0,
    customer: { ...EMPTY_CUSTOMER },
    deliveryAddress: { ...EMPTY_ADDRESS },
    billingAddress: { ...EMPTY_ADDRESS },
    lines: [],
    deliveryMethodUuid: '',
    promotionCode: undefined,
    customerMessage: undefined,
    sameAsDelivery: true
  })

  const getState = () => formStore.get(key)

  const get = (field: string): any => {
    return getState()[field]
  }

  const set = (field: string, value: any): void => {
    formStore.set(key, { [field]: value })
  }

  const getStep = (): number => {
    return getState().currentStep
  }

  const nextStep = (): void => {
    const current = getState().currentStep
    if (current < STEPS.length - 1) {
      formStore.set(key, { currentStep: current + 1 })
    }
  }

  const prevStep = (): void => {
    const current = getState().currentStep
    if (current > 0) {
      formStore.set(key, { currentStep: current - 1 })
    }
  }

  const canGoNext = (): boolean => {
    const state = getState()
    const step = state.currentStep
    if (step === 0) return isCustomerStepValid(state)
    if (step === 1) return isProductsStepValid(state)
    if (step === 2) return isDeliveryStepValid(state)
    return true
  }

  const addLine = (line: OrderLineVM): void => {
    const lines = [...getState().lines, line]
    formStore.set(key, { lines })
  }

  const removeLine = (index: number): void => {
    const lines = [...getState().lines]
    lines.splice(index, 1)
    formStore.set(key, { lines })
  }

  const setLineQuantity = (index: number, quantity: number): void => {
    const lines = [...getState().lines]
    lines[index] = { ...lines[index], quantity }
    formStore.set(key, { lines })
  }

  const setLinePrice = (index: number, price: number): void => {
    const lines = [...getState().lines]
    lines[index] = { ...lines[index], priceWithoutTax: price }
    formStore.set(key, { lines })
  }

  const getLineTotalWithTax = (index: number): number => {
    return calculateLineTotalWithTax(getState().lines[index])
  }

  const getOrderTotalWithTax = (): number => {
    return getState().lines.reduce(
      (sum: number, line: OrderLineVM) => sum + calculateLineTotalWithTax(line),
      0
    )
  }

  const selectCustomer = (customer: {
    uuid: string
    firstname: string
    lastname: string
    email: string
    phone: string
  }): void => {
    formStore.set(key, {
      customer: {
        uuid: customer.uuid,
        firstname: customer.firstname,
        lastname: customer.lastname,
        email: customer.email,
        phone: customer.phone
      }
    })
  }

  const clearCustomer = (): void => {
    formStore.set(key, { customer: { ...EMPTY_CUSTOMER } })
  }

  const copyDeliveryToBilling = (): void => {
    const deliveryAddress = getState().deliveryAddress
    formStore.set(key, { billingAddress: { ...deliveryAddress } })
  }

  const getDto = (): CreateManualOrderDTO => {
    const state = getState()
    return {
      customer: state.customer,
      deliveryAddress: state.deliveryAddress,
      billingAddress: state.billingAddress,
      lines: state.lines.map((line: OrderLineVM) => ({
        productUuid: line.productUuid,
        priceWithoutTax: line.priceWithoutTax,
        percentTaxRate: line.percentTaxRate,
        quantity: line.quantity,
        weight: line.weight
      })),
      deliveryMethodUuid: state.deliveryMethodUuid,
      promotionCode: state.promotionCode,
      customerMessage: state.customerMessage
    }
  }

  const getSteps = (): Array<StepDefinition> => {
    return STEPS
  }

  return {
    get,
    set,
    getStep,
    nextStep,
    prevStep,
    canGoNext,
    addLine,
    removeLine,
    setLineQuantity,
    setLinePrice,
    getLineTotalWithTax,
    getOrderTotalWithTax,
    selectCustomer,
    clearCustomer,
    copyDeliveryToBilling,
    getDto,
    getSteps
  }
}

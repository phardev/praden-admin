import { useFormStore } from '@store/formStore'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import type { CreateOrderVM } from './createOrderVM'
import { createOrderVM } from './createOrderVM'

describe('createOrderVM', () => {
  const key = 'orders-new'
  let vm: CreateOrderVM

  beforeEach(() => {
    setActivePinia(createPinia())
    vm = createOrderVM(key)
  })

  it('should initialize with step 0', () => {
    expect(vm.getStep()).toStrictEqual(0)
  })

  it('should initialize with empty customer fields', () => {
    const formStore = useFormStore()
    expect(formStore.get(key).customer).toStrictEqual({
      uuid: undefined,
      firstname: '',
      lastname: '',
      email: '',
      phone: ''
    })
  })

  it('should initialize with empty lines', () => {
    const formStore = useFormStore()
    expect(formStore.get(key).lines).toStrictEqual([])
  })

  it('should initialize with sameAsDelivery true', () => {
    const formStore = useFormStore()
    expect(formStore.get(key).sameAsDelivery).toStrictEqual(true)
  })

  describe('canGoNext', () => {
    it('should return false when customer fields are empty on step 0', () => {
      expect(vm.canGoNext()).toStrictEqual(false)
    })

    it('should return true when customer fields are filled on step 0', () => {
      vm.set('customer', {
        uuid: undefined,
        firstname: 'Jean',
        lastname: 'Dupont',
        email: 'jean@test.com',
        phone: '0600000000'
      })
      vm.set('deliveryAddress', {
        name: 'Jean Dupont',
        address: '1 rue de Paris',
        zip: '75001',
        city: 'Paris',
        country: 'France',
        phone: '0600000000'
      })
      expect(vm.canGoNext()).toStrictEqual(true)
    })

    it('should return false when no lines on step 1', () => {
      vm.set('customer', {
        uuid: undefined,
        firstname: 'Jean',
        lastname: 'Dupont',
        email: 'jean@test.com',
        phone: '0600000000'
      })
      vm.set('deliveryAddress', {
        name: 'Jean Dupont',
        address: '1 rue de Paris',
        zip: '75001',
        city: 'Paris',
        country: 'France',
        phone: '0600000000'
      })
      vm.nextStep()
      expect(vm.canGoNext()).toStrictEqual(false)
    })

    it('should return true when lines exist on step 1', () => {
      vm.set('customer', {
        uuid: undefined,
        firstname: 'Jean',
        lastname: 'Dupont',
        email: 'jean@test.com',
        phone: '0600000000'
      })
      vm.set('deliveryAddress', {
        name: 'Jean Dupont',
        address: '1 rue de Paris',
        zip: '75001',
        city: 'Paris',
        country: 'France',
        phone: '0600000000'
      })
      vm.nextStep()
      vm.addLine({
        productUuid: 'prod-1',
        productName: 'Doliprane',
        priceWithoutTax: 500,
        percentTaxRate: 5.5,
        quantity: 1,
        weight: 100
      })
      expect(vm.canGoNext()).toStrictEqual(true)
    })

    it('should return false when no delivery method on step 2', () => {
      vm.set('customer', {
        uuid: undefined,
        firstname: 'Jean',
        lastname: 'Dupont',
        email: 'jean@test.com',
        phone: '0600000000'
      })
      vm.set('deliveryAddress', {
        name: 'Jean Dupont',
        address: '1 rue de Paris',
        zip: '75001',
        city: 'Paris',
        country: 'France',
        phone: '0600000000'
      })
      vm.nextStep()
      vm.addLine({
        productUuid: 'prod-1',
        productName: 'Doliprane',
        priceWithoutTax: 500,
        percentTaxRate: 5.5,
        quantity: 1,
        weight: 100
      })
      vm.nextStep()
      expect(vm.canGoNext()).toStrictEqual(false)
    })

    it('should return true when delivery method selected on step 2', () => {
      vm.set('customer', {
        uuid: undefined,
        firstname: 'Jean',
        lastname: 'Dupont',
        email: 'jean@test.com',
        phone: '0600000000'
      })
      vm.set('deliveryAddress', {
        name: 'Jean Dupont',
        address: '1 rue de Paris',
        zip: '75001',
        city: 'Paris',
        country: 'France',
        phone: '0600000000'
      })
      vm.nextStep()
      vm.addLine({
        productUuid: 'prod-1',
        productName: 'Doliprane',
        priceWithoutTax: 500,
        percentTaxRate: 5.5,
        quantity: 1,
        weight: 100
      })
      vm.nextStep()
      vm.set('deliveryMethodUuid', 'dm-1')
      expect(vm.canGoNext()).toStrictEqual(true)
    })
  })

  describe('addLine', () => {
    it('should add a product line', () => {
      vm.addLine({
        productUuid: 'prod-1',
        productName: 'Doliprane',
        priceWithoutTax: 500,
        percentTaxRate: 5.5,
        quantity: 1,
        weight: 100
      })
      expect(vm.get('lines')).toStrictEqual([
        {
          productUuid: 'prod-1',
          productName: 'Doliprane',
          priceWithoutTax: 500,
          percentTaxRate: 5.5,
          quantity: 1,
          weight: 100
        }
      ])
    })
  })

  describe('removeLine', () => {
    it('should remove a product line by index', () => {
      vm.addLine({
        productUuid: 'prod-1',
        productName: 'Doliprane',
        priceWithoutTax: 500,
        percentTaxRate: 5.5,
        quantity: 1,
        weight: 100
      })
      vm.addLine({
        productUuid: 'prod-2',
        productName: 'Efferalgan',
        priceWithoutTax: 300,
        percentTaxRate: 5.5,
        quantity: 2,
        weight: 150
      })
      vm.removeLine(0)
      expect(vm.get('lines')).toStrictEqual([
        {
          productUuid: 'prod-2',
          productName: 'Efferalgan',
          priceWithoutTax: 300,
          percentTaxRate: 5.5,
          quantity: 2,
          weight: 150
        }
      ])
    })
  })

  describe('getLineTotalWithTax', () => {
    it('should calculate line total with tax correctly', () => {
      vm.addLine({
        productUuid: 'prod-1',
        productName: 'Doliprane',
        priceWithoutTax: 1000,
        percentTaxRate: 20,
        quantity: 3,
        weight: 100
      })
      expect(vm.getLineTotalWithTax(0)).toStrictEqual(3600)
    })
  })

  describe('getOrderTotalWithTax', () => {
    it('should sum all line totals with tax', () => {
      vm.addLine({
        productUuid: 'prod-1',
        productName: 'Doliprane',
        priceWithoutTax: 1000,
        percentTaxRate: 20,
        quantity: 2,
        weight: 100
      })
      vm.addLine({
        productUuid: 'prod-2',
        productName: 'Efferalgan',
        priceWithoutTax: 500,
        percentTaxRate: 10,
        quantity: 1,
        weight: 150
      })
      expect(vm.getOrderTotalWithTax()).toStrictEqual(2950)
    })
  })

  describe('selectCustomer', () => {
    it('should fill customer and address fields', () => {
      vm.selectCustomer({
        uuid: 'cust-1',
        firstname: 'Jean',
        lastname: 'Dupont',
        email: 'jean@test.com',
        phone: '0600000000'
      })
      expect(vm.get('customer')).toStrictEqual({
        uuid: 'cust-1',
        firstname: 'Jean',
        lastname: 'Dupont',
        email: 'jean@test.com',
        phone: '0600000000'
      })
    })
  })

  describe('clearCustomer', () => {
    it('should reset customer fields', () => {
      vm.selectCustomer({
        uuid: 'cust-1',
        firstname: 'Jean',
        lastname: 'Dupont',
        email: 'jean@test.com',
        phone: '0600000000'
      })
      vm.clearCustomer()
      expect(vm.get('customer')).toStrictEqual({
        uuid: undefined,
        firstname: '',
        lastname: '',
        email: '',
        phone: ''
      })
    })
  })

  describe('copyDeliveryToBilling', () => {
    it('should copy delivery address to billing address', () => {
      const address = {
        name: 'Jean Dupont',
        address: '1 rue de Paris',
        zip: '75001',
        city: 'Paris',
        country: 'France',
        phone: '0600000000'
      }
      vm.set('deliveryAddress', address)
      vm.copyDeliveryToBilling()
      expect(vm.get('billingAddress')).toStrictEqual(address)
    })
  })

  describe('step navigation', () => {
    it('should advance step with nextStep', () => {
      vm.set('customer', {
        uuid: undefined,
        firstname: 'Jean',
        lastname: 'Dupont',
        email: 'jean@test.com',
        phone: '0600000000'
      })
      vm.set('deliveryAddress', {
        name: 'Jean Dupont',
        address: '1 rue de Paris',
        zip: '75001',
        city: 'Paris',
        country: 'France',
        phone: '0600000000'
      })
      vm.nextStep()
      expect(vm.getStep()).toStrictEqual(1)
    })

    it('should go back with prevStep', () => {
      vm.set('customer', {
        uuid: undefined,
        firstname: 'Jean',
        lastname: 'Dupont',
        email: 'jean@test.com',
        phone: '0600000000'
      })
      vm.set('deliveryAddress', {
        name: 'Jean Dupont',
        address: '1 rue de Paris',
        zip: '75001',
        city: 'Paris',
        country: 'France',
        phone: '0600000000'
      })
      vm.nextStep()
      vm.prevStep()
      expect(vm.getStep()).toStrictEqual(0)
    })

    it('should not go below step 0', () => {
      vm.prevStep()
      expect(vm.getStep()).toStrictEqual(0)
    })
  })

  describe('getDto', () => {
    it('should return correct DTO shape', () => {
      vm.set('customer', {
        uuid: 'cust-1',
        firstname: 'Jean',
        lastname: 'Dupont',
        email: 'jean@test.com',
        phone: '0600000000'
      })
      vm.set('deliveryAddress', {
        name: 'Jean Dupont',
        address: '1 rue de Paris',
        zip: '75001',
        city: 'Paris',
        country: 'France',
        phone: '0600000000'
      })
      vm.set('billingAddress', {
        name: 'Jean Dupont',
        address: '1 rue de Paris',
        zip: '75001',
        city: 'Paris',
        country: 'France',
        phone: '0600000000'
      })
      vm.addLine({
        productUuid: 'prod-1',
        productName: 'Doliprane',
        priceWithoutTax: 500,
        percentTaxRate: 5.5,
        quantity: 1,
        weight: 100
      })
      vm.set('deliveryMethodUuid', 'dm-1')
      vm.set('promotionCode', 'PROMO10')
      vm.set('customerMessage', 'Please deliver fast')

      expect(vm.getDto()).toStrictEqual({
        customer: {
          uuid: 'cust-1',
          firstname: 'Jean',
          lastname: 'Dupont',
          email: 'jean@test.com',
          phone: '0600000000'
        },
        deliveryAddress: {
          name: 'Jean Dupont',
          address: '1 rue de Paris',
          zip: '75001',
          city: 'Paris',
          country: 'France',
          phone: '0600000000'
        },
        billingAddress: {
          name: 'Jean Dupont',
          address: '1 rue de Paris',
          zip: '75001',
          city: 'Paris',
          country: 'France',
          phone: '0600000000'
        },
        lines: [
          {
            productUuid: 'prod-1',
            priceWithoutTax: 500,
            percentTaxRate: 5.5,
            quantity: 1,
            weight: 100
          }
        ],
        deliveryMethodUuid: 'dm-1',
        promotionCode: 'PROMO10',
        customerMessage: 'Please deliver fast'
      })
    })
  })

  describe('setLineQuantity', () => {
    it('should update line quantity', () => {
      vm.addLine({
        productUuid: 'prod-1',
        productName: 'Doliprane',
        priceWithoutTax: 500,
        percentTaxRate: 5.5,
        quantity: 1,
        weight: 100
      })
      vm.setLineQuantity(0, 5)
      expect(vm.get('lines')[0].quantity).toStrictEqual(5)
    })
  })

  describe('setLinePrice', () => {
    it('should override line price', () => {
      vm.addLine({
        productUuid: 'prod-1',
        productName: 'Doliprane',
        priceWithoutTax: 500,
        percentTaxRate: 5.5,
        quantity: 1,
        weight: 100
      })
      vm.setLinePrice(0, 800)
      expect(vm.get('lines')[0].priceWithoutTax).toStrictEqual(800)
    })
  })

  describe('getSteps', () => {
    it('should return 4 step definitions', () => {
      expect(vm.getSteps()).toStrictEqual([
        { label: 'orders.create.customerStep' },
        { label: 'orders.create.productsStep' },
        { label: 'orders.create.deliveryStep' },
        { label: 'orders.create.reviewStep' }
      ])
    })
  })
})

import { createPinia, setActivePinia } from 'pinia'
import { usePreparationStore } from '@store/preparationStore'
import {
  PickingSortType,
  StartPreparationsVM,
  startPreparationsVM
} from '@adapters/primary/view-models/preparations/start-preparations/startPreparationsVM'
import {
  orderToPrepare1,
  orderToPrepare2,
  orderToPrepare3,
  orderWithCustomerMessage,
  orderWithProductWithoutLocation,
  orderWithPromotionCode
} from '@utils/testData/orders'
import {
  calmosine,
  dolodent,
  productWithoutLocation,
  ultraLevure
} from '@utils/testData/products'
import { Header } from '@adapters/primary/view-models/preparations/get-orders-to-prepare/getPreparationsVM'
import { useSettingStore } from '@store/settingStore'
import { useLocationStore } from '@store/locationStore'
import { reserve, zoneGeo } from '@utils/testData/locations'
import { Location } from '@core/entities/location'

describe('Start preparations VM', () => {
  let preparationsStore: any
  let settingStore: any
  let locationStore: any

  const origin = 'https://my-website'

  const detailHeaders: Array<Header> = [
    { name: 'Référence', value: 'reference' },
    { name: 'Nom', value: 'name' },
    { name: zoneGeo.name, value: `locations.${zoneGeo.uuid}` },
    { name: reserve.name, value: `locations.${reserve.uuid}` },
    { name: 'Prix unitaire', value: 'unitPrice' },
    { name: 'Quantité', value: 'quantity' },
    { name: 'TVA', value: 'taxRate' },
    { name: 'Total', value: 'totalPrice' }
  ]

  const globalHeaders: Array<Header> = [
    { name: 'Référence', value: 'reference' },
    { name: 'Nom', value: 'name' },
    { name: zoneGeo.name, value: `locations.${zoneGeo.uuid}` },
    { name: reserve.name, value: `locations.${reserve.uuid}` },
    { name: 'Quantité', value: 'quantity' }
  ]

  beforeEach(() => {
    setActivePinia(createPinia())
    preparationsStore = usePreparationStore()
    settingStore = useSettingStore()
    locationStore = useLocationStore()
    givenExistingLocations(reserve, zoneGeo)
  })

  describe('There is some existing preparations', () => {
    beforeEach(() => {
      preparationsStore.items = [
        orderToPrepare1,
        orderToPrepare2,
        orderWithProductWithoutLocation,
        orderToPrepare3,
        orderWithPromotionCode,
        orderWithCustomerMessage
      ]
    })
    describe('There is no preparations selected', () => {
      it('should list nothing', () => {
        const vm = getStartPreparationsVM(origin)
        const expectedVM: StartPreparationsVM = {
          globalHeaders,
          detailHeaders,
          global: [],
          detail: []
        }
        expect(vm).toStrictEqual(expectedVM)
      })
    })
    describe('There is one preparation selected', () => {
      describe('The sort is by location', () => {
        beforeEach(() => {
          settingStore.set('picking-sort', PickingSortType.Location)
        })
        it('should list the preparation and sort lines by location', () => {
          preparationsStore.selected = [orderToPrepare1.uuid]
          const vm = getStartPreparationsVM(origin)
          const expectedVM: StartPreparationsVM = {
            globalHeaders,
            detailHeaders,
            global: [
              {
                reference: dolodent.ean13,
                name: dolodent.name,
                locations: dolodent.locations,
                quantity: 2
              }
            ],
            detail: [
              {
                href: `${origin}/preparations/${orderToPrepare1.uuid}`,
                reference: orderToPrepare1.uuid,
                deliveryMethodName: orderToPrepare1.deliveries[0].method.name,
                clientLastname: orderToPrepare1.deliveryAddress.lastname,
                createdDate: '21 janv. 2023',
                pickingDate: '20/01/2025 12:42',
                deliveryPrice: 'Gratuit',
                deliveryAddress: {
                  name: 'Jean Bon',
                  address: '10 rue des peupliers',
                  city: 'PlopLand',
                  zip: '12345',
                  country: 'Plop',
                  phone: '0123456789'
                },
                billingAddress: {
                  name: 'Jean Bon',
                  address: '10 rue des peupliers',
                  city: 'PlopLand',
                  zip: '12345',
                  country: 'Plop',
                  phone: '0123456789'
                },
                lines: [
                  {
                    reference: dolodent.ean13,
                    name: dolodent.name,
                    locations: dolodent.locations,
                    quantity: 2,
                    unitPrice: '5,50\u00A0€',
                    taxRate: '10 %',
                    totalPrice: '11,00\u00A0€'
                  }
                ],
                totalWithTax: '11,00\u00A0€'
              }
            ]
          }
          expect(vm).toStrictEqual(expectedVM)
        })
        it('should list the preparation for another order and sort lines by location', () => {
          preparationsStore.selected = [orderToPrepare2.uuid]
          const anotherOrigin = 'http://another-origin:3000'
          const vm = getStartPreparationsVM(anotherOrigin)
          const expectedVM: StartPreparationsVM = {
            globalHeaders,
            detailHeaders,
            global: [
              {
                reference: ultraLevure.ean13,
                name: ultraLevure.name,
                locations: ultraLevure.locations,
                quantity: 2
              },
              {
                reference: dolodent.ean13,
                name: dolodent.name,
                locations: dolodent.locations,
                quantity: 1
              }
            ],
            detail: [
              {
                href: `${anotherOrigin}/preparations/${orderToPrepare2.uuid}`,
                reference: orderToPrepare2.uuid,
                deliveryMethodName: orderToPrepare2.deliveries[0].method.name,
                clientLastname: orderToPrepare2.deliveryAddress.lastname,
                createdDate: '5 févr. 2023',
                pickingDate: '13/02/2025 16:15',
                deliveryPrice: 'Gratuit',
                deliveryAddress: {
                  name: "Jeanne D'arc",
                  address: '12 avenue du bois',
                  city: 'Boisville',
                  zip: '54321',
                  country: 'France',
                  phone: '9876543210'
                },
                billingAddress: {
                  name: "Jeanne D'arc",
                  address: '12 avenue du bois',
                  city: 'Boisville',
                  zip: '54321',
                  country: 'France',
                  phone: '9876543210'
                },
                lines: [
                  {
                    reference: ultraLevure.ean13,
                    name: ultraLevure.name,
                    locations: ultraLevure.locations,
                    quantity: 2,
                    unitPrice: '4,75\u00A0€',
                    taxRate: '10 %',
                    totalPrice: '9,50\u00A0€'
                  },
                  {
                    reference: dolodent.ean13,
                    name: dolodent.name,
                    locations: dolodent.locations,
                    quantity: 1,
                    unitPrice: '5,50\u00A0€',
                    taxRate: '10 %',
                    totalPrice: '5,50\u00A0€'
                  }
                ],
                totalWithTax: '15,00\u00A0€'
              }
            ]
          }
          expect(vm).toStrictEqual(expectedVM)
        })
        it('should list put lines without locations at the end', () => {
          preparationsStore.selected = [orderWithProductWithoutLocation.uuid]
          const anotherOrigin = 'http://another-origin:3000'
          const vm = getStartPreparationsVM(anotherOrigin)
          const expectedVM: StartPreparationsVM = {
            globalHeaders,
            detailHeaders,
            global: [
              {
                reference: calmosine.ean13,
                name: calmosine.name,
                locations: calmosine.locations,
                quantity: 2
              },
              {
                reference: productWithoutLocation.ean13,
                name: productWithoutLocation.name,
                locations: productWithoutLocation.locations,
                quantity: 3
              }
            ],
            detail: [
              {
                href: `${anotherOrigin}/preparations/${orderWithProductWithoutLocation.uuid}`,
                reference: orderWithProductWithoutLocation.uuid,
                deliveryMethodName:
                  orderWithProductWithoutLocation.deliveries[0].method.name,
                clientLastname:
                  orderWithProductWithoutLocation.deliveryAddress.lastname,
                createdDate: '21 janv. 2023',
                deliveryPrice: 'Gratuit',
                deliveryAddress: {
                  name: 'Jean Bon',
                  address: '10 rue des peupliers',
                  city: 'PlopLand',
                  zip: '12345',
                  country: 'Plop',
                  phone: '0123456789'
                },
                billingAddress: {
                  name: 'Jean Bon',
                  address: '10 rue des peupliers',
                  city: 'PlopLand',
                  zip: '12345',
                  country: 'Plop',
                  phone: '0123456789'
                },
                lines: [
                  {
                    reference: calmosine.ean13,
                    name: calmosine.name,
                    locations: calmosine.locations,
                    quantity: 2,
                    unitPrice: '8,91\u00A0€',
                    taxRate: '10 %',
                    totalPrice: '17,82\u00A0€'
                  },
                  {
                    reference: productWithoutLocation.ean13,
                    name: productWithoutLocation.name,
                    locations: productWithoutLocation.locations,
                    quantity: 3,
                    unitPrice: '6,49\u00A0€',
                    taxRate: '10 %',
                    totalPrice: '19,47\u00A0€'
                  }
                ],
                totalWithTax: '37,29\u00A0€'
              }
            ]
          }
          expect(vm).toStrictEqual(expectedVM)
        })
      })
      describe('The sort is by product name', () => {
        beforeEach(() => {
          settingStore.set('picking-sort', PickingSortType.Name)
        })
        it('should list the preparation and sort lines by product name', () => {
          preparationsStore.selected = [orderToPrepare1.uuid]
          const vm = getStartPreparationsVM(origin)
          const expectedVM: StartPreparationsVM = {
            globalHeaders,
            detailHeaders,
            global: [
              {
                reference: dolodent.ean13,
                name: dolodent.name,
                locations: dolodent.locations,
                quantity: 2
              }
            ],
            detail: [
              {
                href: `${origin}/preparations/${orderToPrepare1.uuid}`,
                reference: orderToPrepare1.uuid,
                deliveryMethodName: orderToPrepare1.deliveries[0].method.name,
                clientLastname: orderToPrepare1.deliveryAddress.lastname,
                createdDate: '21 janv. 2023',
                pickingDate: '20/01/2025 12:42',
                deliveryPrice: 'Gratuit',
                deliveryAddress: {
                  name: 'Jean Bon',
                  address: '10 rue des peupliers',
                  city: 'PlopLand',
                  zip: '12345',
                  country: 'Plop',
                  phone: '0123456789'
                },
                billingAddress: {
                  name: 'Jean Bon',
                  address: '10 rue des peupliers',
                  city: 'PlopLand',
                  zip: '12345',
                  country: 'Plop',
                  phone: '0123456789'
                },
                lines: [
                  {
                    reference: dolodent.ean13,
                    name: dolodent.name,
                    locations: dolodent.locations,
                    quantity: 2,
                    unitPrice: '5,50\u00A0€',
                    taxRate: '10 %',
                    totalPrice: '11,00\u00A0€'
                  }
                ],
                totalWithTax: '11,00\u00A0€'
              }
            ]
          }
          expect(vm).toStrictEqual(expectedVM)
        })
        it('should list the preparation for another order and sort lines by product name', () => {
          preparationsStore.selected = [orderToPrepare2.uuid]
          const anotherOrigin = 'http://another-origin:3000'
          const vm = getStartPreparationsVM(anotherOrigin)
          const expectedVM: StartPreparationsVM = {
            globalHeaders,
            detailHeaders,
            global: [
              {
                reference: dolodent.ean13,
                name: dolodent.name,
                locations: dolodent.locations,
                quantity: 1
              },
              {
                reference: ultraLevure.ean13,
                name: ultraLevure.name,
                locations: ultraLevure.locations,
                quantity: 2
              }
            ],
            detail: [
              {
                href: `${anotherOrigin}/preparations/${orderToPrepare2.uuid}`,
                reference: orderToPrepare2.uuid,
                deliveryMethodName: orderToPrepare2.deliveries[0].method.name,
                clientLastname: orderToPrepare2.deliveryAddress.lastname,
                createdDate: '5 févr. 2023',
                pickingDate: '13/02/2025 16:15',
                deliveryPrice: 'Gratuit',
                deliveryAddress: {
                  name: "Jeanne D'arc",
                  address: '12 avenue du bois',
                  city: 'Boisville',
                  zip: '54321',
                  country: 'France',
                  phone: '9876543210'
                },
                billingAddress: {
                  name: "Jeanne D'arc",
                  address: '12 avenue du bois',
                  city: 'Boisville',
                  zip: '54321',
                  country: 'France',
                  phone: '9876543210'
                },
                lines: [
                  {
                    reference: dolodent.ean13,
                    name: dolodent.name,
                    locations: dolodent.locations,
                    quantity: 1,
                    unitPrice: '5,50\u00A0€',
                    taxRate: '10 %',
                    totalPrice: '5,50\u00A0€'
                  },
                  {
                    reference: ultraLevure.ean13,
                    name: ultraLevure.name,
                    locations: ultraLevure.locations,
                    quantity: 2,
                    unitPrice: '4,75\u00A0€',
                    taxRate: '10 %',
                    totalPrice: '9,50\u00A0€'
                  }
                ],
                totalWithTax: '15,00\u00A0€'
              }
            ]
          }
          expect(vm).toStrictEqual(expectedVM)
        })
      })
      it('should display the delivery price', () => {
        preparationsStore.selected = [orderToPrepare3.uuid]
        const anotherOrigin = 'http://another-origin:3000'
        const vm = getStartPreparationsVM(anotherOrigin)
        const expectedVM: StartPreparationsVM = {
          globalHeaders,
          detailHeaders,
          global: [
            {
              reference: dolodent.ean13,
              name: dolodent.name,
              locations: dolodent.locations,
              quantity: 1
            }
          ],
          detail: [
            {
              href: `${anotherOrigin}/preparations/${orderToPrepare3.uuid}`,
              reference: orderToPrepare3.uuid,
              deliveryMethodName: orderToPrepare3.deliveries[0].method.name,
              clientLastname: orderToPrepare3.deliveryAddress.lastname,
              createdDate: '5 févr. 2023',
              deliveryPrice: '6,00\u00A0€',
              deliveryAddress: {
                name: "Jeanne D'arc",
                address: '12 avenue du bois',
                city: 'Boisville',
                zip: '54321',
                country: 'France',
                phone: '9876543210'
              },
              billingAddress: {
                name: "Jeanne D'arc",
                address: '12 avenue du bois',
                city: 'Boisville',
                zip: '54321',
                country: 'France',
                phone: '9876543210'
              },
              lines: [
                {
                  reference: dolodent.ean13,
                  name: dolodent.name,
                  locations: dolodent.locations,
                  quantity: 1,
                  unitPrice: '5,50\u00A0€',
                  taxRate: '10 %',
                  totalPrice: '5,50\u00A0€'
                }
              ],
              totalWithTax: '11,50\u00A0€'
            }
          ]
        }
        expect(vm).toStrictEqual(expectedVM)
      })
      it('should sanitize the client last name', () => {
        preparationsStore.selected = [orderToPrepare3.uuid]
        orderToPrepare3.deliveryAddress.lastname = 'NameWithé'
        const anotherOrigin = 'http://another-origin:3000'
        const vm = getStartPreparationsVM(anotherOrigin)
        const expectedVM: StartPreparationsVM = {
          globalHeaders,
          detailHeaders,
          global: [
            {
              reference: dolodent.ean13,
              name: dolodent.name,
              locations: dolodent.locations,
              quantity: 1
            }
          ],
          detail: [
            {
              href: `${anotherOrigin}/preparations/${orderToPrepare3.uuid}`,
              reference: orderToPrepare3.uuid,
              deliveryMethodName: orderToPrepare3.deliveries[0].method.name,
              clientLastname: 'NameWithe',
              createdDate: '5 févr. 2023',
              deliveryPrice: '6,00\u00A0€',
              deliveryAddress: {
                name: 'Jeanne NameWithé',
                address: '12 avenue du bois',
                city: 'Boisville',
                zip: '54321',
                country: 'France',
                phone: '9876543210'
              },
              billingAddress: {
                name: "Jeanne D'arc",
                address: '12 avenue du bois',
                city: 'Boisville',
                zip: '54321',
                country: 'France',
                phone: '9876543210'
              },
              lines: [
                {
                  reference: dolodent.ean13,
                  name: dolodent.name,
                  locations: dolodent.locations,
                  quantity: 1,
                  unitPrice: '5,50\u00A0€',
                  taxRate: '10 %',
                  totalPrice: '5,50\u00A0€'
                }
              ],
              totalWithTax: '11,50\u00A0€'
            }
          ]
        }
        expect(vm).toStrictEqual(expectedVM)
      })
      it('should display the client message', () => {
        preparationsStore.selected = [orderWithCustomerMessage.uuid]
        orderToPrepare3.deliveryAddress.lastname = 'NameWithé'
        const anotherOrigin = 'http://another-origin:3000'
        const vm = getStartPreparationsVM(anotherOrigin)
        const expectedVM: StartPreparationsVM = {
          globalHeaders,
          detailHeaders,
          global: [
            {
              reference: dolodent.ean13,
              name: dolodent.name,
              locations: dolodent.locations,
              quantity: 2
            }
          ],
          detail: [
            {
              href: `${anotherOrigin}/preparations/${orderWithCustomerMessage.uuid}`,
              reference: orderWithCustomerMessage.uuid,
              deliveryMethodName:
                orderWithCustomerMessage.deliveries[0].method.name,
              clientLastname: orderWithCustomerMessage.deliveryAddress.lastname,
              createdDate: '21 janv. 2023',
              deliveryPrice: 'Gratuit',
              clientMessage: orderWithCustomerMessage.customerMessage,
              deliveryAddress: {
                name: 'Jean Bon',
                address: '10 rue des peupliers',
                city: 'PlopLand',
                zip: '12345',
                country: 'Plop',
                phone: '0123456789'
              },
              billingAddress: {
                name: 'Jean Bon',
                address: '10 rue des peupliers',
                city: 'PlopLand',
                zip: '12345',
                country: 'Plop',
                phone: '0123456789'
              },
              lines: [
                {
                  reference: dolodent.ean13,
                  name: dolodent.name,
                  locations: dolodent.locations,
                  quantity: 2,
                  unitPrice: '5,50\u00A0€',
                  taxRate: '10 %',
                  totalPrice: '11,00\u00A0€'
                }
              ],
              totalWithTax: '11,00\u00A0€'
            }
          ]
        }
        expect(vm).toStrictEqual(expectedVM)
      })
      it('should apply promotion code discount to total for order if there is a promotion code', () => {
        preparationsStore.selected = [orderWithPromotionCode.uuid]
        const vm = getStartPreparationsVM(origin)
        const expectedVM: StartPreparationsVM = {
          globalHeaders,
          detailHeaders,
          global: [
            {
              reference: dolodent.ean13,
              name: dolodent.name,
              locations: dolodent.locations,
              quantity: 2
            }
          ],
          detail: [
            {
              href: `${origin}/preparations/${orderWithPromotionCode.uuid}`,
              reference: orderWithPromotionCode.uuid,
              deliveryMethodName:
                orderWithPromotionCode.deliveries[0].method.name,
              clientLastname: orderWithPromotionCode.deliveryAddress.lastname,
              createdDate: '21 janv. 2023',
              deliveryPrice: 'Gratuit',
              pickingDate: '20/01/2025 12:42',
              promotionCode: {
                code: 'DISCOUNT10',
                discount: '-5,00\u00A0€'
              },
              deliveryAddress: {
                name: 'Jean Bon',
                address: '10 rue des peupliers',
                city: 'PlopLand',
                zip: '12345',
                country: 'Plop',
                phone: '0123456789'
              },
              billingAddress: {
                name: 'Jean Bon',
                address: '10 rue des peupliers',
                city: 'PlopLand',
                zip: '12345',
                country: 'Plop',
                phone: '0123456789'
              },
              lines: [
                {
                  reference: dolodent.ean13,
                  name: dolodent.name,
                  locations: dolodent.locations,
                  quantity: 2,
                  unitPrice: '5,50\u00A0€',
                  taxRate: '10 %',
                  totalPrice: '11,00\u00A0€'
                }
              ],
              totalWithTax: '6,00\u00A0€'
            }
          ]
        }
        expect(vm).toStrictEqual(expectedVM)
      })
    })
    describe('There is multiple preparations selected', () => {
      describe('The sort is by location', () => {
        beforeEach(() => {
          settingStore.set('picking-sort', PickingSortType.Location)
        })
        it('should list all of them', () => {
          preparationsStore.selected = [
            orderToPrepare1.uuid,
            orderToPrepare2.uuid
          ]
          const vm = getStartPreparationsVM(origin)
          const expectedVM: StartPreparationsVM = {
            globalHeaders,
            detailHeaders,
            global: [
              {
                reference: ultraLevure.ean13,
                name: ultraLevure.name,
                locations: ultraLevure.locations,
                quantity: 2
              },
              {
                reference: dolodent.ean13,
                name: dolodent.name,
                locations: dolodent.locations,
                quantity: 3
              }
            ],
            detail: [
              {
                href: `${origin}/preparations/${orderToPrepare1.uuid}`,
                reference: orderToPrepare1.uuid,
                deliveryMethodName: orderToPrepare1.deliveries[0].method.name,
                clientLastname: orderToPrepare1.deliveryAddress.lastname,
                createdDate: '21 janv. 2023',
                pickingDate: '20/01/2025 12:42',
                deliveryPrice: 'Gratuit',
                deliveryAddress: {
                  name: 'Jean Bon',
                  address: '10 rue des peupliers',
                  city: 'PlopLand',
                  zip: '12345',
                  country: 'Plop',
                  phone: '0123456789'
                },
                billingAddress: {
                  name: 'Jean Bon',
                  address: '10 rue des peupliers',
                  city: 'PlopLand',
                  zip: '12345',
                  country: 'Plop',
                  phone: '0123456789'
                },
                lines: [
                  {
                    reference: dolodent.ean13,
                    name: dolodent.name,
                    locations: dolodent.locations,
                    quantity: 2,
                    unitPrice: '5,50\u00A0€',
                    taxRate: '10 %',
                    totalPrice: '11,00\u00A0€'
                  }
                ],
                totalWithTax: '11,00\u00A0€'
              },
              {
                href: `${origin}/preparations/${orderToPrepare2.uuid}`,
                reference: orderToPrepare2.uuid,
                deliveryMethodName: orderToPrepare2.deliveries[0].method.name,
                clientLastname: orderToPrepare2.deliveryAddress.lastname,
                createdDate: '5 févr. 2023',
                pickingDate: '13/02/2025 16:15',
                deliveryPrice: 'Gratuit',
                deliveryAddress: {
                  name: "Jeanne D'arc",
                  address: '12 avenue du bois',
                  city: 'Boisville',
                  zip: '54321',
                  country: 'France',
                  phone: '9876543210'
                },
                billingAddress: {
                  name: "Jeanne D'arc",
                  address: '12 avenue du bois',
                  city: 'Boisville',
                  zip: '54321',
                  country: 'France',
                  phone: '9876543210'
                },
                lines: [
                  {
                    reference: ultraLevure.ean13,
                    name: ultraLevure.name,
                    locations: ultraLevure.locations,
                    quantity: 2,
                    unitPrice: '4,75\u00A0€',
                    taxRate: '10 %',
                    totalPrice: '9,50\u00A0€'
                  },
                  {
                    reference: dolodent.ean13,
                    name: dolodent.name,
                    locations: dolodent.locations,
                    quantity: 1,
                    unitPrice: '5,50\u00A0€',
                    taxRate: '10 %',
                    totalPrice: '5,50\u00A0€'
                  }
                ],
                totalWithTax: '15,00\u00A0€'
              }
            ]
          }
          expect(vm).toStrictEqual(expectedVM)
        })
      })
      describe('The sort is by product name', () => {
        beforeEach(() => {
          settingStore.set('picking-sort', PickingSortType.Name)
        })
        it('should list all of them', () => {
          preparationsStore.selected = [
            orderToPrepare1.uuid,
            orderToPrepare2.uuid
          ]
          const vm = getStartPreparationsVM(origin)
          const expectedVM: StartPreparationsVM = {
            globalHeaders,
            detailHeaders,
            global: [
              {
                reference: dolodent.ean13,
                name: dolodent.name,
                locations: dolodent.locations,
                quantity: 3
              },
              {
                reference: ultraLevure.ean13,
                name: ultraLevure.name,
                locations: ultraLevure.locations,
                quantity: 2
              }
            ],
            detail: [
              {
                href: `${origin}/preparations/${orderToPrepare1.uuid}`,
                reference: orderToPrepare1.uuid,
                deliveryMethodName: orderToPrepare1.deliveries[0].method.name,
                clientLastname: orderToPrepare1.deliveryAddress.lastname,
                createdDate: '21 janv. 2023',
                pickingDate: '20/01/2025 12:42',
                deliveryPrice: 'Gratuit',
                deliveryAddress: {
                  name: 'Jean Bon',
                  address: '10 rue des peupliers',
                  city: 'PlopLand',
                  zip: '12345',
                  country: 'Plop',
                  phone: '0123456789'
                },
                billingAddress: {
                  name: 'Jean Bon',
                  address: '10 rue des peupliers',
                  city: 'PlopLand',
                  zip: '12345',
                  country: 'Plop',
                  phone: '0123456789'
                },
                lines: [
                  {
                    reference: dolodent.ean13,
                    name: dolodent.name,
                    locations: dolodent.locations,
                    quantity: 2,
                    unitPrice: '5,50\u00A0€',
                    taxRate: '10 %',
                    totalPrice: '11,00\u00A0€'
                  }
                ],
                totalWithTax: '11,00\u00A0€'
              },
              {
                href: `${origin}/preparations/${orderToPrepare2.uuid}`,
                reference: orderToPrepare2.uuid,
                deliveryMethodName: orderToPrepare2.deliveries[0].method.name,
                clientLastname: orderToPrepare2.deliveryAddress.lastname,
                createdDate: '5 févr. 2023',
                pickingDate: '13/02/2025 16:15',
                deliveryPrice: 'Gratuit',
                deliveryAddress: {
                  name: "Jeanne D'arc",
                  address: '12 avenue du bois',
                  city: 'Boisville',
                  zip: '54321',
                  country: 'France',
                  phone: '9876543210'
                },
                billingAddress: {
                  name: "Jeanne D'arc",
                  address: '12 avenue du bois',
                  city: 'Boisville',
                  zip: '54321',
                  country: 'France',
                  phone: '9876543210'
                },
                lines: [
                  {
                    reference: dolodent.ean13,
                    name: dolodent.name,
                    locations: dolodent.locations,
                    quantity: 1,
                    unitPrice: '5,50\u00A0€',
                    taxRate: '10 %',
                    totalPrice: '5,50\u00A0€'
                  },
                  {
                    reference: ultraLevure.ean13,
                    name: ultraLevure.name,
                    locations: ultraLevure.locations,
                    quantity: 2,
                    unitPrice: '4,75\u00A0€',
                    taxRate: '10 %',
                    totalPrice: '9,50\u00A0€'
                  }
                ],
                totalWithTax: '15,00\u00A0€'
              }
            ]
          }
          expect(vm).toStrictEqual(expectedVM)
        })
      })
    })
  })

  const givenExistingLocations = (...locations: Array<Location>) => {
    locationStore.items = locations
  }

  const getStartPreparationsVM = (origin: string) => {
    return startPreparationsVM(origin)
  }
})

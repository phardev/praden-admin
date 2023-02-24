import { createPinia, setActivePinia } from 'pinia'
import { usePreparationStore } from '@store/preparationStore'
import {
  StartPreparationsVM,
  startPreparationsVM
} from '@adapters/primary/view-models/start-preparations/startPreparationsVM'
import { orderToPrepare1, orderToPrepare2 } from '@utils/testData/orders'
import { dolodent, ultraLevure } from '@utils/testData/products'
import { Header } from '@adapters/primary/view-models/get-orders-to-prepare/getPreparationsVM'

describe('Start preparations VM', () => {
  let preparationsStore: any

  const origin = 'https://my-website'

  const headers: Array<Header> = [
    { name: 'Référence', value: 'reference' },
    { name: 'Nom', value: 'name' },
    { name: 'Zone géo', value: 'location' },
    { name: 'Quantité', value: 'quantity' }
  ]

  beforeEach(() => {
    setActivePinia(createPinia())
    preparationsStore = usePreparationStore()
  })

  describe('There is some existing preparations', () => {
    beforeEach(() => {
      preparationsStore.items = [orderToPrepare1, orderToPrepare2]
    })
    describe('There is no preparations selected', () => {
      it('should list nothing', () => {
        const vm = startPreparationsVM(origin)
        const expectedVM: StartPreparationsVM = {
          headers,
          global: [],
          detail: []
        }
        expect(vm).toStrictEqual(expectedVM)
      })
    })
    describe('There is one preparation selected', () => {
      it('should list the preparation', () => {
        preparationsStore.selected = [orderToPrepare1.uuid]
        const vm = startPreparationsVM(origin)
        const expectedVM: StartPreparationsVM = {
          headers,
          global: [
            {
              reference: dolodent.cip13,
              name: dolodent.name,
              location: dolodent.location,
              quantity: 2
            }
          ],
          detail: [
            {
              href: `${origin}/preparations/${orderToPrepare1.uuid}`,
              reference: orderToPrepare1.uuid,
              lines: [
                {
                  reference: dolodent.cip13,
                  name: dolodent.name,
                  location: dolodent.location,
                  quantity: 2
                }
              ]
            }
          ]
        }
        expect(vm).toStrictEqual(expectedVM)
      })
      it('should list the preparation for another order and sort lines by location', () => {
        preparationsStore.selected = [orderToPrepare2.uuid]
        const anotherOrigin = 'http://another-origin:3000'
        const vm = startPreparationsVM(anotherOrigin)
        const expectedVM: StartPreparationsVM = {
          headers,
          global: [
            {
              reference: ultraLevure.cip13,
              name: ultraLevure.name,
              location: ultraLevure.location,
              quantity: 2
            },
            {
              reference: dolodent.cip13,
              name: dolodent.name,
              location: dolodent.location,
              quantity: 1
            }
          ],
          detail: [
            {
              href: `${anotherOrigin}/preparations/${orderToPrepare2.uuid}`,
              reference: orderToPrepare2.uuid,
              lines: [
                {
                  reference: ultraLevure.cip13,
                  name: ultraLevure.name,
                  location: ultraLevure.location,
                  quantity: 2
                },
                {
                  reference: dolodent.cip13,
                  name: dolodent.name,
                  location: dolodent.location,
                  quantity: 1
                }
              ]
            }
          ]
        }
        expect(vm).toStrictEqual(expectedVM)
      })
    })
    describe('There is multiple preparations selected', () => {
      it('should list all of them', () => {
        preparationsStore.selected = [
          orderToPrepare1.uuid,
          orderToPrepare2.uuid
        ]
        const vm = startPreparationsVM(origin)
        const expectedVM: StartPreparationsVM = {
          headers,
          global: [
            {
              reference: ultraLevure.cip13,
              name: ultraLevure.name,
              location: ultraLevure.location,
              quantity: 2
            },
            {
              reference: dolodent.cip13,
              name: dolodent.name,
              location: dolodent.location,
              quantity: 3
            }
          ],
          detail: [
            {
              href: `${origin}/preparations/${orderToPrepare1.uuid}`,
              reference: orderToPrepare1.uuid,
              lines: [
                {
                  reference: dolodent.cip13,
                  name: dolodent.name,
                  location: dolodent.location,
                  quantity: 2
                }
              ]
            },
            {
              href: `${origin}/preparations/${orderToPrepare2.uuid}`,
              reference: orderToPrepare2.uuid,
              lines: [
                {
                  reference: ultraLevure.cip13,
                  name: ultraLevure.name,
                  location: ultraLevure.location,
                  quantity: 2
                },
                {
                  reference: dolodent.cip13,
                  name: dolodent.name,
                  location: dolodent.location,
                  quantity: 1
                }
              ]
            }
          ]
        }
        expect(vm).toStrictEqual(expectedVM)
      })
    })
  })
})

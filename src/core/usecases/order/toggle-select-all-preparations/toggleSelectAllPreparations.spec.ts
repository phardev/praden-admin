import { createPinia, setActivePinia } from 'pinia'
import { usePreparationStore } from '@store/preparationStore'
import { orderToPrepare1, orderToPrepare2 } from '@utils/testData/orders'
import { toggleSelectAllPreparations } from '@core/usecases/order/toggle-select-all-preparations/toggleSelectAllPreparations'

describe('Toggle select all preparations', () => {
  let preparationStore: any

  beforeEach(() => {
    setActivePinia(createPinia())
    preparationStore = usePreparationStore()
  })
  describe('There is some preparations available', () => {
    describe('There is no preparation selected', () => {
      it('should select all preparations', () => {
        toggleSelectAllPreparations([
          orderToPrepare1.uuid,
          orderToPrepare2.uuid
        ])
        expect(preparationStore.selected).toStrictEqual([
          orderToPrepare1.uuid,
          orderToPrepare2.uuid
        ])
      })
    })
    describe('There is some preparations selected', () => {
      beforeEach(() => {
        preparationStore.selected = [orderToPrepare1.uuid]
      })
      it('should unselect all preparations', () => {
        toggleSelectAllPreparations([])
        expect(preparationStore.selected).toStrictEqual([])
      })
    })
  })
})

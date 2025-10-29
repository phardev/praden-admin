import { PharmacistSelection } from '@core/entities/pharmacistSelection'
import { Product } from '@core/entities/product'
import { useFormStore } from '@store/formStore'
import { usePharmacistSelectionStore } from '@store/pharmacistSelectionStore'
import { useProductStore } from '@store/productStore'
import {
  anaca3Minceur,
  chamomilla,
  dolodent,
  ultraLevure
} from '@utils/testData/products'
import { createPinia, setActivePinia } from 'pinia'
import { pharmacistSelectionFormVM } from './pharmacistSelectionFormVM'

const toPharmacistSelection = (
  product: Product,
  order: number
): PharmacistSelection => ({
  uuid: product.uuid,
  name: product.name,
  miniature: product.miniature,
  priceWithoutTax: product.priceWithoutTax,
  percentTaxRate: product.percentTaxRate,
  price: Math.round(
    product.priceWithoutTax * (1 + product.percentTaxRate / 100)
  ),
  availableStock: product.availableStock,
  maxQuantityForOrder: product.maxQuantityForOrder,
  weight: product.weight,
  laboratory: product.laboratory?.name,
  isMedicine: product.isMedicine,
  flags: product.flags,
  promotions: [],
  order
})

describe('Pharmacist Selection Form VM', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should initialize FormStore with selected products from entity store', () => {
    const pharmacistSelectionStore = usePharmacistSelectionStore()
    const productStore = useProductStore()
    const formStore = useFormStore()
    pharmacistSelectionStore.setSelection([
      toPharmacistSelection(dolodent, 0),
      toPharmacistSelection(chamomilla, 1)
    ])
    productStore.list([dolodent, ultraLevure, anaca3Minceur, chamomilla])

    pharmacistSelectionFormVM()

    expect(formStore.get('pharmacist-selection-form')).toStrictEqual({
      productUuids: [dolodent.uuid, chamomilla.uuid]
    })
  })

  it('should read selectedProducts from FormStore', () => {
    const pharmacistSelectionStore = usePharmacistSelectionStore()
    const productStore = useProductStore()
    pharmacistSelectionStore.setSelection([
      toPharmacistSelection(dolodent, 0),
      toPharmacistSelection(chamomilla, 1)
    ])
    productStore.list([dolodent, ultraLevure, anaca3Minceur, chamomilla])

    const vm = pharmacistSelectionFormVM()

    expect(vm.selectedProducts).toStrictEqual([
      {
        uuid: dolodent.uuid,
        name: dolodent.name,
        miniature: dolodent.miniature,
        priceWithoutTax: dolodent.priceWithoutTax,
        percentTaxRate: dolodent.percentTaxRate
      },
      {
        uuid: chamomilla.uuid,
        name: chamomilla.name,
        miniature: chamomilla.miniature,
        priceWithoutTax: chamomilla.priceWithoutTax,
        percentTaxRate: chamomilla.percentTaxRate
      }
    ])
  })

  it('should reflect loading state from stores', () => {
    const pharmacistSelectionStore = usePharmacistSelectionStore()
    const productStore = useProductStore()
    pharmacistSelectionStore.setSelection([toPharmacistSelection(dolodent, 0)])
    productStore.list([dolodent])
    pharmacistSelectionStore.startLoading()

    const vm = pharmacistSelectionFormVM()

    expect(vm.isLoading).toStrictEqual(true)
  })

  it('should add product to FormStore only', () => {
    const pharmacistSelectionStore = usePharmacistSelectionStore()
    const productStore = useProductStore()
    const formStore = useFormStore()
    pharmacistSelectionStore.setSelection([toPharmacistSelection(dolodent, 0)])
    productStore.list([dolodent, ultraLevure])

    const vm = pharmacistSelectionFormVM()
    vm.addProduct(ultraLevure.uuid)

    expect({
      formStoreUuids: formStore.get('pharmacist-selection-form').productUuids,
      entityStoreUuids: pharmacistSelectionStore.selection.map(
        (item) => item.uuid
      )
    }).toStrictEqual({
      formStoreUuids: [dolodent.uuid, ultraLevure.uuid],
      entityStoreUuids: [dolodent.uuid]
    })
  })

  it('should set hasChanges to true after adding product', () => {
    const pharmacistSelectionStore = usePharmacistSelectionStore()
    const productStore = useProductStore()
    pharmacistSelectionStore.setSelection([toPharmacistSelection(dolodent, 0)])
    productStore.list([dolodent, ultraLevure])

    const vm = pharmacistSelectionFormVM()
    vm.addProduct(ultraLevure.uuid)

    expect(vm.hasChanges).toStrictEqual(true)
  })

  it('should remove product from selected list', () => {
    const pharmacistSelectionStore = usePharmacistSelectionStore()
    const productStore = useProductStore()
    pharmacistSelectionStore.setSelection([
      toPharmacistSelection(dolodent, 0),
      toPharmacistSelection(chamomilla, 1)
    ])
    productStore.list([dolodent, ultraLevure, chamomilla])

    const vm = pharmacistSelectionFormVM()
    vm.removeProduct(dolodent.uuid)

    expect(vm.selectedProducts).toStrictEqual([
      {
        uuid: chamomilla.uuid,
        name: chamomilla.name,
        miniature: chamomilla.miniature,
        priceWithoutTax: chamomilla.priceWithoutTax,
        percentTaxRate: chamomilla.percentTaxRate
      }
    ])
  })

  it('should set hasChanges to true after removing product', () => {
    const pharmacistSelectionStore = usePharmacistSelectionStore()
    const productStore = useProductStore()
    pharmacistSelectionStore.setSelection([
      toPharmacistSelection(dolodent, 0),
      toPharmacistSelection(chamomilla, 1)
    ])
    productStore.list([dolodent, chamomilla])

    const vm = pharmacistSelectionFormVM()
    vm.removeProduct(dolodent.uuid)

    expect(vm.hasChanges).toStrictEqual(true)
  })

  it('should reorder selected products by moving item from oldIndex to newIndex', () => {
    const pharmacistSelectionStore = usePharmacistSelectionStore()
    const productStore = useProductStore()
    pharmacistSelectionStore.setSelection([
      toPharmacistSelection(dolodent, 0),
      toPharmacistSelection(ultraLevure, 1),
      toPharmacistSelection(chamomilla, 2)
    ])
    productStore.list([dolodent, ultraLevure, chamomilla])

    const vm = pharmacistSelectionFormVM()
    vm.reorder(2, 0)

    expect(vm.selectedProducts).toStrictEqual([
      {
        uuid: chamomilla.uuid,
        name: chamomilla.name,
        miniature: chamomilla.miniature,
        priceWithoutTax: chamomilla.priceWithoutTax,
        percentTaxRate: chamomilla.percentTaxRate
      },
      {
        uuid: dolodent.uuid,
        name: dolodent.name,
        miniature: dolodent.miniature,
        priceWithoutTax: dolodent.priceWithoutTax,
        percentTaxRate: dolodent.percentTaxRate
      },
      {
        uuid: ultraLevure.uuid,
        name: ultraLevure.name,
        miniature: ultraLevure.miniature,
        priceWithoutTax: ultraLevure.priceWithoutTax,
        percentTaxRate: ultraLevure.percentTaxRate
      }
    ])
  })

  it('should reorder by moving item forward in list', () => {
    const pharmacistSelectionStore = usePharmacistSelectionStore()
    const productStore = useProductStore()
    pharmacistSelectionStore.setSelection([
      toPharmacistSelection(dolodent, 0),
      toPharmacistSelection(ultraLevure, 1),
      toPharmacistSelection(chamomilla, 2)
    ])
    productStore.list([dolodent, ultraLevure, chamomilla])

    const vm = pharmacistSelectionFormVM()
    vm.reorder(0, 2)

    expect(vm.getProductUuids()).toStrictEqual([
      ultraLevure.uuid,
      chamomilla.uuid,
      dolodent.uuid
    ])
  })

  it('should set hasChanges to true after reordering', () => {
    const pharmacistSelectionStore = usePharmacistSelectionStore()
    const productStore = useProductStore()
    pharmacistSelectionStore.setSelection([
      toPharmacistSelection(dolodent, 0),
      toPharmacistSelection(chamomilla, 1)
    ])
    productStore.list([dolodent, chamomilla])

    const vm = pharmacistSelectionFormVM()
    vm.reorder(1, 0)

    expect(vm.hasChanges).toStrictEqual(true)
  })

  it('should format price in EUR with French locale', () => {
    const pharmacistSelectionStore = usePharmacistSelectionStore()
    const productStore = useProductStore()
    pharmacistSelectionStore.setSelection([])
    productStore.list([])

    const vm = pharmacistSelectionFormVM()

    expect(vm.formatPrice(1250)).toStrictEqual('12,50\u00a0€')
  })

  it('should return product UUIDs in current order', () => {
    const pharmacistSelectionStore = usePharmacistSelectionStore()
    const productStore = useProductStore()
    pharmacistSelectionStore.setSelection([
      toPharmacistSelection(dolodent, 0),
      toPharmacistSelection(ultraLevure, 1),
      toPharmacistSelection(chamomilla, 2)
    ])
    productStore.list([dolodent, ultraLevure, chamomilla])

    const vm = pharmacistSelectionFormVM()
    vm.reorder(2, 0)

    expect(vm.getProductUuids()).toStrictEqual([
      chamomilla.uuid,
      dolodent.uuid,
      ultraLevure.uuid
    ])
  })

  it('should reset to store state and clear hasChanges', () => {
    const pharmacistSelectionStore = usePharmacistSelectionStore()
    const productStore = useProductStore()
    pharmacistSelectionStore.setSelection([
      toPharmacistSelection(dolodent, 0),
      toPharmacistSelection(chamomilla, 1)
    ])
    productStore.list([dolodent, ultraLevure, chamomilla])

    const vm = pharmacistSelectionFormVM()
    vm.addProduct(ultraLevure.uuid)
    vm.removeProduct(dolodent.uuid)
    vm.reset()

    const result = {
      selectedProducts: vm.selectedProducts,
      hasChanges: vm.hasChanges
    }

    expect(result).toStrictEqual({
      selectedProducts: [
        {
          uuid: dolodent.uuid,
          name: dolodent.name,
          miniature: dolodent.miniature,
          priceWithoutTax: dolodent.priceWithoutTax,
          percentTaxRate: dolodent.percentTaxRate
        },
        {
          uuid: chamomilla.uuid,
          name: chamomilla.name,
          miniature: chamomilla.miniature,
          priceWithoutTax: chamomilla.priceWithoutTax,
          percentTaxRate: chamomilla.percentTaxRate
        }
      ],
      hasChanges: false
    })
  })

  it('should reflect saving state when pharmacist selection store is loading', () => {
    const pharmacistSelectionStore = usePharmacistSelectionStore()
    const productStore = useProductStore()
    pharmacistSelectionStore.setSelection([toPharmacistSelection(dolodent, 0)])
    productStore.list([dolodent])
    pharmacistSelectionStore.startLoading()

    const vm = pharmacistSelectionFormVM()

    expect(vm.isSaving).toStrictEqual(true)
  })

  it('should reflect not saving when pharmacist selection store is not loading', () => {
    const pharmacistSelectionStore = usePharmacistSelectionStore()
    const productStore = useProductStore()
    pharmacistSelectionStore.setSelection([toPharmacistSelection(dolodent, 0)])
    productStore.list([dolodent])

    const vm = pharmacistSelectionFormVM()

    expect(vm.isSaving).toStrictEqual(false)
  })

  it('should provide reactive hasChanges that updates when accessed multiple times', () => {
    const pharmacistSelectionStore = usePharmacistSelectionStore()
    const productStore = useProductStore()
    pharmacistSelectionStore.setSelection([toPharmacistSelection(dolodent, 0)])
    productStore.list([dolodent, ultraLevure])

    const vm = pharmacistSelectionFormVM()

    const initialHasChanges = vm.hasChanges
    vm.addProduct(ultraLevure.uuid)
    const afterAddHasChanges = vm.hasChanges

    expect({
      initialHasChanges,
      afterAddHasChanges
    }).toStrictEqual({
      initialHasChanges: false,
      afterAddHasChanges: true
    })
  })

  it('should provide reactive selectedProducts that updates when accessed multiple times', () => {
    const pharmacistSelectionStore = usePharmacistSelectionStore()
    const productStore = useProductStore()
    pharmacistSelectionStore.setSelection([toPharmacistSelection(dolodent, 0)])
    productStore.list([dolodent, ultraLevure])

    const vm = pharmacistSelectionFormVM()

    const initialProducts = vm.selectedProducts
    vm.addProduct(ultraLevure.uuid)
    const afterAddProducts = vm.selectedProducts

    expect({
      initialProductsLength: initialProducts.length,
      afterAddProductsLength: afterAddProducts.length
    }).toStrictEqual({
      initialProductsLength: 1,
      afterAddProductsLength: 2
    })
  })
})

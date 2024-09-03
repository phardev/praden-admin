import { useProductStore } from '@store/productStore'
import { Product } from '@core/entities/product'
import { priceFormatter } from '@utils/formatters'
import { Header } from '@adapters/primary/view-models/preparations/get-orders-to-prepare/getPreparationsVM'
import { UUID } from '@core/types/types'
import { useSearchStore } from '@store/searchStore'

export interface GetProductsItemVM {
  uuid: UUID
  name: string
  img: string
  reference: string
  category: string
  priceWithoutTax: string
  priceWithTax: string
  availableStock: number
}

export interface GetProductsVM {
  headers: Array<Header>
  items: Array<GetProductsItemVM>
  currentSearch: string | undefined
}

export const getProductsVM = (key: string): GetProductsVM => {
  const productStore = useProductStore()
  const searchStore = useSearchStore()
  const allProducts = productStore.items
  const searchResult = searchStore.get(key)
  const searchFilter = searchStore.getFilter(key)
  const products = searchResult || allProducts
  const formatter = priceFormatter('fr-FR', 'EUR')
  const headers: Array<Header> = [
    {
      name: 'Image',
      value: 'img'
    },
    {
      name: 'Nom',
      value: 'name'
    },
    {
      name: 'Référence',
      value: 'reference'
    },
    {
      name: 'Catégorie',
      value: 'category'
    },
    {
      name: 'Prix HT',
      value: 'priceWithoutTax'
    },
    {
      name: 'Prix TTC',
      value: 'priceWithTax'
    },
    {
      name: 'Stock',
      value: 'availableStock'
    }
  ]
  return {
    headers,
    items: products.map((p: Product) => {
      const priceWithTax =
        p.priceWithoutTax + (p.priceWithoutTax * p.percentTaxRate) / 100
      return {
        uuid: p.uuid,
        name: p.name,
        img: p.miniature,
        reference: p.ean13,
        category: p.category?.name || '',
        priceWithoutTax: formatter.format(p.priceWithoutTax / 100),
        priceWithTax: formatter.format(priceWithTax / 100),
        availableStock: p.availableStock
      }
    }),
    currentSearch: searchFilter
  }
}

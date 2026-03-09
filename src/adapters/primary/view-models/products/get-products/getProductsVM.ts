import { Header } from '@adapters/primary/view-models/preparations/get-orders-to-prepare/getPreparationsVM'
import { ProductStatus } from '@core/entities/product'
import { UUID } from '@core/types/types'
import { ProductListItem } from '@core/usecases/product/product-listing/productListItem'
import { SearchProductsFilters } from '@core/usecases/product/product-searching/searchProducts'
import { useProductStore } from '@store/productStore'
import { useSearchStore } from '@store/searchStore'
import { priceFormatter } from '@utils/formatters'

export interface GetProductsItemVM {
  uuid: UUID
  name: string
  img: string
  reference: string
  laboratory: string
  categories: Array<string>
  priceWithoutTax: string
  priceWithTax: string
  availableStock: number
  isActive: boolean
  arePromotionsAllowed: boolean
}

export interface GetProductsVM {
  headers: Array<Header>
  items: Array<GetProductsItemVM>
  hasMore: boolean
  hasMoreSearch: boolean
  currentSearch: SearchProductsFilters | undefined
  searchError: string | undefined
  isLoading: boolean
  isSearchLoading: boolean
}

export const getProductsVM = (key: string): GetProductsVM => {
  const productStore = useProductStore()
  const isLoading = productStore.isLoading
  const searchStore = useSearchStore()
  const allProducts = productStore.items
  const searchResult = searchStore.get(key)
  const searchFilter = searchStore.getFilter(key)
  const searchError = searchStore.getError(key)
  const hasMoreSearch = searchStore.hasMoreSearch(key)
  const isSearchLoading = searchStore.isLoading(key)
  const products = searchResult !== undefined ? searchResult : allProducts
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
      name: 'Laboratoire',
      value: 'laboratory'
    },
    {
      name: 'Catégories',
      value: 'categories'
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
    },
    {
      name: 'Statut',
      value: 'isActive'
    },
    {
      name: 'Promotions',
      value: 'arePromotionsAllowed'
    }
  ]
  return {
    headers,
    items: products.map((p: ProductListItem) => {
      const priceWithTax =
        p.priceWithoutTax + (p.priceWithoutTax * p.percentTaxRate) / 100
      return {
        uuid: p.uuid,
        name: p.name,
        img: p.miniature,
        reference: p.ean13,
        laboratory: p.laboratory?.name || '',
        categories: p.categories.map((c) => c.name),
        priceWithoutTax: formatter.format(p.priceWithoutTax / 100),
        priceWithTax: formatter.format(priceWithTax / 100),
        availableStock: p.availableStock,
        isActive: p.status === ProductStatus.Active,
        arePromotionsAllowed:
          (p.flags?.arePromotionsAllowed ?? false) && !p.isMedicine
      }
    }),
    currentSearch: searchFilter,
    searchError: searchError
      ? 'Veuillez saisir au moins 3 caractères pour lancer la recherche.'
      : undefined,
    hasMore: productStore.hasMore.valueOf(),
    hasMoreSearch,
    isLoading,
    isSearchLoading
  }
}

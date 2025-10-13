import { useSearchStore } from '@store/searchStore'
import { useProductStore } from '@store/productStore'
import { Product } from '@core/entities/product'
import { priceFormatter } from '@utils/formatters'

export interface ProductSearchItemVM {
  uuid: string
  name: string
  miniature: string
  priceWithTax: number
  formattedPrice: string
  isSelected: boolean
}

export interface ProductSearchVM {
  searchResults: Array<ProductSearchItemVM>
  isLoading: boolean
  hasError: boolean
  errorMessage: string | undefined
}

export const productSearchVM = (
  namespace: string,
  selectedProductUuids: Array<string>
): ProductSearchVM => {
  const searchStore = useSearchStore()
  const productStore = useProductStore()
  const searchResults = searchStore.get(namespace) || []
  const searchError = searchStore.getError(namespace)

  const formatter = priceFormatter('fr-FR', 'EUR')

  return {
    searchResults: searchResults.map((product: Product) => {
      const priceWithTax = Math.round(
        product.priceWithoutTax * (1 + product.percentTaxRate / 100)
      )
      return {
        uuid: product.uuid,
        name: product.name,
        miniature: product.miniature,
        priceWithTax,
        formattedPrice: formatter.format(priceWithTax / 100),
        isSelected: selectedProductUuids.includes(product.uuid)
      }
    }),
    isLoading: productStore.isLoading,
    hasError: !!searchError,
    errorMessage: searchError
      ? 'Veuillez saisir au moins 3 caractères'
      : undefined
  }
}

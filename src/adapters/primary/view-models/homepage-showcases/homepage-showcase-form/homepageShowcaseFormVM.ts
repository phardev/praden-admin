import {
  HOMEPAGE_VISIBLE_PRODUCT_COUNT,
  ShowcaseKind,
  ShowcaseProduct
} from '@core/entities/homepageShowcase'
import { ProductPromotion, ReductionType } from '@core/entities/promotion'
import { DateProvider } from '@core/gateways/dateProvider'
import { Timestamp } from '@core/types/types'
import { useFormStore } from '@store/formStore'
import { useHomepageShowcaseStore } from '@store/homepageShowcaseStore'
import { useSearchStore } from '@store/searchStore'

export enum ShowcasePromotionStatus {
  InProgress = 'IN_PROGRESS',
  Upcoming = 'UPCOMING'
}

export enum ShowcaseItemVisibility {
  Visible = 'VISIBLE',
  BeyondLimit = 'BEYOND_LIMIT',
  NotInPromotion = 'NOT_IN_PROMOTION'
}

export interface ShowcasePromotionVM {
  status: ShowcasePromotionStatus
  discount: string
  date?: string
}

export interface ShowcaseItemVM {
  uuid: string
  name: string
  miniature: string
  price: string
  promotion?: ShowcasePromotionVM
  visibility: ShowcaseItemVisibility
}

export const HOMEPAGE_SHOWCASE_SEARCH_NAMESPACE = (kind: ShowcaseKind) =>
  `homepage-showcase-modal-${kind}`

const formKey = (kind: ShowcaseKind) => `homepage-showcase-form-${kind}`

const formatPrice = (priceInCents: number): string =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(
    priceInCents / 100
  )

const formatDiscount = (promotion: ProductPromotion): string => {
  if (promotion.type === ReductionType.Percentage) {
    return `-${new Intl.NumberFormat('fr-FR', {
      style: 'percent',
      maximumFractionDigits: 2
    }).format(promotion.amount / 100)}`
  }
  return `-${formatPrice(promotion.amount)}`
}

const formatDay = (timestamp?: Timestamp): string | undefined =>
  timestamp === undefined
    ? undefined
    : new Date(timestamp).toLocaleString('fr-FR', {
        day: 'numeric',
        month: 'short'
      })

const isStarted = (promotion: ProductPromotion, now: Timestamp): boolean =>
  promotion.startDate === undefined || promotion.startDate <= now

const isEnded = (promotion: ProductPromotion, now: Timestamp): boolean =>
  promotion.endDate !== undefined && promotion.endDate < now

const isInProgress = (promotion: ProductPromotion, now: Timestamp): boolean =>
  isStarted(promotion, now) && !isEnded(promotion, now)

const byStartDate = (a: ProductPromotion, b: ProductPromotion): number =>
  (a.startDate ?? 0) - (b.startDate ?? 0)

const toPromotionVM = (
  promotions: Array<ProductPromotion>,
  now: Timestamp
): ShowcasePromotionVM | undefined => {
  const inProgress = promotions.find((p) => isInProgress(p, now))
  if (inProgress) {
    return {
      status: ShowcasePromotionStatus.InProgress,
      discount: formatDiscount(inProgress),
      date: formatDay(inProgress.endDate)
    }
  }
  const [upcoming] = promotions
    .filter((p) => !isStarted(p, now))
    .sort(byStartDate)
  if (upcoming) {
    return {
      status: ShowcasePromotionStatus.Upcoming,
      discount: formatDiscount(upcoming),
      date: formatDay(upcoming.startDate)
    }
  }
  return undefined
}

const isDisplayable = (
  kind: ShowcaseKind,
  product: ShowcaseProduct,
  now: Timestamp
): boolean =>
  kind !== ShowcaseKind.HomepagePromotions ||
  product.promotions.some((p) => isInProgress(p, now))

const toItemVMs = (
  kind: ShowcaseKind,
  products: Array<ShowcaseProduct>,
  now: Timestamp
): Array<ShowcaseItemVM> => {
  let displayedCount = 0
  return products.map((product) => {
    let visibility = ShowcaseItemVisibility.NotInPromotion
    if (isDisplayable(kind, product, now)) {
      displayedCount++
      visibility =
        displayedCount <= HOMEPAGE_VISIBLE_PRODUCT_COUNT
          ? ShowcaseItemVisibility.Visible
          : ShowcaseItemVisibility.BeyondLimit
    }
    return {
      uuid: product.uuid,
      name: product.name,
      miniature: product.miniature,
      price: formatPrice(
        product.priceWithoutTax * (1 + product.percentTaxRate / 100)
      ),
      promotion: toPromotionVM(product.promotions, now),
      visibility
    }
  })
}

const fromSearchResult = (result: any): ShowcaseProduct => ({
  uuid: result.uuid,
  name: result.name,
  miniature: result.miniature,
  priceWithoutTax: result.priceWithoutTax,
  percentTaxRate: result.percentTaxRate,
  promotions: result.promotions ?? []
})

export const homepageShowcaseFormVM = (
  kind: ShowcaseKind,
  dateProvider: DateProvider
) => {
  const homepageShowcaseStore = useHomepageShowcaseStore()
  const formStore = useFormStore()
  const searchStore = useSearchStore()
  const key = formKey(kind)

  const savedProducts = (): Array<ShowcaseProduct> =>
    homepageShowcaseStore.get(kind)

  const getProducts = (): Array<ShowcaseProduct> =>
    formStore.get(key)?.products ?? []

  const setProducts = (products: Array<ShowcaseProduct>) => {
    formStore.set(key, { products })
  }

  const reset = () => {
    setProducts(JSON.parse(JSON.stringify(savedProducts())))
  }

  if (!formStore.get(key)) {
    reset()
  }

  const findProduct = (productUuid: string): ShowcaseProduct | undefined => {
    const saved = savedProducts().find((p) => p.uuid === productUuid)
    if (saved) {
      return saved
    }
    const results = searchStore.get(HOMEPAGE_SHOWCASE_SEARCH_NAMESPACE(kind))
    const found = (results ?? []).find((p: any) => p.uuid === productUuid)
    return found ? fromSearchResult(found) : undefined
  }

  const addProduct = (productUuid: string) => {
    const product = findProduct(productUuid)
    if (product) {
      setProducts([...getProducts(), product])
    }
  }

  const removeProduct = (productUuid: string) => {
    setProducts(getProducts().filter((p) => p.uuid !== productUuid))
  }

  const reorder = (oldIndex: number, newIndex: number) => {
    const reordered = [...getProducts()]
    const [moved] = reordered.splice(oldIndex, 1)
    reordered.splice(newIndex, 0, moved)
    setProducts(reordered)
  }

  const getProductUuids = (): Array<string> => getProducts().map((p) => p.uuid)

  const items = (): Array<ShowcaseItemVM> =>
    toItemVMs(kind, getProducts(), dateProvider.now())

  const visibleCount = (): number =>
    items().filter((i) => i.visibility === ShowcaseItemVisibility.Visible)
      .length

  return {
    get items() {
      return items()
    },
    get selectedCount() {
      return getProducts().length
    },
    get visibleCount() {
      return visibleCount()
    },
    get isHiddenOnShop() {
      return kind === ShowcaseKind.HomepagePromotions && visibleCount() === 0
    },
    get hasChanges() {
      return (
        JSON.stringify(getProductUuids()) !==
        JSON.stringify(savedProducts().map((p) => p.uuid))
      )
    },
    get isLoading() {
      return homepageShowcaseStore.isLoading
    },
    get isSaving() {
      return homepageShowcaseStore.isLoading
    },
    get hasSaveFailed() {
      return homepageShowcaseStore.error !== null
    },
    searchNamespace: HOMEPAGE_SHOWCASE_SEARCH_NAMESPACE(kind),
    addProduct,
    removeProduct,
    reorder,
    getProductUuids,
    getProducts,
    reset
  }
}

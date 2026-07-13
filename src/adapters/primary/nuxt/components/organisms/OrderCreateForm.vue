<template lang="pug">
.grid.gap-6.pb-24(class="grid-cols-1 lg:grid-cols-3 lg:pb-0")
  .space-y-6(class="lg:col-span-2")
    UCard
      template(#header)
        h2.text-lg.font-semibold {{ $t('orders.create.customer.title') }}
      customer-search-select(
        :selected-customer="formState.customer"
        @selected="customerSelected"
        @change="customerCleared"
      )

    UCard
      template(#header)
        h2.text-lg.font-semibold {{ $t('orders.create.products.title') }}
      ft-text-field(
        v-model="productSearch"
        :placeholder="$t('orders.create.products.searchPlaceholder')"
        for="order-create-product-search"
        type="text"
        name="order-create-product-search"
        @input="productSearchChanged"
        @keyup.enter="productInputSubmitted"
      ) {{ $t('orders.create.products.searchLabel') }}
      p.text-sm.text-warning.mt-1(v-if="productSearchVM.hasError") {{ $t('orders.create.products.minimumSearch') }}
      .space-y-3.mt-4(v-if="productSearchVM.isLoading")
        USkeleton.h-16(v-for="n in 3" :key="n")
      .space-y-2.mt-4.max-h-96.overflow-y-auto(v-else-if="productSearchVM.results.length > 0")
        .p-4.bg-white.border.rounded.flex.items-center.justify-between(
          v-for="product in productSearchVM.results"
          :key="product.uuid"
        )
          .flex.items-center.flex-1
            img.mr-3.rounded(
              v-if="product.miniature"
              :src="product.miniature"
              :alt="product.name"
              width="40"
              height="40"
            )
            .flex-1
              .font-medium {{ product.name }}
              .text-sm.text-gray-600
                | {{ product.ean13 }} · {{ product.formattedPriceWithTax }} · {{ $t('orders.create.products.stock', { stock: product.availableStock }) }}
                UBadge.ml-2(v-if="product.hasPromotion" color="green" variant="soft" size="xs") {{ $t('orders.create.products.promo') }}
          UButton(
            v-if="!product.isAdded"
            color="primary"
            variant="soft"
            icon="i-heroicons-plus"
            :label="$t('orders.create.products.add')"
            @click="productAddedFromResults(product.uuid)"
          )
          span.text-sm.text-gray-500(v-else) {{ $t('orders.create.products.added') }}
      .text-center.py-4.text-gray-500(v-else-if="hasSearchedProducts")
        p {{ $t('orders.create.products.noResults') }}
      ft-table.mt-6(
        v-if="linesVM.length > 0"
        :headers="linesHeaders"
        :items="linesVM"
        item-key="productUuid"
      )
        template(#title) {{ $t('orders.create.products.linesTitle') }}
        template(#name="{ item }")
          .font-medium {{ item.name }}
          p.text-sm.text-warning(v-if="item.maxQuantityError") {{ $t('orders.create.products.maxQuantity', { max: item.maxQuantityForOrder }) }}
          p.text-sm.text-warning(v-if="item.unavailable") {{ $t('orders.create.products.stockWarning', { stock: item.availableStock }) }}
        template(#formattedUnitPrice="{ item }")
          span {{ item.formattedUnitPrice }}
          UBadge.ml-2(v-if="item.hasPromotion" color="green" variant="soft" size="xs") {{ $t('orders.create.products.promo') }}
        template(#quantity="{ item }")
          ft-quantity-stepper(
            :model-value="item.quantity"
            :max="item.maxQuantityForOrder"
            @update:model-value="quantityChanged(item.productUuid, $event)"
          )
        template(#actions="{ item }")
          UButton(
            color="red"
            variant="ghost"
            icon="i-heroicons-trash"
            @click="lineRemoved(item.productUuid)"
          )

    UCard
      template(#header)
        h2.text-lg.font-semibold {{ $t('orders.create.delivery.title') }}
      .space-y-3
        .p-4.border.rounded.flex.items-center.justify-between(
          v-for="choice in deliveryChoicesVM"
          :key="choice.uuid"
          :class="deliveryChoiceClasses(choice)"
          @click="deliveryMethodSelected(choice)"
        )
          .flex.items-center.gap-3
            URadio(
              :model-value="formState.deliveryMethod?.uuid"
              :value="choice.uuid"
              :disabled="choice.disabled"
            )
            div
              .font-medium {{ choice.name }}
              .text-sm.text-gray-600(v-if="choice.delay") {{ choice.delay }}
              .text-sm.text-warning(v-if="choice.disabledReason") {{ $t(choice.disabledReason) }}
          .font-medium(v-if="!choice.disabled")
            span(v-if="choice.isFree") {{ $t('orders.create.delivery.free') }}
            span(v-else) {{ choice.formattedFee }}
      .mt-4.border-t.pt-4(v-if="requiresSelectedRelayPoint")
        h3.font-medium.mb-2 {{ $t('orders.create.delivery.relaySearch.title') }}
        .mt-3.p-3.border.rounded(
          v-if="formState.selectedRelayPoint"
          class="border-primary-500 bg-primary-50"
        )
          .text-sm.font-medium.text-primary-700 {{ $t('orders.create.delivery.relaySearch.selected') }}
          .font-medium {{ formState.selectedRelayPoint.name }}
          .text-sm.text-gray-600 {{ formState.selectedRelayPoint.address }}
          .text-sm.text-gray-600 {{ formState.selectedRelayPoint.zipCode }} {{ formState.selectedRelayPoint.city }}
        template(v-if="isDpdRelay")
          .flex.flex-wrap.items-end.gap-3.mt-3
            UFormGroup(:label="$t('orders.create.delivery.relaySearch.zip')")
              ft-text-field(v-model="relaySearchZip")
            UFormGroup(:label="$t('orders.create.delivery.relaySearch.city')")
              ft-text-field(v-model="relaySearchCity")
            UButton(
              icon="i-heroicons-magnifying-glass"
              :label="$t('orders.create.delivery.relaySearch.search')"
              :loading="relaySearchVM.isLoading"
              :disabled="!relaySearchZip || !relaySearchCity"
              @click="searchRelayPoints"
            )
          .mt-3.space-y-2.max-h-80.overflow-y-auto(
            v-if="relaySearchVM.points.length > 0"
          )
            .p-3.border.rounded.cursor-pointer(
              v-for="point in relaySearchVM.points"
              :key="point.id"
              :class="relayPointClasses(point.id)"
              @click="selectRelayPoint(point.id)"
            )
              .flex.justify-between.items-start.gap-2
                div
                  .font-medium {{ point.name }}
                  .text-sm.text-gray-600 {{ point.address }}
                  .text-sm.text-gray-600 {{ point.cityLine }}
                  .text-xs.text-gray-500(v-if="point.formattedDistance") {{ point.formattedDistance }}
                UIcon.text-primary-500.w-5.h-5(
                  v-if="formState.selectedRelayPoint?.id === point.id"
                  name="i-heroicons-check-circle"
                )
          p.text-sm.text-gray-500.mt-2(
            v-else-if="hasSearchedRelay && !relaySearchVM.isLoading"
          ) {{ $t('orders.create.delivery.relaySearch.noResult') }}
        template(v-else-if="isColissimoRelay")
          UButton.mt-3(
            icon="i-heroicons-map-pin"
            :label="$t('orders.create.delivery.relaySearch.choose')"
            @click="showColissimoModal = true"
          )
          colissimo-relay-point-modal(
            :show="showColissimoModal"
            :prefill-address="formState.deliveryAddress"
            @close="showColissimoModal = false"
            @selected="colissimoPointSelected"
          )

      UFormGroup.mt-4(
        v-if="isClickAndCollect"
        :label="$t('orders.create.delivery.pickingDate')"
        name="pickingDate"
      )
        UPopover(:popper="{ placement: 'bottom-start' }")
          UButton(
            icon="i-heroicons-calendar-days-20-solid"
            :label="formState.pickingDate ? formatDisplayDate(formState.pickingDate) : $t('orders.create.delivery.selectPickingDate')"
          )
            template(#trailing)
              UButton(
                v-show="formState.pickingDate"
                color="white"
                variant="link"
                icon="i-heroicons-x-mark-20-solid"
                :padded="false"
                @click.prevent="pickingDateCleared"
              )
          template(#panel="{ close }")
            ft-date-picker(
              :model-value="formState.pickingDate"
              :min-date="minPickingDate"
              :disabled-dates="pickingDisabledDates"
              @update:model-value="pickingDateChanged"
              @close="close"
            )
      UFormGroup.mt-4(
        v-if="isClickAndCollect && formState.pickingDate"
        :label="$t('orders.create.delivery.pickingHour')"
        name="pickingHour"
      )
        USelect(
          v-model="formState.pickingHour"
          :options="pickingHours"
          :placeholder="$t('orders.create.delivery.selectPickingHour')"
          :disabled="pickingHours.length === 0"
        )
        p.text-sm.text-warning.mt-2(v-if="pickingHours.length === 0") {{ $t('orders.create.delivery.noPickingHourLeft') }}

    UCard
      template(#header)
        h2.text-lg.font-semibold {{ $t('orders.create.addresses.title') }}
      .space-y-6
        div(v-if="!isClickAndCollect")
          h3.font-medium.mb-3 {{ $t('orders.create.addresses.delivery') }}
          .grid.gap-4(class="grid-cols-1 md:grid-cols-2")
            UFormGroup(:label="$t('orders.create.addresses.firstname')")
              ft-text-field(v-model="formState.deliveryAddress.firstname")
            UFormGroup(:label="$t('orders.create.addresses.lastname')")
              ft-text-field(v-model="formState.deliveryAddress.lastname")
            UFormGroup(:label="$t('orders.create.addresses.address')")
              ft-text-field(v-model="formState.deliveryAddress.address")
            UFormGroup(:label="$t('orders.create.addresses.appartement')")
              ft-text-field(v-model="formState.deliveryAddress.appartement")
            UFormGroup(:label="$t('orders.create.addresses.zip')")
              ft-text-field(v-model="formState.deliveryAddress.zip")
            UFormGroup(:label="$t('orders.create.addresses.city')")
              ft-text-field(v-model="formState.deliveryAddress.city")
            UFormGroup(:label="$t('orders.create.addresses.country')")
              ft-text-field(v-model="formState.deliveryAddress.country")
          ft-checkbox.mt-4(
            v-model="formState.billingSameAsDelivery"
            :label="$t('orders.create.addresses.sameBilling')"
          )
        div(v-if="isClickAndCollect || !formState.billingSameAsDelivery")
          h3.font-medium.mb-3 {{ $t('orders.create.addresses.billing') }}
          .grid.gap-4(class="grid-cols-1 md:grid-cols-2")
            UFormGroup(:label="$t('orders.create.addresses.firstname')")
              ft-text-field(v-model="formState.billingAddress.firstname")
            UFormGroup(:label="$t('orders.create.addresses.lastname')")
              ft-text-field(v-model="formState.billingAddress.lastname")
            UFormGroup(:label="$t('orders.create.addresses.address')")
              ft-text-field(v-model="formState.billingAddress.address")
            UFormGroup(:label="$t('orders.create.addresses.appartement')")
              ft-text-field(v-model="formState.billingAddress.appartement")
            UFormGroup(:label="$t('orders.create.addresses.zip')")
              ft-text-field(v-model="formState.billingAddress.zip")
            UFormGroup(:label="$t('orders.create.addresses.city')")
              ft-text-field(v-model="formState.billingAddress.city")
            UFormGroup(:label="$t('orders.create.addresses.country')")
              ft-text-field(v-model="formState.billingAddress.country")

    UCard
      template(#header)
        h2.text-lg.font-semibold {{ $t('orders.create.contact.title') }}
      .grid.gap-4(class="grid-cols-1 md:grid-cols-2")
        UFormGroup(:label="$t('orders.create.contact.email')")
          ft-text-field(v-model="formState.contact.email" type="email")
        UFormGroup(:label="$t('orders.create.contact.phone')")
          ft-text-field(v-model="formState.contact.phone" type="tel")

  div
    .space-y-4(class="lg:sticky lg:top-20")
      UCard
        template(#header)
          h2.text-lg.font-semibold {{ $t('orders.create.summary.title') }}
        .space-y-3
          .flex.justify-between
            span {{ $t('orders.create.summary.lines', { count: summaryVM.linesCount }) }}
            span {{ summaryVM.formattedLinesTotal }}
          .flex.justify-between(v-if="summaryVM.formattedDeliveryFee !== undefined")
            span {{ $t('orders.create.summary.delivery') }} — {{ formState.deliveryMethod?.name }}
            span {{ summaryVM.formattedDeliveryFee }}
          UDivider
          .flex.justify-between.font-bold.text-lg
            span {{ $t('orders.create.summary.total') }}
            span {{ summaryVM.formattedTotal }}
          div
            p.text-sm.font-medium.mb-2 {{ $t('orders.create.payment.title') }}
            .space-y-2
              URadio(
                v-model="formState.paymentMode"
                :value="ManualOrderPaymentMode.AlreadyPaid"
                :label="$t('orders.create.payment.alreadyPaid')"
              )
              URadio(
                v-model="formState.paymentMode"
                :value="ManualOrderPaymentMode.PaymentPage"
                :label="$t('orders.create.payment.payOnPaymentPage')"
              )
              URadio(
                v-model="formState.paymentMode"
                :value="ManualOrderPaymentMode.PaymentLink"
                :label="$t('orders.create.payment.sendPaymentLink')"
              )
          UAlert(
            v-if="formState.paymentMode === ManualOrderPaymentMode.PaymentPage"
            color="blue"
            variant="soft"
            icon="i-heroicons-information-circle"
            :title="$t('orders.create.payment.redirectNotice')"
          )
          UAlert(
            v-if="formState.paymentMode === ManualOrderPaymentMode.PaymentLink"
            color="blue"
            variant="soft"
            icon="i-heroicons-envelope"
            :title="$t('orders.create.payment.paymentLinkNotice')"
          )
          ft-checkbox(
            v-if="formState.paymentMode === ManualOrderPaymentMode.AlreadyPaid"
            v-model="formState.sendConfirmationEmail"
            :label="$t('orders.create.sendConfirmationEmail')"
          )
          div(v-if="summaryVM.blockers.length > 0")
            p.text-sm.font-medium.mb-1 {{ $t('orders.create.blockers.title') }}
            ul.text-sm.text-gray-600.list-disc.pl-5
              li(v-for="blocker in summaryVM.blockers" :key="blocker") {{ $t(blocker) }}
          UButton.w-full.justify-center(
            color="primary"
            size="lg"
            :label="$t('orders.create.submit')"
            :loading="isSaving"
            :disabled="!summaryVM.canSubmit || isSaving"
            @click="submit"
          )
  .fixed.bottom-0.inset-x-0.z-10.bg-white.border-t.p-4.flex.items-center.justify-between.gap-4(class="lg:hidden")
    div
      p.text-sm.text-gray-600 {{ $t('orders.create.summary.total') }}
      p.font-bold.text-lg {{ summaryVM.formattedTotal }}
    UButton(
      color="primary"
      size="lg"
      :label="$t('orders.create.submit')"
      :loading="isSaving"
      :disabled="!summaryVM.canSubmit || isSaving"
      @click="submit"
    )
</template>

<script lang="ts" setup>
import { buildCreateManualOrderDto } from '@adapters/primary/view-models/orders/create-order/buildCreateManualOrderDto'
import type { DeliveryMethodChoiceVM } from '@adapters/primary/view-models/orders/create-order/deliveryMethodChoicesVM'
import {
  deliveryMethodChoicesVM,
  requiresPickupPoint
} from '@adapters/primary/view-models/orders/create-order/deliveryMethodChoicesVM'
import { dpdRelayPointSearchVM } from '@adapters/primary/view-models/orders/create-order/dpdRelayPointSearchVM'
import type { OrderCreateFormState } from '@adapters/primary/view-models/orders/create-order/orderCreateFormState'
import {
  emptyAddress,
  emptyOrderCreateFormState
} from '@adapters/primary/view-models/orders/create-order/orderCreateFormState'
import type { MaxQuantityViolation } from '@adapters/primary/view-models/orders/create-order/orderCreateLinesVM'
import { orderCreateLinesVM } from '@adapters/primary/view-models/orders/create-order/orderCreateLinesVM'
import { orderCreateProductSearchVM } from '@adapters/primary/view-models/orders/create-order/orderCreateProductSearchVM'
import { orderCreateSummaryVM } from '@adapters/primary/view-models/orders/create-order/orderCreateSummaryVM'
import { availablePickingHours } from '@adapters/primary/view-models/orders/create-order/pickingSlotsVM'
import type { ProductWithPromotions } from '@adapters/primary/view-models/orders/create-order/productPromotionPricing'
import { parseProductSearchInput } from '@adapters/primary/view-models/orders/create-order/productSearchInputVM'
import { CarrierType } from '@core/entities/carrier'
import { DeliveryType } from '@core/entities/order'
import type { RelayPoint } from '@core/entities/relayPoint'
import { getCustomer } from '@core/usecases/customers/customer-get/getCustomer'
import { searchDpdRelayPoints } from '@core/usecases/dpd/dpd-relay-point-search/searchDpdRelayPoints'
import type { CreateManualOrderDTO } from '@core/usecases/order/manual-order-creation/createManualOrder'
import { ManualOrderPaymentMode } from '@core/usecases/order/manual-order-creation/createManualOrder'
import { searchProducts } from '@core/usecases/product/product-searching/searchProducts'
import { useCustomerStore } from '@store/customerStore'
import { useDeliveryMethodStore } from '@store/deliveryMethodStore'
import { useDeliveryPriceRuleStore } from '@store/deliveryPriceRuleStore'
import { useDpdRelayPointStore } from '@store/dpdRelayPointStore'
import { useSearchStore } from '@store/searchStore'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { useCustomerGateway } from '../../../../../../gateways/customerGateway'
import { useDateProvider } from '../../../../../../gateways/dateProvider'
import { useDpdPickupGateway } from '../../../../../../gateways/dpdPickupGateway'
import { useSearchGateway } from '../../../../../../gateways/searchGateway'

const props = defineProps<{
  isSaving: boolean
  maxQuantityViolations?: Array<MaxQuantityViolation>
}>()

const emit = defineEmits<{
  (e: 'submit', dto: CreateManualOrderDTO): void
}>()

const { t } = useI18n()
const productNamespace = 'order-create-product'
const scanNamespace = 'order-create-scan'
const minimumQueryLength = 3
const defaultCountry = 'FRANCE'

const formState = reactive<OrderCreateFormState>(emptyOrderCreateFormState())
const productSearch = ref('')

const customerStore = useCustomerStore()
const deliveryMethodStore = useDeliveryMethodStore()
const deliveryPriceRuleStore = useDeliveryPriceRuleStore()
const dpdRelayPointStore = useDpdRelayPointStore()
const searchStore = useSearchStore()
const dateProvider = useDateProvider()
const dpdPickupGateway = useDpdPickupGateway()

const relaySearchZip = ref('')
const relaySearchCity = ref('')
const hasSearchedRelay = ref(false)

const linesVM = computed(() => {
  return orderCreateLinesVM(
    formState.lines,
    dateProvider.now(),
    props.maxQuantityViolations ?? []
  )
})

const productSearchVM = computed(() => {
  return orderCreateProductSearchVM(
    productNamespace,
    formState.lines.map((line) => line.product.uuid),
    dateProvider.now()
  )
})

const hasSearchedProducts = computed(() => {
  return (
    !!searchStore.getFilter(productNamespace)?.query &&
    !productSearchVM.value.hasError
  )
})

const pricingCountry = computed(() => {
  return formState.deliveryAddress.country || defaultCountry
})

const deliveryChoicesVM = computed(() => {
  return deliveryMethodChoicesVM(
    deliveryMethodStore.items,
    deliveryPriceRuleStore.items,
    formState.lines,
    pricingCountry.value,
    dateProvider.now()
  )
})

const selectedDeliveryChoice = computed(() => {
  return deliveryChoicesVM.value.find(
    (choice) => choice.uuid === formState.deliveryMethod?.uuid
  )
})

const summaryVM = computed(() => {
  return orderCreateSummaryVM(
    formState,
    selectedDeliveryChoice.value,
    dateProvider.now()
  )
})

const isClickAndCollect = computed(() => {
  return formState.deliveryMethod?.type === DeliveryType.ClickAndCollect
})

const requiresSelectedRelayPoint = computed(() => {
  return (
    !!formState.deliveryMethod && requiresPickupPoint(formState.deliveryMethod)
  )
})

const isDpdRelay = computed(() => {
  return (
    requiresSelectedRelayPoint.value &&
    formState.deliveryMethod?.carrier.type === CarrierType.DPD
  )
})

const isColissimoRelay = computed(() => {
  return (
    requiresSelectedRelayPoint.value &&
    formState.deliveryMethod?.carrier.type === CarrierType.Colissimo
  )
})

const showColissimoModal = ref(false)

const colissimoPointSelected = (point: RelayPoint) => {
  formState.selectedRelayPoint = point
  showColissimoModal.value = false
}

const relaySearchVM = computed(() => dpdRelayPointSearchVM())

watch(isDpdRelay, (needsRelay) => {
  if (!needsRelay) {
    return
  }
  if (!relaySearchZip.value) {
    relaySearchZip.value = formState.deliveryAddress.zip
  }
  if (!relaySearchCity.value) {
    relaySearchCity.value = formState.deliveryAddress.city
  }
})

const totalRelayWeight = () => {
  return formState.lines.reduce((acc, { product, quantity }) => {
    return acc + product.weight * quantity
  }, 0)
}

const searchRelayPoints = async () => {
  hasSearchedRelay.value = true
  await searchDpdRelayPoints(
    {
      zipCode: relaySearchZip.value,
      city: relaySearchCity.value,
      weight: totalRelayWeight()
    },
    dpdPickupGateway
  )
}

const selectRelayPoint = (id: string) => {
  formState.selectedRelayPoint = dpdRelayPointStore.items.find(
    (point) => point.id === id
  )
}

const relayPointClasses = (id: string) => {
  return {
    'border-primary-500 bg-primary-50': formState.selectedRelayPoint?.id === id,
    'hover:border-gray-300': formState.selectedRelayPoint?.id !== id
  }
}

const linesHeaders = computed(() => {
  return [
    { name: t('orders.create.products.headers.product'), value: 'name' },
    {
      name: t('orders.create.products.headers.unitPrice'),
      value: 'formattedUnitPrice'
    },
    { name: t('orders.create.products.headers.quantity'), value: 'quantity' },
    {
      name: t('orders.create.products.headers.total'),
      value: 'formattedLineTotal'
    },
    { name: '', value: 'actions' }
  ]
})

const customerSelected = async (customerUuid: string) => {
  await getCustomer(customerUuid, useCustomerGateway())
  const customer = customerStore.current
  if (!customer) {
    return
  }
  formState.customer = customer
  formState.contact = { email: customer.email, phone: customer.phone ?? '' }
  const prefilledAddress = customer.address
    ? { ...emptyAddress(), ...customer.address }
    : {
        ...emptyAddress(),
        firstname: customer.firstname,
        lastname: customer.lastname
      }
  formState.deliveryAddress = { ...prefilledAddress }
  formState.billingAddress = { ...prefilledAddress }
}

const customerCleared = () => {
  formState.customer = undefined
}

let debounceTimer: ReturnType<typeof setTimeout> | null = null

const productSearchChanged = (e: Event) => {
  if (debounceTimer) {
    clearTimeout(debounceTimer)
  }
  debounceTimer = setTimeout(() => {
    const target = e.target as HTMLInputElement
    searchProducts(
      productNamespace,
      { query: target.value, minimumQueryLength },
      useSearchGateway()
    )
  }, 300)
}

const addProduct = (product: ProductWithPromotions) => {
  const existingLine = formState.lines.find(
    (line) => line.product.uuid === product.uuid
  )
  if (existingLine) {
    existingLine.quantity += 1
  } else {
    formState.lines.push({
      product,
      quantity: 1,
      promotions: product.promotions
    })
  }
}

const productAddedFromResults = (productUuid: string) => {
  const results: Array<ProductWithPromotions> =
    searchStore.get(productNamespace) || []
  const product = results.find((p) => p.uuid === productUuid)
  if (product) {
    addProduct(product)
  }
}

const productInputSubmitted = async () => {
  const input = parseProductSearchInput(productSearch.value)
  if (input.type !== 'scan') {
    return
  }
  if (debounceTimer) {
    clearTimeout(debounceTimer)
  }
  productSearch.value = ''
  await addScannedProduct(input.ean13)
}

const addScannedProduct = async (ean13: string) => {
  await searchProducts(
    scanNamespace,
    { query: ean13, minimumQueryLength },
    useSearchGateway()
  )
  const results: Array<ProductWithPromotions> =
    searchStore.get(scanNamespace) || []
  const product = results.find((p) => p.ean13 === ean13)
  if (product) {
    addProduct(product)
    useToast().add({
      title: t('orders.create.products.scanAdded', { name: product.name }),
      color: 'green'
    })
  } else {
    useToast().add({
      title: t('orders.create.products.scanNotFound'),
      color: 'red'
    })
  }
}

const quantityChanged = (productUuid: string, quantity: number) => {
  const line = formState.lines.find((l) => l.product.uuid === productUuid)
  if (line) {
    line.quantity = quantity
  }
}

const lineRemoved = (productUuid: string) => {
  formState.lines = formState.lines.filter(
    (line) => line.product.uuid !== productUuid
  )
}

const deliveryMethodSelected = (choice: DeliveryMethodChoiceVM) => {
  if (choice.disabled) {
    return
  }
  const previousMethodUuid = formState.deliveryMethod?.uuid
  formState.deliveryMethod = deliveryMethodStore.items.find(
    (method) => method.uuid === choice.uuid
  )
  if (formState.deliveryMethod?.uuid !== previousMethodUuid) {
    formState.selectedRelayPoint = undefined
  }
}

const deliveryChoiceClasses = (choice: DeliveryMethodChoiceVM) => {
  return {
    'opacity-50 cursor-not-allowed': choice.disabled,
    'cursor-pointer': !choice.disabled,
    'border-primary-500': formState.deliveryMethod?.uuid === choice.uuid
  }
}

const formatDisplayDate = (timestamp: number) => {
  return format(new Date(timestamp), 'd MMMM yyyy', { locale: fr })
}

const pickingDateChanged = (timestamp: number) => {
  formState.pickingDate = timestamp
  formState.pickingHour = undefined
}

const pickingDateCleared = () => {
  formState.pickingDate = undefined
  formState.pickingHour = undefined
}

const minPickingDate = new Date(dateProvider.now())
const pickingDisabledDates = [{ repeat: { weekdays: 1 } }]

const pickingHours = computed(() => {
  if (formState.pickingDate === undefined) {
    return []
  }
  return availablePickingHours(formState.pickingDate, dateProvider.now())
})

const submit = () => {
  if (!summaryVM.value.canSubmit) {
    return
  }
  emit('submit', buildCreateManualOrderDto(formState))
}
</script>

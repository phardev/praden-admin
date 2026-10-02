<template lang="pug">
.order-create-container.p-6
  .mb-4
    UButton(
      color="gray"
      variant="ghost"
      icon="i-heroicons-arrow-left"
      :label="$t('common.back')"
      @click="navigateTo('/orders')"
    )

  h1.text-2xl.font-bold.mb-6 {{ $t('orders.create.title') }}

  UAlert.mb-4(
    v-if="hasMaxQuantityViolations"
    color="red"
    variant="soft"
    icon="i-heroicons-exclamation-triangle"
    :title="$t('orders.create.maxQuantityAlert')"
  )

  UAlert.mb-4(
    v-if="initialState"
    color="primary"
    variant="soft"
    icon="i-heroicons-shopping-cart"
    :title="$t('orders.create.fromCart')"
  )

  UAlert.mb-4(
    v-if="unavailableProducts"
    color="amber"
    variant="soft"
    icon="i-heroicons-exclamation-triangle"
    :title="$t('orders.create.unavailableProducts', { names: unavailableProducts })"
  )

  USkeleton.h-96.w-full(v-if="!isReady")
  OrderCreateForm(
    v-else
    :is-saving="isSaving"
    :max-quantity-violations="maxQuantityViolations"
    :initial-state="initialState"
    @submit="onSubmit"
  )
</template>

<script lang="ts" setup>
import OrderCreateForm from '@adapters/primary/nuxt/components/organisms/OrderCreateForm.vue'
import type { OrderCreateFormState } from '@adapters/primary/view-models/orders/create-order/orderCreateFormState'
import {
  orderCreateFormStateFromCart,
  unavailableCartProductNames
} from '@adapters/primary/view-models/orders/create-order/orderCreateFormStateFromCart'
import type { MaxQuantityViolation } from '@adapters/primary/view-models/orders/create-order/orderCreateLinesVM'
import { manualOrderErrorMessageVM } from '@adapters/primary/view-models/orders/manual-order-error/manualOrderErrorMessageVM'
import { listDeliveryMethods } from '@core/usecases/delivery-methods/delivery-method-listing/listDeliveryMethods'
import { listDeliveryPriceRules } from '@core/usecases/delivery-price-rules/list-delivery-price-rules/listDeliveryPriceRules'
import type { CreateManualOrderDTO } from '@core/usecases/order/manual-order-creation/createManualOrder'
import {
  createManualOrder,
  ManualOrderPaymentMode
} from '@core/usecases/order/manual-order-creation/createManualOrder'
import { prepareManualOrderFromCart } from '@core/usecases/order/manual-order-from-cart/prepareManualOrderFromCart'
import { useDeliveryMethodStore } from '@store/deliveryMethodStore'
import { useManualOrderDraftStore } from '@store/manualOrderDraftStore'
import { useOrderStore } from '@store/orderStore'
import { useCartGateway } from '../../../../../../gateways/cartGateway'
import { useCustomerGateway } from '../../../../../../gateways/customerGateway'
import { useDateProvider } from '../../../../../../gateways/dateProvider'
import { useDeliveryMethodGateway } from '../../../../../../gateways/deliveryMethodGateway'
import { useDeliveryPriceRuleGateway } from '../../../../../../gateways/deliveryPriceRuleGateway'
import { useOrderGateway } from '../../../../../../gateways/orderGateway'
import { useProductGateway } from '../../../../../../gateways/productGateway'

definePageMeta({ layout: 'main' })

const { t } = useI18n()
const route = useRoute()
const isSaving = ref(false)
const isReady = ref(false)
const initialState = ref<OrderCreateFormState | undefined>(undefined)
const unavailableProducts = ref('')
const maxQuantityViolations = ref<Array<MaxQuantityViolation>>([])

const hasMaxQuantityViolations = computed(() => {
  return maxQuantityViolations.value.length > 0
})

const cartToOrder = route.query.cart as string | undefined

const prepareFromCart = async (cartUuid: string) => {
  await prepareManualOrderFromCart(
    cartUuid,
    useCartGateway(),
    useCustomerGateway(),
    useProductGateway()
  )
  const draft = useManualOrderDraftStore().draft
  if (!draft) {
    return
  }
  unavailableProducts.value = unavailableCartProductNames(
    draft.cart,
    draft.products
  )
  initialState.value = orderCreateFormStateFromCart(
    draft.customer,
    draft.cart,
    draft.products,
    useDeliveryMethodStore().items,
    useDateProvider().now()
  )
}

onMounted(async () => {
  try {
    await Promise.all([
      listDeliveryMethods(useDeliveryMethodGateway()),
      listDeliveryPriceRules(useDeliveryPriceRuleGateway())
    ])
    if (cartToOrder) {
      await prepareFromCart(cartToOrder)
    }
  } catch {
    useToast().add({ title: t('error.unknown'), color: 'red' })
  } finally {
    isReady.value = true
  }
})

const extractMaxQuantityViolations = (
  error: unknown
): Array<MaxQuantityViolation> => {
  const axiosError = error as {
    response?: {
      status?: number
      data?: { violations?: Array<MaxQuantityViolation> }
    }
  }
  if (
    axiosError.response?.status === 400 &&
    Array.isArray(axiosError.response.data?.violations)
  ) {
    return axiosError.response.data.violations
  }
  return []
}

const onSubmit = async (dto: CreateManualOrderDTO) => {
  isSaving.value = true
  maxQuantityViolations.value = []

  try {
    await createManualOrder(dto, useOrderGateway())

    const orderStore = useOrderStore()
    const paymentPageUrl = orderStore.current?.payment?.paymentPageUrl
    if (paymentPageUrl) {
      await navigateTo(paymentPageUrl, { external: true })
      return
    }

    const toast = useToast()
    toast.add({
      title:
        dto.paymentMode === ManualOrderPaymentMode.PaymentLink
          ? t('orders.create.paymentLinkSent')
          : t('orders.create.success'),
      color: 'green'
    })

    navigateTo(`/orders/${orderStore.current!.uuid}`)
  } catch (error) {
    maxQuantityViolations.value = extractMaxQuantityViolations(error)
    if (!hasMaxQuantityViolations.value) {
      const message = manualOrderErrorMessageVM(error)
      useToast().add({ title: t(message.key, message.params), color: 'red' })
    }
  } finally {
    isSaving.value = false
  }
}
</script>

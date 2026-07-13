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

  OrderCreateForm(
    :is-saving="isSaving"
    :max-quantity-violations="maxQuantityViolations"
    @submit="onSubmit"
  )
</template>

<script lang="ts" setup>
import OrderCreateForm from '@adapters/primary/nuxt/components/organisms/OrderCreateForm.vue'
import type { MaxQuantityViolation } from '@adapters/primary/view-models/orders/create-order/orderCreateLinesVM'
import { listDeliveryMethods } from '@core/usecases/delivery-methods/delivery-method-listing/listDeliveryMethods'
import { listDeliveryPriceRules } from '@core/usecases/delivery-price-rules/list-delivery-price-rules/listDeliveryPriceRules'
import type { CreateManualOrderDTO } from '@core/usecases/order/manual-order-creation/createManualOrder'
import {
  createManualOrder,
  ManualOrderPaymentMode
} from '@core/usecases/order/manual-order-creation/createManualOrder'
import { useOrderStore } from '@store/orderStore'
import { useDeliveryMethodGateway } from '../../../../../../gateways/deliveryMethodGateway'
import { useDeliveryPriceRuleGateway } from '../../../../../../gateways/deliveryPriceRuleGateway'
import { useOrderGateway } from '../../../../../../gateways/orderGateway'

definePageMeta({ layout: 'main' })

const { t } = useI18n()
const isSaving = ref(false)
const maxQuantityViolations = ref<Array<MaxQuantityViolation>>([])

const hasMaxQuantityViolations = computed(() => {
  return maxQuantityViolations.value.length > 0
})

onMounted(async () => {
  await Promise.all([
    listDeliveryMethods(useDeliveryMethodGateway()),
    listDeliveryPriceRules(useDeliveryPriceRuleGateway())
  ])
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
      const toast = useToast()
      toast.add({
        title: t('error.unknown'),
        color: 'red'
      })
    }
  } finally {
    isSaving.value = false
  }
}
</script>

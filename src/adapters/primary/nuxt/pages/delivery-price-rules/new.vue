<template lang="pug">
.delivery-price-rule-form-container.p-6
  .mb-4
    UButton(
      color="gray"
      variant="ghost"
      icon="i-heroicons-arrow-left"
      :label="$t('common.back')"
      @click="navigateTo('/delivery-price-rules')"
    )

  UCard
    template(#header)
      h1.text-2xl.font-bold {{ $t('deliveryPriceRules.form.title.create') }}

    template(#default)
      DeliveryPriceRuleForm(
        mode="create"
        :is-saving="isSaving"
        @submit="onSubmit"
        @cancel="navigateTo('/delivery-price-rules')"
      )
</template>

<script lang="ts" setup>
import DeliveryPriceRuleForm from '@adapters/primary/nuxt/components/organisms/DeliveryPriceRuleForm.vue'
import { listDeliveryMethods } from '@core/usecases/delivery-methods/delivery-method-listing/listDeliveryMethods'
import { createDeliveryPriceRule } from '@core/usecases/delivery-price-rules/create-delivery-price-rule/createDeliveryPriceRule'
import { useDeliveryMethodGateway } from '../../../../../../gateways/deliveryMethodGateway'
import { useDeliveryPriceRuleGateway } from '../../../../../../gateways/deliveryPriceRuleGateway'

definePageMeta({ layout: 'main' })

const { t } = useI18n()
const isSaving = ref(false)
const deliveryPriceRuleGateway = useDeliveryPriceRuleGateway()
const deliveryMethodGateway = useDeliveryMethodGateway()

onMounted(async () => {
  await listDeliveryMethods(deliveryMethodGateway)
})

const onSubmit = async (data: {
  deliveryMethodUuid: string
  name: string
  priceInEuros: number
  minOrderValueInEuros: number
  maxWeightInKg: number
  priority: number
  startDate: number | null
  endDate: number | null
  isActive: boolean
}) => {
  isSaving.value = true

  try {
    await createDeliveryPriceRule(
      {
        deliveryMethodUuid: data.deliveryMethodUuid,
        name: data.name,
        price: Math.round(data.priceInEuros * 100),
        minOrderValue: Math.round(data.minOrderValueInEuros * 100),
        maxWeight: data.maxWeightInKg * 1000,
        priority: data.priority,
        startDate: data.startDate,
        endDate: data.endDate,
        isActive: data.isActive
      },
      deliveryPriceRuleGateway
    )

    const toast = useToast()
    toast.add({
      title: t('deliveryPriceRules.createSuccess'),
      color: 'green'
    })

    navigateTo('/delivery-price-rules')
  } catch {
    const toast = useToast()
    toast.add({
      title: t('error.unknown'),
      color: 'red'
    })
  } finally {
    isSaving.value = false
  }
}
</script>

<style scoped>
.delivery-price-rule-form-container {
  max-width: 800px;
  margin: 0 auto;
}
</style>

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
      h1.text-2xl.font-bold {{ $t('deliveryPriceRules.form.title.edit') }}

    template(#default)
      div(v-if="isLoading")
        .flex.justify-center.items-center.py-12
          icon.animate-spin.h-8.w-8(name="i-heroicons-arrow-path")
          span.ml-2 {{ $t('common.loading') }}

      DeliveryPriceRuleForm(
        v-else-if="currentRule"
        mode="edit"
        :delivery-method-uuid="currentRule.deliveryMethodUuid"
        :name="currentRule.name"
        :price-in-euros="currentRule.price / 100"
        :min-order-value-in-euros="currentRule.minOrderValue / 100"
        :max-weight-in-kg="currentRule.maxWeight / 1000"
        :priority="currentRule.priority"
        :start-date="currentRule.startDate"
        :end-date="currentRule.endDate"
        :is-active="currentRule.isActive"
        :is-saving="isSaving"
        @submit="onSubmit"
        @cancel="navigateTo('/delivery-price-rules')"
      )
</template>

<script lang="ts" setup>
import DeliveryPriceRuleForm from '@adapters/primary/nuxt/components/organisms/DeliveryPriceRuleForm.vue'
import { listDeliveryMethods } from '@core/usecases/delivery-methods/delivery-method-listing/listDeliveryMethods'
import { editDeliveryPriceRule } from '@core/usecases/delivery-price-rules/edit-delivery-price-rule/editDeliveryPriceRule'
import { getDeliveryPriceRule } from '@core/usecases/delivery-price-rules/get-delivery-price-rule/getDeliveryPriceRule'
import { useDeliveryPriceRuleStore } from '@store/deliveryPriceRuleStore'
import { useDeliveryMethodGateway } from '../../../../../../../gateways/deliveryMethodGateway'
import { useDeliveryPriceRuleGateway } from '../../../../../../../gateways/deliveryPriceRuleGateway'

definePageMeta({ layout: 'main' })

const route = useRoute()
const { t } = useI18n()
const isLoading = ref(true)
const isSaving = ref(false)
const deliveryPriceRuleGateway = useDeliveryPriceRuleGateway()
const deliveryMethodGateway = useDeliveryMethodGateway()
const store = useDeliveryPriceRuleStore()

const currentRule = computed(() => store.current)

onMounted(async () => {
  const uuid = route.params.uuid as string
  try {
    await listDeliveryMethods(deliveryMethodGateway)
    await getDeliveryPriceRule(uuid, deliveryPriceRuleGateway)
  } catch {
    const toast = useToast()
    toast.add({
      title: t('error.unknown'),
      color: 'red'
    })
    navigateTo('/delivery-price-rules')
  } finally {
    isLoading.value = false
  }
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
  const uuid = route.params.uuid as string

  try {
    await editDeliveryPriceRule(
      uuid,
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
      title: t('deliveryPriceRules.updateSuccess'),
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

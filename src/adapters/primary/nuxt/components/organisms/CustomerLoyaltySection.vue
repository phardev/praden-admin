<template lang="pug">
.customer-loyalty-section
  div(v-if="loyaltyVM")
    .flex.items-center.justify-between.mb-4
      .flex.items-center.gap-4
        UBadge(color="primary" size="lg")
          span.text-lg.font-bold {{ loyaltyVM.pointsBalance }}
          span.ml-1 {{ $t('loyalty.customer.points') }}
      UButton(
        color="primary"
        icon="i-heroicons-plus"
        :label="$t('loyalty.customer.creditPoints')"
        @click="openCreditModal"
      )

    div(v-if="!loyaltyVM.hasTransactions")
      .text-center.py-8.text-gray-500
        p {{ $t('loyalty.customer.noTransactions') }}

    UTable(
      v-else
      :columns="columns"
      :rows="loyaltyVM.transactions"
    )
      template(#typeLabel-data="{ row }")
        span {{ $t(row.typeLabel) }}

      template(#points-data="{ row }")
        span.font-mono(:class="row.points.startsWith('+') ? 'text-green-600' : 'text-red-600'") {{ row.points }}

      template(#formattedDate-data="{ row }")
        span {{ row.formattedDate }}

      template(#description-data="{ row }")
        span {{ row.description }}

  div(v-else)
    .flex.justify-center.items-center.py-8
      span {{ $t('common.loading') }}

  UModal(v-model="isCreditModalOpen")
    UCard
      template(#header)
        h3.text-lg.font-semibold {{ $t('loyalty.customer.creditPoints') }}
      template(#default)
        credit-points-form(
          @submit="creditPoints"
          @cancel="closeCreditModal"
        )
</template>

<script lang="ts" setup>
import { getCustomerLoyaltyVM } from '@adapters/primary/view-models/loyalty/customer-loyalty/getCustomerLoyaltyVM'
import { getCustomerLoyalty } from '@core/usecases/loyalty/customer-loyalty-get/getCustomerLoyalty'
import { creditCustomerPoints } from '@core/usecases/loyalty/customer-points-credit/creditCustomerPoints'
import { useLoyaltyGateway } from '../../../../../../gateways/loyaltyGateway'

const props = defineProps<{
  customerUuid: string
}>()

const { t } = useI18n()
const loyaltyGateway = useLoyaltyGateway()
const isCreditModalOpen = ref(false)

const columns = computed(() => [
  { key: 'formattedDate', label: t('loyalty.multiplierRules.startDate') },
  { key: 'typeLabel', label: 'Type' },
  { key: 'points', label: t('loyalty.customer.points') },
  { key: 'description', label: t('loyalty.customer.description') }
])

onMounted(async () => {
  await getCustomerLoyalty(props.customerUuid, loyaltyGateway)
})

const loyaltyVM = computed(() => getCustomerLoyaltyVM())

const openCreditModal = () => {
  isCreditModalOpen.value = true
}

const closeCreditModal = () => {
  isCreditModalOpen.value = false
}

const creditPoints = async (data: { points: number; description?: string }) => {
  await creditCustomerPoints(
    props.customerUuid,
    data.points,
    loyaltyGateway,
    data.description
  )
  closeCreditModal()
}
</script>

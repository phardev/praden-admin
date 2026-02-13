<template lang="pug">
UCard
  template(#header)
    .flex.items-center.justify-between
      h2.text-lg.font-semibold {{ $t('loyalty.points.title') }}
      UButton(
        v-if="vm"
        color="primary"
        icon="i-heroicons-plus"
        size="sm"
        :label="$t('loyalty.points.credit')"
        @click="openCreditModal"
      )

  div(v-if="!vm || vm.isLoading")
    .flex.justify-center.items-center.py-8
      UIcon.animate-spin.h-6.w-6(name="i-heroicons-arrow-path")
      span.ml-2.text-gray-500 {{ $t('common.loading') }}

  div(v-else)
    .flex.items-center.justify-center.py-6.bg-gray-50.dark_bg-gray-800.rounded-lg.mb-6
      .text-center
        p.text-4xl.font-bold.text-primary {{ vm.balance }}
        p.text-sm.text-gray-500 {{ $t('loyalty.points.pointsLabel') }}

    h3.text-md.font-medium.mb-4 {{ $t('loyalty.points.history') }}

    div(v-if="vm.transactions.length === 0")
      .text-center.py-8
        UIcon.text-gray-400(name="i-heroicons-gift" size="48")
        p.text-sm.text-gray-500.mt-2 {{ $t('loyalty.points.noHistory') }}

    UTable(
      v-else
      :columns="columns"
      :rows="vm.transactions"
    )
      template(#type-data="{ row }")
        UBadge(:color="getTypeBadgeColor(row.type)")
          | {{ getTypeLabel(row.type) }}

      template(#points-data="{ row }")
        span.font-mono(:class="row.points > 0 ? 'text-green-600' : 'text-red-600'")
          | {{ row.points > 0 ? '+' : '' }}{{ row.points }}

      template(#date-data="{ row }")
        span {{ row.date }}

      template(#orderOrReason-data="{ row }")
        div
          NuxtLink(
            v-if="row.orderUuid"
            class="text-primary hover:underline"
            :to="`/orders/${row.orderUuid}`"
          ) {{ $t('loyalty.points.order') }}
          span(v-else-if="row.reason") {{ row.reason }}
          span(v-else) -

      template(#expiresAt-data="{ row }")
        span(:class="{ 'text-gray-400': row.isExpired }") {{ row.expiresAt }}

  UModal(v-model="isCreditModalOpen")
    UCard
      template(#header)
        h3.text-lg.font-semibold {{ $t('loyalty.points.creditModal.title') }}
      template(#default)
        .space-y-4
          UFormGroup(:label="$t('loyalty.points.creditModal.points')" required)
            UInput(
              v-model.number="creditForm.points"
              type="number"
              min="1"
            )
          UFormGroup(:label="$t('loyalty.points.creditModal.reason')" required)
            UTextarea(
              v-model="creditForm.reason"
              :rows="3"
            )
      template(#footer)
        .flex.justify-end.space-x-2
          UButton(
            color="gray"
            variant="ghost"
            :label="$t('loyalty.points.creditModal.cancel')"
            @click="closeCreditModal"
          )
          UButton(
            color="primary"
            :label="$t('loyalty.points.creditModal.confirm')"
            :loading="isCrediting"
            :disabled="!canCredit"
            @click="submitCredit"
          )
</template>

<script lang="ts" setup>
import type { CustomerLoyaltyVM } from '@adapters/primary/view-models/loyalty/customer-loyalty-vm/customerLoyaltyVM'
import { customerLoyaltyVM } from '@adapters/primary/view-models/loyalty/customer-loyalty-vm/customerLoyaltyVM'
import { LoyaltyTransactionType } from '@core/entities/loyaltyPointsTransaction'
import { creditManualPoints } from '@core/usecases/loyalty/credit-manual-points/creditManualPoints'
import { useLoyaltyGateway } from '../../../../../../gateways/loyaltyGateway'

interface Props {
  customerUuid: string
}

const props = defineProps<Props>()
const { t } = useI18n()

const isCreditModalOpen = ref(false)
const isCrediting = ref(false)
const creditForm = ref({
  points: 0,
  reason: ''
})

const loyaltyGateway = useLoyaltyGateway()

const vm = computed((): CustomerLoyaltyVM | null => {
  return customerLoyaltyVM()
})

const columns = computed(() => [
  { key: 'date', label: t('loyalty.points.date') },
  { key: 'type', label: t('loyalty.points.type') },
  { key: 'points', label: t('loyalty.points.pointsLabel') },
  { key: 'orderOrReason', label: t('loyalty.points.reason') },
  { key: 'expiresAt', label: t('loyalty.points.expiresAt') }
])

const getTypeBadgeColor = (type: LoyaltyTransactionType): string => {
  switch (type) {
    case LoyaltyTransactionType.Earned:
      return 'green'
    case LoyaltyTransactionType.ManualCredit:
      return 'blue'
    default:
      return 'gray'
  }
}

const getTypeLabel = (type: LoyaltyTransactionType): string => {
  switch (type) {
    case LoyaltyTransactionType.Earned:
      return t('loyalty.points.earned')
    case LoyaltyTransactionType.ManualCredit:
      return t('loyalty.points.manualCredit')
    default:
      return type
  }
}

const openCreditModal = () => {
  creditForm.value = { points: 0, reason: '' }
  isCreditModalOpen.value = true
}

const closeCreditModal = () => {
  isCreditModalOpen.value = false
}

const canCredit = computed(() => {
  return (
    creditForm.value.points > 0 && creditForm.value.reason.trim().length > 0
  )
})

const submitCredit = async () => {
  if (!canCredit.value) return

  isCrediting.value = true
  try {
    await creditManualPoints(
      props.customerUuid,
      creditForm.value.points,
      creditForm.value.reason,
      loyaltyGateway
    )
    const toast = useToast()
    toast.add({
      title: t('loyalty.points.creditSuccess'),
      color: 'green'
    })
    closeCreditModal()
  } catch {
    const toast = useToast()
    toast.add({
      title: t('loyalty.points.creditError'),
      color: 'red'
    })
  } finally {
    isCrediting.value = false
  }
}
</script>

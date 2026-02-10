<template lang="pug">
UCard
  template(#header)
    .flex.items-center.justify-between
      h2.text-lg.font-semibold {{ $t('loyalty.customerPoints.title') }}
      UButton(
        v-if="vm"
        color="primary"
        icon="i-heroicons-plus"
        size="sm"
        :label="$t('loyalty.customerPoints.manualCreditButton')"
        @click="openCreditModal"
      )

  div(v-if="!vm")
    .flex.justify-center.items-center.py-8
      icon.animate-spin.h-6.w-6(name="i-heroicons-arrow-path")
      span.ml-2.text-muted {{ $t('common.loading') }}

  div(v-else)
    div(class="flex items-center justify-center py-6 bg-gray-50 dark:bg-gray-800 rounded-lg mb-6")
      .text-center
        p.text-4xl.font-bold.text-primary {{ vm.balance }}
        p.text-sm.text-muted {{ $t('loyalty.customerPoints.points') }}

    h3.text-md.font-medium.mb-4 {{ $t('loyalty.customerPoints.history') }}

    div(v-if="vm.transactions.length === 0")
      .text-center.py-8
        UIcon.text-muted(name="i-heroicons-gift" size="48")
        p.text-sm.text-muted.mt-2 {{ $t('loyalty.customerPoints.noTransactions') }}

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

      template(#formattedCreatedAt-data="{ row }")
        span {{ row.formattedCreatedAt }}

      template(#details-data="{ row }")
        div
          span(v-if="row.orderUuid")
            nuxt-link(class="text-primary hover:underline" :to="`/orders/${row.orderUuid}`")
              | {{ $t('loyalty.customerPoints.order') }}
          span(v-else-if="row.reason") {{ row.reason }}

      template(#formattedExpiresAt-data="{ row }")
        span(v-if="row.formattedExpiresAt") {{ row.formattedExpiresAt }}
        span(v-else) -

  UModal(v-model="isCreditModalOpen")
    UCard
      template(#header)
        h3.text-lg.font-semibold {{ $t('loyalty.customerPoints.creditForm.title') }}
      template(#default)
        .space-y-4
          UFormGroup(:label="$t('loyalty.customerPoints.creditForm.points')")
            UInput(
              v-model.number="creditForm.points"
              type="number"
              min="1"
            )
          UFormGroup(:label="$t('loyalty.customerPoints.creditForm.reason')")
            UTextarea(
              v-model="creditForm.reason"
              :placeholder="$t('loyalty.customerPoints.creditForm.reasonPlaceholder')"
            )
      template(#footer)
        .flex.justify-end.space-x-2
          UButton(
            color="gray"
            :label="$t('loyalty.customerPoints.creditForm.cancel')"
            @click="closeCreditModal"
          )
          UButton(
            color="primary"
            :label="$t('loyalty.customerPoints.creditForm.submit')"
            :loading="isCrediting"
            :disabled="!canCredit"
            @click="submitCredit"
          )
</template>

<script lang="ts" setup>
import type { CustomerPointsVM } from '@adapters/primary/view-models/loyalty/customerPointsVM'
import { getCustomerPointsVM } from '@adapters/primary/view-models/loyalty/customerPointsVM'
import { LoyaltyTransactionType } from '@core/entities/loyalty'
import { creditLoyaltyPoints } from '@core/usecases/loyalty/creditLoyaltyPoints'
import { getCustomerLoyaltyPoints } from '@core/usecases/loyalty/getCustomerLoyaltyPoints'
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

onMounted(async () => {
  await getCustomerLoyaltyPoints(props.customerUuid, loyaltyGateway)
})

const vm = computed((): CustomerPointsVM | null => {
  return getCustomerPointsVM(props.customerUuid)
})

const columns = computed(() => [
  { key: 'type', label: t('loyalty.customerPoints.type') },
  { key: 'points', label: t('loyalty.customerPoints.points') },
  { key: 'formattedCreatedAt', label: t('loyalty.customerPoints.createdAt') },
  { key: 'details', label: t('loyalty.customerPoints.reason') },
  { key: 'formattedExpiresAt', label: t('loyalty.customerPoints.expiresAt') }
])

const getTypeBadgeColor = (type: LoyaltyTransactionType): string => {
  switch (type) {
    case LoyaltyTransactionType.Earned:
      return 'green'
    case LoyaltyTransactionType.ManualCredit:
      return 'blue'
    case LoyaltyTransactionType.Expired:
      return 'red'
    default:
      return 'gray'
  }
}

const getTypeLabel = (type: LoyaltyTransactionType): string => {
  switch (type) {
    case LoyaltyTransactionType.Earned:
      return t('loyalty.customerPoints.earned')
    case LoyaltyTransactionType.ManualCredit:
      return t('loyalty.customerPoints.manualCredit')
    case LoyaltyTransactionType.Expired:
      return t('loyalty.customerPoints.expired')
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
    await creditLoyaltyPoints(
      props.customerUuid,
      creditForm.value.points,
      creditForm.value.reason,
      loyaltyGateway
    )
    const toast = useToast()
    toast.add({
      title: t('loyalty.customerPoints.creditSuccess'),
      color: 'green'
    })
    closeCreditModal()
  } catch {
    const toast = useToast()
    toast.add({
      title: t('loyalty.customerPoints.creditError'),
      color: 'red'
    })
  } finally {
    isCrediting.value = false
  }
}
</script>

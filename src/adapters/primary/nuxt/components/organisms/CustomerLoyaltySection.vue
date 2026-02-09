<template lang="pug">
div
  UCard.mb-4
    template(#header)
      .flex.items-center.justify-between
        h3.text-lg.font-semibold {{ $t('loyalty.balance') }}
        .flex.items-center.space-x-2
          span.text-2xl.font-bold {{ vm.balance }}
          span.text-gray-500 {{ $t('loyalty.points') }}
    template(#default)
      .flex.justify-end
        UButton(
          color="primary"
          icon="i-heroicons-plus"
          :label="$t('loyalty.creditPoints')"
          @click="openCreditModal"
        )

  UCard
    template(#header)
      h3.text-lg.font-semibold {{ $t('loyalty.history') }}
    template(#default)
      div(v-if="vm.isLoading")
        .flex.justify-center.items-center.py-8
          icon.animate-spin.h-6.w-6(name="i-heroicons-arrow-path")
          span.ml-2 {{ $t('common.loading') }}

      div(v-else-if="vm.items.length === 0")
        .text-center.py-8.text-gray-500
          p {{ $t('loyalty.noTransactions') }}

      UTable(
        v-else
        :columns="columns"
        :rows="vm.items"
      )
        template(#createdAt-data="{ row }")
          span {{ row.createdAt }}

        template(#type-data="{ row }")
          UBadge(:color="badgeColor(row.type)")
            | {{ row.type }}

        template(#points-data="{ row }")
          span.font-mono.font-semibold(:class="pointsClass(row.points)") {{ row.points }}

        template(#orderUuid-data="{ row }")
          NuxtLink.text-primary-500.underline(
            v-if="row.orderUuid"
            :to="`/orders/get/${row.orderUuid}`"
          ) {{ $t('loyalty.order') }}
          span(v-else) -

        template(#reason-data="{ row }")
          span {{ row.reason || '-' }}

        template(#expiresAt-data="{ row }")
          span {{ row.expiresAt || '-' }}

  UModal(v-model="isCreditModalOpen")
    UCard
      template(#header)
        h3.text-lg.font-semibold {{ $t('loyalty.creditPoints') }}
      template(#default)
        .space-y-4
          UFormGroup(:label="$t('loyalty.pointsAmount')")
            UInput(
              v-model.number="creditForm.points"
              type="number"
              :min="1"
            )
          UFormGroup(:label="$t('loyalty.reason')")
            UInput(v-model="creditForm.reason")
      template(#footer)
        .flex.justify-end.space-x-2
          UButton(
            color="gray"
            :label="$t('common.cancel')"
            @click="closeCreditModal"
          )
          UButton(
            color="primary"
            :label="$t('loyalty.creditPoints')"
            :loading="isCreditLoading"
            :disabled="!isCreditFormValid"
            @click="submitCredit"
          )
</template>

<script lang="ts" setup>
import {
  type CustomerLoyaltyVM,
  getCustomerLoyaltyVM
} from '@adapters/primary/view-models/loyalty/customerLoyaltyVM'
import { creditManualPoints } from '@core/usecases/loyalty/credit-manual-points/creditManualPoints'

interface Props {
  customerUuid: string
  loyaltyGateway: any
}

const props = defineProps<Props>()
const { t } = useI18n()

const vm = computed(
  (): CustomerLoyaltyVM => getCustomerLoyaltyVM(props.customerUuid)
)

const columns = computed(() => [
  { key: 'createdAt', label: t('common.updated') },
  { key: 'type', label: 'Type' },
  { key: 'points', label: t('loyalty.points') },
  { key: 'orderUuid', label: t('loyalty.order') },
  { key: 'reason', label: t('loyalty.reason') },
  { key: 'expiresAt', label: t('loyalty.expiresAt') }
])

const badgeColor = (type: string): string => {
  const colors: Record<string, string> = {
    Gagné: 'green',
    'Crédit manuel': 'blue',
    Expiré: 'red'
  }
  return colors[type] ?? 'gray'
}

const pointsClass = (points: string): string => {
  return points.startsWith('-') ? 'text-red-500' : 'text-green-500'
}

const isCreditModalOpen = ref(false)
const isCreditLoading = ref(false)
const creditForm = reactive({
  points: 0,
  reason: ''
})

const isCreditFormValid = computed(() => {
  return creditForm.points > 0 && creditForm.reason.trim().length > 0
})

const openCreditModal = () => {
  creditForm.points = 0
  creditForm.reason = ''
  isCreditModalOpen.value = true
}

const closeCreditModal = () => {
  isCreditModalOpen.value = false
}

const submitCredit = async () => {
  if (!isCreditFormValid.value) return

  isCreditLoading.value = true
  try {
    await creditManualPoints(
      props.customerUuid,
      { points: creditForm.points, reason: creditForm.reason },
      props.loyaltyGateway
    )
    const toast = useToast()
    toast.add({ title: t('loyalty.creditPoints'), color: 'green' })
    closeCreditModal()
  } catch {
    const toast = useToast()
    toast.add({ title: t('error.unknown'), color: 'red' })
  } finally {
    isCreditLoading.value = false
  }
}
</script>

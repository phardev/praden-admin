<template lang="pug">
.section
  h1.text-title {{ $t('loyalty.title') }}

  UCard.mt-6
    template(#header)
      h2.text-subtitle {{ $t('loyalty.config.title') }}
    .space-y-4
      p.font-medium {{ $t('loyalty.config.earningRule') }}
      .flex.items-center.gap-2.flex-wrap
        span {{ $t('loyalty.config.earningRulePrefix') }}
        UInput.w-20(v-model.number="pointsPerThreshold" type="number" min="1" step="1")
        span {{ $t('loyalty.config.earningRulePoints') }}
        UInput.w-24(v-model.number="eurosPerThreshold" type="number" min="1" step="1")
        span {{ $t('loyalty.config.earningRuleSuffix') }}
      .bg-gray-50.rounded-lg.p-4.space-y-1(v-if="eurosPerThreshold > 0 && pointsPerThreshold > 0")
        p.text-sm.font-medium.text-gray-600 {{ $t('loyalty.config.earningRulePreview') }}
        p.text-sm.text-gray-500(v-for="example in previewExamples" :key="example.amount")
          | {{ $t('loyalty.config.earningRuleExample', { amount: example.amount, points: example.points }) }}
      .flex.justify-end
        ft-button.button-solid(:loading="vm.isLoading" @click="saveConfig") {{ $t('loyalty.config.save') }}

  UCard.mt-6
    template(#header)
      h2.text-subtitle {{ $t('loyalty.config.redemptionRate') }}
    .space-y-4
      .flex.items-center.gap-2.flex-wrap
        span {{ $t('loyalty.config.redemptionRatePrefix') }}
        UInput.w-24(v-model.number="eurosPerPoint" type="number" min="0.01" step="0.01")
        span {{ $t('loyalty.config.redemptionRateSuffix') }}
      .bg-gray-50.rounded-lg.p-4.space-y-1(v-if="eurosPerPoint > 0")
        p.text-sm.font-medium.text-gray-600 {{ $t('loyalty.config.redemptionRatePreview') }}
        p.text-sm.text-gray-500(v-for="example in redemptionPreviewExamples" :key="example.points")
          | {{ $t('loyalty.config.redemptionRateExample', { points: example.points, amount: example.amount }) }}
      .flex.justify-end
        ft-button.button-solid(:loading="vm.isLoading" @click="saveConfig") {{ $t('loyalty.config.save') }}

  UCard.mt-6
    template(#header)
      .flex.justify-between.items-center
        h2.text-subtitle {{ $t('loyalty.multipliers.title') }}
        ft-button.button-solid(@click="showMultiplierModal = true") {{ $t('loyalty.multipliers.create') }}
    div(v-if="vm.multipliers.length === 0")
      p.text-gray-500.text-center.py-4 {{ $t('loyalty.multipliers.noMultipliers') }}
    UTable(
      v-else
      :rows="vm.multipliers"
      :columns="multiplierColumns"
    )
      template(#status-data="{ row }")
        UBadge(
          :color="statusColor(row.status)"
          variant="subtle"
        ) {{ $t(`loyalty.multipliers.${row.status}`) }}
      template(#actions-data="{ row }")
        ft-button(
          color="red"
          variant="ghost"
          @click="onDeleteMultiplier(row.uuid)"
        ) {{ $t('loyalty.multipliers.delete') }}

  create-multiplier-modal(
    v-model="showMultiplierModal"
    @created="onMultiplierCreated"
  )
</template>

<script lang="ts" setup>
import {
  earningRateToForm,
  formToEarningRate,
  loyaltyConfigVM,
  previewPoints,
  redemptionPreviewDiscount
} from '@adapters/primary/view-models/loyalty/loyalty-config-vm/loyaltyConfigVM'
import type { UUID } from '@core/types/types'
import { createMultiplier } from '@core/usecases/loyalty/create-multiplier/createMultiplier'
import { deleteMultiplier } from '@core/usecases/loyalty/delete-multiplier/deleteMultiplier'
import { getLoyaltyConfig } from '@core/usecases/loyalty/get-loyalty-config/getLoyaltyConfig'
import { saveLoyaltyConfig } from '@core/usecases/loyalty/save-loyalty-config/saveLoyaltyConfig'
import { useLoyaltyGateway } from '../../../../../../gateways/loyaltyGateway'

definePageMeta({ layout: 'main' })

const { t } = useI18n()
const toast = useToast()
const loyaltyGateway = useLoyaltyGateway()
const pointsPerThreshold = ref(1)
const eurosPerThreshold = ref(10)
const eurosPerPoint = ref(1)
const showMultiplierModal = ref(false)

const vm = computed(() => loyaltyConfigVM())

const previewExamples = computed(() => {
  const rate = formToEarningRate(
    pointsPerThreshold.value,
    eurosPerThreshold.value
  )
  return [25, 9.99, 50].map((amount) => ({
    amount: amount.toFixed(2).replace('.', ','),
    points: previewPoints(amount, rate)
  }))
})

const redemptionPreviewExamples = computed(() => {
  const rateCentimes = Math.round(eurosPerPoint.value * 100)
  return [10, 50, 100].map((points) => ({
    points,
    amount: redemptionPreviewDiscount(points, rateCentimes)
      .toFixed(2)
      .replace('.', ',')
  }))
})

const multiplierColumns = [
  { key: 'startDate', label: t('loyalty.multipliers.startDate') },
  { key: 'endDate', label: t('loyalty.multipliers.endDate') },
  { key: 'multiplier', label: t('loyalty.multipliers.multiplier') },
  { key: 'status', label: 'Statut' },
  { key: 'actions', label: '' }
]

const statusColor = (status: string) => {
  if (status === 'active') return 'green'
  if (status === 'expired') return 'red'
  return 'blue'
}

onMounted(async () => {
  try {
    await getLoyaltyConfig(loyaltyGateway)
    const form = earningRateToForm(vm.value.earningRate)
    pointsPerThreshold.value = form.points
    eurosPerThreshold.value = form.euros
    eurosPerPoint.value = vm.value.redemptionRate / 100
  } catch {
    toast.add({
      title: t('error.unknown'),
      color: 'red'
    })
  }
})

const saveConfig = async () => {
  const earningRate = formToEarningRate(
    pointsPerThreshold.value,
    eurosPerThreshold.value
  )
  const redemptionRate = Math.round(eurosPerPoint.value * 100)
  try {
    await saveLoyaltyConfig(earningRate, redemptionRate, loyaltyGateway)
    toast.add({
      title: t('loyalty.config.saved'),
      color: 'green'
    })
  } catch {
    toast.add({
      title: t('error.unknown'),
      color: 'red'
    })
  }
}

const onMultiplierCreated = async (data: {
  startDate: number
  endDate: number
  multiplier: number
}) => {
  await createMultiplier(
    data.startDate,
    data.endDate,
    data.multiplier,
    loyaltyGateway
  )
  showMultiplierModal.value = false
}

const onDeleteMultiplier = async (uuid: UUID) => {
  await deleteMultiplier(uuid, loyaltyGateway)
}
</script>

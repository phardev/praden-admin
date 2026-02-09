<template lang="pug">
.section
  h1.text-title {{ $t('loyalty.title') }}

  UCard.mt-6
    template(#header)
      h2.text-subtitle {{ $t('loyalty.config.title') }}
    .space-y-4
      UFormGroup(:label="$t('loyalty.config.earningRate')" name="earningRate")
        UInput(
          v-model.number="earningRate"
          type="number"
          min="0"
          step="0.1"
        )
        p.text-sm.text-gray-500.mt-1 {{ $t('loyalty.config.earningRateDescription') }}
      .flex.justify-end
        ft-button.button-solid(@click="saveConfig") {{ $t('loyalty.config.save') }}

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
import { loyaltyConfigVM } from '@adapters/primary/view-models/loyalty/loyalty-config-vm/loyaltyConfigVM'
import type { UUID } from '@core/types/types'
import { createMultiplier } from '@core/usecases/loyalty/create-multiplier/createMultiplier'
import { deleteMultiplier } from '@core/usecases/loyalty/delete-multiplier/deleteMultiplier'
import { getLoyaltyConfig } from '@core/usecases/loyalty/get-loyalty-config/getLoyaltyConfig'
import { saveLoyaltyConfig } from '@core/usecases/loyalty/save-loyalty-config/saveLoyaltyConfig'
import { useLoyaltyGateway } from '../../../../../../gateways/loyaltyGateway'

definePageMeta({ layout: 'main' })

const { t } = useI18n()
const loyaltyGateway = useLoyaltyGateway()
const earningRate = ref(0)
const showMultiplierModal = ref(false)

const vm = computed(() => loyaltyConfigVM())

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
    earningRate.value = vm.value.earningRate
  } catch {
    const toast = useToast()
    toast.add({
      title: t('error.unknown'),
      color: 'red'
    })
  }
})

const saveConfig = async () => {
  await saveLoyaltyConfig(earningRate.value, loyaltyGateway)
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

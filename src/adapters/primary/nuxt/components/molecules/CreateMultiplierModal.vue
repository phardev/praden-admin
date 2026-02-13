<template lang="pug">
ft-modal(v-model="model")
  .p-6
    h3.text-lg.font-semibold.mb-4 {{ $t('loyalty.multipliers.create') }}
    .space-y-4
      UFormGroup(:label="$t('loyalty.multipliers.startDate')" name="startDate" required)
        UPopover(:popper="{ placement: 'bottom-start' }")
          UButton.w-full(
            icon="i-heroicons-calendar-days-20-solid"
            :label="startDate ? formatDisplayDate(startDate) : $t('loyalty.multipliers.startDate')"
          )
          template(#panel="{ close }")
            ft-date-picker(
              :model-value="startDate"
              @update:model-value="startDateChanged($event, close)"
            )
      UFormGroup(:label="$t('loyalty.multipliers.endDate')" name="endDate" required)
        UPopover(:popper="{ placement: 'bottom-start' }")
          UButton.w-full(
            icon="i-heroicons-calendar-days-20-solid"
            :label="endDate ? formatDisplayDate(endDate) : $t('loyalty.multipliers.endDate')"
          )
          template(#panel="{ close }")
            ft-date-picker(
              :model-value="endDate"
              @update:model-value="endDateChanged($event, close)"
            )
      UFormGroup(:label="$t('loyalty.multipliers.multiplier')" name="multiplier" required)
        UInput(
          v-model.number="multiplier"
          type="number"
          min="1"
          step="0.1"
        )
      .flex.justify-end.space-x-4
        UButton(
          color="gray"
          variant="ghost"
          :label="$t('common.cancel')"
          @click="model = false"
        )
        UButton(
          color="primary"
          :label="$t('common.create')"
          :disabled="!isValid"
          @click="confirm"
        )
</template>

<script lang="ts" setup>
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

const emit = defineEmits<{
  (
    e: 'created',
    data: { startDate: number; endDate: number; multiplier: number }
  ): void
}>()

const model = defineModel({ type: Boolean })
const startDate = ref<number | null>(null)
const endDate = ref<number | null>(null)
const multiplier = ref(2)

const isValid = computed(() => {
  return (
    startDate.value !== null && endDate.value !== null && multiplier.value >= 1
  )
})

const formatDisplayDate = (timestamp: number) => {
  return format(new Date(timestamp), 'd MMMM yyyy', { locale: fr })
}

const startDateChanged = (timestamp: number, close: () => void) => {
  startDate.value = timestamp
  close()
}

const endDateChanged = (timestamp: number, close: () => void) => {
  endDate.value = timestamp
  close()
}

const confirm = () => {
  if (!startDate.value || !endDate.value) return
  emit('created', {
    startDate: startDate.value,
    endDate: endDate.value,
    multiplier: multiplier.value
  })
  startDate.value = null
  endDate.value = null
  multiplier.value = 2
  model.value = false
}
</script>

<template lang="pug">
UForm(:state="formState" @submit="onSubmit")
  .space-y-4
    UFormGroup(:label="$t('loyalty.multiplierRules.multiplier')" name="multiplier" required)
      UInput(
        v-model.number="formState.multiplier"
        type="number"
        min="1"
        step="0.5"
      )

    .grid(class="grid-cols-1 md:grid-cols-2 gap-4")
      UFormGroup(:label="$t('loyalty.multiplierRules.startDate')" name="startDate" required)
        UPopover(:popper="{ placement: 'bottom-start' }")
          UButton.w-full(
            icon="i-heroicons-calendar-days-20-solid"
            :label="formState.startDate ? formatDisplayDate(formState.startDate) : $t('loyalty.multiplierRules.startDate')"
          )
          template(#panel="{ close }")
            ft-date-picker(
              :model-value="formState.startDate"
              @update:model-value="startDateChanged"
              @close="close"
            )

      UFormGroup(:label="$t('loyalty.multiplierRules.endDate')" name="endDate" required)
        UPopover(:popper="{ placement: 'bottom-start' }")
          UButton.w-full(
            icon="i-heroicons-calendar-days-20-solid"
            :label="formState.endDate ? formatDisplayDate(formState.endDate) : $t('loyalty.multiplierRules.endDate')"
          )
          template(#panel="{ close }")
            ft-date-picker(
              :model-value="formState.endDate"
              @update:model-value="endDateChanged"
              @close="close"
            )

    .flex.justify-end.space-x-4
      UButton(
        color="gray"
        variant="ghost"
        :label="$t('common.cancel')"
        @click="$emit('cancel')"
      )
      UButton(
        type="submit"
        color="primary"
        :label="props.rule ? $t('common.update') : $t('common.create')"
        :disabled="!isFormValid"
      )
</template>

<script lang="ts" setup>
import type { MultiplierRuleVM } from '@adapters/primary/view-models/loyalty/loyalty-config/getLoyaltyConfigVM'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

const props = defineProps<{
  rule?: MultiplierRuleVM | null
}>()

const emit = defineEmits<{
  (
    e: 'submit',
    data: { multiplier: number; startDate: number; endDate: number }
  ): void
  (e: 'cancel'): void
}>()

const formState = reactive({
  multiplier: props.rule?.multiplier ?? 2,
  startDate: props.rule?.startDate ?? (null as number | null),
  endDate: props.rule?.endDate ?? (null as number | null)
})

watch(
  () => props.rule,
  (newVal) => {
    formState.multiplier = newVal?.multiplier ?? 2
    formState.startDate = newVal?.startDate ?? null
    formState.endDate = newVal?.endDate ?? null
  }
)

const isFormValid = computed(() => {
  return (
    formState.multiplier > 0 &&
    formState.startDate !== null &&
    formState.endDate !== null
  )
})

const formatDisplayDate = (timestamp: number) => {
  return format(new Date(timestamp), 'd MMMM yyyy', { locale: fr })
}

const startDateChanged = (timestamp: number) => {
  formState.startDate = timestamp
}

const endDateChanged = (timestamp: number) => {
  formState.endDate = timestamp
}

const onSubmit = () => {
  if (!isFormValid.value) return

  emit('submit', {
    multiplier: formState.multiplier,
    startDate: formState.startDate!,
    endDate: formState.endDate!
  })
}
</script>

<template lang="pug">
ft-modal(v-model="model" @close="onClose")
  .space-y-6.p-4
    h3.text-lg.font-semibold {{ $t('customers.loyaltyCreditPoints') }}
    UFormGroup(
      :label="$t('customers.loyaltyCreditPointsAmount')"
      name="points"
    )
      UInput(
        v-model.number="points"
        type="number"
        min="1"
        :placeholder="$t('customers.loyaltyCreditPointsPlaceholder')"
      )
    UFormGroup(
      :label="$t('customers.loyaltyCreditReason')"
      name="reason"
    )
      UTextarea(
        v-model="reason"
        :placeholder="$t('customers.loyaltyCreditReasonPlaceholder')"
        :rows="3"
      )
    .flex.justify-end.gap-3
      UButton(
        variant="ghost"
        @click="onClose"
      ) {{ $t('common.cancel') }}
      UButton(
        :disabled="!isValid"
        :loading="isSubmitting"
        @click="onSubmit"
      ) {{ $t('customers.loyaltyCreditSubmit') }}
</template>

<script lang="ts" setup>
interface Props {
  customerUuid: string
}

const props = defineProps<Props>()

const model = defineModel({ type: Boolean })

const emit = defineEmits<{
  (e: 'submitted', points: number, reason: string): void
}>()

const points = ref<number | undefined>(undefined)
const reason = ref('')
const isSubmitting = ref(false)

const isValid = computed(() => {
  return (
    points.value !== undefined &&
    points.value > 0 &&
    reason.value.trim().length > 0
  )
})

const onClose = () => {
  model.value = false
  resetForm()
}

const resetForm = () => {
  points.value = undefined
  reason.value = ''
  isSubmitting.value = false
}

const onSubmit = () => {
  if (!isValid.value || points.value === undefined) return
  isSubmitting.value = true
  emit('submitted', points.value, reason.value.trim())
}

watch(model, (newVal) => {
  if (!newVal) {
    resetForm()
  }
})
</script>

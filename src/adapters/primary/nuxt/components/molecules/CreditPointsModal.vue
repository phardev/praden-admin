<template lang="pug">
ft-modal(v-model="model")
  .p-6
    h3.text-lg.font-semibold.mb-4 {{ $t('loyalty.points.creditModal.title') }}
    .space-y-4
      UFormGroup(:label="$t('loyalty.points.creditModal.points')" name="points" required)
        UInput(
          v-model.number="points"
          type="number"
          min="1"
        )
      UFormGroup(:label="$t('loyalty.points.creditModal.reason')" name="reason" required)
        UTextarea(
          v-model="reason"
          :rows="3"
        )
      .flex.justify-end.space-x-4
        UButton(
          color="gray"
          variant="ghost"
          :label="$t('loyalty.points.creditModal.cancel')"
          @click="model = false"
        )
        UButton(
          color="primary"
          :label="$t('loyalty.points.creditModal.confirm')"
          :disabled="!isValid"
          @click="confirm"
        )
</template>

<script lang="ts" setup>
defineProps<{
  customerUuid: string
}>()

const emit = defineEmits<{
  (e: 'credited', data: { points: number; reason: string }): void
}>()

const model = defineModel({ type: Boolean })
const points = ref(0)
const reason = ref('')

const isValid = computed(() => {
  return points.value > 0 && reason.value.trim().length > 0
})

const confirm = () => {
  emit('credited', {
    points: points.value,
    reason: reason.value
  })
  points.value = 0
  reason.value = ''
  model.value = false
}
</script>

<template lang="pug">
UForm(:state="formState" @submit="onSubmit")
  .space-y-4
    UFormGroup(:label="$t('loyalty.customer.points')" name="points" required)
      UInput(
        v-model.number="formState.points"
        type="number"
        min="1"
        step="1"
      )

    UFormGroup(:label="$t('loyalty.customer.description')" name="description")
      UInput(
        v-model="formState.description"
        type="text"
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
        :label="$t('loyalty.customer.credit')"
        :disabled="!isFormValid"
      )
</template>

<script lang="ts" setup>
const emit = defineEmits<{
  (e: 'submit', data: { points: number; description?: string }): void
  (e: 'cancel'): void
}>()

const formState = reactive({
  points: 0,
  description: ''
})

const isFormValid = computed(() => {
  return formState.points > 0
})

const onSubmit = () => {
  if (!isFormValid.value) return

  emit('submit', {
    points: formState.points,
    description: formState.description || undefined
  })
}
</script>

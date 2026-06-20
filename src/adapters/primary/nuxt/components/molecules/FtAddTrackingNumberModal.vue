<template lang="pug">
ft-modal(v-model="model")
  div.mx-10.my-10
    UFormGroup.pb-4(
      :label="$t('orders.deliveries.addTrackingNumberLabel')"
      name="trackingNumber"
    )
      ft-text-field(
        v-model="trackingNumber"
        :disabled="loading"
        @keyup.enter="validate"
      )
    div(class="flex justify-end space-x-4 pt-4")
      ft-button(
        type="button"
        variant="outline"
        :disabled="loading"
        @click="cancel"
      ) {{ $t('common.cancel') }}
      ft-button(
        type="button"
        :loading="loading"
        :disabled="loading"
        @click="validate"
      ) {{ $t('orders.deliveries.addTrackingNumberValidate') }}
</template>

<script lang="ts" setup>
const model = defineModel({ type: Boolean })
const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  }
})
const trackingNumber = ref('')

const emit = defineEmits<{
  (e: 'trackingNumberAdded', trackingNumber: string): void
}>()

const validate = () => {
  if (props.loading) {
    return
  }
  const trimmed = trackingNumber.value.trim()
  if (!trimmed) {
    return
  }
  emit('trackingNumberAdded', trimmed)
}

const cancel = () => {
  if (props.loading) {
    return
  }
  model.value = false
}

watch(model, (isOpen) => {
  if (!isOpen) {
    trackingNumber.value = ''
  }
})
</script>

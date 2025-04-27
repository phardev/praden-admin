<template lang="pug">
ft-modal(v-model="model" @close="emit('close')")
  div.flex.flex-col.items-center.justify-center.gap-4
    icon.icon-2xl.text-error(name="material-symbols:error-circle-rounded-outline-sharp")
    h2.text-2xl Erreur
    p {{ error }}
    ft-button.button-solid.px-6.text-xl(
      block
      @click="close"
    ) OK
</template>

<script lang="ts" setup>
const model = defineModel({ type: Boolean })

defineProps({
  error: {
    type: String,
    default: () => {
      return ''
    }
  }
})

const emit = defineEmits<{
  (e: 'close'): void
}>()

const close = () => {
  emit('close')
}
</script>

<template lang="pug">
UInputMenu(
  v-bind="$attrs"
  v-model="model"
  size="lg"
  :close-on-select="true"
)
  template(#trailing)
    UButton(
      v-show="model && !$attrs.disabled"
      color="gray"
      variant="link"
      icon="i-heroicons-x-mark-20-solid"
      :padded="false"
      @click.stop="clear"
    )
</template>
<script lang="ts" setup>
const model = defineModel({ type: String })

const emit = defineEmits(['clear'])

const clear = () => {
  model.value = null
  emit('clear')
}
</script>

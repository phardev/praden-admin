<template lang="pug">
UInputMenu(
  v-model="model"
  v-bind="$attrs"
  size="lg"
)
  template(#trailing)
    UButton(
      v-show="model && !$attrs.disabled"
      color="gray"
      variant="link"
      icon="i-heroicons-x-mark-20-solid"
      :padded="false"
      @click="clear"
    )
</template>
<script lang="ts" setup>
const model = defineModel({ type: String })

const emit = defineEmits(['clear'])

const clear = async () => {
  emit('clear')
}
</script>

<template lang="pug">
.flex.items-center.gap-1
  UButton(
    icon="i-heroicons-minus"
    size="xs"
    color="gray"
    variant="soft"
    :disabled="modelValue <= min"
    @click="decrement"
  )
  UInput.w-16(
    :model-value="modelValue"
    type="number"
    :min="min"
    :max="max"
    size="sm"
    @update:model-value="quantityTyped"
  )
  UButton(
    icon="i-heroicons-plus"
    size="xs"
    color="gray"
    variant="soft"
    :disabled="max !== undefined && modelValue >= max"
    @click="increment"
  )
</template>

<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    modelValue: number
    min?: number
    max?: number
  }>(),
  {
    min: 1,
    max: undefined
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void
}>()

const decrement = () => {
  emit('update:modelValue', Math.max(props.min, props.modelValue - 1))
}

const increment = () => {
  emit('update:modelValue', props.modelValue + 1)
}

const quantityTyped = (value: string) => {
  const quantity = Number.parseInt(value, 10)
  if (Number.isNaN(quantity)) {
    emit('update:modelValue', props.min)
    return
  }
  emit('update:modelValue', Math.max(props.min, quantity))
}
</script>

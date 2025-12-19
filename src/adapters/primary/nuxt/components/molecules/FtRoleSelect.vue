<template lang="pug">
div.flex.items-center.justify-center
  USelectMenu.w-44(
    :model-value="modelValue"
    :options="options"
    :disabled="disabled"
    value-attribute="uuid"
    option-attribute="name"
    @update:model-value="$emit('update:modelValue', $event)"
  )
    template(#label)
      FtRoleBadge(v-if="currentRole" :role-name="currentRole.name" :role-uuid="currentRole.uuid")
      span.text-gray-500(v-else) {{ $t('staff.selectRole') }}
    template(#option="{ option }")
      FtRoleBadge(:role-name="option.name" :role-uuid="option.uuid")
</template>

<script setup lang="ts">
interface RoleOption {
  uuid: string
  name: string
}

const props = defineProps<{
  modelValue?: string
  options: Array<RoleOption>
  disabled?: boolean
}>()

defineEmits<{
  'update:modelValue': [value: string]
}>()

const currentRole = computed(() => {
  if (!props.modelValue) return null
  return (
    props.options.find((option: RoleOption) => option.uuid === props.modelValue) || null
  )
})
</script>

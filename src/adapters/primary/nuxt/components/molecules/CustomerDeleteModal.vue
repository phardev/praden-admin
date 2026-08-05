<template lang="pug">
ft-modal(:model-value="isOpen" @update:model-value="$emit('update:isOpen', $event)" @close="$emit('close')")
  UCard.w-full.max-w-md
    template(#header)
      .flex.items-center.gap-3
        .p-2.bg-red-100.rounded-lg
          icon.h-5.w-5.text-red-600(name="i-heroicons-exclamation-triangle-20-solid")
        .space-y-1
          h3.text-lg.font-semibold {{ $t('customers.delete.title') }}
          p.text-sm.text-gray-500 {{ $t('customers.delete.description') }}

    .space-y-4
      .p-4.bg-gray-50.rounded-lg
        .font-medium {{ customer.firstname }} {{ customer.lastname }}
        .text-sm.text-gray-600.mt-1 {{ customer.email }}

      .flex.justify-end.gap-3
        ft-button(variant="outline" @click="$emit('close')")
          | {{ $t('common.cancel') }}
        ft-button(color="red" :loading="isDeleting" @click="handleDelete")
          | {{ $t('common.delete') }}
</template>

<script setup lang="ts">
defineProps<{
  isOpen: boolean
  customer?: any
  isDeleting?: boolean
}>()

const emit = defineEmits<{
  close: []
  confirm: []
  'update:isOpen': [value: boolean]
}>()

const handleDelete = () => {
  emit('confirm')
}
</script>

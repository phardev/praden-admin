<template lang="pug">
UCard.relative
  template(#header)
    .flex.items-start.justify-between
      .flex-1
        h3.text-lg.font-semibold.text-gray-900 {{ answer.title }}
      .flex.gap-1
        ft-button(size="sm" variant="ghost" @click="$emit('edit', answer)")
          icon(name="i-heroicons-pencil-square-20-solid")
        ft-button(size="sm" variant="ghost" color="red" @click="$emit('delete', answer)")
          icon(name="i-heroicons-trash-20-solid")
  .text-gray-600.leading-relaxed.whitespace-pre-line {{ answer.content }}
</template>

<script setup lang="ts">
defineProps<{
  answer: any
}>()

defineEmits<{
  edit: [answer: any]
  delete: [answer: any]
}>()
</script>

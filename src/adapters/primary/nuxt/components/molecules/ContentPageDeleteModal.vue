<template lang="pug">
ft-modal(
  :model-value="isOpen"
  @update:model-value="emit('update:isOpen', $event)"
  @close="emit('close')"
)
  UCard.w-full.max-w-md
    template(#header)
      .flex.items-center.gap-3
        .p-2.bg-red-100.rounded-lg
          icon.h-5.w-5.text-red-600(name="i-heroicons-exclamation-triangle-20-solid")
        .space-y-1
          h3.text-lg.font-semibold {{ $t('shopManagement.contentPages.delete.title') }}
          p.text-sm.text-gray-500 {{ $t('shopManagement.contentPages.delete.confirm') }}

    .space-y-4
      .p-4.bg-gray-50.rounded-lg(v-if="contentPage")
        .font-medium {{ contentPage.name }}
        .text-sm.text-gray-600.mt-1 /{{ contentPage.slug }}

      .flex.justify-end.gap-3
        ft-button(variant="outline" @click="emit('close')")
          | {{ $t('common.cancel') }}
        ft-button(color="red" :loading="isDeleting" @click="emit('confirm')")
          | {{ $t('common.delete') }}
</template>

<script lang="ts" setup>
import type { GetContentPagesItemVM } from '@adapters/primary/view-models/content-page/get-content-pages/getContentPagesVM'

defineProps<{
  isOpen: boolean
  contentPage?: GetContentPagesItemVM
  isDeleting?: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'confirm'): void
  (e: 'update:isOpen', value: boolean): void
}>()
</script>

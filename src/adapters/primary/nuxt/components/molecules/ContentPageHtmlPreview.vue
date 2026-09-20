<template lang="pug">
.border.border-gray-200.rounded-lg.overflow-hidden
  .flex.items-center.justify-between.px-4.py-3.bg-gray-50
    h3.text-sm.font-semibold.text-gray-700 {{ $t('shopManagement.contentPages.preview.title') }}
    ft-button(
      type="button"
      color="gray"
      variant="ghost"
      size="xs"
      @click="isOpen = !isOpen"
    ) {{ isOpen ? $t('shopManagement.contentPages.preview.hide') : $t('shopManagement.contentPages.preview.show') }}
  div(v-if="isOpen")
    p.text-xs.text-gray-500.px-4.pt-3 {{ $t('shopManagement.contentPages.preview.disclaimer') }}
    .p-4.bg-white.overflow-auto(class="max-h-[60vh]")
      .content.prose.prose-sm(class="max-w-none" v-html="html")
</template>

<script lang="ts" setup>
defineProps<{ html: string }>()

const isOpen = ref(false)
</script>

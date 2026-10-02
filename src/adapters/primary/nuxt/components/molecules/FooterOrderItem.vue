<template lang="pug">
.footer-order-item.flex.items-center.gap-3.p-3.bg-white.border.border-gray-200.rounded-lg.transition-all.cursor-move(
  :class="{ 'hover:border-gray-300 hover:shadow-sm': !isDragging, 'opacity-50': isDragging }"
)
  icon.text-gray-400.flex-shrink-0(name="i-heroicons-bars-3-bottom-left")
  .flex-1.min-w-0.font-medium.text-gray-900.truncate {{ label }}
  UTooltip(v-if="entry.isDraft" :text="$t('shopManagement.contentPages.footer.draft')")
    ft-content-page-status-badge(:status="draftStatus")
  ft-mandatory-badge(v-if="entry.isLocked && !entry.isSystem")
  UTooltip(v-if="entry.isSystem" :text="$t('shopManagement.contentPages.footer.systemLocked')")
    icon.h-4.w-4.text-gray-400(name="i-heroicons-lock-closed")
</template>

<script lang="ts" setup>
import type { FooterOrderEntryVM } from '@adapters/primary/view-models/content-page/get-footer-order/getFooterOrderVM'
import { ContentPageStatus } from '@core/entities/contentPage'

const props = defineProps<{
  entry: FooterOrderEntryVM
  isDragging?: boolean
}>()

const { t, te } = useI18n()

const draftStatus = ContentPageStatus.DRAFT

const label = computed(() => {
  if (!props.entry.isSystem) return props.entry.name
  const key = `shopManagement.contentPages.footer.system.${props.entry.systemKey}`
  return te(key) ? t(key) : props.entry.systemKey
})
</script>

<template lang="pug">
div.flex.items-center.gap-2.bg-white.border.border-gray-200.rounded-lg.px-3.py-2.text-sm
  img.rounded.object-cover.flex-shrink-0(
    :src="attachment.previewUrl"
    :alt="attachment.name"
    width="40"
    height="30"
  )
  p.flex-1.min-w-0.truncate.text-gray-700 {{ attachment.name }} · {{ $t(attachment.formattedSize.key, attachment.formattedSize.params) }}
  UButton(
    icon="i-heroicons-x-mark"
    variant="ghost"
    color="gray"
    size="xs"
    :aria-label="$t('assistance.panel.removeAttachment')"
    @click="$emit('remove')"
  )
</template>

<script lang="ts" setup>
import type { AssistanceAttachmentVM } from '@adapters/primary/view-models/assistance/assistance-request-form/assistanceRequestFormVM'

defineProps<{
  attachment: AssistanceAttachmentVM
}>()

defineEmits<{
  (e: 'remove'): void
}>()
</script>

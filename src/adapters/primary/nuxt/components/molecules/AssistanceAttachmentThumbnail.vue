<template lang="pug">
div
  USkeleton.h-16.w-20(v-if="isLoading")
  button.block(
    v-else-if="attachment.url && attachment.isImage"
    type="button"
    :aria-label="$t('assistance.details.openImage')"
    @click="openImage"
  )
    img.h-16.rounded(:src="attachment.url" :alt="attachment.filename")
  a.text-sm.underline(
    v-else-if="attachment.url"
    :href="attachment.url"
    :download="attachment.filename"
  ) {{ attachment.filename }} · {{ $t(attachment.formattedSize.key, attachment.formattedSize.params) }}
  span.text-xs.text-gray-400(v-else) {{ attachment.filename }} · {{ $t(attachment.formattedSize.key, attachment.formattedSize.params) }}
</template>

<script lang="ts" setup>
import type { AssistanceAttachmentItemVM } from '@adapters/primary/view-models/assistance/assistance-request-details/assistanceRequestDetailsVM'
import { loadAssistanceAttachment } from '@core/usecases/assistance/assistance-attachment-loading/loadAssistanceAttachment'
import { useAssistanceRequestGateway } from '../../../../../../gateways/assistanceRequestGateway'

const props = defineProps<{
  requestId: string
  attachment: AssistanceAttachmentItemVM
}>()

const hasFailed = ref(false)

const isLoading = computed(() => !props.attachment.url && !hasFailed.value)

onMounted(async () => {
  try {
    await loadAssistanceAttachment(
      props.requestId,
      props.attachment.id,
      useAssistanceRequestGateway()
    )
  } catch {
    hasFailed.value = true
  }
})

const openImage = () => {
  window.open(props.attachment.url)
}
</script>

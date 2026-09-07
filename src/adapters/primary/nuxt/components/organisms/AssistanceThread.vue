<template lang="pug">
.flex.flex-col.gap-5(ref="container")
  .flex.flex-col.gap-1(
    v-for="message in messages"
    :key="message.id"
    :class="message.isPharmacy ? 'items-end' : 'items-start'"
  )
    .flex.items-baseline.gap-2.text-xs
      span.font-semibold.text-gray-900
        | {{ message.author }}
        span.ml-1(v-if="!message.isPharmacy") · {{ $t('assistance.details.phardev') }}
      span.text-gray-400 {{ $t(message.sentAt.key, message.sentAt.params) }}
    .max-w-lg.py-3.text-sm.leading-5(
      v-if="message.hasContent"
      class="px-3.5"
      :class="bubbleClass(message)"
    )
      p.whitespace-pre-wrap.break-words {{ message.content }}
    .flex.flex-wrap.gap-2(v-if="message.attachments.length > 0")
      assistance-attachment-thumbnail(
        v-for="attachment in message.attachments"
        :key="attachment.id"
        :request-id="requestId"
        :attachment="attachment"
      )
</template>

<script lang="ts" setup>
import type { AssistanceMessageVM } from '@adapters/primary/view-models/assistance/assistance-request-details/assistanceRequestDetailsVM'

const props = defineProps<{
  requestId: string
  messages: Array<AssistanceMessageVM>
}>()

const container = ref<HTMLElement | null>(null)

const bubbleClass = (message: AssistanceMessageVM): string =>
  message.isPharmacy
    ? 'ml-auto bg-customPrimary-500 text-white rounded-[12px_12px_4px_12px]'
    : 'mr-auto bg-gray-100 text-gray-900 rounded-[12px_12px_12px_4px]'

const scrollToLastMessage = async () => {
  await nextTick()
  container.value?.lastElementChild?.scrollIntoView({
    behavior: 'smooth',
    block: 'nearest'
  })
}

watch(() => props.messages.length, scrollToLastMessage)
</script>

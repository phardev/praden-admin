<template lang="pug">
.section(v-if="ticketDetailsVM")
  div(v-if="ticketDetailsVM.isLoading")
    .space-y-4
      USkeleton.h-8.w-64
      .grid(class="grid-cols-1 lg:grid-cols-3 gap-6")
        .space-y-4(class="lg:col-span-2")
          USkeleton(class="h-96 w-full")
        .space-y-4
          USkeleton(class="h-80 w-full")

  div(v-else-if="ticketDetailsVM.item")
    .support-header.mb-8(class="bg-gray1 rounded-2xl p-6 shadow-whisper border border-gray-100/50")
      .flex.items-start.justify-between(class="flex-col sm:flex-row gap-6")
        .flex.items-start.gap-5
          UButton(
            icon="i-lucide-arrow-left"
            variant="soft"
            color="primary"
            size="lg"
            class="rounded-xl hover:scale-105 transition-transform duration-200"
            @click="$router.push('/support')"
          )

          div.flex-1
            .flex.items-center.gap-4.mb-3
              h1(
                class="text-2xl font-bold text-gray-900 sm:text-3xl"
              ) {{ ticketDetailsVM.item.ticketNumber }}

            .mb-4
              h2.text-xl.text-gray-800.font-semibold.leading-snug.mb-2 {{ ticketDetailsVM.item.subject }}
              .w-12.h-1(
                class="bg-customPrimary-500 rounded-full"
              )

            .flex.items-center.gap-8.text-sm
              .flex.items-center.gap-3.font-medium
                .customer-avatar.w-8.h-8.rounded-full(
                  class="bg-primary5 flex items-center justify-center"
                )
                  UIcon(name="i-lucide-user" class="w-4 h-4 text-primary9")
                NuxtLink.text-link(
                  class="font-semibold underline-offset-2 hover:underline transition-colors"
                  :to="`/customers/get/${ticketDetailsVM.item.customer.uuid}`"
                ) {{ ticketDetailsVM.item.customer.name }}
              .flex.items-center.gap-2.text-gray-500.font-medium
                .w-6.h-6.rounded-full.bg-gray-100.flex.items-center.justify-center
                  UIcon(name="i-lucide-clock" class="w-3 h-3 text-gray-400")
                span {{ formatDate(ticketDetailsVM.item.createdAt) }}

        .action-panel.flex.items-center.gap-4(class="flex-wrap bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-100/60 shadow-soft")
          USelectMenu(
            v-model="selectedPriority"
            :options="['LOW', 'MEDIUM', 'HIGH', 'URGENT']"
            class="min-w-fit"
            @change="updatePriority"
          )
            template(#label)
              .flex.items-center.gap-3.px-1
                .w-2.h-2.rounded-full(:class="getPriorityDotColor(ticketDetailsVM.item.priority)")
                span.font-medium.text-gray-700 {{ $t('support.details.priority') }}
                TicketPriorityBadge(
                  v-if="ticketDetailsVM.item && ticketDetailsVM.item.priority"
                  :priority="ticketDetailsVM.item.priority"
                  class="scale-90"
                )
            template(#option="{ option }")
              .flex.items-center.gap-3
                .w-2.h-2.rounded-full(:class="getPriorityDotColor(option)")
                TicketPriorityBadge(:priority="option")

          .action-buttons.flex.gap-3(class="flex-wrap")
            UButton(
              v-if="ticketDetailsVM.item.status === 'NEW' || ticketDetailsVM.item.status === 'RESOLVED'"
              icon="i-lucide-play"
              color="blue"
              size="lg"
              :loading="isStartingTicket"
              :disabled="isStartingTicket"
              class="rounded-xl font-semibold px-6 hover:scale-105 transition-transform duration-200"
              @click="handleStartTicket"
            ) {{ $t('support.actions.startTicket') }}

            UButton(
              v-if="ticketDetailsVM.item.status !== 'NEW' && ticketDetailsVM.item.status !== 'RESOLVED'"
              icon="i-lucide-reply"
              variant="soft"
              color="primary"
              size="lg"
              class="rounded-xl font-semibold px-6 hover:scale-105 transition-transform duration-200"
              @click="toggleReplyEditor"
            ) {{ $t('support.actions.reply') }}

            UButton(
              v-if="ticketDetailsVM.item.status !== 'NEW' && ticketDetailsVM.item.status !== 'RESOLVED'"
              icon="i-lucide-sticky-note"
              variant="soft"
              color="amber"
              size="lg"
              class="rounded-xl font-semibold px-6 hover:scale-105 transition-transform duration-200"
              @click="togglePrivateNoteEditor"
            ) {{ $t('support.actions.privateNote') }}

            UButton(
              v-if="ticketDetailsVM.item.status !== 'RESOLVED' && ticketDetailsVM.item.status !== 'NEW'"
              icon="i-lucide-check"
              color="emerald"
              size="lg"
              class="rounded-xl font-semibold px-6 hover:scale-105 transition-transform duration-200 shadow-emerald-200"
              @click="markAsResolved"
            ) {{ $t('support.actions.markAsResolved') }}

    .grid(class="grid-cols-1 lg:grid-cols-3 gap-8")
      div(class="lg:col-span-2")
        UCard.conversation-card(class="shadow-gentle rounded-2xl border-gray-100/60 bg-gray1")
          template(#header)
            .flex.items-center.gap-4.p-2
              .conversation-icon.w-10.h-10.rounded-xl(
                class="bg-customPrimary-500 flex items-center justify-center"
              )
                UIcon(name="i-lucide-message-circle" class="w-5 h-5 text-white")
              .flex-1
                h2.text-xl.font-bold.text-gray-900 {{ $t('support.details.conversation') }}
              UBadge(
                :label="ticketDetailsVM.item.messages.length.toString()"
                variant="soft"
                color="blue"
                class="px-3 py-1.5 rounded-xl font-semibold"
              )

          .space-y-4(class="max-h-[60vh] overflow-y-auto")
            .each(v-for="(message, index) in ticketDetailsVM.item.messages" :key="message.uuid")
              .relative
                .absolute.left-6.top-12.w-px.bg-gray-200(
                  v-if="index < ticketDetailsVM.item.messages.length - 1"
                  class="h-full"
                )

                .flex.gap-4
                  .flex-shrink-0
                    .w-10.h-10.rounded-full.flex.items-center.justify-center(
                      :class="message.type === 'PRIVATE' ? 'bg-amber-100' : message.author.name === ticketDetailsVM.item.customer.name ? 'bg-primary5' : 'bg-green-100'"
                    )
                      UIcon(
                        :name="message.type === 'PRIVATE' ? 'i-lucide-lock' : message.author.name === ticketDetailsVM.item.customer.name ? 'i-lucide-user' : 'i-lucide-headphones'"
                        class="w-5 h-5"
                        :class="message.type === 'PRIVATE' ? 'text-amber-600' : message.author.name === ticketDetailsVM.item.customer.name ? 'text-primary9' : 'text-green-600'"
                      )

                  .flex-1.min-w-0
                    .rounded-lg.border.p-4(
                      :class="message.type === 'PRIVATE' ? 'bg-amber-50 border-amber-200' : 'bg-white border-gray-200'"
                    )
                      .flex.items-start.justify-between.mb-3
                        .flex.items-center.gap-2
                          span.font-medium.text-gray-900 {{ message.author.name }}
                          UBadge(
                            v-if="message.type === 'PRIVATE'"
                            :label="$t('support.details.privateNote')"
                            color="amber"
                            variant="soft"
                            size="xs"
                          )
                        .text-xs.text-gray-500 {{ formatDate(message.sentAt) }}

                      p.text-gray-800.whitespace-pre-wrap {{ message.content }}

                      div(v-if="message.attachments && message.attachments.length > 0" class="mt-3 space-y-2")
                        .text-xs.font-medium.text-gray-500.mb-2 {{ $t('support.attachments.files') }}
                        .each(v-for="attachment in message.attachments" :key="attachment.filename")
                          .flex.items-center.gap-2.text-xs.bg-gray-100.rounded.px-2.py-1.cursor-pointer(
                            class="hover:bg-gray-200"
                            @click="downloadAttachment(attachment)"
                          )
                            UIcon(name="i-lucide-download" class="w-3 h-3")
                            span {{ attachment.filename }}
                            span.text-gray-400 {{ '(' + formatFileSize(attachment.size) + ')' }}

          div(v-if="showReplyEditor" class="mt-6 p-4 bg-gray-50 rounded-lg border")
            .flex.items-center.gap-2.mb-4
              UIcon(name="i-lucide-reply" class="w-5 h-5 text-blue-600")
              h3.text-lg.font-semibold.text-gray-900 {{ $t('support.actions.reply') }}
              UButton(
                icon="i-lucide-x"
                variant="ghost"
                size="sm"
                class="ml-auto"
                @click="cancelReplyEditor"
              )

            form(@submit.prevent="submitReply")
              .mb-4
                .flex.items-center.justify-between.mb-2
                  .flex.items-center.gap-2
                    UIcon(name="i-heroicons-chat-bubble-left-right" class="w-4 h-4")
                    label.text-sm.font-medium.text-gray-700 {{ $t('support.predefinedAnswers.label') }}
                  NuxtLink(
                    to="/support/ticket-predefined-answers"
                    class="text-sm text-link"
                  ) {{ $t('support.predefinedAnswers.manage') }}

                USelectMenu(
                  v-if="ticketPredefinedAnswers.length > 0"
                  v-model="selectedAnswer"
                  :searchable="customSearch"
                  :searchable-placeholder="$t('support.predefinedAnswers.placeholder')"
                  :options="ticketPredefinedAnswers"
                  @update:model-value="handlePredefinedAnswerSelect"
                )
                  template(#option="{ option }")
                    .space-y-1
                      .font-medium {{ option.title }}
                      .text-sm.text-gray-500.line-clamp-1 {{ option.content.substring(0, 100) + (option.content.length > 100 ? '...' : '') }}

                .text-sm.text-gray-500(v-else) {{ $t('support.predefinedAnswers.empty') }}

              UTextarea(
                v-model="replyContent"
                :placeholder="$t('support.modal.reply.placeholder')"
                :rows="6"
                class="mb-4"
                resize
                autofocus
              )

              .mb-4
                .flex.items-center.gap-2.mb-2
                  UIcon(name="i-lucide-paperclip" class="w-4 h-4")
                  label.text-sm.font-medium.text-gray-700 {{ $t('support.attachments.label') }}
                input(
                  ref="replyFileInput"
                  type="file"
                  multiple
                  class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  @change="onReplyFilesSelected"
                )
                div(v-if="replyFiles.length > 0" class="mt-2 space-y-1")
                  .flex.items-center.justify-between.text-xs.bg-gray-50.rounded.px-2.py-1(
                    v-for="(file, index) in replyFiles"
                    :key="index"
                  )
                    .flex.items-center.gap-2
                      UIcon(name="i-lucide-file" class="w-3 h-3")
                      span {{ file.name }}
                      span.text-gray-400 {{ '(' + formatFileSize(file.size) + ')' }}
                    UButton(
                      icon="i-lucide-x"
                      size="2xs"
                      variant="ghost"
                      @click="removeReplyFile(index)"
                    )

              .flex.items-center.justify-between
                .flex.items-center.gap-2.text-sm.text-gray-500
                  UIcon(name="i-lucide-info" class="w-4 h-4")
                  span {{ $t('support.editor.tips.reply') }}

                .flex.gap-2
                  UButton(
                    type="button"
                    variant="ghost"
                    @click="cancelReplyEditor"
                  ) {{ $t('support.modal.reply.cancel') }}
                  UButton(
                    type="submit"
                    :disabled="!replyContent.trim()"
                    :loading="isSubmittingReply"
                  ) {{ $t('support.modal.reply.send') }}

          div(v-if="showPrivateNoteEditor" class="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200")
            .flex.items-center.gap-2.mb-4
              UIcon(name="i-lucide-sticky-note" class="w-5 h-5 text-amber-600")
              h3.text-lg.font-semibold.text-gray-900 {{ $t('support.actions.privateNote') }}
              UBadge(
                :label="$t('support.details.privateNote')"
                color="amber"
                variant="soft"
                size="xs"
              )
              UButton(
                icon="i-lucide-x"
                variant="ghost"
                size="sm"
                class="ml-auto"
                @click="cancelPrivateNoteEditor"
              )

            form(@submit.prevent="submitPrivateNote")
              UTextarea(
                v-model="privateNoteContent"
                :placeholder="$t('support.modal.privateNote.placeholder')"
                :rows="6"
                class="mb-4"
                resize
                autofocus
              )

              .mb-4
                .flex.items-center.gap-2.mb-2
                  UIcon(name="i-lucide-paperclip" class="w-4 h-4")
                  label.text-sm.font-medium.text-gray-700 {{ $t('support.attachments.label') }}
                input(
                  ref="privateNoteFileInput"
                  type="file"
                  multiple
                  class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
                  @change="onPrivateNoteFilesSelected"
                )
                div(v-if="privateNoteFiles.length > 0" class="mt-2 space-y-1")
                  .flex.items-center.justify-between.text-xs.bg-amber-50.rounded.px-2.py-1(
                    v-for="(file, index) in privateNoteFiles"
                    :key="index"
                  )
                    .flex.items-center.gap-2
                      UIcon(name="i-lucide-file" class="w-3 h-3")
                      span {{ file.name }}
                      span.text-amber-600 {{ '(' + formatFileSize(file.size) + ')' }}
                    UButton(
                      icon="i-lucide-x"
                      size="2xs"
                      variant="ghost"
                      @click="removePrivateNoteFile(index)"
                    )

              .flex.items-center.justify-between
                .flex.items-center.gap-2.text-sm.text-amber-600
                  UIcon(name="i-lucide-eye-off" class="w-4 h-4")
                  span {{ $t('support.editor.tips.privateNote') }}

                .flex.gap-2
                  UButton(
                    type="button"
                    variant="ghost"
                    @click="cancelPrivateNoteEditor"
                  ) {{ $t('support.modal.privateNote.cancel') }}
                  UButton(
                    type="submit"
                    :disabled="!privateNoteContent.trim()"
                    :loading="isSubmittingPrivateNote"
                    color="amber"
                  ) {{ $t('support.modal.privateNote.add') }}

      div
        UCard
          template(#header)
            .flex.items-center.gap-2
              UIcon(name="i-lucide-info" class="w-5 h-5")
              h2.text-lg.font-semibold {{ $t('support.details.ticketDetails') }}

          .space-y-6
            div
              .flex.items-center.gap-2.mb-2
                UIcon(name="i-lucide-flag" class="w-4 h-4 text-gray-500")
                .text-sm.font-medium.text-gray-500 {{ $t('support.details.priority') }}
              TicketPriorityBadge(:priority="ticketDetailsVM.item.priority" size="sm")

            div
              .flex.items-center.gap-2.mb-3
                UIcon(name="i-lucide-user" class="w-4 h-4 text-gray-500")
                .text-sm.font-medium.text-gray-500 {{ $t('support.details.customer') }}
              .space-y-1
                NuxtLink.font-medium.text-link(
                  :to="`/customers/get/${ticketDetailsVM.item.customer.uuid}`"
                ) {{ ticketDetailsVM.item.customer.name }}
                .flex.items-center.gap-2
                  UIcon(name="i-lucide-mail" class="w-4 h-4 text-gray-400")
                  p.text-gray-600.text-sm {{ ticketDetailsVM.item.customer.email }}

            UDivider(v-if="ticketDetailsVM.item.orderUuid")

            div(v-if="ticketDetailsVM.item.orderUuid")
              .flex.items-center.gap-2.mb-3
                UIcon(name="i-lucide-shopping-cart" class="w-4 h-4 text-gray-500")
                .text-sm.font-medium.text-gray-500 {{ $t('support.details.relatedOrder') }}
              UButton(
                :to="`/orders/${ticketDetailsVM.item.orderUuid}`"
                variant="outline"
                size="sm"
                icon="i-lucide-external-link"
                class="w-full justify-start"
              ) {{ $t('support.actions.viewOrder') }}

            UDivider

            .space-y-4
              div
                .flex.items-center.gap-2.mb-2
                  UIcon(name="i-lucide-calendar-plus" class="w-4 h-4 text-gray-500")
                  .text-sm.font-medium.text-gray-500 {{ $t('support.details.createdAt') }}
                p.text-sm.text-gray-900 {{ formatDate(ticketDetailsVM.item.createdAt) }}

              div
                .flex.items-center.gap-2.mb-2
                  UIcon(name="i-lucide-calendar-clock" class="w-4 h-4 text-gray-500")
                  .text-sm.font-medium.text-gray-500 {{ $t('support.details.updatedAt') }}
                p.text-sm.text-gray-900 {{ formatDate(ticketDetailsVM.item.updatedAt) }}

</template>

<script lang="ts" setup>
import { getTicketDetails } from '@core/usecases/support/getTicketDetails'
import { replyToTicket } from '@core/usecases/support/replyToTicket'
import { addPrivateNoteToTicket } from '@core/usecases/support/addPrivateNoteToTicket'
import { updateTicketPriority } from '@core/usecases/support/updateTicketPriority'
import { startTicket } from '@core/usecases/support/startTicket'
import { resolveTicket } from '@core/usecases/support/resolveTicket'
import { listTicketPredefinedAnswers } from '@core/usecases/support/ticket-predefined-answers/listTicketPredefinedAnswers'
import { useTicketGateway } from '../../../../../../gateways/ticketGateway'
import { useTicketPredefinedAnswerGateway } from '../../../../../../gateways/ticketPredefinedAnswerGateway'
import { getTicketDetailsVM } from '@adapters/primary/view-models/support/get-support-ticket-details/getTicketDetailsVM'
import { useTicketPredefinedAnswerStore } from '@store/ticketPredefinedAnswerStore'
import { TicketPriority } from '@core/entities/ticket'
import '@utils/strings'
definePageMeta({ layout: 'main' })

const route = useRoute()
const ticketUuid = route.params.uuid as string
const ticketGateway = useTicketGateway()
const ticketPredefinedAnswerGateway = useTicketPredefinedAnswerGateway()
const ticketPredefinedAnswerStore = useTicketPredefinedAnswerStore()

const ticketDetailsVM = computed(() => getTicketDetailsVM())
const selectedPriority = ref('')
const ticketPredefinedAnswers = computed(
  () => ticketPredefinedAnswerStore.items
)
const selectedAnswer = ref(null)

const customSearch = (query: string) => {
  if (!query || query.trim() === '') {
    return ticketPredefinedAnswers.value
  }

  const normalizedQuery = (query as string).ftNormalize().toLowerCase()

  return ticketPredefinedAnswers.value.filter((option: any) => {
    const normalizedTitle = (option.title as string).ftNormalize().toLowerCase()
    return normalizedTitle.includes(normalizedQuery)
  })
}

const showReplyEditor = ref(false)
const showPrivateNoteEditor = ref(false)
const isSubmittingReply = ref(false)
const isSubmittingPrivateNote = ref(false)
const isStartingTicket = ref(false)

const toggleReplyEditor = () => {
  showReplyEditor.value = !showReplyEditor.value
  if (showReplyEditor.value) {
    showPrivateNoteEditor.value = false
    privateNoteContent.value = ''
  }
}

const togglePrivateNoteEditor = () => {
  showPrivateNoteEditor.value = !showPrivateNoteEditor.value
  if (showPrivateNoteEditor.value) {
    showReplyEditor.value = false
    replyContent.value = ''
  }
}

const cancelReplyEditor = () => {
  showReplyEditor.value = false
  replyContent.value = ''
  replyFiles.value = []
  if (replyFileInput.value) {
    replyFileInput.value.value = ''
  }
}

const cancelPrivateNoteEditor = () => {
  showPrivateNoteEditor.value = false
  privateNoteContent.value = ''
  privateNoteFiles.value = []
  if (privateNoteFileInput.value) {
    privateNoteFileInput.value.value = ''
  }
}

const replyContent = ref('')
const privateNoteContent = ref('')
const replyFiles = ref<Array<File>>([])
const privateNoteFiles = ref<Array<File>>([])
const replyFileInput = ref<HTMLInputElement>()
const privateNoteFileInput = ref<HTMLInputElement>()

onMounted(async () => {
  await getTicketDetails(ticketUuid, ticketGateway)
  selectedPriority.value = ticketDetailsVM.value?.item?.priority || ''
  listTicketPredefinedAnswers(ticketPredefinedAnswerGateway)
})

const updatePriority = async () => {
  if (!selectedPriority.value) return

  try {
    await updateTicketPriority(
      ticketUuid,
      selectedPriority.value as TicketPriority,
      ticketGateway
    )
  } catch (error) {
    console.error('Error updating priority:', error)
  }
}

const submitReply = async () => {
  if (!replyContent.value.trim()) return

  isSubmittingReply.value = true
  try {
    await replyToTicket(
      ticketUuid,
      replyContent.value,
      'Service Client',
      ticketGateway,
      replyFiles.value
    )
    replyContent.value = ''
    replyFiles.value = []
    showReplyEditor.value = false
    if (replyFileInput.value) {
      replyFileInput.value.value = ''
    }
  } catch (error) {
    console.error('Error sending reply:', error)
  } finally {
    isSubmittingReply.value = false
  }
}

const submitPrivateNote = async () => {
  if (!privateNoteContent.value.trim()) return

  isSubmittingPrivateNote.value = true
  try {
    await addPrivateNoteToTicket(
      ticketUuid,
      privateNoteContent.value,
      'Opérateur Support',
      ticketGateway,
      privateNoteFiles.value
    )
    privateNoteContent.value = ''
    privateNoteFiles.value = []
    showPrivateNoteEditor.value = false
    if (privateNoteFileInput.value) {
      privateNoteFileInput.value.value = ''
    }
  } catch (error) {
    console.error('Error adding private note:', error)
  } finally {
    isSubmittingPrivateNote.value = false
  }
}

const handleStartTicket = async () => {
  isStartingTicket.value = true
  try {
    await startTicket(ticketUuid, ticketGateway)
  } catch (error) {
    console.error('Error starting ticket:', error)
  } finally {
    isStartingTicket.value = false
  }
}

const markAsResolved = async () => {
  try {
    await resolveTicket(ticketUuid, ticketGateway)
  } catch (error) {
    console.error('Error resolving ticket:', error)
  }
}

const formatDate = (timestamp: number) => {
  return new Date(timestamp).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const onReplyFilesSelected = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files) {
    replyFiles.value = Array.from(target.files)
  }
}

const onPrivateNoteFilesSelected = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files) {
    privateNoteFiles.value = Array.from(target.files)
  }
}

const removeReplyFile = (index: number) => {
  replyFiles.value.splice(index, 1)
}

const removePrivateNoteFile = (index: number) => {
  privateNoteFiles.value.splice(index, 1)
}

const handlePredefinedAnswerSelect = (answer: any) => {
  if (answer && answer.content) {
    replyContent.value = answer.content
  }
  selectedAnswer.value = null
}

const downloadAttachment = (attachment: any) => {
  const link = document.createElement('a')
  link.href = attachment.url
  link.download = attachment.filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const getPriorityDotColor = (priority: string) => {
  const colors = {
    LOW: 'bg-slate-400',
    MEDIUM: 'bg-blue-400',
    HIGH: 'bg-orange-400',
    URGENT: 'bg-red-400 animate-pulse'
  }
  return colors[priority as keyof typeof colors] || 'bg-gray-400'
}
</script>

<style scoped>
@import url('~/assets/css/humanized-support.css');
</style>

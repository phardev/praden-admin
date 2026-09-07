<template lang="pug">
div(@paste="onPaste" @keydown.ctrl.enter.prevent="send" @keydown.meta.enter.prevent="send")
  .flex.items-end.gap-3
    UTextarea.flex-1(
      v-model="content"
      :rows="3"
      autoresize
      :placeholder="placeholder"
      :disabled="isSending"
    )
    UButton(
      icon="i-heroicons-paper-clip"
      variant="ghost"
      color="gray"
      :aria-label="$t('assistance.details.attach')"
      :disabled="isSending"
      @click="openFilePicker"
    )
    input.hidden(
      ref="fileInput"
      type="file"
      accept="image/*"
      multiple
      @change="onFilesSelected"
    )
    ft-button.button-solid(
      icon="i-heroicons-paper-airplane"
      :loading="isSending"
      :disabled="!canSend"
      @click="send"
    ) {{ $t('assistance.details.send') }}
  .mt-2.flex.flex-wrap.gap-2(v-if="files.length > 0")
    span.inline-flex.items-center.gap-1.rounded-full.bg-gray-100.py-1.pl-3.pr-1.text-xs.text-gray-700(
      v-for="(file, index) in files"
      :key="`${file.name}-${index}`"
    )
      | {{ file.name }} · {{ $t(sizeLabel(file).key, sizeLabel(file).params) }}
      UButton(
        icon="i-heroicons-x-mark"
        variant="ghost"
        color="gray"
        size="2xs"
        :aria-label="$t('assistance.panel.removeAttachment')"
        @click="removeFile(index)"
      )
  p.mt-2.text-sm.text-orange-700(v-if="attachmentError") {{ $t(`assistance.panel.attachmentErrors.${attachmentError}`) }}
</template>

<script lang="ts" setup>
import {
  type AssistanceAttachmentError,
  attachmentErrorFor
} from '@adapters/primary/view-models/assistance/assistance-request-form/attachmentRules'
import {
  type FileSizeLabelVM,
  formatFileSize
} from '@adapters/primary/view-models/assistance/shared/fileSize'

const props = defineProps<{
  placeholder: string
  isSending: boolean
}>()

const emit = defineEmits<{
  (e: 'send', value: { content: string; files: Array<File> }): void
}>()

const content = ref('')
const files = ref<Array<File>>([])
const attachmentError = ref<AssistanceAttachmentError | undefined>()
const fileInput = ref<HTMLInputElement | null>(null)

const canSend = computed(
  () =>
    content.value.trim() !== '' && !attachmentError.value && !props.isSending
)

const isImage = (file: File): boolean => file.type.startsWith('image/')

const sizeLabel = (file: File): FileSizeLabelVM => formatFileSize(file.size)

const addFiles = (candidates: Array<File>) => {
  attachmentError.value = attachmentErrorFor(files.value.length, candidates)
  if (attachmentError.value) return
  files.value = [...files.value, ...candidates]
}

const openFilePicker = () => {
  fileInput.value?.click()
}

const onFilesSelected = (event: Event) => {
  const input = event.target as HTMLInputElement
  addFiles(Array.from(input.files ?? []))
  input.value = ''
}

const onPaste = (event: ClipboardEvent) => {
  const pasted = Array.from(event.clipboardData?.files ?? []).filter(isImage)
  if (pasted.length === 0) return
  event.preventDefault()
  addFiles(pasted)
}

const removeFile = (index: number) => {
  files.value = files.value.filter((_, fileIndex) => fileIndex !== index)
  attachmentError.value = undefined
}

const send = () => {
  if (!canSend.value) return
  emit('send', { content: content.value.trim(), files: [...files.value] })
}

const clear = () => {
  content.value = ''
  files.value = []
  attachmentError.value = undefined
}

defineExpose({ clear })
</script>

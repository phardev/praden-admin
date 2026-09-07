<template lang="pug">
div.flex.items-center.gap-3.border-2.border-dashed.rounded-lg.px-4.py-3.text-sm.text-gray-500.transition-colors(
  :class="isDragging ? 'border-customPrimary-400 bg-customPrimary-50' : 'border-gray-300 bg-gray-50'"
  @dragover.prevent="isDragging = true"
  @dragleave.prevent="isDragging = false"
  @drop.prevent="onDrop"
)
  UIcon.h-5.w-5.flex-shrink-0(name="i-heroicons-photo" aria-hidden="true")
  div
    span.font-semibold.text-gray-700 {{ $t('assistance.panel.dropzone.paste') }}
    span {{ $t('assistance.panel.dropzone.dragOr') }}
    button.text-link.font-medium(type="button" @click="openFileDialog") {{ $t('assistance.panel.dropzone.choose') }}
  input.hidden(
    ref="fileInput"
    type="file"
    accept="image/*"
    multiple
    @change="onFilesChosen"
  )
</template>

<script lang="ts" setup>
const emit = defineEmits<{
  (e: 'files', files: Array<File>): void
}>()

const fileInput = ref<HTMLInputElement>()
const isDragging = ref(false)

const openFileDialog = () => {
  fileInput.value?.click()
}

const emitFiles = (files: FileList | null | undefined) => {
  const list = Array.from(files ?? [])
  if (list.length > 0) emit('files', list)
}

const onFilesChosen = (event: Event) => {
  const input = event.target as HTMLInputElement
  emitFiles(input.files)
  input.value = ''
}

const onDrop = (event: DragEvent) => {
  isDragging.value = false
  emitFiles(event.dataTransfer?.files)
}
</script>

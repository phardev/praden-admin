<template lang="pug">
.space-y-3
  .flex.items-start.gap-4
    .flex-1.space-y-2
      UInput(
        :model-value="imageUrl"
        :placeholder="$t('shopManagement.blogPosts.fields.imageUrl')"
        icon="i-heroicons-link"
        @update:model-value="onUrlChange"
      )
      .flex.items-center.gap-2
        UButton(
          color="gray"
          variant="soft"
          size="xs"
          icon="i-heroicons-arrow-up-tray"
          :label="file ? $t('shopManagement.blogPosts.fields.imageReplace') : $t('shopManagement.blogPosts.fields.imageUpload')"
          @click="openFileDialog"
        )
        span.text-xs.text-gray-500.truncate(v-if="file") {{ file.name }}
        UButton(
          v-if="file"
          color="gray"
          variant="ghost"
          size="xs"
          icon="i-heroicons-x-mark"
          @click="clearFile"
        )
      input.hidden(
        ref="fileInput"
        type="file"
        accept="image/*"
        @change="onFileChosen"
      )
    .w-32.h-32.flex-shrink-0.rounded-lg.border.border-gray-200.bg-gray-50.flex.items-center.justify-center.overflow-hidden
      img.w-full.h-full.object-cover(
        v-if="previewUrl && !isBroken"
        :src="previewUrl"
        alt=""
        @error="isBroken = true"
      )
      .text-center.px-2(v-else)
        icon.text-gray-300(name="i-heroicons-photo" class="text-3xl")
        p.text-xs.text-gray-500.mt-1(v-if="previewUrl && isBroken") {{ $t('shopManagement.blogPosts.fields.imageMissing') }}
</template>

<script lang="ts" setup>
const props = defineProps<{
  imageUrl: string
  file?: File
}>()

const emit = defineEmits<{
  (e: 'update:imageUrl', value: string): void
  (e: 'update:file', value: File | undefined): void
}>()

const fileInput = ref<HTMLInputElement>()
const isBroken = ref(false)

const previewUrl = computed(() => {
  if (props.file) return URL.createObjectURL(props.file)
  return props.imageUrl
})

watch(previewUrl, () => {
  isBroken.value = false
})

const openFileDialog = () => {
  fileInput.value?.click()
}

const onFileChosen = (event: Event) => {
  const [chosen] = Array.from((event.target as HTMLInputElement).files ?? [])
  if (chosen) emit('update:file', chosen)
}

const clearFile = () => {
  emit('update:file', undefined)
}

const onUrlChange = (value: string) => {
  emit('update:imageUrl', value)
}
</script>

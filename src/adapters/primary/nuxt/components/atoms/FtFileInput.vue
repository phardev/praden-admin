<template lang="pug">
.flex.items-center.justify-center.w-full
  label.flex.flex-col.items-center.justify-center.w-full.h-64.border-2.border-gray-300.border-dashed.rounded-lg.cursor-pointer.bg-gray-50(:for="inputId" class='dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600')
    .flex.flex-col.items-center.justify-center.pt-5.pb-6
      svg.w-8.h-8.mb-4.text-gray-500(class='dark:text-gray-400' aria-hidden='true' xmlns='http://www.w3.org/2000/svg' fill='none' viewbox='0 0 20 16')
        path(stroke='currentColor' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2')
      p.mb-2.text-sm.text-gray-500(class='dark:text-gray-400')
        span.font-semibold Cliquez pour choisir un fichier
        |  ou glissez-déposez
    input.hidden(
      :id="inputId"
      type='file',
      :accept="accept"
      :multiple="multiple"
      @change="fileInput"
    )
</template>

<script lang="ts" setup>
defineProps({
  accept: {
    type: String,
    default: () => {
      return ''
    }
  },
  multiple: {
    type: Boolean,
    default: () => {
      return false
    }
  }
})

const uniqueId = ref(Math.random().toString(36).substr(2, 9))
const inputId = computed(() => `dropzone-file-${uniqueId.value}`)

const emit = defineEmits<{
  (e: 'input', file: File): void
}>()

const fileInput = (e: any) => {
  e.preventDefault()
  emit('input', e.target.files)
}
</script>

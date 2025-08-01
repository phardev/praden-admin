<template lang="pug">
ft-modal(:model-value="isOpen" @update:model-value="$emit('update:isOpen', $event)" @close="handleClose")
  UCard.w-full.max-w-2xl
    template(#header)
      .flex.items-center.gap-3
        .p-2.bg-blue-100.rounded-lg
          icon.h-5.w-5.text-blue-600(name="i-heroicons-chat-bubble-left-right-20-solid")
        .space-y-1
          h3.text-lg.font-semibold {{ isEditing ? $t('support.ticketPredefinedAnswers.edit') : $t('support.ticketPredefinedAnswers.create') }}
          p.text-sm.text-gray-500 {{ $t('support.ticketPredefinedAnswers.formDescription') }}

    UForm.space-y-6(ref="form" :state="formData" @submit="handleSubmit")
      UFormGroup(:label="$t('support.ticketPredefinedAnswers.titleLabel')" name="title" required)
        ft-text-field(
          v-model="formData.title"
          :placeholder="$t('support.ticketPredefinedAnswers.titlePlaceholder')"
          size="lg"
        )

      UFormGroup(:label="$t('support.ticketPredefinedAnswers.contentLabel')" name="content" required)
        UTextarea(
          v-model="formData.content"
          :placeholder="$t('support.ticketPredefinedAnswers.contentPlaceholder')"
          :rows="6"
        )

      .flex.justify-end.gap-3.pt-4.border-t
        ft-button(variant="outline" @click="handleClose")
          | {{ $t('common.cancel') }}
        ft-button(type="submit" :loading="isSubmitting")
          | {{ isEditing ? $t('common.update') : $t('common.create') }}
</template>

<script setup lang="ts">
const props = defineProps<{
  isOpen: boolean
  answer?: any
}>()

const emit = defineEmits<{
  close: []
  submit: [data: any]
  'update:isOpen': [value: boolean]
}>()

const isEditing = computed(() => !!props.answer)
const isSubmitting = ref(false)

const formData = reactive({
  title: '',
  content: ''
})

const form = ref()

const handleClose = () => {
  resetForm()
  emit('close')
}

const resetForm = () => {
  formData.title = ''
  formData.content = ''
  isSubmitting.value = false
}

const handleSubmit = async () => {
  isSubmitting.value = true
  try {
    emit('submit', {
      title: formData.title,
      content: formData.content
    })
  } finally {
    isSubmitting.value = false
  }
}

watch(
  () => props.answer,
  (answer) => {
    if (answer) {
      formData.title = answer.title
      formData.content = answer.content
    } else {
      resetForm()
    }
  },
  { immediate: true }
)

watch(
  () => props.isOpen,
  (isOpen) => {
    if (!isOpen) {
      resetForm()
    }
  }
)
</script>

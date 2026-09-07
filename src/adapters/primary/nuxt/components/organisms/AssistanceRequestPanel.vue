<template lang="pug">
ft-slideover(:model-value="isOpen" @update:model-value="onToggle" @close="close")
  div.flex.flex-col.h-full(
    v-if="vm && panel"
    @keydown.meta.enter="submit"
    @keydown.ctrl.enter="submit"
  )
    div.flex.items-start.justify-between.px-6.pt-6.pb-4.border-b.border-gray-100
      div
        h2.text-xl.font-semibold.text-gray-900 {{ $t('assistance.panel.title') }}
      UButton(
        icon="i-heroicons-x-mark"
        variant="ghost"
        color="gray"
        :aria-label="$t('assistance.panel.close')"
        @click="close"
      )
    div.flex-1.overflow-y-auto.px-6.py-5.flex.flex-col.gap-5
      div
        p.text-sm.font-medium.text-gray-700.mb-1 {{ $t('assistance.panel.subject') }}
        assistance-subject-card(
          v-if="vm.isPrefilledFromPage() && subject"
          :category="category"
          :subject="subject"
          @change="vm.startChangingSubject()"
        )
        template(v-else)
          ft-category-chips(
            ref="chips"
            :options="categoryOptions"
            :model-value="category"
            @update:model-value="setCategory"
          )
          assistance-subject-card.mt-3(
            v-if="subject && category"
            :category="category"
            :subject="subject"
            @change="vm.startChangingSubject()"
          )
          assistance-subject-picker.mt-3(
            v-else-if="vm.needsSubject() && subjectType && category"
            ref="picker"
            :key="subjectType"
            :subject-type="subjectType"
            :category="category"
            :query="subjectQuery"
            @update:query="setSubjectQuery"
            @selected="setSubject"
          )
      UFormGroup(
        :label="$t('assistance.panel.description')"
        :help="$t('assistance.panel.descriptionHint')"
      )
        div(ref="descriptionField")
          UTextarea(
            :model-value="description"
            :rows="6"
            :placeholder="$t('assistance.panel.descriptionPlaceholder')"
            @update:model-value="setDescription"
          )
      div
        p.text-sm.font-medium.text-gray-700.mb-1
          | {{ $t('assistance.panel.screenshot') }}
          |
          span.text-gray-400.font-normal {{ $t('assistance.panel.optional') }}
        ft-image-dropzone(@files="addAttachments")
        div.flex.flex-col.gap-2.mt-2(v-if="attachments.length > 0")
          ft-attachment-chip(
            v-for="(attachment, index) in attachments"
            :key="`${index}-${attachment.name}`"
            :attachment="attachment"
            @remove="vm.removeAttachment(index)"
          )
        p.text-sm.text-orange-700.mt-2(v-if="attachmentError") {{ $t(`assistance.panel.attachmentErrors.${attachmentError}`) }}
    div.px-6.pt-4.pb-6.border-t.border-gray-100.flex.flex-col.gap-3
      UAlert(
        v-if="submitFailed"
        color="red"
        variant="soft"
        :description="$t('assistance.panel.submitFailed')"
      )
      ft-button.button-solid.w-full(
        icon="i-heroicons-paper-airplane"
        :loading="isSubmitting"
        :disabled="!vm.isValid() || isSubmitting"
        @click="submit"
      ) {{ $t('assistance.panel.submit') }}
      p.text-xs.text-gray-500.text-center
        | {{ $t('assistance.panel.footerHint') }}
        |
        NuxtLink.text-link.font-medium(to="/assistance" @click="close") {{ $t('assistance.panel.footerLink') }}
        | .
</template>

<script lang="ts" setup>
import { useAssistancePanel } from '@adapters/primary/nuxt/composables/useAssistancePanel'
import type { AssistancePanelVM } from '@adapters/primary/view-models/assistance/assistance-panel/assistancePanelVM'
import { assistancePanelVM } from '@adapters/primary/view-models/assistance/assistance-panel/assistancePanelVM'
import type { AssistanceRequestFormVM } from '@adapters/primary/view-models/assistance/assistance-request-form/assistanceRequestFormVM'
import { assistanceRequestFormVM } from '@adapters/primary/view-models/assistance/assistance-request-form/assistanceRequestFormVM'
import type { AssistanceSubject } from '@core/entities/assistanceRequest'
import { AssistanceRequestCategory } from '@core/entities/assistanceRequest'
import { createAssistanceRequest } from '@core/usecases/assistance/assistance-request-creation/createAssistanceRequest'
import { useAssistanceRequestGateway } from '../../../../../../gateways/assistanceRequestGateway'

const FORM_KEY = 'assistance-panel'
const TOAST_TIMEOUT_MS = 8000
const FOCUS_DELAY_MS = 100

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const { isOpen, close } = useAssistancePanel()

const panel = ref<AssistancePanelVM>()
const vm = shallowRef<AssistanceRequestFormVM>()
const chips = ref<{ focus: () => void }>()
const picker = ref<{ focus: () => void }>()
const descriptionField = ref<HTMLElement>()
const isSubmitting = ref(false)
const submitFailed = ref(false)
let resetOnNextOpen = true
let lastPageSubjectUuid: string | undefined

const categoryOptions = computed(() =>
  Object.values(AssistanceRequestCategory).map((value) => ({
    value,
    label: t(`assistance.category.${value.toLowerCase()}`)
  }))
)

const category = computed<AssistanceRequestCategory | undefined>(
  () => vm.value?.get('category').value
)
const subject = computed<AssistanceSubject | undefined>(
  () => vm.value?.get('subject').value
)
const subjectType = computed(() => vm.value?.subjectType())
const subjectQuery = computed<string>(
  () => vm.value?.get('subjectQuery').value ?? ''
)
const description = computed<string>(
  () => vm.value?.get('description').value ?? ''
)
const attachments = computed(() => vm.value?.getAttachments() ?? [])
const attachmentError = computed(() => vm.value?.getAttachmentError())

const setCategory = (value: string) => vm.value?.set('category', value)
const setSubject = (value: AssistanceSubject) => vm.value?.set('subject', value)
const setSubjectQuery = (value: string) => vm.value?.set('subjectQuery', value)
const setDescription = (value: string) => vm.value?.set('description', value)
const addAttachments = (files: Array<File>) => vm.value?.addAttachments(files)

const shouldResetForm = (pageSubjectUuid: string | undefined): boolean =>
  resetOnNextOpen || pageSubjectUuid !== lastPageSubjectUuid

const initialiseForm = (currentPanel: AssistancePanelVM) => {
  const pageSubjectUuid = currentPanel.pageSubject?.uuid
  if (!shouldResetForm(pageSubjectUuid)) return
  vm.value = assistanceRequestFormVM(FORM_KEY, {
    pageSubject: currentPanel.pageSubject,
    suggestedCategory: currentPanel.suggestedCategory
  })
  lastPageSubjectUuid = pageSubjectUuid
  resetOnNextOpen = false
}

const focusInitialField = () => {
  if (!vm.value) return
  if (!category.value) chips.value?.focus()
  else if (vm.value.needsSubject()) picker.value?.focus()
  else descriptionField.value?.querySelector('textarea')?.focus()
}

const onPaste = (event: ClipboardEvent) => {
  const images = Array.from(event.clipboardData?.files ?? []).filter((file) =>
    file.type.startsWith('image/')
  )
  if (images.length === 0) return
  event.preventDefault()
  vm.value?.addAttachments(images)
}

const onOpen = () => {
  const currentPanel = assistancePanelVM(route.path)
  panel.value = currentPanel
  submitFailed.value = false
  initialiseForm(currentPanel)
  document.addEventListener('paste', onPaste)
  setTimeout(focusInitialField, FOCUS_DELAY_MS)
}

const onClose = () => {
  document.removeEventListener('paste', onPaste)
}

const onToggle = (value: boolean) => {
  if (!value) close()
}

const notifyCreated = (created: { id: string; reference: string }) => {
  useToast().add({
    title: t('assistance.panel.toast.title', { reference: created.reference }),
    description: t('assistance.panel.toast.description'),
    color: 'green',
    timeout: TOAST_TIMEOUT_MS,
    actions: [
      {
        label: t('assistance.panel.toast.action'),
        click: () => router.push(`/assistance/${created.id}`)
      }
    ]
  })
}

const submit = async () => {
  if (!vm.value || !vm.value.isValid() || isSubmitting.value) return
  isSubmitting.value = true
  submitFailed.value = false
  try {
    await createAssistanceRequest(
      vm.value.getDto(),
      vm.value.getFiles(),
      useAssistanceRequestGateway()
    )
    const created = assistancePanelVM(route.path).lastCreated
    resetOnNextOpen = true
    close()
    if (created) notifyCreated(created)
  } catch {
    submitFailed.value = true
  } finally {
    isSubmitting.value = false
  }
}

watch(isOpen, (open) => {
  if (open) onOpen()
  else onClose()
})

onUnmounted(onClose)
</script>

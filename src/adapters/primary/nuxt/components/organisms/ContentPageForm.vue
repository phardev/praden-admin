<template lang="pug">
form.space-y-6(@submit.prevent="emit('submit')")
  UFormGroup(
    :label="$t('shopManagement.contentPages.fields.title')"
    :help="$t('shopManagement.contentPages.fields.titleHelp')"
    name="title"
    required
  )
    UInput(
      :model-value="formVm.get('title').value"
      :disabled="!formVm.get('title').canEdit"
      @update:model-value="formVm.set('title', $event)"
    )

  UFormGroup(
    :label="$t('shopManagement.contentPages.fields.metaDescription')"
    :help="$t('shopManagement.contentPages.fields.metaDescriptionHelp', { count: formVm.getMetaDescriptionLength() })"
    name="metaDescription"
    required
  )
    UTextarea(
      :model-value="formVm.get('metaDescription').value"
      :disabled="!formVm.get('metaDescription').canEdit"
      :rows="3"
      @update:model-value="formVm.set('metaDescription', $event)"
    )

  UFormGroup(
    :label="$t('shopManagement.contentPages.fields.html')"
    :help="$t('shopManagement.contentPages.fields.htmlHelp')"
    name="html"
    required
  )
    UTextarea(
      :model-value="formVm.get('html').value"
      :disabled="!formVm.get('html').canEdit"
      :rows="28"
      :ui="{ base: 'font-mono text-xs leading-relaxed' }"
      spellcheck="false"
      autocapitalize="off"
      autocorrect="off"
      @update:model-value="formVm.set('html', $event)"
    )

  content-page-html-preview(:html="formVm.get('html').value || ''")

  .flex.justify-end.pt-2
    ft-button.button-solid(
      type="submit"
      :disabled="!formVm.getCanValidate()"
      :loading="isSaving"
    ) {{ $t('shopManagement.contentPages.save') }}
</template>

<script lang="ts" setup>
import type { ContentPageFormVM } from '@adapters/primary/view-models/content-page/content-page-form/contentPageFormVM'

defineProps<{
  formVm: ContentPageFormVM
  isSaving: boolean
}>()

const emit = defineEmits<{ (e: 'submit'): void }>()
</script>

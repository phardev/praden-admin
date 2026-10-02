<template lang="pug">
form.space-y-6(@submit.prevent="emit('submit')")
  UAlert(
    v-if="formVm.isMandatory()"
    icon="i-heroicons-lock-closed"
    color="amber"
    variant="subtle"
    :title="$t('shopManagement.contentPages.mandatory')"
    :description="$t('shopManagement.contentPages.mandatoryHelp')"
  )

  UFormGroup(
    :label="$t('shopManagement.contentPages.fields.name')"
    :help="$t('shopManagement.contentPages.fields.nameHelp')"
    name="name"
    required
  )
    UInput(
      :model-value="formVm.get('name').value"
      :maxlength="maxNameLength"
      @update:model-value="formVm.set('name', $event)"
    )

  UFormGroup(
    :label="$t('shopManagement.contentPages.fields.slug')"
    :help="slugHelp"
    :error="slugError"
    name="slug"
    required
  )
    UInput(
      :model-value="formVm.get('slug').value"
      :disabled="!formVm.get('slug').canEdit"
      :placeholder="$t('shopManagement.contentPages.fields.slugPlaceholder')"
      @update:model-value="formVm.set('slug', $event)"
    )

  .grid.gap-6(class="md:grid-cols-2")
    UFormGroup(
      :label="$t('shopManagement.contentPages.fields.status')"
      :help="statusHelp"
      name="status"
    )
      .flex.items-center.gap-3
        USelectMenu(
          :model-value="formVm.get('status').value"
          :options="statusOptions"
          :disabled="statusOptions.length === 1"
          value-attribute="value"
          option-attribute="label"
          class="w-48"
          @update:model-value="formVm.set('status', $event)"
        )
        ft-content-page-status-badge(:status="formVm.get('status').value")

    UFormGroup(
      :label="$t('shopManagement.contentPages.fields.footerSection')"
      :help="footerSectionHelp"
      name="footerSection"
    )
      USelectMenu(
        :model-value="formVm.get('footerSection').value"
        :options="footerSectionOptions"
        value-attribute="value"
        option-attribute="label"
        class="w-64"
        @update:model-value="formVm.set('footerSection', $event)"
      )

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
import type {
  ContentPageFormVM,
  FooterSectionChoice
} from '@adapters/primary/view-models/content-page/content-page-form/contentPageFormVM'
import type { ContentPageStatus } from '@core/entities/contentPage'
import {
  CONTENT_PAGE_MAX_NAME_LENGTH,
  isValidContentPageSlug
} from '@core/entities/contentPage'

const props = defineProps<{
  formVm: ContentPageFormVM
  isSaving: boolean
}>()

const emit = defineEmits<{ (e: 'submit'): void }>()

const { t } = useI18n()
const config = useRuntimeConfig()

const maxNameLength = CONTENT_PAGE_MAX_NAME_LENGTH

const statusOptions = computed(() =>
  props.formVm.getStatusOptions().map((status: ContentPageStatus) => ({
    value: status,
    label: t(`shopManagement.contentPages.status.${status}`)
  }))
)

const footerSectionOptions = computed(() =>
  props.formVm
    .getFooterSectionOptions()
    .map((section: FooterSectionChoice) => ({
      value: section,
      label: t(`shopManagement.contentPages.footer.sections.${section}`)
    }))
)

const publicUrl = computed(
  () => `${config.public.SHOP_URL}${props.formVm.getPublicPath()}`
)

const slugHelp = computed(() =>
  props.formVm.get('slug').canEdit
    ? t('shopManagement.contentPages.fields.slugHelp', { url: publicUrl.value })
    : t('shopManagement.contentPages.fields.slugLocked', {
        url: publicUrl.value
      })
)

const slugError = computed(() => {
  const slug = props.formVm.get('slug').value
  if (!slug || isValidContentPageSlug(slug)) return undefined
  return t('shopManagement.contentPages.fields.slugInvalid')
})

const statusHelp = computed(() =>
  props.formVm.isMandatory()
    ? t('shopManagement.contentPages.fields.statusMandatoryHelp')
    : t('shopManagement.contentPages.fields.statusHelp')
)

const footerSectionHelp = computed(() =>
  props.formVm.isMandatory()
    ? t('shopManagement.contentPages.fields.footerSectionMandatoryHelp')
    : t('shopManagement.contentPages.fields.footerSectionHelp')
)
</script>

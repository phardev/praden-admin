<template lang="pug">
form.space-y-6(@submit.prevent="emit('submit')")
  UFormGroup(
    :label="$t('shopManagement.blogPosts.fields.title')"
    :help="$t('shopManagement.blogPosts.fields.titleHelp')"
    name="title"
    required
  )
    UInput(
      :model-value="formVm.get('title').value"
      @update:model-value="formVm.set('title', $event)"
    )

  UFormGroup(
    :label="$t('shopManagement.blogPosts.fields.slug')"
    :help="slugHelp"
    :error="slugError"
    name="slug"
    required
  )
    UInput(
      :model-value="formVm.get('slug').value"
      :disabled="!formVm.get('slug').canEdit"
      :placeholder="$t('shopManagement.blogPosts.fields.slugPlaceholder')"
      @update:model-value="formVm.set('slug', $event)"
    )

  UFormGroup(
    :label="$t('shopManagement.blogPosts.fields.status')"
    :help="$t('shopManagement.blogPosts.fields.statusHelp')"
    name="status"
  )
    .flex.items-center.gap-3
      USelectMenu(
        :model-value="formVm.get('status').value"
        :options="statusOptions"
        value-attribute="value"
        option-attribute="label"
        class="w-48"
        @update:model-value="formVm.set('status', $event)"
      )
      ft-blog-post-status-badge(:status="formVm.get('status').value")

  UFormGroup(
    :label="$t('shopManagement.blogPosts.fields.publishedAt')"
    :help="$t('shopManagement.blogPosts.fields.publishedAtHelp')"
    name="publishedAt"
    required
  )
    UPopover(:popper="{ placement: 'bottom-start' }")
      UButton(
        color="white"
        icon="i-heroicons-calendar-days"
        :label="publishedAtLabel"
      )
      template(#panel="{ close }")
        ft-date-picker(
          :model-value="formVm.get('publishedAt').value"
          @update:model-value="formVm.set('publishedAt', $event)"
          @close="close"
        )

  UFormGroup(
    :label="$t('shopManagement.blogPosts.fields.image')"
    :help="$t('shopManagement.blogPosts.fields.imageHelp')"
    name="image"
    required
  )
    blog-post-image-field(
      :image-url="formVm.get('imageUrl').value || ''"
      :file="formVm.get('image').value"
      @update:image-url="formVm.set('imageUrl', $event)"
      @update:file="formVm.set('image', $event)"
    )

  UFormGroup(
    :label="$t('shopManagement.blogPosts.fields.tags')"
    :help="$t('shopManagement.blogPosts.fields.tagsHelp')"
    name="tags"
  )
    blog-post-tags-field(
      :tags="formVm.get('tags').value || []"
      @add="formVm.addTag($event)"
      @remove="formVm.removeTag($event)"
    )

  UFormGroup(
    :label="$t('shopManagement.blogPosts.fields.metaTitle')"
    :help="$t('shopManagement.blogPosts.fields.metaTitleHelp')"
    name="metaTitle"
  )
    UInput(
      :model-value="formVm.get('metaTitle').value"
      @update:model-value="formVm.set('metaTitle', $event)"
    )

  UFormGroup(
    :label="$t('shopManagement.blogPosts.fields.metaDescription')"
    :help="$t('shopManagement.blogPosts.fields.metaDescriptionHelp', { count: formVm.getMetaDescriptionLength() })"
    name="metaDescription"
    required
  )
    UTextarea(
      :model-value="formVm.get('metaDescription').value"
      :rows="3"
      @update:model-value="formVm.set('metaDescription', $event)"
    )

  UFormGroup(
    :label="$t('shopManagement.blogPosts.fields.html')"
    :help="$t('shopManagement.blogPosts.fields.htmlHelp')"
    name="html"
    required
  )
    UTextarea(
      :model-value="formVm.get('html').value"
      :rows="24"
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
    ) {{ $t('shopManagement.blogPosts.save') }}
</template>

<script lang="ts" setup>
import type { BlogPostFormVM } from '@adapters/primary/view-models/blog-post/blog-post-form/blogPostFormVM'
import { BlogPostStatus, isValidBlogPostSlug } from '@core/entities/blogPost'
import { timestampToLocaleString } from '@utils/formatters'

const props = defineProps<{
  formVm: BlogPostFormVM
  isSaving: boolean
}>()

const emit = defineEmits<{ (e: 'submit'): void }>()

const { t } = useI18n()

const statusOptions = computed(() => [
  {
    value: BlogPostStatus.DRAFT,
    label: t('shopManagement.blogPosts.status.DRAFT')
  },
  {
    value: BlogPostStatus.PUBLISHED,
    label: t('shopManagement.blogPosts.status.PUBLISHED')
  }
])

const publishedAtLabel = computed(() =>
  timestampToLocaleString(props.formVm.get('publishedAt').value, 'fr-FR')
)

const slugHelp = computed(() => {
  const key = props.formVm.get('slug').canEdit ? 'slugHelp' : 'slugLocked'
  return t(`shopManagement.blogPosts.fields.${key}`, {
    url: props.formVm.getPublicPath()
  })
})

const slugError = computed(() => {
  const slug = props.formVm.get('slug').value
  if (!slug || isValidBlogPostSlug(slug)) return undefined
  return t('shopManagement.blogPosts.fields.slugInvalid')
})
</script>

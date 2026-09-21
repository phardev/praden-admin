<template lang="pug">
.blog-post-form-container.p-6
  .mb-4
    UButton(
      color="gray"
      variant="ghost"
      icon="i-heroicons-arrow-left"
      :label="$t('common.back')"
      @click="navigateTo('/shop-management/blog-posts')"
    )

  UCard
    template(#header)
      h1.text-2xl.font-bold {{ $t('shopManagement.blogPosts.createTitle') }}
    template(#default)
      blog-post-form(:form-vm="formVM" :is-saving="isSaving" @submit="save")
</template>

<script lang="ts" setup>
import { blogPostFormVM } from '@adapters/primary/view-models/blog-post/blog-post-form/blogPostFormVM'
import { createBlogPost } from '@core/usecases/blog-post/blog-post-creation/createBlogPost'
import { useBlogPostStore } from '@store/blogPostStore'
import { useBlogPostGateway } from '../../../../../../../gateways/blogPostGateway'
import { useDateProvider } from '../../../../../../../gateways/dateProvider'

definePageMeta({ layout: 'main' })

const { t } = useI18n()
const toast = useToast()
const blogPostGateway = useBlogPostGateway()
const blogPostStore = useBlogPostStore()

const buildFormVM = () => {
  formVM.value = blogPostFormVM(useDateProvider())
}

const formVM = ref(blogPostFormVM(useDateProvider()))
const isSaving = computed(() => blogPostStore.isSaving)

const save = async () => {
  try {
    await createBlogPost(formVM.value.getCreateDto(), blogPostGateway)
    buildFormVM()
    toast.add({
      title: t('shopManagement.blogPosts.createSuccess'),
      color: 'green'
    })
    await navigateTo('/shop-management/blog-posts')
  } catch (error: any) {
    toast.add({
      title:
        error?.response?.status === 409
          ? t('shopManagement.blogPosts.slugAlreadyUsed')
          : t('shopManagement.blogPosts.createError'),
      color: 'red'
    })
  }
}

onBeforeRouteLeave((to, from, next) => {
  if (formVM.value.hasChanges) {
    next(confirm(t('shopManagement.blogPosts.leavePageConfirm')))
    return
  }
  next()
})
</script>

<style scoped>
.blog-post-form-container {
  max-width: 1100px;
  margin: 0 auto;
}
</style>

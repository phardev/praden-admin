<template lang="pug">
.blog-post-form-container.p-6
  .mb-4.flex.items-center.justify-between
    UButton(
      color="gray"
      variant="ghost"
      icon="i-heroicons-arrow-left"
      :label="$t('common.back')"
      @click="navigateTo('/shop-management/blog-posts')"
    )
    UButton(
      v-if="formVM"
      color="gray"
      variant="ghost"
      icon="i-heroicons-arrow-top-right-on-square"
      :label="$t('shopManagement.blogPosts.viewOnline')"
      :to="onlineUrl"
      target="_blank"
    )

  UCard
    template(#header)
      h1.text-2xl.font-bold {{ $t('shopManagement.blogPosts.editTitle') }}
    template(#default)
      div(v-if="!formVM")
        .flex.justify-center.items-center.py-12
          icon.animate-spin.h-8.w-8(name="i-heroicons-arrow-path")
          span.ml-2 {{ $t('common.loading') }}

      blog-post-form(
        v-else
        :form-vm="formVM"
        :is-saving="isSaving"
        @submit="save"
      )
</template>

<script lang="ts" setup>
import type { BlogPostFormVM } from '@adapters/primary/view-models/blog-post/blog-post-form/blogPostFormVM'
import { blogPostFormVM } from '@adapters/primary/view-models/blog-post/blog-post-form/blogPostFormVM'
import { BlogPostStatus } from '@core/entities/blogPost'
import { editBlogPost } from '@core/usecases/blog-post/blog-post-edition/editBlogPost'
import { publishBlogPost } from '@core/usecases/blog-post/blog-post-publication/publishBlogPost'
import { unpublishBlogPost } from '@core/usecases/blog-post/blog-post-publication/unpublishBlogPost'
import { getBlogPost } from '@core/usecases/blog-post/get-blog-post/getBlogPost'
import { useBlogPostStore } from '@store/blogPostStore'
import { useBlogPostGateway } from '../../../../../../../../gateways/blogPostGateway'
import { useDateProvider } from '../../../../../../../../gateways/dateProvider'

definePageMeta({ layout: 'main' })

const { t } = useI18n()
const toast = useToast()
const route = useRoute()
const config = useRuntimeConfig()
const blogPostGateway = useBlogPostGateway()
const blogPostStore = useBlogPostStore()

const uuid = route.params.uuid as string
const formVM = ref<BlogPostFormVM | null>(null)

const isSaving = computed(() => blogPostStore.isSaving)
const onlineUrl = computed(
  () => `${config.public.SHOP_URL}/blog/${blogPostStore.current?.slug}`
)

const buildFormVM = () => {
  formVM.value = blogPostFormVM(useDateProvider(), uuid)
}

onMounted(async () => {
  try {
    await getBlogPost(uuid, blogPostGateway)
    buildFormVM()
  } catch {
    toast.add({ title: t('error.unknown'), color: 'red' })
    await navigateTo('/shop-management/blog-posts')
  }
})

const applyStatusTransition = async () => {
  const transition = formVM.value!.getStatusTransition()
  if (transition === undefined) return
  if (transition === BlogPostStatus.PUBLISHED) {
    await publishBlogPost(uuid, blogPostGateway)
    return
  }
  await unpublishBlogPost(uuid, blogPostGateway)
}

const save = async () => {
  try {
    await editBlogPost(uuid, formVM.value!.getEditDto(), blogPostGateway)
    await applyStatusTransition()
    await getBlogPost(uuid, blogPostGateway)
    buildFormVM()
    toast.add({
      title: t('shopManagement.blogPosts.updateSuccess'),
      color: 'green'
    })
  } catch {
    toast.add({
      title: t('shopManagement.blogPosts.updateError'),
      color: 'red'
    })
  }
}

onBeforeRouteLeave((to, from, next) => {
  if (formVM.value?.hasChanges) {
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

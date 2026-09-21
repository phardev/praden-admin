<template lang="pug">
.blog-posts-container.p-6
  .mb-4.flex.items-center.justify-between
    UButton(
      color="gray"
      variant="ghost"
      icon="i-heroicons-arrow-left"
      :label="$t('common.back')"
      @click="navigateTo('/shop-management')"
    )
    UButton(
      color="primary"
      icon="i-heroicons-plus"
      :label="$t('shopManagement.blogPosts.create')"
      @click="navigateTo('/shop-management/blog-posts/new')"
    )

  UCard.mb-6
    template(#header)
      h2.text-lg.font-semibold {{ $t('shopManagement.blogPosts.highlights.title') }}
      p.text-sm.text-gray-600.mt-1 {{ $t('shopManagement.blogPosts.highlights.description') }}
    template(#default)
      blog-post-highlights-manager(
        :items="vm.highlighted"
        :is-loading="vm.isLoading"
        @reorder="saveHighlights"
        @remove="removeFromHighlights"
      )

  UCard
    template(#header)
      h1.text-2xl.font-bold {{ $t('shopManagement.blogPosts.list.otherArticles') }}
    template(#default)
      blog-posts-list(
        :items="allItems"
        :is-loading="vm.isLoading"
        :is-saving="vm.isSaving"
        @highlight="(item) => addToHighlights(item.uuid)"
        @toggle-publication="togglePublication"
        @edit="(item) => navigateTo(`/shop-management/blog-posts/edit/${item.uuid}`)"
        @delete="openDeleteModal"
      )

  blog-post-delete-modal(
    :is-open="isDeleteModalOpen"
    :blog-post="itemToDelete"
    :is-deleting="vm.isDeleting"
    @update:is-open="isDeleteModalOpen = $event"
    @close="closeDeleteModal"
    @confirm="confirmDelete"
  )
</template>

<script lang="ts" setup>
import type { BlogPostListItemVM } from '@adapters/primary/view-models/blog-post/blog-posts-list/blogPostsListVM'
import { blogPostsListVM } from '@adapters/primary/view-models/blog-post/blog-posts-list/blogPostsListVM'
import { deleteBlogPost } from '@core/usecases/blog-post/blog-post-deletion/deleteBlogPost'
import { setBlogPostHighlights } from '@core/usecases/blog-post/blog-post-highlights/setBlogPostHighlights'
import { publishBlogPost } from '@core/usecases/blog-post/blog-post-publication/publishBlogPost'
import { unpublishBlogPost } from '@core/usecases/blog-post/blog-post-publication/unpublishBlogPost'
import { listBlogPosts } from '@core/usecases/blog-post/list-blog-posts/listBlogPosts'
import { useBlogPostGateway } from '../../../../../../../gateways/blogPostGateway'

definePageMeta({ layout: 'main' })

const { t } = useI18n()
const toast = useToast()
const blogPostGateway = useBlogPostGateway()

const vm = computed(() => blogPostsListVM())
const allItems = computed(() => [...vm.value.highlighted, ...vm.value.others])
const isDeleteModalOpen = ref(false)
const itemToDelete = ref<BlogPostListItemVM | undefined>(undefined)

onMounted(async () => {
  try {
    await listBlogPosts(blogPostGateway)
  } catch {
    toast.add({ title: t('error.unknown'), color: 'red' })
  }
})

const saveHighlights = async (uuids: Array<string>) => {
  try {
    await setBlogPostHighlights(uuids, blogPostGateway)
    toast.add({
      title: t('shopManagement.blogPosts.highlights.updateSuccess'),
      color: 'green'
    })
  } catch {
    toast.add({
      title: t('shopManagement.blogPosts.highlights.updateError'),
      color: 'red'
    })
    await listBlogPosts(blogPostGateway)
  }
}

const addToHighlights = (uuid: string) => {
  return saveHighlights([...vm.value.highlightedUuids, uuid])
}

const removeFromHighlights = (uuid: string) => {
  return saveHighlights(
    vm.value.highlightedUuids.filter((current) => current !== uuid)
  )
}

const togglePublication = async (item: BlogPostListItemVM) => {
  try {
    if (item.isPublished) {
      await unpublishBlogPost(item.uuid, blogPostGateway)
      toast.add({
        title: t('shopManagement.blogPosts.unpublishSuccess'),
        color: 'green'
      })
      return
    }
    await publishBlogPost(item.uuid, blogPostGateway)
    toast.add({
      title: t('shopManagement.blogPosts.publishSuccess'),
      color: 'green'
    })
  } catch {
    toast.add({
      title: t('shopManagement.blogPosts.updateError'),
      color: 'red'
    })
  }
}

const openDeleteModal = (item: BlogPostListItemVM) => {
  itemToDelete.value = item
  isDeleteModalOpen.value = true
}

const closeDeleteModal = () => {
  isDeleteModalOpen.value = false
  itemToDelete.value = undefined
}

const confirmDelete = async () => {
  try {
    await deleteBlogPost(itemToDelete.value!.uuid, blogPostGateway)
    toast.add({
      title: t('shopManagement.blogPosts.delete.success'),
      color: 'green'
    })
  } catch {
    toast.add({
      title: t('shopManagement.blogPosts.delete.error'),
      color: 'red'
    })
  } finally {
    closeDeleteModal()
  }
}
</script>

<style scoped>
.blog-posts-container {
  max-width: 1100px;
  margin: 0 auto;
}
</style>

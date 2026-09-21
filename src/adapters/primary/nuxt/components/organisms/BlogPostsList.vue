<template lang="pug">
.space-y-3(v-if="isLoading")
  USkeleton.h-20(v-for="n in 3" :key="n")

.text-center.py-12.text-gray-500(v-else-if="items.length === 0")
  icon.mb-4(name="i-heroicons-newspaper" class="text-6xl")
  p {{ $t('shopManagement.blogPosts.list.empty') }}

.space-y-3(v-else)
  blog-post-list-item(
    v-for="item in items"
    :key="item.uuid"
    :item="item"
    :is-saving="isSaving"
    @highlight="emit('highlight', item)"
    @toggle-publication="emit('togglePublication', item)"
    @edit="emit('edit', item)"
    @delete="emit('delete', item)"
  )
</template>

<script lang="ts" setup>
import type { BlogPostListItemVM } from '@adapters/primary/view-models/blog-post/blog-posts-list/blogPostsListVM'

defineProps<{
  items: Array<BlogPostListItemVM>
  isLoading: boolean
  isSaving: boolean
}>()

const emit = defineEmits<{
  (e: 'highlight', item: BlogPostListItemVM): void
  (e: 'togglePublication', item: BlogPostListItemVM): void
  (e: 'edit', item: BlogPostListItemVM): void
  (e: 'delete', item: BlogPostListItemVM): void
}>()
</script>

<template lang="pug">
.flex.items-center.gap-4.p-4.bg-white.border.border-gray-200.rounded-lg
  img.rounded.object-cover.bg-gray-100(
    :src="item.imageUrl"
    :alt="item.title"
    width="64"
    height="48"
  )
  .flex-1.min-w-0
    .font-medium.text-gray-900.truncate {{ item.title }}
    .flex.items-center.gap-3.mt-1.flex-wrap
      ft-blog-post-status-badge(:status="item.status")
      span.text-xs.text-gray-500 {{ $t('shopManagement.blogPosts.publishedOn', { date: item.publishedAt }) }}
      span.text-xs.text-gray-400 {{ $t(`shopManagement.blogPosts.lastUpdated.${item.authorKind}`, { date: item.updatedAt, author: item.authorName }) }}
  .flex.items-center.gap-2
    UButton(
      v-if="!item.isHighlighted"
      color="gray"
      variant="ghost"
      size="xs"
      icon="i-heroicons-star"
      :label="$t('shopManagement.blogPosts.highlights.add')"
      @click="emit('highlight')"
    )
    UButton(
      color="gray"
      variant="ghost"
      size="xs"
      :icon="item.isPublished ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'"
      :label="item.isPublished ? $t('shopManagement.blogPosts.unpublish') : $t('shopManagement.blogPosts.publish')"
      :loading="isSaving"
      @click="emit('togglePublication')"
    )
    UButton(
      color="gray"
      variant="ghost"
      size="xs"
      icon="i-heroicons-pencil"
      :label="$t('shopManagement.blogPosts.list.edit')"
      @click="emit('edit')"
    )
    UButton(
      color="red"
      variant="ghost"
      size="xs"
      icon="i-heroicons-trash"
      :label="$t('shopManagement.blogPosts.list.delete')"
      @click="emit('delete')"
    )
</template>

<script lang="ts" setup>
import type { BlogPostListItemVM } from '@adapters/primary/view-models/blog-post/blog-posts-list/blogPostsListVM'

defineProps<{
  item: BlogPostListItemVM
  isSaving?: boolean
}>()

const emit = defineEmits<{
  (e: 'highlight'): void
  (e: 'togglePublication'): void
  (e: 'edit'): void
  (e: 'delete'): void
}>()
</script>

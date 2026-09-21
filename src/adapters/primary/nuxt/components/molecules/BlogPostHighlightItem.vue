<template lang="pug">
.blog-post-highlight-item.flex.items-center.gap-4.p-4.bg-white.border.border-gray-200.rounded-lg.transition-all(
  :class="{ 'hover:border-gray-300 hover:shadow-sm': !isDragging, 'opacity-50': isDragging, 'cursor-move': !isDragging }"
)
  icon.text-gray-400.flex-shrink-0.cursor-move(name="i-heroicons-bars-3-bottom-left")
  img.rounded.object-cover.bg-gray-100(
    :src="item.imageUrl"
    :alt="item.title"
    width="64"
    height="48"
  )
  .flex-1.min-w-0
    .font-medium.text-gray-900.truncate {{ item.title }}
    .flex.items-center.gap-2.mt-1
      ft-blog-post-status-badge(:status="item.status")
      span.text-xs.text-amber-600(v-if="!item.isPublished") {{ $t('shopManagement.blogPosts.highlights.draftWarning') }}
  UButton(
    color="gray"
    variant="ghost"
    icon="i-heroicons-x-mark"
    size="sm"
    :aria-label="$t('shopManagement.blogPosts.highlights.remove')"
    @click="emit('remove')"
  )
</template>

<script lang="ts" setup>
import type { BlogPostListItemVM } from '@adapters/primary/view-models/blog-post/blog-posts-list/blogPostsListVM'

defineProps<{
  item: BlogPostListItemVM
  isDragging?: boolean
}>()

const emit = defineEmits<{
  (e: 'remove'): void
}>()
</script>

<template lang="pug">
.space-y-3
  .space-y-3(v-if="isLoading")
    USkeleton.h-20(v-for="n in 2" :key="n")

  draggable(
    v-else-if="items.length > 0"
    :model-value="items"
    item-key="uuid"
    handle=".blog-post-highlight-item"
    class="space-y-3"
    @start="onDragStart"
    @end="onDragEnd"
  )
    template(#item="{ element }")
      blog-post-highlight-item(
        :item="element"
        :is-dragging="draggedUuid === element.uuid"
        @remove="emit('remove', element.uuid)"
      )

  .text-center.py-10.bg-gray-50.rounded-lg.border-2.border-dashed.border-gray-200(v-else)
    icon.mx-auto.mb-3.text-gray-400(name="i-heroicons-newspaper" class="w-12 h-12")
    p.text-gray-600 {{ $t('shopManagement.blogPosts.highlights.empty') }}
</template>

<script lang="ts" setup>
import type { BlogPostListItemVM } from '@adapters/primary/view-models/blog-post/blog-posts-list/blogPostsListVM'
import draggable from 'vuedraggable'

const props = defineProps<{
  items: Array<BlogPostListItemVM>
  isLoading: boolean
}>()

const emit = defineEmits<{
  (e: 'reorder', uuids: Array<string>): void
  (e: 'remove', uuid: string): void
}>()

const draggedUuid = ref<string | null>(null)

const onDragStart = (event: any) => {
  draggedUuid.value = props.items[event.oldIndex]?.uuid || null
}

const onDragEnd = (event: any) => {
  draggedUuid.value = null
  if (event.oldIndex === event.newIndex) return
  const uuids = props.items.map((item: BlogPostListItemVM) => item.uuid)
  const [moved] = uuids.splice(event.oldIndex, 1)
  uuids.splice(event.newIndex, 0, moved)
  emit('reorder', uuids)
}
</script>

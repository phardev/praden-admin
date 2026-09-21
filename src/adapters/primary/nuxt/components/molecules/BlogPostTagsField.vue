<template lang="pug">
.space-y-2
  .flex.items-center.gap-2.flex-wrap(v-if="tags.length > 0")
    UBadge.gap-1(
      v-for="tag in tags"
      :key="tag"
      color="primary"
      variant="subtle"
      :ui="{ rounded: 'rounded-full' }"
    )
      span {{ tag }}
      button.ml-1(type="button" @click="emit('remove', tag)")
        icon(name="i-heroicons-x-mark" class="text-xs")
  UInput(
    v-model="draft"
    :placeholder="$t('shopManagement.blogPosts.fields.tagsPlaceholder')"
    icon="i-heroicons-tag"
    @keydown.enter.prevent="addDraft"
    @blur="addDraft"
  )
</template>

<script lang="ts" setup>
defineProps<{
  tags: Array<string>
}>()

const emit = defineEmits<{
  (e: 'add', tag: string): void
  (e: 'remove', tag: string): void
}>()

const draft = ref('')

const addDraft = () => {
  if (draft.value.trim().length === 0) return
  emit('add', draft.value)
  draft.value = ''
}
</script>

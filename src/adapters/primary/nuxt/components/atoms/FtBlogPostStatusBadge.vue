<template lang="pug">
UBadge(
  :color="isPublished ? 'green' : 'gray'"
  variant="subtle"
  :ui="{ rounded: 'rounded-full' }"
) {{ $t(`shopManagement.blogPosts.status.${status}`) }}
</template>

<script lang="ts" setup>
import { BlogPostStatus } from '@core/entities/blogPost'

const props = defineProps<{
  status: BlogPostStatus
}>()

const isPublished = computed(() => props.status === BlogPostStatus.PUBLISHED)
</script>

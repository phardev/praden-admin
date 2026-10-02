<template lang="pug">
UBadge(
  :color="isPublished ? 'green' : 'gray'"
  variant="subtle"
  :ui="{ rounded: 'rounded-full' }"
) {{ $t(`shopManagement.contentPages.status.${status}`) }}
</template>

<script lang="ts" setup>
import { ContentPageStatus } from '@core/entities/contentPage'

const props = defineProps<{
  status: ContentPageStatus
}>()

const isPublished = computed(() => props.status === ContentPageStatus.PUBLISHED)
</script>

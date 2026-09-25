<template lang="pug">
.mt-6.space-y-8
  section
    h2.text-lg.font-semibold.text-gray-900.mb-3 {{ $t('shopManagement.announcementBar.displayedNow') }}
    .rounded-lg.border-2.border-green-500.bg-green-50(v-if="announcementBarsVm.displayed")
      AnnouncementBarListItem(
        :announcement-bar="announcementBarsVm.displayed"
        @edit="handleEdit"
        @delete="handleDelete"
      )
    .rounded-lg.border.border-dashed.border-gray-300.py-6.text-center.text-gray-600(v-else)
      | {{ $t('shopManagement.announcementBar.noneDisplayed') }}

  AnnouncementBarsTimeline(
    :timeline-vm="timelineVm"
    @edit="handleEdit"
  )

  section
    h2.text-lg.font-semibold.text-gray-900.mb-3 {{ $t('shopManagement.announcementBar.upcoming') }}
    .rounded-lg.border.border-gray-200(v-if="announcementBarsVm.upcoming.length > 0")
      AnnouncementBarListItem(
        v-for="item in announcementBarsVm.upcoming"
        :key="item.uuid"
        :announcement-bar="item"
        @edit="handleEdit"
        @delete="handleDelete"
      )
    p.text-gray-600(v-else) {{ $t('shopManagement.announcementBar.noUpcoming') }}

  details.group(v-if="announcementBarsVm.ended.length > 0")
    summary.cursor-pointer.text-lg.font-semibold.text-gray-900.mb-3
      | {{ $t('shopManagement.announcementBar.ended', { count: announcementBarsVm.ended.length }) }}
    .rounded-lg.border.border-gray-200
      AnnouncementBarListItem(
        v-for="item in announcementBarsVm.ended"
        :key="item.uuid"
        :announcement-bar="item"
        @edit="handleEdit"
        @delete="handleDelete"
      )
</template>

<script lang="ts" setup>
import AnnouncementBarListItem from '@adapters/primary/nuxt/components/molecules/AnnouncementBarListItem.vue'
import AnnouncementBarsTimeline from '@adapters/primary/nuxt/components/organisms/AnnouncementBarsTimeline.vue'
import type { GetAnnouncementBarsVM } from '@adapters/primary/view-models/announcement-bar/get-announcement-bars/getAnnouncementBarsVM'
import type { GetAnnouncementBarsTimelineVM } from '@adapters/primary/view-models/announcement-bar/get-announcement-bars-timeline/getAnnouncementBarsTimelineVM'

defineProps<{
  announcementBarsVm: GetAnnouncementBarsVM
  timelineVm: GetAnnouncementBarsTimelineVM
}>()

const emit = defineEmits<{
  (e: 'edit', uuid: string): void
  (e: 'delete', uuid: string): void
}>()

const handleEdit = (uuid: string) => {
  emit('edit', uuid)
}

const handleDelete = (uuid: string) => {
  emit('delete', uuid)
}
</script>

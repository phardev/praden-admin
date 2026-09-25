<template lang="pug">
.flex.items-center.justify-between.space-x-4.py-4.px-4.border-b.border-gray-200(class="last:border-b-0")
  .flex-1.min-w-0
    .flex.items-center.space-x-3
      p.text-sm.font-medium.text-gray-900.truncate {{ announcementBar.text }}
      UBadge(
        :color="STATUS_COLORS[announcementBar.status]"
        variant="subtle"
        size="xs"
      ) {{ $t(`shopManagement.announcementBar.status.${announcementBar.status}`) }}
    .mt-1.flex.items-center.space-x-2.text-xs.text-gray-600
      span(v-if="announcementBar.startDate") {{ $t('shopManagement.announcementBar.from') }} {{ announcementBar.startDate }}
      span(v-if="announcementBar.endDate") {{ $t('shopManagement.announcementBar.to') }} {{ announcementBar.endDate }}
    p.mt-1.text-xs.text-orange-700(v-if="announcementBar.maskedBy")
      span(v-if="announcementBar.maskedBy.endDate") {{ $t('shopManagement.announcementBar.maskedByUntil', announcementBar.maskedBy) }}
      span(v-else) {{ $t('shopManagement.announcementBar.maskedBy', announcementBar.maskedBy) }}
  .flex.items-center.space-x-2
    ft-button(
      size="sm"
      variant="ghost"
      :aria-label="$t('common.edit')"
      @click="emit('edit', announcementBar.uuid)"
    )
      icon.icon-md.text-link(name="material-symbols:edit-square-outline")
    ft-button(
      size="sm"
      variant="ghost"
      :aria-label="$t('common.delete')"
      @click="handleDelete"
    )
      icon.icon-md.text-red-500(name="material-symbols:delete-outline")
</template>

<script lang="ts" setup>
import type {
  AnnouncementBarStatus,
  GetAnnouncementBarsItemVM
} from '@adapters/primary/view-models/announcement-bar/get-announcement-bars/getAnnouncementBarsVM'

const STATUS_COLORS: Record<AnnouncementBarStatus, string> = {
  DISPLAYED: 'green',
  MASKED: 'orange',
  SCHEDULED: 'blue',
  PAUSED: 'gray',
  ENDED: 'gray'
}

const props = defineProps<{
  announcementBar: GetAnnouncementBarsItemVM
}>()

const emit = defineEmits<{
  (e: 'edit', uuid: string): void
  (e: 'delete', uuid: string): void
}>()

const handleDelete = () => {
  emit('delete', props.announcementBar.uuid)
}
</script>

<template lang="pug">
.flex.items-center.justify-between.space-x-4.py-4.px-4.border-b.border-gray-200(class="hover:bg-gray-50")
  .flex-1.min-w-0
    .flex.items-center.space-x-3
      p.text-sm.font-medium.text-gray-900.truncate {{ announcementBar.text }}
      UBadge(
        v-if="announcementBar.isActive"
        color="green"
        variant="subtle"
        size="xs"
      ) {{ $t('shopManagement.announcementBar.active') }}
      UBadge(
        v-else
        color="gray"
        variant="subtle"
        size="xs"
      ) {{ $t('shopManagement.announcementBar.inactive') }}
    .mt-1.flex.items-center.space-x-2.text-xs.text-gray-500
      span(v-if="announcementBar.startDate") {{ $t('shopManagement.announcementBar.from') }} {{ announcementBar.startDate }}
      span(v-if="announcementBar.endDate") {{ $t('shopManagement.announcementBar.to') }} {{ announcementBar.endDate }}
  .flex.items-center.space-x-2
    ft-button(
      size="sm"
      variant="ghost"
      @click="emit('edit', announcementBar.uuid)"
    )
      icon.icon-md.text-link(name="material-symbols:edit-square-outline")
    ft-button(
      size="sm"
      variant="ghost"
      @click="handleDelete"
    )
      icon.icon-md.text-red-500(name="material-symbols:delete-outline")
</template>

<script lang="ts" setup>
import type { GetAnnouncementBarsItemVM } from '@adapters/primary/view-models/announcement-bar/get-announcement-bars/getAnnouncementBarsVM'

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

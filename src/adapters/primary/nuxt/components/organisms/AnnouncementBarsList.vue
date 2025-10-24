<template lang="pug">
tab-group.border-b.border-gray-200(as="div")
  tab-list.-mb-px.flex.space-x-4
    tab.w-full.rounded-md.border-neutral-light.py-2.pl-3.pr-10.text-base.outline-0.cursor-pointer(
      v-for="(group, tabIndex) in Object.keys(announcementBarsVm)"
      v-slot="{ selected }"
      :key="tabIndex"
      as="div"
    )
      div.whitespace-nowrap.flex.py-4.px-1.border-b-2.font-medium.text-sm(
        :class="[selected ? 'border-default text-colored' : 'border-transparent text-light-contrast hover:text-contrast hover:border-neutral-light']"
      )
        div {{ group }}
  tab-panels
    tab-panel.mt-4(
      v-for="(group, index) in Object.values(announcementBarsVm)"
      :key="index"
    )
      div(v-if="group.items.length === 0")
        p.text-center.text-gray-500.py-8 {{ $t('shopSettings.announcementBar.noItems') }}
      div(v-else)
        AnnouncementBarListItem(
          v-for="item in group.items"
          :key="item.uuid"
          :announcement-bar="item"
          @edit="handleEdit"
          @delete="handleDelete"
        )
</template>

<script lang="ts" setup>
import AnnouncementBarListItem from '@adapters/primary/nuxt/components/molecules/AnnouncementBarListItem.vue'
import type { GetAnnouncementBarsVM } from '@adapters/primary/view-models/announcement-bar/get-announcement-bars/getAnnouncementBarsVM'
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/vue'

defineProps<{
  announcementBarsVm: GetAnnouncementBarsVM
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

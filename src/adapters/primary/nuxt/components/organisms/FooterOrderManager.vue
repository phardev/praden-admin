<template lang="pug">
.space-y-4
  p.text-sm.text-gray-600 {{ $t('shopManagement.contentPages.footer.help') }}

  .grid.gap-6(v-if="isLoading" class="md:grid-cols-2")
    .space-y-2(v-for="column in 2" :key="column")
      USkeleton.h-12(v-for="n in 4" :key="n")

  .grid.gap-6(v-else class="md:grid-cols-2")
    div(v-for="section in sections" :key="section.section")
      h3.font-semibold.text-gray-900.mb-3 {{ $t(`shopManagement.contentPages.footer.sections.${section.section}`) }}
      draggable(
        v-if="section.entries.length > 0"
        :model-value="section.entries"
        item-key="uuid"
        handle=".footer-order-item"
        class="space-y-2"
        :disabled="isSaving"
        @start="onDragStart(section, $event)"
        @end="onDragEnd(section, $event)"
      )
        template(#item="{ element }")
          footer-order-item(
            :entry="element"
            :is-dragging="draggedUuid === element.uuid"
          )
      .text-center.py-8.bg-gray-50.rounded-lg.border-2.border-dashed.border-gray-200.text-sm.text-gray-500(v-else)
        | {{ $t('shopManagement.contentPages.footer.empty') }}
</template>

<script lang="ts" setup>
import type {
  FooterOrderEntryVM,
  FooterOrderSectionVM
} from '@adapters/primary/view-models/content-page/get-footer-order/getFooterOrderVM'
import type { FooterSection } from '@core/entities/footer'
import draggable from 'vuedraggable'

defineProps<{
  sections: Array<FooterOrderSectionVM>
  isLoading: boolean
  isSaving: boolean
}>()

const emit = defineEmits<{
  (e: 'reorder', section: FooterSection, uuids: Array<string>): void
}>()

const draggedUuid = ref<string | null>(null)

const onDragStart = (section: FooterOrderSectionVM, event: any) => {
  draggedUuid.value = section.entries[event.oldIndex]?.uuid || null
}

const onDragEnd = (section: FooterOrderSectionVM, event: any) => {
  draggedUuid.value = null
  if (event.oldIndex === event.newIndex) return
  const uuids = section.entries.map((entry: FooterOrderEntryVM) => entry.uuid)
  const [moved] = uuids.splice(event.oldIndex, 1)
  uuids.splice(event.newIndex, 0, moved)
  emit('reorder', section.section, uuids)
}
</script>

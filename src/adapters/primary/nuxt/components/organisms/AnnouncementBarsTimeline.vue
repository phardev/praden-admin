<template lang="pug">
section(v-if="timelineVm.site.length > 0")
  h2.text-lg.font-semibold.text-gray-900 {{ $t('shopManagement.announcementBar.timeline.title') }}
  p.text-sm.text-gray-600.mb-3 {{ $t('shopManagement.announcementBar.timeline.description') }}
  .rounded-lg.border.border-gray-200.bg-white.p-4
    .overflow-x-auto
      .flex(class="min-w-[720px]")
        .w-56.shrink-0.pr-3
          .h-6
          .h-9.flex.items-center.text-sm.font-semibold.text-gray-900 {{ $t('shopManagement.announcementBar.timeline.site') }}
          .h-8.flex.items-center.gap-2.text-xs.text-gray-700(
            v-for="row in timelineVm.rows"
            :key="row.uuid"
          )
            span.inline-block.h-2.w-2.shrink-0.rounded-full(:style="{ background: colorOf(row.colorIndex).solid }")
            span.truncate(:title="row.text") {{ row.text }}
        .relative.flex-1
          .relative.h-6.text-xs.text-gray-600
            span.absolute(
              v-for="tick in timelineVm.ticks"
              :key="tick.label"
              class="-translate-x-1/2"
              :style="{ left: `${tick.leftPercent}%` }"
            ) {{ tick.label }}
          .pointer-events-none.absolute.bottom-0.border-l.border-dashed.border-gray-200(
            v-for="weekLine in timelineVm.weekLines"
            :key="`week-${weekLine}`"
            class="top-6"
            :style="{ left: `${weekLine}%` }"
          )
          .pointer-events-none.absolute.inset-y-0.border-l.border-gray-300(
            v-for="tick in timelineVm.ticks"
            :key="`line-${tick.label}`"
            :style="{ left: `${tick.leftPercent}%` }"
          )
          .pointer-events-none.absolute.inset-y-0.left-0.border-l-2.border-primary-500
          .relative.h-9.border-b.border-gray-200
            template(
              v-for="segment in timelineVm.site"
              :key="`site-${segment.leftPercent}`"
            )
              .timeline-gap.absolute.inset-y-1.flex.items-center.overflow-hidden.rounded.px-2.text-xs.font-medium.text-red-700(
                v-if="segment.isGap"
                :style="placementStyle(segment)"
                :title="$t('shopManagement.announcementBar.timeline.gapTitle', segment)"
              ) {{ $t('shopManagement.announcementBar.timeline.gap') }}
              button.absolute.inset-y-1.overflow-hidden.truncate.rounded.px-2.text-left.text-xs.font-medium.text-white.cursor-pointer(
                v-else
                type="button"
                class="hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-gray-900"
                :style="{ ...placementStyle(segment), background: colorOf(segment.colorIndex).solid }"
                :title="segmentTitle(segment.text, 'DISPLAYED', segment)"
                :aria-label="segmentTitle(segment.text, 'DISPLAYED', segment)"
                @click="emit('edit', segment.uuid)"
              ) {{ segment.text }}
          .relative.h-8(
            v-for="row in timelineVm.rows"
            :key="`track-${row.uuid}`"
          )
            button.absolute.inset-y-1.rounded.cursor-pointer(
              v-for="segment in row.segments"
              :key="`${row.uuid}-${segment.leftPercent}`"
              type="button"
              class="hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-gray-900"
              :style="{ ...placementStyle(segment), ...stateStyle(segment.state, row.colorIndex) }"
              :title="segmentTitle(row.text, segment.state, segment)"
              :aria-label="segmentTitle(row.text, segment.state, segment)"
              @click="emit('edit', row.uuid)"
            )
    .mt-4.flex.flex-wrap.gap-x-6.gap-y-2.text-xs.text-gray-700
      span.flex.items-center.gap-2
        span.inline-block.h-3.border-l-2.border-primary-500
        | {{ $t('shopManagement.announcementBar.timeline.today') }}
      span.flex.items-center.gap-2
        span.inline-block.h-3.w-6.rounded(:style="stateStyle('DISPLAYED', NEUTRAL)")
        | {{ $t('shopManagement.announcementBar.timeline.state.DISPLAYED') }}
      span.flex.items-center.gap-2
        span.inline-block.h-3.w-6.rounded(:style="stateStyle('MASKED', NEUTRAL)")
        | {{ $t('shopManagement.announcementBar.timeline.state.MASKED') }}
      span.flex.items-center.gap-2
        span.inline-block.h-3.w-6.rounded(:style="stateStyle('PAUSED', NEUTRAL)")
        | {{ $t('shopManagement.announcementBar.timeline.state.PAUSED') }}
      span.flex.items-center.gap-2
        span.timeline-gap.inline-block.h-3.w-6.rounded
        | {{ $t('shopManagement.announcementBar.timeline.gapLegend') }}

    .mt-6.border-t.border-gray-200.pt-4
      h3.text-sm.font-semibold.text-gray-900.mb-2 {{ $t('shopManagement.announcementBar.timeline.changesTitle') }}
      p.text-sm.text-gray-600(v-if="timelineVm.changes.length === 0") {{ $t('shopManagement.announcementBar.timeline.noChanges') }}
      ol.space-y-1(v-else)
        li.flex.items-center.gap-3.text-sm(
          v-for="change in timelineVm.changes"
          :key="`change-${change.dateLabel}-${change.text}`"
        )
          span.w-28.shrink-0.font-medium.text-gray-900 {{ change.dateLabel }}
          icon.icon-sm.shrink-0.text-gray-400(name="material-symbols:arrow-right-alt")
          span.font-medium.text-red-700(v-if="change.isGap") {{ $t('shopManagement.announcementBar.timeline.gapLegend') }}
          span.flex.min-w-0.items-center.gap-2.text-gray-800(v-else)
            span.inline-block.h-2.w-2.shrink-0.rounded-full(:style="{ background: colorOf(change.colorIndex).solid }")
            span.truncate {{ change.text }}
</template>

<script lang="ts" setup>
import type {
  AnnouncementBarTimelineState,
  GetAnnouncementBarsTimelineVM
} from '@adapters/primary/view-models/announcement-bar/get-announcement-bars-timeline/getAnnouncementBarsTimelineVM'

defineProps<{
  timelineVm: GetAnnouncementBarsTimelineVM
}>()

const emit = defineEmits<{
  (e: 'edit', uuid: string): void
}>()

const { t } = useI18n()

interface BarColor {
  solid: string
  light: string
}

const PALETTE: Array<BarColor> = [
  { solid: '#2563eb', light: '#93c5fd' },
  { solid: '#b45309', light: '#fcd34d' },
  { solid: '#7c3aed', light: '#c4b5fd' },
  { solid: '#0f766e', light: '#5eead4' },
  { solid: '#be185d', light: '#f9a8d4' },
  { solid: '#475569', light: '#cbd5e1' }
]

const NEUTRAL = -1
const NEUTRAL_COLOR: BarColor = { solid: '#6b7280', light: '#d1d5db' }
const MIN_SEGMENT_WIDTH = '3px'

const colorOf = (colorIndex?: number): BarColor =>
  colorIndex === undefined || colorIndex === NEUTRAL
    ? NEUTRAL_COLOR
    : PALETTE[colorIndex % PALETTE.length]

const stateStyle = (
  state: AnnouncementBarTimelineState,
  colorIndex: number
): Record<string, string> => {
  const color = colorOf(colorIndex)
  const styles: Record<AnnouncementBarTimelineState, Record<string, string>> = {
    DISPLAYED: { background: color.solid },
    MASKED: {
      background: `repeating-linear-gradient(135deg, ${color.light} 0 4px, #ffffff 4px 8px)`
    },
    PAUSED: { background: '#ffffff', border: `2px dashed ${color.light}` }
  }
  return styles[state]
}

const placementStyle = (segment: {
  leftPercent: number
  widthPercent: number
}) => ({
  left: `${segment.leftPercent}%`,
  width: `max(${segment.widthPercent}%, ${MIN_SEGMENT_WIDTH})`
})

const segmentTitle = (
  text: string,
  state: AnnouncementBarTimelineState,
  segment: { startLabel: string; endLabel: string }
) =>
  t('shopManagement.announcementBar.timeline.segmentTitle', {
    text,
    state: t(`shopManagement.announcementBar.timeline.state.${state}`),
    start: segment.startLabel,
    end: segment.endLabel
  })
</script>

<style scoped>
.timeline-gap {
  background: repeating-linear-gradient(
    135deg,
    #fecaca 0 4px,
    #fef2f2 4px 8px
  );
}
</style>

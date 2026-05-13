<template lang="pug">
section.flex.flex-col.gap-4(:aria-label="$t('orders.timeline.title')")
  h2.text-lg.font-semibold {{ $t('orders.timeline.title') }}
  ol.flex.flex-col(v-if="entries.length > 0")
    li.flex.items-start.gap-3(
      v-for="(entry, index) in entries"
      :key="`${entry.type}-${entry.timestamp}-${index}`"
    )
      .flex.flex-col.items-center.shrink-0
        .flex.h-6.w-6.items-center.justify-center(:class="iconColor(entry.type)")
          UIcon.h-5.w-5(:name="iconName(entry.type)" aria-hidden="true")
        .w-px.flex-1.bg-gray-200(v-if="index < entries.length - 1")
      .flex.flex-1.items-baseline.justify-between.gap-3.min-w-0.pb-4
        .flex.items-baseline.gap-2.min-w-0
          span.font-medium.truncate {{ $t(entry.labelKey) }}
          span.text-sm.text-gray-500.shrink-0 {{ entry.timestamp }}
        span.text-sm.text-gray-500.shrink-0 {{ actorLabel(entry.actor) }}
  p.text-sm.text-gray-500(v-else) {{ $t('orders.timeline.empty') }}
</template>

<script lang="ts" setup>
import type {
  TimelineActorVM,
  TimelineEntryVM
} from '@adapters/primary/view-models/orders/get-order-timeline/getOrderTimelineVM'
import { TimelineEntryType } from '@core/entities/orderTimeline'

defineProps<{
  entries: Array<TimelineEntryVM>
}>()

const { t } = useI18n()

const actorLabel = (actor: TimelineActorVM): string => {
  if (actor.kind === 'staff') return actor.name
  if (actor.kind === 'system') return t('orders.timeline.actor.system')
  return t('orders.timeline.actor.unknown')
}

const iconName = (type: TimelineEntryType): string => {
  switch (type) {
    case TimelineEntryType.Placed:
      return 'i-heroicons-shopping-bag'
    case TimelineEntryType.Paid:
      return 'i-heroicons-credit-card'
    case TimelineEntryType.PaymentRejected:
      return 'i-heroicons-credit-card'
    case TimelineEntryType.PreparationStarted:
      return 'i-heroicons-play'
    case TimelineEntryType.PreparationSaved:
      return 'i-heroicons-bookmark-square'
    case TimelineEntryType.PreparationValidated:
      return 'i-heroicons-check-badge'
    case TimelineEntryType.PreparationCanceled:
      return 'i-heroicons-x-circle'
    case TimelineEntryType.Shipped:
      return 'i-heroicons-truck'
    case TimelineEntryType.Delivered:
      return 'i-heroicons-home'
  }
}

const iconColor = (type: TimelineEntryType): string => {
  switch (type) {
    case TimelineEntryType.Placed:
      return 'text-gray-500'
    case TimelineEntryType.Paid:
      return 'text-green-500'
    case TimelineEntryType.PaymentRejected:
      return 'text-red-500'
    case TimelineEntryType.PreparationStarted:
      return 'text-blue-500'
    case TimelineEntryType.PreparationSaved:
      return 'text-amber-500'
    case TimelineEntryType.PreparationValidated:
      return 'text-green-500'
    case TimelineEntryType.PreparationCanceled:
      return 'text-red-500'
    case TimelineEntryType.Shipped:
      return 'text-orange-500'
    case TimelineEntryType.Delivered:
      return 'text-green-500'
  }
}
</script>

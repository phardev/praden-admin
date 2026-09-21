<template lang="pug">
.flex.flex-wrap.items-end.gap-3
  .flex.flex-wrap.gap-2
    UButton(
      v-for="preset in presets"
      :key="preset.key"
      :label="$t(preset.labelKey)"
      :color="preset.key === activePreset ? 'primary' : 'gray'"
      :variant="preset.key === activePreset ? 'solid' : 'soft'"
      :aria-pressed="preset.key === activePreset"
      size="sm"
      class="cursor-pointer transition-colors duration-200 min-h-11"
      @click="applyPreset(preset.key)"
    )
  UFormGroup(:label="$t('common.period.startDate')" name="startDate")
    UPopover(:popper="{ placement: 'bottom-start' }")
      UButton(
        icon="i-heroicons-calendar-days-20-solid"
        :label="start ? format(start, 'd MMM yyyy', { locale: fr }) : $t('common.period.selectDate')"
        class="w-full flex justify-between text-sm cursor-pointer min-h-11"
        color="primary"
        variant="soft"
        size="sm"
      )
      template(#panel="{ close }")
        ft-date-picker(
          :model-value="start"
          @update:model-value="onStartChange"
          @close="close"
        )
  UFormGroup(:label="$t('common.period.endDate')" name="endDate")
    UPopover(:popper="{ placement: 'bottom-start' }")
      UButton(
        icon="i-heroicons-calendar-days-20-solid"
        :label="end ? format(end, 'd MMM yyyy', { locale: fr }) : $t('common.period.selectDate')"
        class="w-full flex justify-between text-sm cursor-pointer min-h-11"
        color="primary"
        variant="soft"
        size="sm"
      )
      template(#panel="{ close }")
        ft-date-picker(
          :model-value="end"
          :is-end-date="true"
          @update:model-value="onEndChange"
          @close="close"
        )
</template>

<script setup lang="ts">
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

type PresetKey = 'last7Days' | 'last30Days' | 'currentMonth'

const props = defineProps<{
  start: number | null
  end: number | null
}>()

const emit = defineEmits<{
  'update:start': [value: number | null]
  'update:end': [value: number | null]
  apply: []
}>()

const presets: Array<{ key: PresetKey; labelKey: string }> = [
  { key: 'last7Days', labelKey: 'common.period.last7Days' },
  { key: 'last30Days', labelKey: 'common.period.last30Days' },
  { key: 'currentMonth', labelKey: 'common.period.currentMonth' }
]

const startOfDay = (date: Date): number => {
  date.setHours(0, 0, 0, 0)
  return date.getTime()
}

const endOfDay = (date: Date): number => {
  date.setHours(23, 59, 59, 999)
  return date.getTime()
}

const buildPresetRange = (key: PresetKey): [number, number] => {
  const today = new Date()
  if (key === 'currentMonth') {
    return [
      startOfDay(new Date(today.getFullYear(), today.getMonth(), 1)),
      endOfDay(new Date(today))
    ]
  }
  const days = key === 'last7Days' ? 7 : 30
  const from = new Date(today)
  from.setDate(from.getDate() - (days - 1))
  return [startOfDay(from), endOfDay(new Date(today))]
}

const activePreset = computed<PresetKey | null>(() => {
  if (!props.start || !props.end) return null
  const matching = presets.find((preset) => {
    const [from, to] = buildPresetRange(preset.key)
    return from === props.start && to === props.end
  })
  return matching ? matching.key : null
})

const applyPreset = (key: PresetKey) => {
  const [from, to] = buildPresetRange(key)
  emit('update:start', from)
  emit('update:end', to)
  emit('apply')
}

const onStartChange = (value: number | null) => {
  emit('update:start', value)
  emit('apply')
}

const onEndChange = (value: number | null) => {
  emit('update:end', value)
  emit('apply')
}
</script>

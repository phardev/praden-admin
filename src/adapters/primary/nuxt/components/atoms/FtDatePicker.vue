<template lang="pug">
VCalendarDatePicker(
  v-model="date"
  v-bind="{ ...attrs, ...$attrs }"
  locale="fr"
  @dayclick="onDayClick"
)
</template>

<script setup lang="ts">
import { DatePicker as VCalendarDatePicker } from 'v-calendar'
import type {
  DatePickerDate,
  DatePickerRangeObject
} from 'v-calendar/dist/types/src/use/datePicker'
import 'v-calendar/dist/style.css'

const props = defineProps({
  modelValue: {
    type: [Date, Object] as PropType<
      DatePickerDate | DatePickerRangeObject | null
    >,
    default: null
  },
  isEndDate: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:model-value', 'close'])

const date = computed({
  get: () => props.modelValue,
  set: (value) => {
    if (value === null || value === undefined) return
    const tmp = new Date(value as Date)
    if (props.isEndDate) {
      tmp.setHours(23, 59, 59, 999)
    }
    const timestamp = tmp.getTime()
    emit('update:model-value', timestamp)
    emit('close')
  }
})

const attrs = {
  transparent: true,
  borderless: true,
  color: 'primary',
  'is-dark': { selector: 'html', darkClass: 'dark' },
  'first-day-of-week': 2
}
const onDayClick = (day: any, event: MouseEvent) => {
  if (event?.target instanceof HTMLElement) {
    event.target.blur()
  }
}
</script>

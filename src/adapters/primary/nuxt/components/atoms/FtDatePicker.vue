<template lang="pug">
VCalendarDatePicker(
  v-model="date"
  v-bind="{ ...attrs, ...$attrs }"
  locale="fr"
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
  }
})

const emit = defineEmits(['update:model-value', 'close'])

const date = computed({
  get: () => props.modelValue,
  set: (value) => {
    const tmp = new Date(value)
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
</script>

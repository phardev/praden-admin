<template lang="pug">
ft-input(
  type='date'
  v-bind="$attrs"
)
  slot
  template(#inputField)
    VueDatePicker(
      :model-value="modelValue"
      :enable-time-picker="false"
      model-type="timestamp"
      :start-time="startTime"
      enable-seconds
      locale="fr-FR"
      @update:model-value="handleDateChange"
    )
      template(#action-row="{ selectDate }")
        div.w-full.flex.flex-row-reverse
          ft-button.button-solid(@click="selectDate") Valider
</template>

<script lang="ts" setup>
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

defineProps({
  modelValue: {
    type: Number,
    default: () => {
      return undefined
    }
  },
  startTime: {
    type: Object,
    default: () => {
      return undefined
    }
  }
})

const emit = defineEmits<{
  (e: 'date-changed', value: number): void
}>()

const handleDateChange = (date: number) => {
  emit('date-changed', date)
}
</script>

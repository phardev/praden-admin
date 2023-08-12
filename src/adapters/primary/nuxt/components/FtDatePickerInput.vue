<template lang="pug">
ft-input(
  type='date'
  v-bind="$attrs"
)
  slot
  template(#inputField)
    VueDatePicker(
      class="focus:ring-colored"
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

<style lang="scss">
.dp__theme_light {
  --dp-background-color: #ffffff;
  --dp-text-color: #212121;
  --dp-hover-color: #f3f3f3;
  --dp-hover-text-color: #212121;
  --dp-hover-icon-color: #959595;
  --dp-primary-color: var(--color-primary11);
  --dp-primary-text-color: #f8f5f5;
  --dp-secondary-color: #c0c4cc;
  --dp-border-color: var(--color-primary5);
  --dp-menu-border-color: #ddd;
  --dp-border-color-hover: var(--color-primary6);
  --dp-disabled-color: #f6f6f6;
  --dp-scroll-bar-background: #f3f3f3;
  --dp-scroll-bar-color: #959595;
  --dp-success-color: #76d275;
  --dp-success-color-disabled: #a3d9b1;
  --dp-icon-color: #959595;
  --dp-danger-color: #ff6f60;
  --dp-highlight-color: rgba(25, 118, 210, 0.1);
}
</style>

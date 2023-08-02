<template lang="pug">
.section
  pre {{ createPromotionVM }}
  pre {{ startDate }}
  pre {{ endDate }}
  ft-input(
    for="name"
    required
    type='text'
    name='name'
    @input="nameChanged"
  ) Nom
  div.flex
    ft-date-picker-input.flex-1(
      :model-value="startDate"
      :start-time="startTime"
      for="startDate"
      @date-changed="handleStartDate"
    ) Date de début
    ft-date-picker-input.flex-1(
      :model-value="endDate"
      :start-time="endTime"
      for="startDate"
      @date-changed="handleEndDate"
    ) Date de fin
</template>

<script lang="ts" setup>
import { getCreatePromotionVM } from '@adapters/primary/view-models/create-promotion/getCreatePromotionVM'
import FtInput from '@adapters/primary/nuxt/components/FtInput.vue'
import FtDatePickerInput from '@adapters/primary/nuxt/components/FtDatePickerInput.vue'
definePageMeta({ layout: 'main' })

const createPromotionVM = ref(getCreatePromotionVM())
const startTime = ref({ hours: 0, minutes: 0 })
const endTime = ref({ hours: 23, minutes: 59, seconds: 59 })

const startDate = computed(() => {
  return createPromotionVM.value.startDate
})

const endDate = computed(() => {
  return createPromotionVM.value.endDate
})

const nameChanged = (e: any) => {
  createPromotionVM.value.name = e.target.value
}

const handleStartDate = (date: number) => {
  createPromotionVM.value.startDate = date
}

const handleEndDate = (date: number) => {
  createPromotionVM.value.endDate = date
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

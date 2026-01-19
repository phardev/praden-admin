<template lang="pug">
div.flex.items-center.justify-center
  USelectMenu.w-44(
    v-model="model"
    :options="options"
  )
    template(#label)
      FtCategoryStatusBadge(v-if="model !== undefined" :status="model")
    template(#option="{ option }")
      FtCategoryStatusBadge(:status="option")
</template>

<script lang="ts" setup>
import { CategoryStatus } from '@core/entities/category'

const model = defineModel<CategoryStatus | undefined>()

const options = computed(() => {
  return Object.values(CategoryStatus)
})
</script>

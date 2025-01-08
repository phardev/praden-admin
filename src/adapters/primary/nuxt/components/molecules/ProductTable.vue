<template lang="pug">
ft-table(
  v-bind="{ ...$attrs, ...$slots }"
)
  template(v-for="(_, name) in $slots", #[name]="scope")
    slot(:name="name" v-bind="scope")
  template(#img="{ item }")
    .h-10.w-10
      img.rounded-full.h-10.w-10(:src="item.img")
  template(#categories="{ item }")
    div(v-if="item.categories && item.categories.length")
      div.mb-1(v-for="category in item.categories" :key="category")
        UBadge(variant="subtle" :label="category")
    div(v-else)
  template(#isActive="{ item }")
    UToggle(
      size="md"
      on-icon="i-heroicons-check-20-solid"
      off-icon="i-heroicons-x-mark-20-solid"
      :model-value="item.isActive"
      :disabled="true"
    )
</template>

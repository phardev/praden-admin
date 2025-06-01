<template lang="pug">
UCheckbox(
  v-bind="{ ...$attrs, ...$slots }"
)
  template(v-for="(_, name) in $slots", #[name]="scope")
    slot(:name="name" v-bind="scope")
</template>

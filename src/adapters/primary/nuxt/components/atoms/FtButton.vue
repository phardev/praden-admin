<template lang="pug">
UButton(
  v-bind="{ ...$attrs, ...$slots }"
  class='flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed'
)
  template(v-for="(_, name) in $slots", #[name]="scope")
    slot(:name="name" v-bind="scope")
</template>

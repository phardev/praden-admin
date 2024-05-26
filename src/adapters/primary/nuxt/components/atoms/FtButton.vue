<template lang="pug">
UButton(
  v-bind="$attrs"
  class='flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed'
)
  slot
</template>

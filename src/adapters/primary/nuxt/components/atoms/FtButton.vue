<template lang="pug">
UButton(
  v-bind="$attrs"
  class='disabled:opacity-50 disabled:cursor-not-allowed'
)
  slot
</template>

<template lang="pug">
.flex.flex-col.flex-grow.w-full
  .flex.flex-col.flex-grow.h-0.p-4
    div(
      v-for="(message, index) in messages"
      :key="index"
      :class="[index % 2 === 1 ? '' : 'ml-auto justify-end', 'flex w-full mt-2 space-x-3 max-w-xs']"
    )
      div
        .p-3(
          :class="[index % 2 === 1 ? 'bg-neutral rounded-r-lg rounded-bl-lg' : 'bg-solid text-opposite rounded-l-lg rounded-br-lg']"
        )
          p.text-sm {{ message.content }}
        time.text-xs.text-contrast.leading-none(:datetime='message.sentDatetime') {{ message.sentDate }}
</template>

<script lang="ts" setup>
defineProps({
  messages: {
    type: Array,
    default: () => {
      return []
    }
  }
})
</script>

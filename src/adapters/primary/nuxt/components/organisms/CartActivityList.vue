<template lang="pug">
ul.space-y-1.text-sm
  li.flex.gap-2(v-for="(activity, index) in activity" :key="index")
    span.text-gray-500.whitespace-nowrap {{ activity.date }}
    span.text-gray-500 {{ $t(activity.actorKey) }}
    span {{ $t(activity.labelKey, activity.labelParams) }}
</template>

<script lang="ts" setup>
import type { CartActivityVM } from '@adapters/primary/view-models/carts/cart-content/cartContentVM'

defineProps<{ activity: Array<CartActivityVM> }>()
</script>

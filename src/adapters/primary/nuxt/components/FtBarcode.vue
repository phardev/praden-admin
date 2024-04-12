<template lang="pug">
div
  svg(ref="barcode")
</template>

<script setup>
import { onMounted, ref } from 'vue'
import JsBarcode from 'jsbarcode'

const props = defineProps({
  code: {
    type: String,
    default: null
  },
  width: {
    type: Number,
    default: () => {
      return 2
    }
  },
  height: {
    type: Number,
    default: () => {
      return 100
    }
  }
})

const barcode = ref(null)

onMounted(() => {
  JsBarcode(barcode.value, props.code, {
    format: 'CODE128',
    background: 'transparent',
    width: props.width,
    height: props.height
  })
})
</script>

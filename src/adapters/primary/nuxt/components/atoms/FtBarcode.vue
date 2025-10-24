<template lang="pug">
div
  svg(ref="barcode")
</template>

<script setup>
import JsBarcode from 'jsbarcode'
import { onMounted, ref } from 'vue'

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
  },
  text: {
    type: String,
    default: () => {
      return undefined
    }
  }
})

const barcode = ref(null)

onMounted(() => {
  JsBarcode(barcode.value, props.code, {
    format: 'CODE128',
    background: 'transparent',
    width: props.width,
    height: props.height,
    text: props.text
  })
})
</script>

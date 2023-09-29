<template lang="pug">
div.hidden.printme.mx-2
  p Récapitulatif des commandes
  ft-table(
    :headers="startVM.headers"
    :items="startVM.global"
  )
  div.break-before-page(v-for="order in startVM.detail" :key="order.reference")
    div.flex
      h1.text-xl.grow Commande {{ order.reference }}
      client-only
        vueQr(:text="order.href")
    ft-table(
      :headers="startVM.headers"
      :items="order.lines"
    )
</template>

<script lang="ts" setup>
import { startPreparationsVM } from '@adapters/primary/view-models/preparations/start-preparations/startPreparationsVM'

let vueQr
if (process.client) {
  import('vue-qr/src/packages/vue-qr.vue').then((module) => {
    vueQr = module.default
  })
}

const startVM = computed(() => {
  let origin = ''
  if (process.client) {
    origin = location.origin
  }
  return startPreparationsVM(origin)
})
</script>

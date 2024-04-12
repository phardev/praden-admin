<template lang="pug">
div.hidden.printme.mx-2
  p Récapitulatif des commandes
  ft-table(
    :headers="startVM.globalHeaders"
    :items="startVM.global"
  )
  div.break-before-page(v-for="order in startVM.detail" :key="order.reference")
    div.flex
      div.grow
        h1.text-xl {{ order.deliveryMethodName }}
        h1.text-xl Commande {{ order.reference }}
        h1.text-xl {{ order.createdDate }}
        ft-barcode.w-10(
          :code="order.clientName"
          :width="1"
          :height="50"
        )
      client-only
        vueQr(:text="order.href")
    ft-table(
      :headers="startVM.detailHeaders"
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

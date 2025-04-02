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
        h1.text-xl Commande
        ft-barcode.w-5(
          :code="order.reference"
          :width="1"
          :height="50"
          :text="order.reference"
        )
        h1.text-xl {{ order.createdDate }}
        h1.text-xl(v-if="order.pickingDate") Date de retrait {{ order.pickingDate }}
      client-only
        .qr-container
          vueQr(
            :text="order.href"
          )
    div.flex.mt-4
      div.grow
        div.text-lg.mb-2 Adresse de livraison
        div {{ order.deliveryAddress.name }}
        div {{ order.deliveryAddress.address }}
        div {{ order.deliveryAddress.zip }}
        div {{ order.deliveryAddress.city }}
        div {{ order.deliveryAddress.phone }}
      div.grow
        div.text-lg.mb-2 Adresse de facturation
        div {{ order.billingAddress.name }}
        div {{ order.billingAddress.address }}
        div {{ order.billingAddress.zip }}
        div {{ order.billingAddress.city }}
        div {{ order.billingAddress.phone }}
      ft-barcode(
        :code="order.clientLastname"
        :width="1"
        :height="50"
        :text="order.deliveryAddress.name"
      )

    ft-table(
      :headers="startVM.detailHeaders"
      :items="order.lines"
    )
    div(class="w-1/3").ml-auto.border-b.border-light.ml-8
      div.flex.items-center.justify-around.m-2
        div(class="w-1/2") Frais de livraison
        div.text-right(class="w-1/2") {{ order.deliveryPrice }}
    div(class="w-1/3").ml-auto.border-b.border-light.ml-8
      div.flex.items-center.justify-around.m-2
        div(class="w-1/2") Total TTC
        div.text-right(class="w-1/2") {{ order.totalWithTax }}
    .max-w-lg.flex-shrink-0(v-if="order.clientMessage")
      h1.text-2xl.font-semibold.text-default.mt-8 Note du client
      div.mt-2 {{ order.clientMessage }}

</template>

<script lang="ts" setup>
import { startPreparationsVM } from '@adapters/primary/view-models/preparations/start-preparations/startPreparationsVM'
import { getSettings } from '@core/usecases/settings/get-settings/getSettings'
import { useSettingsGateway } from '../../../../../../gateways/settingGateways'

onMounted(() => {
  getSettings(useSettingsGateway())
})

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

<style scoped>
.qr-container {
  display: flex;
  justify-content: normal;
  align-items: normal;
}

.qr-container img {
  width: 120px;
  height: 120px;
}
</style>

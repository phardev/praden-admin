<template lang="pug">
.section
  div.flex.items-center.align-center
    h1.text-page-title.flex-grow Bannières
    nuxt-link(to="/banners/new")
      ft-button.button-solid.text-xl.px-6 Créer bannière
  banners-list(:banners-vm="bannersVM")
</template>

<script lang="ts" setup>
import BannersList from '@adapters/primary/nuxt/components/organisms/BannersList.vue'
import { getBannersVM } from '@adapters/primary/view-models/banners/get-banners/getBannersVM'
import { listBanners } from '@core/usecases/banners/list-banners/listBanners'
import { useBannerGateway } from '../../../../../../gateways/bannerGateway'
import { useDateProvider } from '../../../../../../gateways/dateProvider'

definePageMeta({ layout: 'main' })

onMounted(() => {
  listBanners(useBannerGateway())
})

const bannersVM = computed(() => {
  return getBannersVM(useDateProvider())
})
</script>

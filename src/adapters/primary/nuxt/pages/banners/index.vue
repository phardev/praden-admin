<template lang="pug">
.section
  div.flex.items-center.align-center
    h1.text-page-title.flex-grow Bannières
  draggable(
    v-model="banners"
    item-key="uuid"
  )
    template(#item="{ element }")
      div.flex.items-center.justify-center.space-x-4
        div
          icon.icon-xl(name="pajamas:hamburger")
        div.relative.group.mt-2.max-w-lg(:key="element.uuid")
          img(
            :src="element.img"
            class="border-2 border-transparent group-hover:border-red-500"
            :class="{ 'grayscale': !element.isActive }"
          )
          ft-button(
            size="xl"
            class="absolute top-[-15px] right-[-15px] m-2 h-8 w-8 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
            @click="deleteBannerClicked(element.uuid)"
          ) X
        ft-toggle(
          v-model="element.isActive"
          @update:model-value="(value) => updateIsActive(element.uuid, value)"
        )
  ft-file-input.mt-4(
    accept="image/*"
    multiple
    @input="bannersAdded"
  )

</template>

<script lang="ts" setup>
import { getBannersVM } from '@adapters/primary/view-models/banners/get-banners/getBannersVM'
import { listBanners } from '@core/usecases/banners/list-banners/listBanners'
import { useBannerGateway } from '../../../../../../gateways/bannerGateway'
import draggable from 'vuedraggable'
import { deleteBanner } from '@core/usecases/banners/banner-deletion/deleteBanner'
import { createBanner } from '@core/usecases/banners/banner-creation/createBanner'
import { reorderBanners } from '@core/usecases/banners/banners-reorder/reorderBanners'
import FtToggle from '@adapters/primary/nuxt/components/atoms/FtToggle.vue'
import { editBanner } from '@core/usecases/banners/banner-edition/editBanner'

definePageMeta({ layout: 'main' })

onMounted(() => {
  listBanners(useBannerGateway())
})

const banners = computed({
  get: () => bannersVM.value.items,
  set: (v) => reorderBanners(v, useBannerGateway())
})

const bannersVM = computed(() => {
  return getBannersVM()
})

const deleteBannerClicked = (uuid) => {
  deleteBanner(uuid, useBannerGateway())
}

const bannersAdded = async (files: Array<File>) => {
  files.forEach(async (f) => {
    await createBanner(f, useBannerGateway())
  })
}

const updateIsActive = (uuid, isActive) => {
  editBanner(uuid, { isActive }, useBannerGateway())
}
</script>

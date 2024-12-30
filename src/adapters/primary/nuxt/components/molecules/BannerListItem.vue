<template lang="pug">
div.flex.items-center.justify-stretch.space-x-4.space-y-2
  div
    icon.icon-xl(name="pajamas:hamburger")
  div.relative.group.mt-2.max-w-lg(:key="banner.uuid")
    img(
      :src="banner.img"
      class="border-2 border-transparent group-hover:border-red-500"
      :class="{ 'grayscale': !banner.isActive }"
    )
    ft-button(
      size="xl"
      class="absolute top-[-15px] right-[-15px] m-2 h-8 w-8 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
      @click="deleteBannerClicked(banner.uuid)"
    ) X
  div
    UFormGroup.pb-4(label="Date de début" name="startDate")
      UPopover(:popper="{ placement: 'bottom-start' }")
        UButton.w-72(
          icon="i-heroicons-calendar-days-20-solid"
          :disabled="false"
          :label="banner.startDate.length ? format(parse(banner.startDate, 'dd MMMM yyyy', new Date(), { locale: fr }), 'd MMMM yyyy', { locale: fr }) : 'Choisissez une date'"
        )
          template(#trailing)
            UButton(
              v-show="banner.startDate"
              color="white"
              variant="link"
              icon="i-heroicons-x-mark-20-solid"
              :padded="false"
              @click.prevent="clearStartDate(banner.uuid)"
            )
        template(#panel="{ close }")
          ft-date-picker(
            :model-value="banner.startDate"
            @update:model-value="(date) => startDateChanged(banner.uuid, date)"
            @close="close"
          )
    UFormGroup.pb-4(label="Date de fin" name="endDate")
      UPopover(:popper="{ placement: 'bottom-start' }")
        UButton.w-72(
          icon="i-heroicons-calendar-days-20-solid"
          :disabled="false"
          :label="banner.endDate.length ? format(parse(banner.endDate, 'dd MMMM yyyy', new Date(), { locale: fr }), 'd MMMM yyyy', { locale: fr }) : 'Choisissez une date'"
        )
          template(#trailing)
            UButton(
              v-show="banner.endDate"
              color="white"
              variant="link"
              icon="i-heroicons-x-mark-20-solid"
              :padded="false"
              @click.prevent="clearEndDate(banner.uuid)"
            )
        template(#panel="{ close }")
          ft-date-picker(
            :model-value="banner.endDate"
            @update:model-value="(date) => endDateChanged(banner.uuid, date)"
            @close="close"
          )
  ft-toggle(
    :model-value="banner.isActive"
    @update:model-value="(value) => updateIsActive(banner.uuid, value)"
  )
  icon.icon-lg.text-link(
    name="material-symbols:edit-square-outline"
    @click="editClicked(banner.uuid)"
  )
</template>

<script lang="ts" setup>
import { useBannerGateway } from '../../../../../../gateways/bannerGateway'
import { editBanner } from '@core/usecases/banners/banner-edition/editBanner'
import { deleteBanner } from '@core/usecases/banners/banner-deletion/deleteBanner'
import { format, parse } from 'date-fns'
import { fr } from 'date-fns/locale'

definePageMeta({ layout: 'main' })

defineProps({
  banner: {
    type: Object,
    default() {
      return {}
    }
  }
})

const updateIsActive = (uuid, isActive) => {
  editBanner(uuid, { isActive }, useBannerGateway())
}

const deleteBannerClicked = (uuid: string) => {
  deleteBanner(uuid, useBannerGateway())
}

const startDateChanged = (uuid: string, date: number) => {
  editBanner(uuid, { startDate: date }, useBannerGateway())
}

const clearStartDate = (uuid: string) => {
  editBanner(uuid, { startDate: null }, useBannerGateway())
}

const endDateChanged = (uuid: string, date: number) => {
  editBanner(uuid, { endDate: date }, useBannerGateway())
}

const clearEndDate = (uuid: string) => {
  editBanner(uuid, { endDate: null }, useBannerGateway())
}

const editClicked = (uuid: string) => {
  const router = useRouter()
  router.push(`/banners/edit/${uuid}`)
}
</script>

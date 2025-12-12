<template lang="pug">
div
  div.pt-4.pb-4.pr-6.cursor-pointer
    nuxt-link.flex.items-center.text-link.group(href="/")
      .logo-with-hat.relative
        img.w-24.h-24(:src="menu.logo")
        svg.santa-hat.absolute(
          width="55"
          height="50"
          viewBox="0 0 120 110"
          style="top:-12px; left:15px; transform:rotate(8deg)"
        )
          path(
            d="M10 88 Q35 25 55 15 Q90 22 105 70 Q95 88 10 88 Z"
            fill="#c0392b"
            stroke="#2d2d2d"
            stroke-width="2"
          )
          path(
            d="M18 85 Q40 30 55 20 Q80 25 95 65 Q85 82 18 85 Z"
            fill="#e74c3c"
          )
          path(
            d="M5 78 Q15 72 35 75 Q50 70 70 73 Q90 68 105 75 Q100 85 85 90 Q60 95 35 92 Q15 90 5 85 Z"
            fill="white"
            stroke="#2d2d2d"
            stroke-width="2"
          )
          path(
            d="M10 80 Q25 76 40 78 Q55 75 75 78 Q90 74 100 78 Q95 83 80 86 Q55 88 30 86 Q15 85 10 82 Z"
            fill="#ecf0f1"
          )
          ellipse(cx="52" cy="14" rx="12" ry="10" fill="white" stroke="#2d2d2d" stroke-width="2")
          ellipse(cx="50" cy="12" rx="6" ry="5" fill="#ecf0f1")

      h3 {{ menu.title }}
  div.overflow-y-auto.flex-1
    div.mb-10(v-for="(section, sectionIndex) in menu.sections" :key="sectionIndex")
      h3.mx-6.mb-2.text-xs.tracking-widest.text-light-contrast.uppercase {{ section.title }}
      nuxt-link.flex.items-center.px-6.py-2.text-link.group(
        v-for="(link, linkIndex) in section.links" :key="linkIndex"
        :to="link.href"
      )
        icon.icon-sm.mr-2(:name="link.icon")
        div {{ link.name }}
</template>

<script lang="ts" setup>
import { getNavigationMenuVM } from '@adapters/primary/view-models/navigation-menu/get-navigation-menu/getNavigationMenuVM'
import { getNavigationMenu } from '@core/usecases/navigation-menu/navigation-menu-get/getNavigationMenu'
import { useNavigationMenuGateway } from '../../../../../../gateways/navigationMenuGateway'

onMounted(() => {
  getNavigationMenu(useNavigationMenuGateway())
})

const menu = computed(() => {
  return getNavigationMenuVM()
})
</script>

<style scoped>
.santa-hat {
  filter: drop-shadow(1px 2px 2px rgb(0 0 0 / 30%));
  z-index: 10;
  pointer-events: none;
  shape-rendering: geometricprecision;
  image-rendering: auto;
}
</style>

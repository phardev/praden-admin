<template lang="pug">
div.flex.justify-between.items-center.py-3.px-3.space-x-3.bg-light.border-b
  button.flex-shrink-0.flex.items-center.justify-center.w-10.h-10.rounded-full(
    type="button"
    value="openSidebar"
    class="md:hidden md:px-6 md:space-x-6 focus:outline-none focus:ring-2 focus:ring-neutral"
    @click="openSidebar"
  )
    icon.icon-md(name="heroicons:bars-3")
  div.w-full.flex.flex-row.justify-between
    div.flex.flex-row(v-for="(section, sectionIndex) in menu.sections" :key="sectionIndex")
      nuxt-link.flex.items-center.px-6.py-2.text-link.group(
        v-for="(link, linkIndex) in section.links" :key="linkIndex"
        :href="link.href"
      )
        icon.icon-sm.mr-2(:name="link.icon")
        div {{ link.name }}
    div.flex.flex-row(v-for="(section, sectionIndex) in menu2.sections" :key="sectionIndex")
      nuxt-link.flex.items-center.px-6.py-2.text-link.group(
        v-for="(link, linkIndex) in section.links" :key="linkIndex"
        href="#"
        @click="logout"
      )
        icon.icon-sm.mr-2(:name="link.icon")
        div {{ link.name }}
</template>
<script lang="ts" setup>
const menu = {
  sections: [
    {
      links: [
        {
          name: 'Ma boutique',
          icon: 'ion:cart-outline',
          href: 'https://2f440074.praden-restart.pages.dev/'
        }
      ]
    }
  ]
}

const menu2 = {
  sections: [
    {
      links: [
        {
          name: 'Se déconnecter',
          icon: 'solar:logout-2-outline'
        }
      ]
    }
  ]
}

const emit = defineEmits<{
  (e: 'open-sidebar'): void
}>()

const openSidebar = () => {
  emit('open-sidebar')
}

const logout = () => {
  const { $keycloak } = useNuxtApp()
  if ($keycloak) {
    $keycloak.logout({ redirectUri: window.location.origin })
  }
}
</script>

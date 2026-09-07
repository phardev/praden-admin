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
    div.flex.flex-row.items-center.gap-2
      UButton(
        v-if="canAccessAssistance"
        icon="i-heroicons-lifebuoy"
        color="primary"
        variant="soft"
        :class="{ 'ring-2 ring-offset-2 ring-customPrimary-500': isOpen }"
        @click="open"
      ) {{ $t('assistance.report') }}
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
import { useAssistancePanel } from '@adapters/primary/nuxt/composables/useAssistancePanel'
import { usePermissions } from '@adapters/primary/nuxt/composables/usePermissions'
import { PermissionResource } from '@core/entities/permissionResource'
import type Keycloak from 'keycloak-js'

const { hasPermission } = usePermissions()
const canAccessAssistance = computed(() =>
  hasPermission(PermissionResource.ASSISTANCE)
)
const { isOpen, open } = useAssistancePanel()

const menu = {
  sections: [
    {
      links: [
        {
          name: 'Ma boutique',
          icon: 'ion:cart-outline',
          href: 'https://pharmacieagnespraden.com/'
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
  const nuxtApp = useNuxtApp()
  const $keycloak = nuxtApp.$keycloak as Keycloak
  if ($keycloak) {
    $keycloak.logout({ redirectUri: window.location.origin })
  }
}
</script>

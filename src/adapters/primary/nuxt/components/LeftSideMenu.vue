<template lang="pug">
div.flex.min-h-screen
  TransitionRoot(:show="sidebarOpened")
    Dialog.fixed.inset-0.z-40(
      as="div"
      class="md:hidden"
      @close="sidebarOpened = false"
    )
      TransitionChild(
        as="template"
        enter="transition ease-in-out duration-200 transform"
        enter-from="-translate-x-full"
        enter-to="translate-x-0"
        leave="transition ease-in-out duration-200 transform"
        leave-from="translate-x-0"
        leave-to="-translate-x-full"
      )
        div.flex.flex-col.w-72.relative.z-10.h-full.bg-gray-50.border-r.border-gray-200(class="md:hidden")
          button.absolute.top-2.right-2.flex.items-center.justify-center.w-10.h-10.rounded-full(
            type="button"
            value="closeSidebar"
            class="focus:outline-none focus:ring-2 focus:ring-gray-500"
            @click="sidebarOpened = false"
          )
            icon.icon-sm(name="heroicons:x-mark")
          div.pt-8.pb-4.pr-6
            nuxt-link.flex.items-center(href="/")
              img.w-24.h-24(:src="menu.logo")
              h3 {{ menu.title }}
          div.overflow-y-auto.flex-1
            div.mb-10(v-for="(section, sectionIndex) in menu.sections" :key="sectionIndex")
              h3.mx-6.mb-2.text-xs.tracking-widest.text-gray-400.uppercase {{ section.title }}
              nuxt-link.flex.items-center.px-6.py-2.text-gray-500.group(
                v-for="(link, linkIndex) in section.links" :key="linkIndex"
                class="hover:text-orange-600"
                :href="link.href"
              )
                icon.icon-sm.mr-2(:name="link.icon")
                div {{ link.name }}
      TransitionChild(
        as="template"
        enter="transition-opacity ease-linear duration-200"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="transition-opacity ease-linear duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      )
        DialogOverlay.fixed.inset-0.bg-gray-600.bg-opacity-50

  div.hidden.w-64.bg-gray-50.border-r.border-gray-200(class="md:block")
  div.flex-1
    div.flex.justify-between.items-center.py-3.px-3.space-x-3.bg-gray-50.border-b
      button.flex-shrink-0.flex.items-center.justify-center.w-10.h-10.rounded-full(
        type="button"
        value="openSidebar"
        class="md:hidden md:px-6 md:space-x-6 focus:outline-none focus:ring-2 focus:ring-gray-500"
        @click="sidebarOpened = true"
      )
        icon.icon-md(name="heroicons:bars-3")
      div La nav
    main coucou
</template>
<script lang="ts" setup>
import {
  Dialog,
  DialogOverlay,
  TransitionChild,
  TransitionRoot
} from '@headlessui/vue'

const sidebarOpened = ref(false)

const menu = {
  logo: 'https://www.pharmabest.com/assets/images/footer/pharmabest-footer.svg',
  title: 'Pharmacie Agnes Praden',
  sections: [
    {
      title: 'Catalogue',
      links: [
        {
          name: 'Produits',
          icon: 'fluent-mdl2:product-catalog',
          href: '/products'
        }
      ]
    },
    {
      title: 'Commandes',
      links: [
        {
          name: 'Préparations',
          icon: 'akar-icons:shipping-box-01',
          href: '/orders/preparations'
        }
      ]
    }
  ]
}
</script>

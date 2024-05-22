<template lang="pug">
div
  div.pt-4.pb-4.pr-6.cursor-pointer
    nuxt-link.flex.items-center.text-link.group(href="/")
      img.w-24.h-24(:src="menu.logo")
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
const menu = {
  logo: 'https://www.pharmabest.com/images/header/pharmabest-header.svg',
  title: 'Pharmacie Agnes Praden',
  sections: [
    {
      title: 'Catalogue',
      links: [
        {
          name: 'Produits',
          icon: 'fluent-mdl2:product-catalog',
          href: '/products'
          // },
          // {
          //   name: 'Promotions',
          //   icon: 'uil:euro-circle',
          //   href: '/promotions'
        }
      ]
    },
    {
      title: 'Commandes',
      links: [
        {
          name: 'Préparations',
          icon: 'akar-icons:shipping-box-01',
          href: '/preparations'
        },
        {
          name: 'Préparations en attente',
          icon: 'pajamas:status-waiting',
          href: '/waitingPreparations'
        }
      ]
    }
  ]
}
</script>

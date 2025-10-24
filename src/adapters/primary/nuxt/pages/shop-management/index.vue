<template lang="pug">
.shop-settings-container.p-6
  UCard.welcome-card.mb-8
    template(#header)
      .flex.items-center.justify-between
        h1.text-2xl.font-bold {{ $t('shopSettings.title') }}
    template(#default)
      p.text-gray-600.mb-4 {{ $t('shopSettings.overview.title') }}

  .grid.grid-cols-1.gap-6(class="md:grid-cols-2")
    UCard.settings-card.transition-all.duration-300(
      class="hover:shadow-lg hover:scale-105 cursor-pointer"
      @click="navigateTo('/shop-settings/announcement-bar')"
    )
      template(#header)
        .flex.items-center.justify-between
          h2.text-lg.font-semibold {{ $t('shopSettings.overview.announcementBarCard') }}
          icon(name="i-heroicons-megaphone" class="text-2xl text-primary")
      template(#default)
        p.text-sm.text-gray-600.mb-4 {{ $t('shopSettings.announcementBar.title') }}
        UButton(
          color="primary"
          variant="soft"
          block
          icon="i-heroicons-arrow-right"
          :label="$t('common.edit')"
          @click.stop="navigateTo('/shop-settings/announcement-bar')"
        )

    UCard.settings-card.transition-all.duration-300(
      class="hover:shadow-lg hover:scale-105 cursor-pointer"
      @click="navigateTo('/shop-settings/category-order')"
    )
      template(#header)
        .flex.items-center.justify-between
          h2.text-lg.font-semibold {{ $t('shopSettings.overview.categoryOrderCard') }}
          icon(name="i-heroicons-bars-3" class="text-2xl text-primary")
      template(#default)
        p.text-sm.text-gray-600.mb-4 {{ $t('shopSettings.categoryOrder.title') }}
        UButton(
          color="primary"
          variant="soft"
          block
          icon="i-heroicons-arrow-right"
          :label="$t('common.edit')"
          @click.stop="navigateTo('/shop-settings/category-order')"
        )

    UCard.settings-card.transition-all.duration-300(
      class="hover:shadow-lg hover:scale-105 cursor-pointer"
      @click="navigateTo('/shop-settings/pharmacist-selection')"
    )
      template(#header)
        .flex.items-center.justify-between
          h2.text-lg.font-semibold {{ $t('shopSettings.overview.pharmacistSelectionCard') }}
          icon(name="i-heroicons-star" class="text-2xl text-primary")
      template(#default)
        p.text-sm.text-gray-600.mb-4 {{ $t('shopSettings.pharmacistSelection.title') }}
        UButton(
          color="primary"
          variant="soft"
          block
          icon="i-heroicons-arrow-right"
          :label="$t('common.edit')"
          @click.stop="navigateTo('/shop-settings/pharmacist-selection')"
        )

    UCard.settings-card.transition-all.duration-300(
      class="hover:shadow-lg hover:scale-105 cursor-pointer"
      @click="navigateTo('/shop-settings/emergency-pharmacies')"
    )
      template(#header)
        .flex.items-center.justify-between
          h2.text-lg.font-semibold {{ $t('shopSettings.overview.emergencyPharmaciesCard') }}
          icon(name="i-heroicons-map-pin" class="text-2xl text-primary")
      template(#default)
        p.text-sm.text-gray-600.mb-4 {{ $t('shopSettings.emergencyPharmacies.title') }}
        UButton(
          color="primary"
          variant="soft"
          block
          icon="i-heroicons-arrow-right"
          :label="$t('common.edit')"
          @click.stop="navigateTo('/shop-settings/emergency-pharmacies')"
        )
</template>

<script lang="ts" setup>
definePageMeta({ layout: 'main' })
</script>

<style scoped>
.shop-settings-container {
  max-width: 1400px;
  margin: 0 auto;
}
</style>

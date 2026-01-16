<template lang="pug">
.shop-management-container.p-6
  UCard.welcome-card.mb-8
    template(#header)
      .flex.items-center.justify-between
        h1.text-2xl.font-bold {{ $t('shopManagement.title') }}
    template(#default)
      p.text-gray-600.mb-4 {{ $t('shopManagement.overview.title') }}

  .grid.grid-cols-1.gap-6(class="md:grid-cols-2")
    UCard.settings-card.transition-all.duration-300(
      class="hover:shadow-lg hover:scale-105 cursor-pointer"
      @click="navigateTo('/shop-management/announcement-bar')"
    )
      template(#header)
        .flex.items-center.justify-between
          h2.text-lg.font-semibold {{ $t('shopManagement.overview.announcementBarCard') }}
          icon(name="i-heroicons-megaphone" class="text-2xl text-primary")
      template(#default)
        p.text-sm.text-gray-600.mb-4 {{ $t('shopManagement.announcementBar.title') }}
        UButton(
          color="primary"
          variant="soft"
          block
          icon="i-heroicons-arrow-right"
          :label="$t('common.edit')"
          @click.stop="navigateTo('/shop-management/announcement-bar')"
        )

    UCard.settings-card.transition-all.duration-300(
      class="hover:shadow-lg hover:scale-105 cursor-pointer"
      @click="navigateTo('/shop-management/category-order')"
    )
      template(#header)
        .flex.items-center.justify-between
          h2.text-lg.font-semibold {{ $t('shopManagement.overview.categoryOrderCard') }}
          icon(name="i-heroicons-bars-3" class="text-2xl text-primary")
      template(#default)
        p.text-sm.text-gray-600.mb-4 {{ $t('shopManagement.categoryOrder.title') }}
        UButton(
          color="primary"
          variant="soft"
          block
          icon="i-heroicons-arrow-right"
          :label="$t('common.edit')"
          @click.stop="navigateTo('/shop-management/category-order')"
        )

    UCard.settings-card.transition-all.duration-300(
      class="hover:shadow-lg hover:scale-105 cursor-pointer"
      @click="navigateTo('/shop-management/pharmacist-selection')"
    )
      template(#header)
        .flex.items-center.justify-between
          h2.text-lg.font-semibold {{ $t('shopManagement.overview.pharmacistSelectionCard') }}
          icon(name="i-heroicons-star" class="text-2xl text-primary")
      template(#default)
        p.text-sm.text-gray-600.mb-4 {{ $t('shopManagement.pharmacistSelection.title') }}
        UButton(
          color="primary"
          variant="soft"
          block
          icon="i-heroicons-arrow-right"
          :label="$t('common.edit')"
          @click.stop="navigateTo('/shop-management/pharmacist-selection')"
        )

    UCard.settings-card.transition-all.duration-300(
      class="hover:shadow-lg hover:scale-105 cursor-pointer"
      @click="navigateTo('/shop-management/emergency-pharmacies')"
    )
      template(#header)
        .flex.items-center.justify-between
          h2.text-lg.font-semibold {{ $t('shopManagement.overview.emergencyPharmaciesCard') }}
          icon(name="i-heroicons-map-pin" class="text-2xl text-primary")
      template(#default)
        p.text-sm.text-gray-600.mb-4 {{ $t('shopManagement.emergencyPharmacies.title') }}
        UButton(
          color="primary"
          variant="soft"
          block
          icon="i-heroicons-arrow-right"
          :label="$t('common.edit')"
          @click.stop="navigateTo('/shop-management/emergency-pharmacies')"
        )

    UCard.settings-card.transition-all.duration-300(
      class="hover:shadow-lg hover:scale-105 cursor-pointer"
      @click="navigateTo('/shop-management/loyalty-points')"
    )
      template(#header)
        .flex.items-center.justify-between
          h2.text-lg.font-semibold {{ $t('shopManagement.overview.loyaltyPointsCard') }}
          icon(name="i-heroicons-gift" class="text-2xl text-primary")
      template(#default)
        p.text-sm.text-gray-600.mb-4 {{ $t('shopManagement.loyaltyPoints.title') }}
        UButton(
          color="primary"
          variant="soft"
          block
          icon="i-heroicons-arrow-right"
          :label="$t('common.edit')"
          @click.stop="navigateTo('/shop-management/loyalty-points')"
        )
</template>

<script lang="ts" setup>
definePageMeta({ layout: 'main' })
</script>

<style scoped>
.shop-management-container {
  max-width: 1400px;
  margin: 0 auto;
}
</style>

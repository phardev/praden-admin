<template lang="pug">
.home-container.p-6
  UCard.welcome-card.mb-8
    template(#header)
      .flex.items-center.justify-between
        h1.text-2xl.font-bold Pharmacie Agnes Praden
        img.h-12(src="https://www.pharmabest.com/images/header/pharmabest-header.svg" alt="Pharmacie Agnes Praden")
    template(#default)
      p.text-gray-600.mb-4 Bienvenue sur le portail d'administration de la Pharmacie Agnes Praden. Accédez rapidement à toutes les fonctionnalités.

  .grid.grid-cols-1.gap-6(class="md:grid-cols-2 lg:grid-cols-4")
    UCard.dashboard-card.transition-all.duration-300(
      class="hover:shadow-lg hover:scale-105 cursor-pointer"
      @click="navigateTo('/dashboard')"
    )
      template(#header)
        .flex.items-center.justify-between
          h2.text-lg.font-semibold Tableau de bord
          icon(name="i-akar-icons:statistic-up" class="text-2xl text-primary")
      template(#default)
        p.text-sm.text-gray-600.mb-4 Consultez les statistiques de vente et les performances de la pharmacie.
        UButton(color="primary" variant="soft" block icon="i-heroicons-arrow-right" label="Accéder" @click.stop="navigateTo('/dashboard')")
    UCard.products-card.transition-all.duration-300(
      class="hover:shadow-lg hover:scale-105 cursor-pointer"
      @click="navigateTo('/products')"
    )
      template(#header)
        .flex.items-center.justify-between
          h2.text-lg.font-semibold Produits
          icon(name="i-fluent-mdl2:product-catalog" class="text-2xl text-primary")
      template(#default)
        p.text-sm.text-gray-600.mb-4 Gérez votre catalogue de produits, prix et disponibilité.
        UButton(color="primary" variant="soft" block icon="i-heroicons-arrow-right" label="Accéder" @click.stop="navigateTo('/products')")
    UCard.preparations-card.transition-all.duration-300(
      class="hover:shadow-lg hover:scale-105 cursor-pointer"
      @click="navigateTo('/preparations')"
    )
      template(#header)
        .flex.items-center.justify-between
          h2.text-lg.font-semibold Préparations
          icon(name="i-akar-icons:shipping-box-01" class="text-2xl text-primary")
      template(#default)
        p.text-sm.text-gray-600.mb-4 Suivez et gérez les préparations de commandes en cours.
        UButton(color="primary" variant="soft" block icon="i-heroicons-arrow-right" label="Accéder" @click.stop="navigateTo('/preparations')")
    UCard.orders-card.transition-all.duration-300(
      class="hover:shadow-lg hover:scale-105 cursor-pointer"
      @click="navigateTo('/orders')"
    )
      template(#header)
        .flex.items-center.justify-between
          h2.text-lg.font-semibold Commandes
          icon(name="i-material-symbols:orders-outline" class="text-2xl text-primary")
      template(#default)
        p.text-sm.text-gray-600.mb-4 Consultez l'historique des commandes et leur statut.
        UButton(color="primary" variant="soft" block icon="i-heroicons-arrow-right" label="Accéder" @click.stop="navigateTo('/orders')")

  UCard.mt-8
    template(#header)
      h2.text-xl.font-bold Aperçu rapide du jour
    template(#default)
      div(v-if="isLoading")
        .flex.justify-center.items-center.py-12
          icon.animate-spin.h-8.w-8(name="i-heroicons-arrow-path")
          span.ml-2 Chargement des données...
      .grid.grid-cols-1.gap-4(v-else class="md:grid-cols-4")
        .stat-item.text-center
          h3.font-semibold Commandes
          p.text-2xl.font-bold {{ totalSalesCount }}
          p.text-xs.text-gray-500 Commandes totales

        .stat-item.text-center
          h3.font-semibold Chiffre d'affaires total
          p.text-2xl.font-bold {{ formatCurrency(totalSalesTurnover) }}
          p.text-xs.text-gray-500 Revenu total

        .stat-item.text-center
          h3.font-semibold Frais de livraison
          p.text-2xl.font-bold {{ formatCurrency(totalSalesDeliveryPrice) }}
          p.text-xs.text-gray-500 de revenus

        .stat-item.text-center
          h3.font-semibold Panier moyen
          p.text-2xl.font-bold {{ formatCurrency(totalSalesAverageBasketValue) }}
          p.text-xs.text-gray-500 Valeur moyenne
</template>

<script lang="ts" setup>
import { formatCurrency } from '@/src/utils/formatters'
import { useDashboardData } from '../composables/useDashboardData'

definePageMeta({ layout: 'main' })

const { isLoading, dashboard, fetchDashboardData } = useDashboardData()

onMounted(() => {
  const now = new Date()
  const startOfDay = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    0,
    0,
    0
  )
  const endOfDay = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    23,
    59,
    59
  )
  const params = {
    startDate: startOfDay,
    endDate: endOfDay,
    productLimit: 0
  }
  fetchDashboardData(params)
})

const totalSalesCount = computed(
  () => dashboard.value?.totalSales?.count?.toLocaleString() || '0'
)

const totalSalesTurnover = computed(
  () => dashboard.value?.totalSales?.turnover || '0'
)

const totalSalesDeliveryPrice = computed(
  () => dashboard.value?.totalSales?.deliveryPrice || '0'
)

const totalSalesAverageBasketValue = computed(
  () => dashboard.value?.totalSales?.averageBasketValue || '0'
)
</script>

<style scoped>
.home-container {
  max-width: 1400px;
  margin: 0 auto;
}
</style>

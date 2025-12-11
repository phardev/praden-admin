<template lang="pug">
.home-container.p-6
  .christmas-card.mb-8.relative.overflow-hidden.rounded-xl.bg-gradient-to-br.from-red-700.via-red-600.to-green-700.p-8.text-white.shadow-2xl
    //- Glowing stars scattered around
    svg.glowing-star.star-1.absolute(width="20" height="20" viewBox="0 0 100 100" style="top: 10%; left: 5%;")
      polygon(points="50,5 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35" fill="gold")
    svg.glowing-star.star-2.absolute(width="15" height="15" viewBox="0 0 100 100" style="top: 20%; left: 15%;")
      polygon(points="50,5 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35" fill="gold")
    svg.glowing-star.star-3.absolute(width="25" height="25" viewBox="0 0 100 100" style="top: 5%; right: 20%;")
      polygon(points="50,5 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35" fill="gold")
    svg.glowing-star.star-4.absolute(width="18" height="18" viewBox="0 0 100 100" style="top: 30%; right: 8%;")
      polygon(points="50,5 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35" fill="gold")
    svg.glowing-star.star-5.absolute(width="12" height="12" viewBox="0 0 100 100" style="bottom: 25%; left: 10%;")
      polygon(points="50,5 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35" fill="gold")
    svg.glowing-star.star-6.absolute(width="22" height="22" viewBox="0 0 100 100" style="bottom: 15%; right: 15%;")
      polygon(points="50,5 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35" fill="gold")
    svg.glowing-star.star-7.absolute(width="14" height="14" viewBox="0 0 100 100" style="top: 50%; left: 3%;")
      polygon(points="50,5 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35" fill="gold")
    svg.glowing-star.star-8.absolute(width="16" height="16" viewBox="0 0 100 100" style="bottom: 40%; right: 5%;")
      polygon(points="50,5 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35" fill="gold")
    //- Snowflakes decoration
    .snowflake.absolute.opacity-30(style="top: 15%; left: 8%;")
      svg(width="40" height="40" viewBox="0 0 100 100")
        line(x1="50" y1="5" x2="50" y2="95" stroke="white" stroke-width="3")
        line(x1="5" y1="50" x2="95" y2="50" stroke="white" stroke-width="3")
        line(x1="18" y1="18" x2="82" y2="82" stroke="white" stroke-width="3")
        line(x1="82" y1="18" x2="18" y2="82" stroke="white" stroke-width="3")
        circle(cx="50" cy="20" r="5" fill="white")
        circle(cx="50" cy="80" r="5" fill="white")
        circle(cx="20" cy="50" r="5" fill="white")
        circle(cx="80" cy="50" r="5" fill="white")
    .snowflake.absolute.opacity-20(style="bottom: 20%; left: 5%;")
      svg(width="60" height="60" viewBox="0 0 100 100")
        line(x1="50" y1="5" x2="50" y2="95" stroke="white" stroke-width="2")
        line(x1="5" y1="50" x2="95" y2="50" stroke="white" stroke-width="2")
        line(x1="18" y1="18" x2="82" y2="82" stroke="white" stroke-width="2")
        line(x1="82" y1="18" x2="18" y2="82" stroke="white" stroke-width="2")
        polygon(points="50,10 45,20 55,20" fill="white")
        polygon(points="50,90 45,80 55,80" fill="white")
        polygon(points="10,50 20,45 20,55" fill="white")
        polygon(points="90,50 80,45 80,55" fill="white")
    .snowflake.absolute.opacity-25(style="top: 60%; left: 12%;")
      svg(width="30" height="30" viewBox="0 0 100 100")
        line(x1="50" y1="5" x2="50" y2="95" stroke="white" stroke-width="4")
        line(x1="5" y1="50" x2="95" y2="50" stroke="white" stroke-width="4")
        line(x1="18" y1="18" x2="82" y2="82" stroke="white" stroke-width="4")
        line(x1="82" y1="18" x2="18" y2="82" stroke="white" stroke-width="4")
    //- Big decorative star on the right
    .christmas-decoration.absolute.top-0.right-0.opacity-20
      svg(width="200" height="200" viewBox="0 0 100 100" fill="currentColor")
        polygon(points="50,5 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35" fill="gold")
    .relative.z-10.text-center
      .christmas-icon.mb-6
        svg.mx-auto(width="100" height="120" viewBox="0 0 100 120")
          path(d="M50 5 L50 15" stroke="gold" stroke-width="2" stroke-linecap="round")
          circle(cx="50" cy="5" r="4" fill="gold")
          path(d="M50 20 L25 50 L35 50 L15 80 L30 80 L10 110 L90 110 L70 80 L85 80 L65 50 L75 50 Z" fill="none" stroke="rgba(255,255,255,0.9)" stroke-width="2" stroke-linejoin="round")
          path(d="M50 20 L25 50 L35 50 L15 80 L30 80 L10 110 L90 110 L70 80 L85 80 L65 50 L75 50 Z" fill="rgba(255,255,255,0.1)")
          circle(cx="40" cy="65" r="3" fill="gold" opacity="0.8")
          circle(cx="60" cy="85" r="3" fill="gold" opacity="0.8")
          circle(cx="50" cy="100" r="3" fill="gold" opacity="0.8")
          circle(cx="55" cy="55" r="2" fill="gold" opacity="0.6")
          circle(cx="35" cy="90" r="2" fill="gold" opacity="0.6")
      h2.christmas-title.text-3xl.mb-4(class="md:text-4xl") {{ $t('home.christmas.message') }}

  UCard.welcome-card.mb-8
    template(#header)
      .flex.items-center.justify-between
        h1.text-2xl.font-bold Pharmacie Agnes Praden
        img.h-12(src="https://www.pharmabest.com/images/header/pharmabest-header.svg" alt="Pharmacie Agnes Praden")
    template(#default)
      p.text-gray-600.mb-4 Bienvenue sur le portail d'administration de la Pharmacie Agnes Praden. Accédez rapidement à toutes les fonctionnalités.

  .grid.grid-cols-1.gap-6(class="md:grid-cols-2 lg:grid-cols-4")
    UCard.dashboard-card.transition-all.duration-300(
      v-if="permissions.canAccessDashboard"
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
      v-if="canAccess('/products')"
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
      v-if="canAccess('/preparations')"
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
      v-if="canAccess('/orders')"
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

  UCard.mt-8(v-if="permissions.canAccessDashboard")
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
import { useUserProfileStore } from '@store/userProfileStore'
import { formatCurrency } from '@/src/utils/formatters'
import { useDateProvider } from '../../../../../gateways/dateProvider'
import { getPermissionsVM } from '../../view-models/permissions/getPermissionsVM'
import { useDashboardData } from '../composables/useDashboardData'

definePageMeta({ layout: 'main' })

const { isLoading, dashboard, fetchDashboardData } = useDashboardData()
const permissions = computed(() => getPermissionsVM())
const userProfileStore = useUserProfileStore()

const canAccess = (route: string): boolean => {
  const routePermissionMap: Record<
    string,
    keyof ReturnType<typeof getPermissionsVM>
  > = {
    '/products': 'canAccessProducts',
    '/preparations': 'canAccessPreparations',
    '/orders': 'canAccessOrders'
  }
  const permissionKey = routePermissionMap[route]
  return permissionKey ? permissions.value[permissionKey] : false
}

onMounted(() => {
  const dateProvider = useDateProvider()
  const now = new Date(dateProvider.now())
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

  const stopWatch = watch(
    () => userProfileStore.current,
    (profile) => {
      if (profile && permissions.value.canAccessDashboard) {
        fetchDashboardData(params)
        stopWatch()
      }
    },
    { immediate: true }
  )
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
@import url('https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap');

.home-container {
  max-width: 1400px;
  margin: 0 auto;
}

.christmas-card {
  animation: gentle-glow 3s ease-in-out infinite alternate;
}

.christmas-title {
  font-family: 'Great Vibes', cursive;
  text-shadow: 2px 2px 4px rgb(0 0 0 / 30%);
}

.christmas-message {
  font-family: 'Great Vibes', cursive;
  text-shadow: 1px 1px 2px rgb(0 0 0 / 20%);
}

.christmas-signature {
  font-family: 'Great Vibes', cursive;
  font-size: 1.2rem;
}

.christmas-icon svg {
  filter: drop-shadow(0 4px 6px rgb(0 0 0 / 30%));
}

.tree-star {
  animation: tree-star-glow 1s ease-in-out infinite alternate;
}

.glowing-star {
  filter: drop-shadow(0 0 8px gold);
  animation: star-twinkle 2s ease-in-out infinite;
}

.star-1 { animation-delay: 0s; }
.star-2 { animation-delay: 0.3s; }
.star-3 { animation-delay: 0.6s; }
.star-4 { animation-delay: 0.9s; }
.star-5 { animation-delay: 1.2s; }
.star-6 { animation-delay: 1.5s; }
.star-7 { animation-delay: 1.8s; }
.star-8 { animation-delay: 2.1s; }

@keyframes star-twinkle {
  0%, 100% {
    opacity: 0.4;
    filter: drop-shadow(0 0 4px gold);
    transform: scale(1);
  }

  50% {
    opacity: 1;
    filter: drop-shadow(0 0 15px gold) drop-shadow(0 0 25px rgb(255 215 0 / 80%));
    transform: scale(1.2);
  }
}

@keyframes tree-star-glow {
  from {
    filter: drop-shadow(0 0 3px gold);
  }

  to {
    filter: drop-shadow(0 0 10px gold) drop-shadow(0 0 20px rgb(255 215 0 / 60%));
  }
}

@keyframes gentle-glow {
  from {
    box-shadow: 0 25px 50px -12px rgb(0 0 0 / 25%), 0 0 30px rgb(255 215 0 / 10%);
  }

  to {
    box-shadow: 0 25px 50px -12px rgb(0 0 0 / 25%), 0 0 50px rgb(255 215 0 / 20%);
  }
}

.snowflake {
  animation: snowflake-float 4s ease-in-out infinite;
}

@keyframes snowflake-float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }

  50% {
    transform: translateY(-5px) rotate(10deg);
  }
}

.santa-hat {
  filter: drop-shadow(1px 2px 2px rgb(0 0 0 / 30%));
  z-index: 10;
}

@media (prefers-reduced-motion: reduce) {
  .christmas-card,
  .glowing-star,
  .tree-star,
  .snowflake {
    animation: none;
  }
}
</style>

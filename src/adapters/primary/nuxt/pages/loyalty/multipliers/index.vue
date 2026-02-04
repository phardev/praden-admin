<template lang="pug">
.multipliers-container.p-6
  .mb-4.flex.items-center.justify-between
    .flex.items-center.space-x-4
      UButton(
        color="gray"
        variant="ghost"
        icon="i-heroicons-arrow-left"
        :label="$t('common.back')"
        @click="navigateTo('/loyalty')"
      )
      h1.text-2xl.font-bold {{ $t('loyalty.multipliers.title') }}
    UButton(
      color="primary"
      icon="i-heroicons-plus"
      :label="$t('loyalty.multipliers.createButton')"
      @click="navigateTo('/loyalty/multipliers/create')"
    )

  UCard
    template(#default)
      div(v-if="isLoading")
        .flex.justify-center.items-center.py-12
          icon.animate-spin.h-8.w-8(name="i-heroicons-arrow-path")
          span.ml-2 {{ $t('common.loading') }}

      div(v-else-if="listVM.length === 0")
        .text-center.py-12.text-gray-500
          icon.mb-4(name="i-heroicons-gift" class="text-6xl")
          p {{ $t('loyalty.multipliers.noMultipliers') }}

      UTable(
        v-else
        :columns="columns"
        :rows="listVM"
      )
        template(#name-data="{ row }")
          span.font-medium {{ row.name }}

        template(#formattedMultiplierValue-data="{ row }")
          span.font-mono.text-primary {{ row.formattedMultiplierValue }}

        template(#formattedStartDate-data="{ row }")
          span {{ row.formattedStartDate }}

        template(#formattedEndDate-data="{ row }")
          span {{ row.formattedEndDate }}

        template(#isActive-data="{ row }")
          UBadge(:color="row.isActive ? 'green' : 'gray'")
            | {{ row.isActive ? $t('loyalty.multipliers.active') : $t('loyalty.multipliers.inactive') }}

        template(#actions-data="{ row }")
          .flex.space-x-2
            UButton(
              color="gray"
              variant="ghost"
              icon="i-heroicons-pencil"
              size="xs"
              @click="navigateTo(`/loyalty/multipliers/edit/${row.uuid}`)"
            )
            UButton(
              color="red"
              variant="ghost"
              icon="i-heroicons-trash"
              size="xs"
              @click="openDeleteModal(row)"
            )

  UModal(v-model="isDeleteModalOpen")
    UCard
      template(#header)
        h3.text-lg.font-semibold {{ $t('common.delete') }}
      template(#default)
        p {{ $t('loyalty.multipliers.confirmDelete') }}
        p.mt-2.font-semibold(v-if="multiplierToDelete") {{ multiplierToDelete.name }}
      template(#footer)
        .flex.justify-end.space-x-2
          UButton(
            color="gray"
            :label="$t('common.cancel')"
            @click="closeDeleteModal"
          )
          UButton(
            color="red"
            :label="$t('common.delete')"
            :loading="isDeleting"
            @click="handleDelete"
          )
</template>

<script lang="ts" setup>
import type { MultiplierListItemVM } from '@adapters/primary/view-models/loyalty/multipliersListVM'
import { getMultipliersListVM } from '@adapters/primary/view-models/loyalty/multipliersListVM'
import { deleteMultiplier } from '@core/usecases/loyalty/deleteMultiplier'
import { listMultipliers } from '@core/usecases/loyalty/listMultipliers'
import { useLoyaltyStore } from '@store/loyaltyStore'
import { useLoyaltyGateway } from '../../../../../../../gateways/loyaltyGateway'

definePageMeta({ layout: 'main' })

const { t } = useI18n()
const loyaltyStore = useLoyaltyStore()
const loyaltyGateway = useLoyaltyGateway()

const isLoading = computed(() => loyaltyStore.isLoading)
const isDeleteModalOpen = ref(false)
const multiplierToDelete = ref<MultiplierListItemVM | null>(null)
const isDeleting = ref(false)

const columns = computed(() => [
  { key: 'name', label: t('loyalty.multipliers.name') },
  {
    key: 'formattedMultiplierValue',
    label: t('loyalty.multipliers.multiplierValue')
  },
  { key: 'formattedStartDate', label: t('loyalty.multipliers.startDate') },
  { key: 'formattedEndDate', label: t('loyalty.multipliers.endDate') },
  { key: 'isActive', label: t('loyalty.multipliers.status') },
  { key: 'actions', label: '' }
])

onMounted(async () => {
  loyaltyStore.startLoading()
  await listMultipliers(loyaltyGateway)
  loyaltyStore.stopLoading()
})

const listVM = computed(() => getMultipliersListVM())

const openDeleteModal = (multiplier: MultiplierListItemVM) => {
  multiplierToDelete.value = multiplier
  isDeleteModalOpen.value = true
}

const closeDeleteModal = () => {
  isDeleteModalOpen.value = false
  multiplierToDelete.value = null
}

const handleDelete = async () => {
  if (!multiplierToDelete.value) return

  isDeleting.value = true
  try {
    await deleteMultiplier(multiplierToDelete.value.uuid, loyaltyGateway)

    const toast = useToast()
    toast.add({
      title: t('loyalty.multipliers.deleteSuccess'),
      color: 'green'
    })

    closeDeleteModal()
  } catch {
    const toast = useToast()
    toast.add({
      title: t('error.unknown'),
      color: 'red'
    })
  } finally {
    isDeleting.value = false
  }
}
</script>

<style scoped>
.multipliers-container {
  max-width: 1200px;
  margin: 0 auto;
}
</style>

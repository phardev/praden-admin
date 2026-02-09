<template lang="pug">
.loyalty-config-container.p-6
  .mb-4
    UButton(
      color="gray"
      variant="ghost"
      icon="i-heroicons-arrow-left"
      :label="$t('common.back')"
      @click="navigateTo('/shop-management')"
    )

  h1.text-2xl.font-bold.mb-6 {{ $t('loyalty.config.title') }}

  UCard.mb-6
    template(#header)
      h2.text-lg.font-semibold {{ $t('loyalty.config.pointsPerEuro') }}
    template(#default)
      .flex.items-end.space-x-4
        UFormGroup(:label="$t('loyalty.config.pointsPerEuro')")
          UInput(
            v-model.number="pointsPerEuro"
            type="number"
            :min="0"
            step="0.1"
          )
        UButton(
          color="primary"
          :label="$t('loyalty.config.save')"
          :loading="isSavingConfig"
          @click="saveConfig"
        )

  UCard
    template(#header)
      .flex.items-center.justify-between
        h2.text-lg.font-semibold {{ $t('loyalty.multipliers.title') }}
        UButton(
          color="primary"
          icon="i-heroicons-plus"
          :label="$t('loyalty.multipliers.create')"
          @click="openCreateModal"
        )
    template(#default)
      div(v-if="configVM.isLoading")
        .flex.justify-center.items-center.py-8
          icon.animate-spin.h-6.w-6(name="i-heroicons-arrow-path")
          span.ml-2 {{ $t('common.loading') }}

      div(v-else-if="configVM.multipliers.length === 0")
        .text-center.py-8.text-gray-500
          p {{ $t('loyalty.multipliers.noMultipliers') }}

      UTable(
        v-else
        :columns="multiplierColumns"
        :rows="configVM.multipliers"
      )
        template(#startDate-data="{ row }")
          span {{ row.startDate }}

        template(#endDate-data="{ row }")
          span {{ row.endDate }}

        template(#multiplier-data="{ row }")
          span.font-mono.font-semibold x{{ row.multiplier }}

        template(#createdAt-data="{ row }")
          span {{ row.createdAt }}

        template(#actions-data="{ row }")
          UButton(
            color="red"
            variant="ghost"
            icon="i-heroicons-trash"
            size="xs"
            @click="openDeleteModal(row.uuid)"
          )

  UModal(v-model="isCreateModalOpen")
    UCard
      template(#header)
        h3.text-lg.font-semibold {{ $t('loyalty.multipliers.create') }}
      template(#default)
        .space-y-4
          UFormGroup(:label="$t('loyalty.multipliers.startDate')")
            UInput(
              v-model="createForm.startDate"
              type="date"
            )
          UFormGroup(:label="$t('loyalty.multipliers.endDate')")
            UInput(
              v-model="createForm.endDate"
              type="date"
            )
          UFormGroup(:label="$t('loyalty.multipliers.multiplier')")
            UInput(
              v-model.number="createForm.multiplier"
              type="number"
              :min="1"
              step="0.1"
            )
      template(#footer)
        .flex.justify-end.space-x-2
          UButton(
            color="gray"
            :label="$t('common.cancel')"
            @click="closeCreateModal"
          )
          UButton(
            color="primary"
            :label="$t('common.create')"
            :loading="isCreatingMultiplier"
            :disabled="!isCreateFormValid"
            @click="submitCreate"
          )

  UModal(v-model="isDeleteModalOpen")
    UCard
      template(#header)
        h3.text-lg.font-semibold {{ $t('loyalty.multipliers.confirmDelete') }}
      template(#default)
        p {{ $t('loyalty.multipliers.confirmDeleteMessage') }}
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
            :loading="isDeletingMultiplier"
            @click="submitDelete"
          )
</template>

<script lang="ts" setup>
import { getLoyaltyConfigVM } from '@adapters/primary/view-models/loyalty/loyaltyConfigVM'
import { configureLoyalty } from '@core/usecases/loyalty/configure-loyalty/configureLoyalty'
import { createMultiplier } from '@core/usecases/loyalty/create-multiplier/createMultiplier'
import { deleteMultiplier } from '@core/usecases/loyalty/delete-multiplier/deleteMultiplier'
import { getLoyaltyConfig } from '@core/usecases/loyalty/get-loyalty-config/getLoyaltyConfig'
import { getMultipliers } from '@core/usecases/loyalty/get-multipliers/getMultipliers'
import { useLoyaltyGateway } from '../../../../../../../gateways/loyaltyGateway'

definePageMeta({ layout: 'main' })

const { t } = useI18n()
const loyaltyGateway = useLoyaltyGateway()

const pointsPerEuro = ref(1)
const isSavingConfig = ref(false)
const isCreateModalOpen = ref(false)
const isDeleteModalOpen = ref(false)
const isCreatingMultiplier = ref(false)
const isDeletingMultiplier = ref(false)
const multiplierToDelete = ref<string | null>(null)

const createForm = reactive({
  startDate: '',
  endDate: '',
  multiplier: 2
})

const configVM = computed(() => getLoyaltyConfigVM())

const multiplierColumns = computed(() => [
  { key: 'startDate', label: t('loyalty.multipliers.startDate') },
  { key: 'endDate', label: t('loyalty.multipliers.endDate') },
  { key: 'multiplier', label: t('loyalty.multipliers.multiplier') },
  { key: 'createdAt', label: t('common.updated') },
  { key: 'actions', label: '' }
])

const isCreateFormValid = computed(() => {
  return (
    createForm.startDate.length > 0 &&
    createForm.endDate.length > 0 &&
    createForm.multiplier > 0
  )
})

onMounted(async () => {
  await getLoyaltyConfig(loyaltyGateway)
  await getMultipliers(loyaltyGateway)
  if (configVM.value.pointsPerEuro !== null) {
    pointsPerEuro.value = configVM.value.pointsPerEuro
  }
})

const saveConfig = async () => {
  isSavingConfig.value = true
  try {
    await configureLoyalty(
      { pointsPerEuro: pointsPerEuro.value },
      loyaltyGateway
    )
    const toast = useToast()
    toast.add({ title: t('loyalty.config.save'), color: 'green' })
  } catch {
    const toast = useToast()
    toast.add({ title: t('error.unknown'), color: 'red' })
  } finally {
    isSavingConfig.value = false
  }
}

const openCreateModal = () => {
  createForm.startDate = ''
  createForm.endDate = ''
  createForm.multiplier = 2
  isCreateModalOpen.value = true
}

const closeCreateModal = () => {
  isCreateModalOpen.value = false
}

const submitCreate = async () => {
  if (!isCreateFormValid.value) return

  isCreatingMultiplier.value = true
  try {
    await createMultiplier(
      {
        startDate: new Date(createForm.startDate).toISOString(),
        endDate: new Date(createForm.endDate).toISOString(),
        multiplier: createForm.multiplier
      },
      loyaltyGateway
    )
    const toast = useToast()
    toast.add({ title: t('loyalty.multipliers.create'), color: 'green' })
    closeCreateModal()
  } catch {
    const toast = useToast()
    toast.add({ title: t('error.unknown'), color: 'red' })
  } finally {
    isCreatingMultiplier.value = false
  }
}

const openDeleteModal = (uuid: string) => {
  multiplierToDelete.value = uuid
  isDeleteModalOpen.value = true
}

const closeDeleteModal = () => {
  isDeleteModalOpen.value = false
  multiplierToDelete.value = null
}

const submitDelete = async () => {
  if (!multiplierToDelete.value) return

  isDeletingMultiplier.value = true
  try {
    await deleteMultiplier(multiplierToDelete.value, loyaltyGateway)
    const toast = useToast()
    toast.add({ title: t('common.delete'), color: 'green' })
    closeDeleteModal()
  } catch {
    const toast = useToast()
    toast.add({ title: t('error.unknown'), color: 'red' })
  } finally {
    isDeletingMultiplier.value = false
  }
}
</script>

<style scoped>
.loyalty-config-container {
  max-width: 1400px;
  margin: 0 auto;
}
</style>

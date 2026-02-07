<template lang="pug">
.loyalty-config-container.p-6
  h1.text-2xl.font-bold.mb-6 {{ $t('loyalty.config.title') }}

  UCard.mb-6
    template(#default)
      div(v-if="!configVM")
        .flex.justify-center.items-center.py-12
          span {{ $t('common.loading') }}

      div(v-else)
        UForm(:state="formState" @submit="saveConfig")
          UFormGroup(:label="$t('loyalty.config.pointsPerEuro')" name="pointsPerEuro")
            UInput(
              v-model.number="formState.pointsPerEuro"
              type="number"
              min="0"
              step="1"
            )
          .flex.justify-end.mt-4
            UButton(
              type="submit"
              color="primary"
              :label="$t('loyalty.config.save')"
              :loading="isSaving"
            )

  h2.text-xl.font-bold.mb-4 {{ $t('loyalty.multiplierRules.title') }}

  UCard
    template(#default)
      .mb-4.flex.justify-end
        UButton(
          color="primary"
          icon="i-heroicons-plus"
          :label="$t('loyalty.multiplierRules.create')"
          @click="openCreateModal"
        )

      div(v-if="configVM && configVM.multiplierRules.length === 0")
        .text-center.py-8.text-gray-500
          p {{ $t('loyalty.multiplierRules.noRules') }}

      UTable(
        v-else-if="configVM && configVM.multiplierRules.length > 0"
        :columns="columns"
        :rows="configVM.multiplierRules"
      )
        template(#multiplier-data="{ row }")
          span.font-mono x{{ row.multiplier }}

        template(#formattedStartDate-data="{ row }")
          span {{ row.formattedStartDate }}

        template(#formattedEndDate-data="{ row }")
          span {{ row.formattedEndDate }}

        template(#actions-data="{ row }")
          .flex.space-x-2
            UButton(
              color="gray"
              variant="ghost"
              icon="i-heroicons-pencil"
              size="xs"
              @click="openEditModal(row)"
            )
            UButton(
              color="red"
              variant="ghost"
              icon="i-heroicons-trash"
              size="xs"
              @click="openDeleteConfirm(row)"
            )

  UModal(v-model="isRuleModalOpen")
    UCard
      template(#header)
        h3.text-lg.font-semibold {{ editingRule ? $t('loyalty.multiplierRules.edit') : $t('loyalty.multiplierRules.create') }}
      template(#default)
        multiplier-rule-form(
          :rule="editingRule"
          @submit="saveRule"
          @cancel="closeRuleModal"
        )

  UModal(v-model="isDeleteModalOpen")
    UCard
      template(#header)
        h3.text-lg.font-semibold {{ $t('common.delete') }}
      template(#default)
        p {{ $t('loyalty.multiplierRules.confirmDelete') }}
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
            @click="confirmDelete"
          )
</template>

<script lang="ts" setup>
import type { MultiplierRuleVM } from '@adapters/primary/view-models/loyalty/loyalty-config/getLoyaltyConfigVM'
import { getLoyaltyConfigVM } from '@adapters/primary/view-models/loyalty/loyalty-config/getLoyaltyConfigVM'
import type { CreateMultiplierRuleDTO } from '@core/gateways/loyaltyGateway'
import { getLoyaltyConfig } from '@core/usecases/loyalty/loyalty-config-get/getLoyaltyConfig'
import { updateLoyaltyConfig } from '@core/usecases/loyalty/loyalty-config-update/updateLoyaltyConfig'
import { createMultiplierRule } from '@core/usecases/loyalty/multiplier-rule-creation/createMultiplierRule'
import { deleteMultiplierRule } from '@core/usecases/loyalty/multiplier-rule-deletion/deleteMultiplierRule'
import { editMultiplierRule } from '@core/usecases/loyalty/multiplier-rule-edition/editMultiplierRule'
import { useLoyaltyGateway } from '../../../../../../gateways/loyaltyGateway'

definePageMeta({ layout: 'main' })

const { t } = useI18n()
const loyaltyGateway = useLoyaltyGateway()

const isSaving = ref(false)
const isRuleModalOpen = ref(false)
const isDeleteModalOpen = ref(false)
const isDeleting = ref(false)
const editingRule = ref<MultiplierRuleVM | null>(null)
const ruleToDelete = ref<MultiplierRuleVM | null>(null)

const formState = reactive({
  pointsPerEuro: 0
})

const columns = computed(() => [
  { key: 'multiplier', label: t('loyalty.multiplierRules.multiplier') },
  {
    key: 'formattedStartDate',
    label: t('loyalty.multiplierRules.startDate')
  },
  { key: 'formattedEndDate', label: t('loyalty.multiplierRules.endDate') },
  { key: 'actions', label: '' }
])

onMounted(async () => {
  await getLoyaltyConfig(loyaltyGateway)
  const vm = getLoyaltyConfigVM()
  if (vm) {
    formState.pointsPerEuro = vm.pointsPerEuro
  }
})

const configVM = computed(() => getLoyaltyConfigVM())

const saveConfig = async () => {
  isSaving.value = true
  try {
    await updateLoyaltyConfig(formState.pointsPerEuro, loyaltyGateway)
    const toast = useToast()
    toast.add({ title: t('loyalty.config.saved'), color: 'green' })
  } finally {
    isSaving.value = false
  }
}

const openCreateModal = () => {
  editingRule.value = null
  isRuleModalOpen.value = true
}

const openEditModal = (rule: MultiplierRuleVM) => {
  editingRule.value = rule
  isRuleModalOpen.value = true
}

const closeRuleModal = () => {
  isRuleModalOpen.value = false
  editingRule.value = null
}

const saveRule = async (data: CreateMultiplierRuleDTO) => {
  if (editingRule.value) {
    await editMultiplierRule(editingRule.value.uuid, data, loyaltyGateway)
  } else {
    await createMultiplierRule(data, loyaltyGateway)
  }
  closeRuleModal()
}

const openDeleteConfirm = (rule: MultiplierRuleVM) => {
  ruleToDelete.value = rule
  isDeleteModalOpen.value = true
}

const closeDeleteModal = () => {
  isDeleteModalOpen.value = false
  ruleToDelete.value = null
}

const confirmDelete = async () => {
  if (!ruleToDelete.value) return
  isDeleting.value = true
  try {
    await deleteMultiplierRule(ruleToDelete.value.uuid, loyaltyGateway)
    closeDeleteModal()
  } finally {
    isDeleting.value = false
  }
}
</script>

<style scoped>
.loyalty-config-container {
  max-width: 1000px;
  margin: 0 auto;
}
</style>

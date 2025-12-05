<template lang="pug">
.delivery-price-rules-container.p-6
  .mb-4.flex.items-center.justify-between
    h1.text-2xl.font-bold {{ $t('deliveryPriceRules.title') }}
    UButton(
      color="primary"
      icon="i-heroicons-plus"
      :label="$t('deliveryPriceRules.create')"
      @click="navigateTo('/delivery-price-rules/new')"
    )

  UCard
    template(#default)
      div(v-if="isLoading")
        .flex.justify-center.items-center.py-12
          icon.animate-spin.h-8.w-8(name="i-heroicons-arrow-path")
          span.ml-2 {{ $t('common.loading') }}

      div(v-else-if="listVM.length === 0")
        .text-center.py-12.text-gray-500
          icon.mb-4(name="i-heroicons-truck" class="text-6xl")
          p {{ $t('deliveryPriceRules.noRules') }}

      UTable(
        v-else
        :columns="columns"
        :rows="listVM"
      )
        template(#priority-data="{ row }")
          span.font-mono {{ row.priority }}

        template(#name-data="{ row }")
          span.font-medium {{ row.name }}

        template(#deliveryMethodName-data="{ row }")
          span {{ row.deliveryMethodName }}

        template(#formattedPrice-data="{ row }")
          span.font-mono {{ row.formattedPrice }}

        template(#formattedMinOrderValue-data="{ row }")
          span.font-mono {{ row.formattedMinOrderValue }}

        template(#formattedMaxWeight-data="{ row }")
          span.font-mono {{ row.formattedMaxWeight }}

        template(#formattedDateRange-data="{ row }")
          span {{ row.formattedDateRange }}

        template(#isActive-data="{ row }")
          UBadge(:color="row.isActive ? 'green' : 'gray'")
            | {{ row.isActive ? $t('common.active') : $t('common.inactive') }}

        template(#actions-data="{ row }")
          .flex.space-x-2
            UButton(
              color="gray"
              variant="ghost"
              icon="i-heroicons-pencil"
              size="xs"
              @click="navigateTo(`/delivery-price-rules/edit/${row.uuid}`)"
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
        h3.text-lg.font-semibold {{ $t('deliveryPriceRules.confirmDelete') }}
      template(#default)
        p {{ $t('deliveryPriceRules.confirmDeleteMessage') }}
        p.mt-2.font-semibold(v-if="ruleToDelete") {{ ruleToDelete.name }}
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
            @click="deleteRule"
          )
</template>

<script lang="ts" setup>
import type { DeliveryPriceRuleListItemVM } from '@adapters/primary/view-models/delivery-price-rules/delivery-price-rule-list/deliveryPriceRuleListVM'
import { getDeliveryPriceRuleListVM } from '@adapters/primary/view-models/delivery-price-rules/delivery-price-rule-list/deliveryPriceRuleListVM'
import { listDeliveryMethods } from '@core/usecases/delivery-methods/delivery-method-listing/listDeliveryMethods'
import { deleteDeliveryPriceRule } from '@core/usecases/delivery-price-rules/delete-delivery-price-rule/deleteDeliveryPriceRule'
import { listDeliveryPriceRules } from '@core/usecases/delivery-price-rules/list-delivery-price-rules/listDeliveryPriceRules'
import { useDeliveryPriceRuleStore } from '@store/deliveryPriceRuleStore'
import { useDeliveryMethodGateway } from '../../../../../../gateways/deliveryMethodGateway'
import { useDeliveryPriceRuleGateway } from '../../../../../../gateways/deliveryPriceRuleGateway'

definePageMeta({ layout: 'main' })

const { t } = useI18n()
const deliveryPriceRuleGateway = useDeliveryPriceRuleGateway()
const deliveryMethodGateway = useDeliveryMethodGateway()
const store = useDeliveryPriceRuleStore()

const isDeleteModalOpen = ref(false)
const ruleToDelete = ref<DeliveryPriceRuleListItemVM | null>(null)
const isDeleting = ref(false)

const isLoading = computed(() => store.isLoading)

const columns = computed(() => [
  { key: 'priority', label: t('deliveryPriceRules.fields.priority') },
  { key: 'name', label: t('deliveryPriceRules.fields.name') },
  {
    key: 'deliveryMethodName',
    label: t('deliveryPriceRules.fields.deliveryMethod')
  },
  { key: 'formattedPrice', label: t('deliveryPriceRules.fields.price') },
  {
    key: 'formattedMinOrderValue',
    label: t('deliveryPriceRules.fields.minOrderValue')
  },
  {
    key: 'formattedMaxWeight',
    label: t('deliveryPriceRules.fields.maxWeight')
  },
  {
    key: 'formattedDateRange',
    label: t('deliveryPriceRules.fields.dateRange')
  },
  { key: 'isActive', label: t('deliveryPriceRules.fields.isActive') },
  { key: 'actions', label: '' }
])

onMounted(async () => {
  await listDeliveryMethods(deliveryMethodGateway)
  await listDeliveryPriceRules(deliveryPriceRuleGateway)
})

const listVM = computed(() => getDeliveryPriceRuleListVM())

const openDeleteModal = (rule: DeliveryPriceRuleListItemVM) => {
  ruleToDelete.value = rule
  isDeleteModalOpen.value = true
}

const closeDeleteModal = () => {
  isDeleteModalOpen.value = false
  ruleToDelete.value = null
}

const deleteRule = async () => {
  if (!ruleToDelete.value) return

  isDeleting.value = true
  try {
    await deleteDeliveryPriceRule(
      ruleToDelete.value.uuid,
      deliveryPriceRuleGateway
    )

    const toast = useToast()
    toast.add({
      title: t('deliveryPriceRules.deleteSuccess'),
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
.delivery-price-rules-container {
  max-width: 1400px;
  margin: 0 auto;
}
</style>

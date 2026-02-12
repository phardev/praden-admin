<template lang="pug">
.section
  h1.text-page-title.mb-6 {{ $t('orders.createOrder') }}

  .flex.gap-4.mb-8
    .flex.items-center.gap-2(
      v-for="(step, index) in steps"
      :key="step.label"
    )
      .w-8.h-8.rounded-full.flex.items-center.justify-center.text-sm.font-semibold(
        :class="stepClass(index)"
      ) {{ index + 1 }}
      span.text-sm(:class="index === currentStep ? 'font-semibold' : 'text-gray-500'") {{ $t(step.label) }}
      UIcon.text-gray-300(v-if="index < steps.length - 1" name="i-heroicons-chevron-right")

  manual-order-customer-step(v-if="currentStep === 0" :vm="currentVM")
  manual-order-products-step(v-if="currentStep === 1" :vm="currentVM")
  manual-order-delivery-step(v-if="currentStep === 2" :vm="currentVM")
  manual-order-review-step(v-if="currentStep === 3" :vm="currentVM" @confirm="confirm")

  .flex.justify-between.mt-8(v-if="currentStep < 3")
    ft-button(
      v-if="currentStep > 0"
      color="gray"
      variant="soft"
      @click.prevent="currentVM.prevStep()"
    ) {{ $t('orders.create.back') }}
    div(v-else)
    ft-button(
      :disabled="!currentVM.canGoNext()"
      @click.prevent="currentVM.nextStep()"
    ) {{ $t('orders.create.next') }}
</template>

<script lang="ts" setup>
import { createOrderVM } from '@adapters/primary/view-models/orders/create-order/createOrderVM'
import { createManualOrder } from '@core/usecases/order/manual-order-creation/createManualOrder'
import { useOrderStore } from '@store/orderStore'
import { useOrderGateway } from '../../../../../../gateways/orderGateway'

definePageMeta({ layout: 'main' })

const router = useRouter()
const routeName = String(router.currentRoute.value.name ?? '')
const vm = ref(createOrderVM(routeName))

const currentVM = computed(() => vm.value)

const steps = computed(() => currentVM.value.getSteps())
const currentStep = computed(() => currentVM.value.getStep())

const stepClass = (index: number) => {
  if (index === currentStep.value) return 'bg-primary-500 text-white'
  if (index < currentStep.value) return 'bg-primary-100 text-primary-700'
  return 'bg-gray-200 text-gray-500'
}

const confirm = async () => {
  await createManualOrder(currentVM.value.getDto(), useOrderGateway())
  const orderStore = useOrderStore()
  router.push(`/orders/${orderStore.current?.uuid}`)
}
</script>

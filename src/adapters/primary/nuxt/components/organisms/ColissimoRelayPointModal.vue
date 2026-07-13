<template lang="pug">
UModal(
  :model-value="show"
  :ui="{ width: 'sm:max-w-4xl' }"
  @update:model-value="onModelValueUpdate"
)
  UCard
    template(#header)
      .flex.items-center.justify-between
        h3.text-lg.font-semibold {{ $t('orders.create.delivery.relaySearch.colissimoTitle') }}
        UButton(
          color="gray"
          variant="ghost"
          icon="i-heroicons-x-mark"
          @click="closeModal"
        )
    div(v-if="isLoading")
      .space-y-3
        USkeleton.h-8(class="w-1/2")
        USkeleton.h-96
    div(v-show="!isLoading")
      #colissimo-relay-point-widget.min-h-96
</template>

<script lang="ts" setup>
import type { ColissimoWidgetPoint } from '@adapters/primary/view-models/orders/create-order/colissimoRelayPointVM'
import { mapColissimoWidgetPoint } from '@adapters/primary/view-models/orders/create-order/colissimoRelayPointVM'
import type { Address } from '@core/entities/order'
import type { RelayPoint } from '@core/entities/relayPoint'
import { getColissimoWidgetToken } from '@core/usecases/colissimo/colissimo-widget-token-retrieval/getColissimoWidgetToken'
import { useColissimoWidgetStore } from '@store/colissimoWidgetStore'
import { useColissimoWidgetGateway } from '../../../../../../gateways/colissimoWidgetGateway'

const COLISSIMO_URL = 'https://ws.colissimo.fr'
const COLISSIMO_SCRIPT_URL = `${COLISSIMO_URL}/widget-colissimo/js/jquery.plugin.colissimo.min.js`
const JQUERY_SCRIPT_URL =
  'https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js'
const MAPBOX_CSS_URL =
  'https://api.mapbox.com/mapbox-gl-js/v2.6.1/mapbox-gl.css'
const CALLBACK_NAME = 'colissimoRelayPointSelected'

const props = defineProps<{
  show: boolean
  prefillAddress: Address
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'selected', point: RelayPoint): void
}>()

const isLoading = ref(true)

const colissimoWidgetStore = useColissimoWidgetStore()

const onModelValueUpdate = (value: boolean) => {
  if (!value) {
    closeModal()
  }
}

const closeModal = () => {
  closeWidgetFrame()
  emit('close')
}

const widgetContainer = () => {
  return (window as any).jQuery('#colissimo-relay-point-widget')
}

const closeWidgetFrame = () => {
  try {
    widgetContainer().frameColissimoClose()
  } catch {
    return
  }
}

const loadStylesheet = (href: string) => {
  if (document.querySelector(`link[href="${href}"]`)) {
    return
  }
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = href
  document.head.appendChild(link)
}

const loadScript = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve()
      return
    }
    const script = document.createElement('script')
    script.src = src
    script.type = 'text/javascript'
    script.onload = () => resolve()
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`))
    document.body.appendChild(script)
  })
}

const registerSelectionCallback = () => {
  ;(window as any)[CALLBACK_NAME] = (point: ColissimoWidgetPoint) => {
    emit('selected', mapColissimoWidgetPoint(point))
    closeWidgetFrame()
    emit('close')
  }
}

const openWidget = async () => {
  isLoading.value = true
  try {
    loadStylesheet(MAPBOX_CSS_URL)
    await loadScript(JQUERY_SCRIPT_URL)
    await loadScript(COLISSIMO_SCRIPT_URL)
    await getColissimoWidgetToken(useColissimoWidgetGateway())
    registerSelectionCallback()
    await nextTick()
    const container = widgetContainer()
    container.empty()
    container.frameColissimoOpen({
      URLColissimo: COLISSIMO_URL,
      callBackFrame: CALLBACK_NAME,
      ceCountry: 'FR',
      ceAddress: props.prefillAddress.address,
      ceZipCode: props.prefillAddress.zip,
      ceTown: props.prefillAddress.city,
      token: colissimoWidgetStore.token
    })
  } finally {
    isLoading.value = false
  }
}

watch(
  () => props.show,
  async (isShown) => {
    if (isShown) {
      await openWidget()
    }
  }
)
</script>

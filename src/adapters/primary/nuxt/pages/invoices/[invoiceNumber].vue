<script lang="ts" setup>
import type { RouteLocationRaw } from 'vue-router'
import { useInvoiceGateway } from '../../../../../../gateways/invoiceGateway'

definePageMeta({ layout: 'main' })

onMounted(async () => {
  const route = useRoute()
  const router = useRouter()
  const invoiceNumber = decodeURIComponent(route.params.invoiceNumber as string)

  const newWindow = window.open('about:blank', '_blank')

  if (!newWindow) {
    console.error('Popup blocked - cannot open invoice PDF')
    router.push('/orders' as RouteLocationRaw)
    return
  }

  try {
    const blob = await useInvoiceGateway().downloadPdf(invoiceNumber)
    const url = window.URL.createObjectURL(blob)

    newWindow.location.href = url

    setTimeout(() => {
      window.URL.revokeObjectURL(url)
    }, 1000)
  } catch (error) {
    console.error('Failed to load invoice PDF:', error)
    newWindow.close()
  }

  router.push('/orders' as RouteLocationRaw)
})
</script>

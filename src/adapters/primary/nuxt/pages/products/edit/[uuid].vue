<template lang="pug">
.section(v-if="vm")
  h1.text-title Editer produit
  product-form(
    :vm="vm"
    @validate="validate"
  )
</template>

<script lang="ts" setup>
import {
  type ErrorWithResponse,
  useApiErrorMessage
} from '@adapters/primary/nuxt/composables/useApiErrorMessage'
import { productFormEditVM } from '@adapters/primary/view-models/products/product-form/productFormEditVM'
import { listCategories } from '@core/usecases/categories/list-categories/listCategories'
import { getProduct } from '@core/usecases/product/get-product/getProduct'
import { editProduct } from '@core/usecases/product/product-edition/editProduct'
import { useCategoryGateway } from '../../../../../../../gateways/categoryGateway'
import { useDateProvider } from '../../../../../../../gateways/dateProvider'
import { useProductGateway } from '../../../../../../../gateways/productGateway'
import { usePromotionGateway } from '../../../../../../../gateways/promotionGateway'

definePageMeta({ layout: 'main' })

const vm = ref()
const route = useRoute()
const productUuid = String(route.params.uuid)
const router = useRouter()
const routeName = String(router.currentRoute.value.name ?? '')

onMounted(async () => {
  const categoryGateway = useCategoryGateway()
  listCategories(categoryGateway)
  const productGateway = useProductGateway()
  await getProduct(
    productUuid,
    productGateway,
    usePromotionGateway(),
    useDateProvider()
  )
  vm.value = productFormEditVM(routeName)
})

const { t } = useI18n()
const { fromError } = useApiErrorMessage()
const validate = async () => {
  try {
    await editProduct(productUuid, vm.value.getDto(), useProductGateway())
  } catch (error: unknown) {
    const { title, message } = fromError(error as ErrorWithResponse)
    useToast().add({
      title: t('products.form.editError'),
      description: message || title,
      color: 'red'
    })
    return
  }
  router.push('/products/')
}
</script>

<template lang="pug">
.product-item.flex.items-center.gap-4.p-4.bg-white.border.border-gray-200.rounded-lg.transition-colors(
  :class="{ 'hover:border-gray-300 hover:shadow-sm': !isDragging, 'opacity-50': isDragging, 'cursor-move': !isDragging }"
)
  .flex.items-center.gap-4.flex-1.min-w-0
    icon.text-gray-400.flex-shrink-0.cursor-move(
      name="i-heroicons-bars-3-bottom-left"
      aria-hidden="true"
    )
    img.rounded.object-cover(
      v-if="item.miniature"
      :src="item.miniature"
      :alt="item.name"
      width="48"
      height="48"
      :class="{ grayscale: !isVisible }"
    )
    .flex-1.min-w-0
      .font-medium.text-gray-900.truncate {{ item.name }}
      .flex.flex-wrap.items-center.gap-2.mt-1
        span.text-sm.text-gray-600 {{ item.price }}
        UBadge(
          v-if="item.promotion"
          :color="isInProgress ? 'green' : 'blue'"
          variant="subtle"
          size="xs"
          :label="promotionLabel"
        )
        UBadge(
          v-if="visibilityLabel"
          color="amber"
          variant="subtle"
          size="xs"
          icon="i-heroicons-eye-slash"
          :label="visibilityLabel"
        )
  UButton(
    color="gray"
    variant="ghost"
    icon="i-heroicons-trash"
    size="sm"
    :aria-label="$t('common.delete')"
    @click="$emit('remove')"
  )
</template>

<script lang="ts" setup>
import {
  ShowcaseItemVisibility,
  type ShowcaseItemVM,
  ShowcasePromotionStatus
} from '@adapters/primary/view-models/homepage-showcases/homepage-showcase-form/homepageShowcaseFormVM'
import { HOMEPAGE_VISIBLE_PRODUCT_COUNT } from '@core/entities/homepageShowcase'

const props = defineProps<{
  item: ShowcaseItemVM
  isDragging?: boolean
}>()

defineEmits<{
  (e: 'remove'): void
}>()

const { t } = useI18n()

const isVisible = computed(
  () => props.item.visibility === ShowcaseItemVisibility.Visible
)

const isInProgress = computed(
  () => props.item.promotion?.status === ShowcasePromotionStatus.InProgress
)

const promotionLabel = computed(() => {
  const promotion = props.item.promotion
  if (!promotion) return ''
  if (promotion.status === ShowcasePromotionStatus.Upcoming) {
    return t('shopManagement.homepageShowcase.promotion.upcoming', promotion)
  }
  return promotion.date
    ? t('shopManagement.homepageShowcase.promotion.inProgress', promotion)
    : t(
        'shopManagement.homepageShowcase.promotion.inProgressWithoutEnd',
        promotion
      )
})

const visibilityLabel = computed(() => {
  if (props.item.visibility === ShowcaseItemVisibility.NotInPromotion) {
    return props.item.promotion?.status === ShowcasePromotionStatus.Upcoming
      ? t('shopManagement.homepageShowcase.visibility.notStartedYet')
      : t('shopManagement.homepageShowcase.visibility.notInPromotion')
  }
  if (props.item.visibility === ShowcaseItemVisibility.BeyondLimit) {
    return t('shopManagement.homepageShowcase.visibility.beyondLimit', {
      count: HOMEPAGE_VISIBLE_PRODUCT_COUNT
    })
  }
  return ''
})
</script>

<template lang="pug">
TransitionRoot(:show="isOpened")
  Dialog.fixed.inset-0.z-40(
    as="div"
    class="md:hidden"
    @close="close"
  )
    TransitionChild(
      as="template"
      enter="transition ease-in-out duration-200 transform"
      enter-from="-translate-x-full"
      enter-to="translate-x-0"
      leave="transition ease-in-out duration-200 transform"
      leave-from="translate-x-0"
      leave-to="-translate-x-full"
    )
      div.flex.flex-col.w-72.relative.z-10.h-full.bg-light.border-r.border-neutral-light(class="md:hidden")
        button.absolute.top-2.right-2.flex.items-center.justify-center.w-10.h-10.rounded-full(
          type="button"
          value="closeSidebar"
          class="focus:outline-none focus:ring-2 focus:ring-neutral"
          @click="close"
        )
          icon.icon-sm(name="heroicons:x-mark")
        navigation-menu.pt-4
    TransitionChild(
      as="template"
      enter="transition-opacity ease-linear duration-200"
      enter-from="opacity-0"
      enter-to="opacity-100"
      leave="transition-opacity ease-linear duration-200"
      leave-from="opacity-100"
      leave-to="opacity-0"
    )
      DialogOverlay.fixed.inset-0.bg-backdrop
</template>
<script lang="ts" setup>
import {
  Dialog,
  DialogOverlay,
  TransitionChild,
  TransitionRoot
} from '@headlessui/vue'

defineProps({
  isOpened: {
    type: Boolean,
    default: () => {
      return false
    }
  }
})

const emit = defineEmits<{
  (e: 'close'): void
}>()

const close = () => {
  emit('close')
}
</script>

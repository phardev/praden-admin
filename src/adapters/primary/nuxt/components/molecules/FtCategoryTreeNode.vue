<template lang="pug">
.category-tree-node
  ul
    li(v-for="item in items" :key="item.data.uuid")
      .list-item(@click="toggle(item)")
        .flex.justify-between.items-center.p-2.cursor-pointer.bg-hover
          div.flex.items-center.justify-center.space-x-4
            img.w-8.h-8(:src="item.data.miniature")
            span {{ item.data.name }}
          div.flex.items-center.justify-center
            ft-button.button-solid.mr-0.py-1.px-2.text-md(
              @click.prevent="view(item.data.uuid)"
            ) Voir
            span(v-if="item.children.length" class="ml-2")
              icon.icon-md(
                v-if="isOpen(item.data.uuid)"
                name="material-symbols-light:keyboard-arrow-up"
              )
              icon.icon-md(
                v-else
                name="material-symbols-light:keyboard-arrow-down"
              )
      transition(name="slide-fade")
        ul(v-if="isOpen(item.data.uuid)" class="pl-6")
          FtCategoryTreeNode(
            :items="item.children"
            @clicked.prevent="view"
          )
</template>
<script setup lang="ts">
const props = defineProps({
  items: {
    type: Array,
    default: () => {
      return []
    }
  },
  openItems: {
    type: Array,
    default: () => {
      return []
    }
  }
})

const toggle = (item) => {
  const uuid = item.data.uuid
  const newOpenItems = [...props.openItems]
  if (newOpenItems.includes(uuid)) {
    newOpenItems.splice(newOpenItems.indexOf(uuid), 1)
  } else {
    newOpenItems.push(uuid)
  }
  emit('update:open-items', newOpenItems)
}

const isOpen = (uuid) => props.openItems.includes(uuid)

const emit = defineEmits<{
  (e: 'view', uuid: string): void
  (e: 'update:open-items', items: Array<any>): void
}>()

const view = (uuid: string): void => {
  emit('view', uuid)
}
</script>

<style scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  max-height: 0;
  opacity: 0;
}
</style>

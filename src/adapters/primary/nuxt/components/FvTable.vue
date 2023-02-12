<template lang="pug">
.px-4(class='sm:px-6 lg:px-8')
div(class='sm:flex sm:items-center')
  div(class='sm:flex-auto')
    h1.text-2xl.font-semibold.text-default
      slot(name="title")
.-mx-4.mt-10.ring-1.ring-light(class='sm:-mx-6 md:mx-0 md:rounded-lg')
  table.min-w-full.divide-y.divide-light
    thead.bg-contrast
      tr
        th(v-if="selectable" scope="col" class="relative w-12 px-6 sm:w-16 sm:px-8")
          input(type="checkbox" class="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-light text-colored focus:ring-colored sm:left-6")
        th.pl-4.pr-3.text-left.text-sm.font-semibold.text-default(
          v-for="(header, headerIndex) in headers"
          :key="headerIndex"
          :class="[headerIndex === 0 ? 'pl-4 pr-3 sm:pl-6' : 'px-3 lg:table-cell', 'text-left text-sm font-semibold text-default py-3.5']"
          scope='col'
        ) {{ header.name }}
    tbody
      tr(v-for='(item, index) in items' :key='index')
        td.border-t.border-light(v-if="selectable" class="relative w-12 px-6 sm:w-16 sm:px-8")
          div(v-if="false" class="absolute inset-y-0 left-0 w-0.5 bg-contrast")
          input(
            :key="selection.includes(item.reference)"
            type="checkbox"
            class="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-light text-colored focus:ring-colored sm:left-6"
            :checked="selection.includes(item.reference)"
            @click.prevent="select(item)"
          )
        td.border-t.border-light.px-3.py-3.text-sm.text-contrast(
          v-for="(header, headerIndex) in headers"
          :key="headerIndex"
        )
          slot(:name="header.value" :item="item") {{ item[header.value] }}
</template>

<script lang="ts" setup>
defineProps({
  headers: {
    type: Array,
    default: () => {
      return []
    }
  },
  items: {
    type: Array,
    default: () => {
      return []
    }
  },
  selectable: {
    type: Boolean,
    default: () => {
      return false
    }
  },
  selection: {
    type: Array,
    default: () => {
      return []
    }
  }
})

const emit = defineEmits<{
  (e: 'item-selected', value: any): void
}>()

const select = (selected: any) => {
  emit('item-selected', selected)
}
</script>

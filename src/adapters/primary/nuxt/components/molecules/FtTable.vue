<template lang="pug">
.ft-table
  .px-4(class='sm:px-6 lg:px-8')
  div(class='sm:flex sm:items-center')
    div(class='sm:flex-auto')
      h1.text-2xl.font-semibold.text-default(:class="{'mb-10': hasTitleSlot && !hasSearchSlot}")
        slot(name="title")
  div(:class="{'mt-4': hasSearchSlot}")
    slot(name="search")
  .-mx-4.ring-1.ring-light(class='sm:-mx-6 md:mx-0 md:rounded-lg')
    div(class="overflow-y-auto" style="max-height: 400px;")
      table.min-w-full.divide-y.divide-light
        thead.bg-contrast
          tr
            th(v-if="selectable" scope="col" class="relative w-12 px-6 sm:w-16 sm:px-8")
              input(
                :key="indeterminate || selectionIntersection.length === items.length"
                type="checkbox"
                class="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-light text-colored focus:ring-colored sm:left-6"
                :checked="indeterminate || (selectionIntersection.length === items.length && items.length > 0)"
                :indeterminate="indeterminate"
                @click.prevent="selectAll"
              )
            th.pl-4.pr-3.text-left.text-sm.font-semibold(
              v-for="(header, headerIndex) in headers"
              :key="headerIndex"
              :class="[headerIndex === 0 ? 'pl-4 pr-3 sm:pl-6' : 'px-3 lg:table-cell', 'text-left text-sm font-semibold text-default py-3.5']"
              scope='col'
            ) {{ header.name }}
        tbody(v-if="isLoading")
          tr(v-for="i in 5" :key="i")
            td(v-if="selectable" class="relative w-12 px-6 sm:w-16 sm:px-8")
              USkeleton(class="h-4 w-4")
            td(v-for="c in headers.length" :key="c")
              USkeleton.my-4(class="h-4 w-[250px]")
        tbody(v-else)
          tr.table-line(
            v-for='(item, index) in items'
            :key='index'
            @click.prevent="clicked(item)"
          )
            td.border-t.border-light(v-if="selectable" class="relative w-12 px-6 sm:w-16 sm:px-8")
              input(
                :key="selection.includes(item[itemKey])"
                type="checkbox"
                class="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-light text-colored focus:ring-colored sm:left-6"
                :checked="selection.includes(item[itemKey])"
                @click.stop.prevent="select(item)"
              )
            td.border-t.border-light.px-3.py-3.text-sm.text-contrast(
              v-for="(header, headerIndex) in headers"
              :key="headerIndex"
            )
              slot(:name="header.value" :item="item") {{ getValue(item, header.value) }}
</template>

<script lang="ts" setup>
const props = defineProps({
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
  },
  itemKey: {
    type: String,
    default: () => {
      return 'uuid'
    }
  },
  isLoading: {
    type: Boolean,
    default: () => {
      return false
    }
  }
})

const slots = useSlots()

const hasSearchSlot = computed(() => !!slots.search)
const hasTitleSlot = computed(() => !!slots.title)

const emit = defineEmits<{
  (e: 'clicked', value: any): void
  (e: 'item-selected', value: any): void
  (e: 'select-all', value: Array<any>): void
}>()

const indeterminate = computed(() => {
  return (
    selectionIntersection.value.length > 0 &&
    selectionIntersection.value.length < props.items.length
  )
})

const selectionIntersection = computed(() => {
  return props.selection.filter((s: any) =>
    props.items.find((i: any) => i[props.itemKey] === s)
  )
})

const clicked = (item: any) => {
  emit('clicked', item[props.itemKey])
}

const select = (selected: any) => {
  emit('item-selected', selected[props.itemKey])
}

const selectAll = () => {
  emit(
    'select-all',
    props.items?.map((i: any) => i[props.itemKey])
  )
}

const getValue = (item: Record<string, unknown>, key: string) => {
  return key
    .split('.')
    .reduce(
      (item: Record<string, unknown>, key: string) =>
        item && (item[key] as Record<string, unknown>),
      item
    )
}
</script>

<style scoped>
@media print {
  td {
    white-space: normal !important; /* Allows wrapping */
    overflow: visible !important; /* Ensure content is visible */
  }

  div[style*='max-height'] {
    max-height: none !important;
  }

  .break-page {
    page-break-before: always;
  }

  .invoice {
    font-size: 12px; /* Adjust font size for printing */
  }

  table {
    page-break-inside: auto !important; /* Allow page breaks within tables */
  }

  tr {
    page-break-inside: avoid !important; /* Avoid page breaks within table rows */
  }

  thead {
    display: table-header-group !important; /* Repeat table headers on each page */
  }

  tfoot {
    display: table-footer-group !important; /* Repeat table footers on each page */
  }
}
</style>

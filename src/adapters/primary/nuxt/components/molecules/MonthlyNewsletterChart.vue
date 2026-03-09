<template lang="pug">
div
  div(ref="chartContainer" class="chart-container")
</template>

<script lang="ts" setup>
import type { MonthlyNewsletterSubscription } from '@core/entities/dashboard'

const props = defineProps<{
  data: MonthlyNewsletterSubscription[]
}>()

const { t } = useI18n()

const isMounted = ref(false)
const chartContainer = ref<HTMLElement | null>(null)

const sortedData = computed(() => {
  return [...props.data].sort((a, b) => a.month.localeCompare(b.month))
})

const formatMonth = (month: string) => {
  const [, monthNum] = month.split('-')
  return monthNum
}

const createChart = async () => {
  if (!chartContainer.value || !isMounted.value || props.data.length === 0)
    return

  const d3Module = await import('d3')
  const d3 = d3Module.default || d3Module

  d3.select(chartContainer.value).selectAll('*').remove()

  const margin = { top: 40, right: 30, bottom: 60, left: 60 }
  let containerHeight = chartContainer.value.clientHeight
  if (containerHeight === 0) {
    containerHeight = 400
  }

  const width = chartContainer.value.clientWidth - margin.left - margin.right
  const height = containerHeight - margin.top - margin.bottom

  const svg = d3
    .select(chartContainer.value)
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`)

  const months = [
    '01',
    '02',
    '03',
    '04',
    '05',
    '06',
    '07',
    '08',
    '09',
    '10',
    '11',
    '12'
  ]

  const dataMap = new Map(
    sortedData.value.map((d) => [formatMonth(d.month), d.count])
  )

  const x = d3.scaleBand().domain(months).range([0, width]).padding(0.2)

  const maxCount = d3.max(sortedData.value, (d) => d.count) || 0

  const y = d3.scaleLinear().domain([0, maxCount]).nice().range([height, 0])

  svg
    .append('g')
    .attr('transform', `translate(0,${height})`)
    .call(d3.axisBottom(x))
    .selectAll('text')
    .style('text-anchor', 'middle')

  svg.append('g').call(d3.axisLeft(y))

  svg
    .append('text')
    .attr('text-anchor', 'middle')
    .attr('transform', 'rotate(-90)')
    .attr('y', -margin.left + 15)
    .attr('x', -height / 2)
    .text(t('dashboard.userStatistics.subscribers'))
    .attr('class', 'axis-label')

  const tooltip = d3
    .select('body')
    .append('div')
    .attr('class', 'tooltip')
    .style('position', 'absolute')
    .style('z-index', '100')
    .style('background', 'rgba(255, 255, 255, 0.9)')
    .style('padding', '8px')
    .style('border-radius', '4px')
    .style('box-shadow', '0 2px 5px rgba(0, 0, 0, 0.2)')
    .style('pointer-events', 'none')
    .style('opacity', 0)

  months.forEach((month) => {
    const count = dataMap.get(month) || 0

    svg
      .append('rect')
      .attr('x', x(month) || 0)
      .attr('y', y(count))
      .attr('width', x.bandwidth())
      .attr('height', height - y(count))
      .attr('fill', 'rgba(16, 185, 129, 0.7)')
      .attr('stroke', 'rgba(16, 185, 129, 1)')
      .attr('stroke-width', 1)
      .on('mouseover', function (event) {
        d3.select(this).attr('fill', 'rgba(16, 185, 129, 0.9)')
        tooltip
          .style('opacity', 1)
          .html(
            `<strong>${t('dashboard.userStatistics.subscribers')}</strong><br>${month}: ${count}`
          )
          .style('left', event.pageX + 10 + 'px')
          .style('top', event.pageY - 20 + 'px')
      })
      .on('mouseout', function () {
        d3.select(this).attr('fill', 'rgba(16, 185, 129, 0.7)')
        tooltip.style('opacity', 0)
      })
  })
}

const handleResize = () => {
  createChart()
}

onMounted(() => {
  isMounted.value = true
  createChart()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)

  if (typeof window !== 'undefined') {
    const d3Module = import('d3')
    d3Module.then((d3Module) => {
      const d3 = d3Module.default || d3Module
      d3.selectAll('body > .tooltip').remove()
    })
  }
})

watch(
  () => props.data,
  () => {
    createChart()
  },
  { deep: true }
)
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 100%;
  position: relative;
}

.axis-label {
  font-size: 12px;
  fill: #6b7280;
}

.chart-title {
  font-size: 14px;
  font-weight: bold;
}

.tooltip {
  position: absolute;
  padding: 8px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  pointer-events: none;
  font-size: 12px;
  box-shadow: 0 2px 4px rgb(0 0 0 / 10%);
}
</style>

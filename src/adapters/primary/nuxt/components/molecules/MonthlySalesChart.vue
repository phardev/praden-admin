<template>
  <div>
    <div ref="chartContainer" class="chart-container"></div>
  </div>
</template>

<script lang="ts" setup>
import { MonthlySales } from '@core/entities/dashboard'

const props = defineProps<{
  data: MonthlySales[]
}>()

const isMounted = ref(false)
const chartContainer = ref<HTMLElement | null>(null)

const sortedData = computed(() => {
  return [...props.data].sort((a, b) => a.month.localeCompare(b.month))
})

const formatMonth = (month: string) => {
  const [year, monthNum] = month.split('-')
  return `${monthNum}/${year.substring(2)}`
}

const createChart = async () => {
  if (!chartContainer.value || !isMounted.value || props.data.length === 0)
    return

  const d3Module = await import('d3')
  const d3 = d3Module.default || d3Module

  d3.select(chartContainer.value).selectAll('*').remove()

  const margin = { top: 30, right: 30, bottom: 60, left: 60 }
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

  const x = d3
    .scaleBand()
    .domain(sortedData.value.map((d) => formatMonth(d.month)))
    .range([0, width])
    .padding(0.2)

  const y = d3
    .scaleLinear()
    .domain([0, d3.max(sortedData.value, (d) => d.count) || 0])
    .nice()
    .range([height, 0])

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
    .text('Nombre de ventes')
    .attr('class', 'axis-label')

  svg
    .selectAll('rect')
    .data(sortedData.value)
    .enter()
    .append('rect')
    .attr('x', (d) => x(formatMonth(d.month)) || 0)
    .attr('y', (d) => y(d.count))
    .attr('width', x.bandwidth())
    .attr('height', (d) => height - y(d.count))
    .attr('fill', 'rgba(59, 130, 246, 0.7)')
    .attr('stroke', 'rgba(59, 130, 246, 1)')
    .attr('stroke-width', 1)
    .on('mouseover', function (event, d) {
      d3.select(this).attr('fill', 'rgba(59, 130, 246, 0.9)')

      const tooltipWidth = 150
      const tooltipHeight = 40
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight

      let left = event.pageX + 10
      let top = event.pageY - 20

      if (left + tooltipWidth > viewportWidth) {
        left = event.pageX - tooltipWidth - 10
      }

      if (top + tooltipHeight > viewportHeight) {
        top = event.pageY - tooltipHeight - 10
      }

      tooltip
        .style('opacity', 1)
        .html(`<strong>Nombre de ventes:</strong> ${d.count}`)
        .style('left', left + 'px')
        .style('top', top + 'px')
    })
    .on('mouseout', function () {
      d3.select(this).attr('fill', 'rgba(59, 130, 246, 0.7)')
      tooltip.style('opacity', 0)
    })

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

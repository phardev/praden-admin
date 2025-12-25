<template>
  <div>
    <div ref="chartContainer" class="chart-container"></div>
  </div>
</template>

<script lang="ts" setup>
import { MonthlySales } from '@core/entities/dashboard'
import { formatCurrency } from '@utils/formatters'

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
  if (!chartContainer.value || !isMounted.value || props.data.length === 0) {
    return
  }

  const d3Module = await import('d3')
  const d3 = d3Module.default || d3Module

  d3.select(chartContainer.value).selectAll('*').remove()

  const margin = { top: 30, right: 50, bottom: 60, left: 70 }
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
    .domain([0, d3.max(sortedData.value, (d) => d.turnover) || 1000])
    .nice()
    .range([height, 0])

  svg
    .append('g')
    .attr('transform', `translate(0,${height})`)
    .call(d3.axisBottom(x))
    .selectAll('text')
    .style('text-anchor', 'middle')

  svg
    .append('g')
    .call(d3.axisLeft(y).tickFormat((d) => formatCurrency(d as number, false)))

  svg
    .append('text')
    .attr('text-anchor', 'middle')
    .attr('transform', 'rotate(-90)')
    .attr('y', -margin.left + 15)
    .attr('x', -height / 2)
    .text("Chiffre d'affaire")
    .attr('class', 'axis-label')

  const line = d3
    .line<MonthlySales>()
    .x((d) => (x(formatMonth(d.month)) || 0) + x.bandwidth() / 2)
    .y((d) => y(d.turnover))
    .curve(d3.curveMonotoneX)

  const area = d3
    .area<MonthlySales>()
    .x((d) => (x(formatMonth(d.month)) || 0) + x.bandwidth() / 2)
    .y0(height)
    .y1((d) => y(d.turnover))
    .curve(d3.curveMonotoneX)

  svg
    .append('path')
    .datum(sortedData.value)
    .attr('fill', 'rgba(16, 185, 129, 0.2)')
    .attr('d', area)

  svg
    .append('path')
    .datum(sortedData.value)
    .attr('fill', 'none')
    .attr('stroke', 'rgba(16, 185, 129, 1)')
    .attr('stroke-width', 2)
    .attr('d', line)

  svg
    .selectAll('circle')
    .data(sortedData.value)
    .enter()
    .append('circle')
    .attr('cx', (d) => (x(formatMonth(d.month)) || 0) + x.bandwidth() / 2)
    .attr('cy', (d) => y(d.turnover))
    .attr('r', 5)
    .attr('fill', 'rgba(16, 185, 129, 1)')
    .on('mouseover', function (event, d) {
      d3.select(this).attr('r', 7)

      const tooltipWidth = 200
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
        .html(
          `<strong>Chiffre d'affaire:</strong> ${formatCurrency(d.turnover)}`
        )
        .style('left', left + 'px')
        .style('top', top + 'px')
    })
    .on('mouseout', function () {
      d3.select(this).attr('r', 5)
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
  setTimeout(() => {
    createChart()
  }, 100)
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
  (newData) => {
    if (newData && newData.length > 0) {
      createChart()
    }
  },
  { deep: true, immediate: true }
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

<template>
  <div>
    <div ref="chartContainer" class="chart-container"></div>
  </div>
</template>

<script lang="ts" setup>
import type { MonthlySales } from '@core/entities/dashboard'
import { formatCurrency } from '@/src/utils/formatters'

const props = defineProps<{
  data: MonthlySales[]
  previousYearData?: MonthlySales[]
}>()

const isMounted = ref(false)
const chartContainer = ref<HTMLElement | null>(null)

const sortedData = computed(() => {
  return [...props.data].sort((a, b) => a.month.localeCompare(b.month))
})

const sortedPreviousYearData = computed(() => {
  if (!props.previousYearData) return []
  return [...props.previousYearData].sort((a, b) =>
    a.month.localeCompare(b.month)
  )
})

const hasPreviousYearData = computed(() => {
  return sortedPreviousYearData.value.length > 0
})

const extractMonthNumber = (month: string) => {
  return month.split('-')[1]
}

const extractYear = (month: string) => {
  return month.split('-')[0]
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

  const currentYear =
    sortedData.value.length > 0 ? extractYear(sortedData.value[0].month) : ''
  const previousYear =
    sortedPreviousYearData.value.length > 0
      ? extractYear(sortedPreviousYearData.value[0].month)
      : ''

  const allMonthNumbers = new Set<string>()
  sortedData.value.forEach((d) =>
    allMonthNumbers.add(extractMonthNumber(d.month))
  )
  sortedPreviousYearData.value.forEach((d) =>
    allMonthNumbers.add(extractMonthNumber(d.month))
  )
  const months = Array.from(allMonthNumbers).sort()

  const x = d3.scaleBand().domain(months).range([0, width]).padding(0.2)

  const allTurnovers = [
    ...sortedData.value.map((d) => d.turnover),
    ...sortedPreviousYearData.value.map((d) => d.turnover)
  ]

  const y = d3
    .scaleLinear()
    .domain([0, d3.max(allTurnovers) || 1000])
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

  if (hasPreviousYearData.value) {
    const previousYearMappedData = sortedPreviousYearData.value.map((d) => ({
      ...d,
      monthNumber: extractMonthNumber(d.month)
    }))

    const linePrev = d3
      .line<(typeof previousYearMappedData)[0]>()
      .x((d) => (x(d.monthNumber) || 0) + x.bandwidth() / 2)
      .y((d) => y(d.turnover))
      .curve(d3.curveMonotoneX)

    const areaPrev = d3
      .area<(typeof previousYearMappedData)[0]>()
      .x((d) => (x(d.monthNumber) || 0) + x.bandwidth() / 2)
      .y0(height)
      .y1((d) => y(d.turnover))
      .curve(d3.curveMonotoneX)

    svg
      .append('path')
      .datum(previousYearMappedData)
      .attr('fill', 'rgba(147, 51, 234, 0.2)')
      .attr('d', areaPrev)

    svg
      .append('path')
      .datum(previousYearMappedData)
      .attr('fill', 'none')
      .attr('stroke', 'rgba(147, 51, 234, 1)')
      .attr('stroke-width', 2)
      .attr('d', linePrev)

    svg
      .selectAll('.circle-prev')
      .data(previousYearMappedData)
      .enter()
      .append('circle')
      .attr('class', 'circle-prev')
      .attr('cx', (d) => (x(d.monthNumber) || 0) + x.bandwidth() / 2)
      .attr('cy', (d) => y(d.turnover))
      .attr('r', 5)
      .attr('fill', 'rgba(147, 51, 234, 1)')
      .on('mouseover', function (event, d) {
        d3.select(this).attr('r', 7)

        const tooltipWidth = 200
        const tooltipHeight = 50
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
            `<strong>${previousYear}</strong><br/>Chiffre d'affaire: ${formatCurrency(d.turnover)}`
          )
          .style('left', left + 'px')
          .style('top', top + 'px')
      })
      .on('mouseout', function () {
        d3.select(this).attr('r', 5)
        tooltip.style('opacity', 0)
      })
  }

  const currentYearMappedData = sortedData.value.map((d) => ({
    ...d,
    monthNumber: extractMonthNumber(d.month)
  }))

  const line = d3
    .line<(typeof currentYearMappedData)[0]>()
    .x((d) => (x(d.monthNumber) || 0) + x.bandwidth() / 2)
    .y((d) => y(d.turnover))
    .curve(d3.curveMonotoneX)

  const area = d3
    .area<(typeof currentYearMappedData)[0]>()
    .x((d) => (x(d.monthNumber) || 0) + x.bandwidth() / 2)
    .y0(height)
    .y1((d) => y(d.turnover))
    .curve(d3.curveMonotoneX)

  svg
    .append('path')
    .datum(currentYearMappedData)
    .attr('fill', 'rgba(16, 185, 129, 0.2)')
    .attr('d', area)

  svg
    .append('path')
    .datum(currentYearMappedData)
    .attr('fill', 'none')
    .attr('stroke', 'rgba(16, 185, 129, 1)')
    .attr('stroke-width', 2)
    .attr('d', line)

  svg
    .selectAll('.circle-current')
    .data(currentYearMappedData)
    .enter()
    .append('circle')
    .attr('class', 'circle-current')
    .attr('cx', (d) => (x(d.monthNumber) || 0) + x.bandwidth() / 2)
    .attr('cy', (d) => y(d.turnover))
    .attr('r', 5)
    .attr('fill', 'rgba(16, 185, 129, 1)')
    .on('mouseover', function (event, d) {
      d3.select(this).attr('r', 7)

      const tooltipWidth = 200
      const tooltipHeight = 50
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
          `<strong>${currentYear}</strong><br/>Chiffre d'affaire: ${formatCurrency(d.turnover)}`
        )
        .style('left', left + 'px')
        .style('top', top + 'px')
    })
    .on('mouseout', function () {
      d3.select(this).attr('r', 5)
      tooltip.style('opacity', 0)
    })

  if (hasPreviousYearData.value) {
    const legend = svg
      .append('g')
      .attr('class', 'legend')
      .attr('transform', `translate(${width - 100}, 0)`)

    legend
      .append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', 12)
      .attr('height', 12)
      .attr('fill', 'rgba(147, 51, 234, 0.7)')

    legend
      .append('text')
      .attr('x', 16)
      .attr('y', 10)
      .text(previousYear)
      .style('font-size', '11px')

    legend
      .append('rect')
      .attr('x', 0)
      .attr('y', 18)
      .attr('width', 12)
      .attr('height', 12)
      .attr('fill', 'rgba(16, 185, 129, 0.7)')

    legend
      .append('text')
      .attr('x', 16)
      .attr('y', 28)
      .text(currentYear)
      .style('font-size', '11px')
  }
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
  () => [props.data, props.previousYearData],
  (newData) => {
    if (newData && newData[0] && newData[0].length > 0) {
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

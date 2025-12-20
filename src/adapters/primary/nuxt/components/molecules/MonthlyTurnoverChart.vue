<template>
  <div>
    <div ref="chartContainer" class="chart-container"></div>
  </div>
</template>

<script lang="ts" setup>
import type { MonthlySales } from '@core/entities/dashboard'
import { formatCurrency } from '@utils/formatters'

const props = defineProps<{
  data: MonthlySales[]
  previousYearData?: MonthlySales[]
}>()

const isMounted = ref(false)
const chartContainer = ref<HTMLElement | null>(null)

const getMonthNumber = (month: string) => {
  return month.split('-')[1]
}

const sortedData = computed(() => {
  return [...props.data].sort((a, b) => a.month.localeCompare(b.month))
})

const sortedPreviousYearData = computed(() => {
  if (!props.previousYearData) return []
  return [...props.previousYearData].sort((a, b) =>
    a.month.localeCompare(b.month)
  )
})

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

  const hasPreviousYearData = sortedPreviousYearData.value.length > 0
  const months = sortedData.value.map((d) => getMonthNumber(d.month))

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

  const currentYear = sortedData.value[0]?.month.split('-')[0] || ''
  const previousYear =
    sortedPreviousYearData.value[0]?.month.split('-')[0] || ''

  if (hasPreviousYearData) {
    const previousYearMap = new Map(
      sortedPreviousYearData.value.map((d) => [getMonthNumber(d.month), d])
    )

    const previousYearDataAligned = sortedData.value.map((d) => {
      const monthNum = getMonthNumber(d.month)
      const prevData = previousYearMap.get(monthNum)
      return {
        month: monthNum,
        turnover: prevData?.turnover || 0
      }
    })

    const linePrevious = d3
      .line<{ month: string; turnover: number }>()
      .x((d) => (x(d.month) || 0) + x.bandwidth() / 2)
      .y((d) => y(d.turnover))
      .curve(d3.curveMonotoneX)

    const areaPrevious = d3
      .area<{ month: string; turnover: number }>()
      .x((d) => (x(d.month) || 0) + x.bandwidth() / 2)
      .y0(height)
      .y1((d) => y(d.turnover))
      .curve(d3.curveMonotoneX)

    svg
      .append('path')
      .datum(previousYearDataAligned)
      .attr('fill', 'rgba(147, 51, 234, 0.2)')
      .attr('d', areaPrevious)

    svg
      .append('path')
      .datum(previousYearDataAligned)
      .attr('fill', 'none')
      .attr('stroke', 'rgba(147, 51, 234, 1)')
      .attr('stroke-width', 2)
      .attr('d', linePrevious)

    svg
      .selectAll('.circle-previous')
      .data(previousYearDataAligned)
      .enter()
      .append('circle')
      .attr('class', 'circle-previous')
      .attr('cx', (d) => (x(d.month) || 0) + x.bandwidth() / 2)
      .attr('cy', (d) => y(d.turnover))
      .attr('r', 5)
      .attr('fill', 'rgba(147, 51, 234, 1)')
      .on('mouseover', function (event, d) {
        d3.select(this).attr('r', 7)
        tooltip
          .style('opacity', 1)
          .html(
            `<strong>${previousYear}:</strong> ${formatCurrency(d.turnover)}`
          )
          .style('left', event.pageX + 10 + 'px')
          .style('top', event.pageY - 20 + 'px')
      })
      .on('mouseout', function () {
        d3.select(this).attr('r', 5)
        tooltip.style('opacity', 0)
      })
  }

  const currentYearDataFormatted = sortedData.value.map((d) => ({
    month: getMonthNumber(d.month),
    turnover: d.turnover
  }))

  const line = d3
    .line<{ month: string; turnover: number }>()
    .x((d) => (x(d.month) || 0) + x.bandwidth() / 2)
    .y((d) => y(d.turnover))
    .curve(d3.curveMonotoneX)

  const area = d3
    .area<{ month: string; turnover: number }>()
    .x((d) => (x(d.month) || 0) + x.bandwidth() / 2)
    .y0(height)
    .y1((d) => y(d.turnover))
    .curve(d3.curveMonotoneX)

  svg
    .append('path')
    .datum(currentYearDataFormatted)
    .attr('fill', 'rgba(16, 185, 129, 0.2)')
    .attr('d', area)

  svg
    .append('path')
    .datum(currentYearDataFormatted)
    .attr('fill', 'none')
    .attr('stroke', 'rgba(16, 185, 129, 1)')
    .attr('stroke-width', 2)
    .attr('d', line)

  svg
    .selectAll('.circle-current')
    .data(currentYearDataFormatted)
    .enter()
    .append('circle')
    .attr('class', 'circle-current')
    .attr('cx', (d) => (x(d.month) || 0) + x.bandwidth() / 2)
    .attr('cy', (d) => y(d.turnover))
    .attr('r', 5)
    .attr('fill', 'rgba(16, 185, 129, 1)')
    .on('mouseover', function (event, d) {
      d3.select(this).attr('r', 7)
      tooltip
        .style('opacity', 1)
        .html(`<strong>${currentYear}:</strong> ${formatCurrency(d.turnover)}`)
        .style('left', event.pageX + 10 + 'px')
        .style('top', event.pageY - 20 + 'px')
    })
    .on('mouseout', function () {
      d3.select(this).attr('r', 5)
      tooltip.style('opacity', 0)
    })

  if (hasPreviousYearData) {
    const legend = svg
      .append('g')
      .attr('transform', `translate(${width - 150}, 0)`)

    legend
      .append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', 15)
      .attr('height', 15)
      .attr('fill', 'rgba(147, 51, 234, 0.7)')

    legend.append('text').attr('x', 20).attr('y', 12).text(previousYear)

    legend
      .append('rect')
      .attr('x', 0)
      .attr('y', 20)
      .attr('width', 15)
      .attr('height', 15)
      .attr('fill', 'rgba(16, 185, 129, 0.7)')

    legend.append('text').attr('x', 20).attr('y', 32).text(currentYear)
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
    if (newData && newData[0] && (newData[0] as MonthlySales[]).length > 0) {
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

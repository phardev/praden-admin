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
  nextYearData?: MonthlySales[]
}>()

const isMounted = ref(false)
const chartContainer = ref<HTMLElement | null>(null)

const sortedData = computed(() => {
  return [...props.data].sort((a, b) => a.month.localeCompare(b.month))
})

const sortedNextYearData = computed(() => {
  if (!props.nextYearData) return []
  return [...props.nextYearData].sort((a, b) => a.month.localeCompare(b.month))
})

const formatMonth = (month: string) => {
  const [, monthNum] = month.split('-')
  return monthNum
}

const extractYear = (data: MonthlySales[]) => {
  if (data.length === 0) return ''
  return data[0].month.split('-')[0]
}

const createChart = async () => {
  if (!chartContainer.value || !isMounted.value || props.data.length === 0) {
    return
  }

  const d3Module = await import('d3')
  const d3 = d3Module.default || d3Module

  d3.select(chartContainer.value).selectAll('*').remove()

  const margin = { top: 40, right: 50, bottom: 60, left: 70 }
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

  const hasNextYearData = sortedNextYearData.value.length > 0
  const currentYear = extractYear(sortedData.value)
  const nextYear = hasNextYearData ? extractYear(sortedNextYearData.value) : ''

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

  const currentYearMap = new Map(
    sortedData.value.map((d) => [formatMonth(d.month), d.turnover])
  )
  const nextYearMap = new Map(
    sortedNextYearData.value.map((d) => [formatMonth(d.month), d.turnover])
  )

  const x = d3.scaleBand().domain(months).range([0, width]).padding(0.2)

  const maxTurnover = Math.max(
    d3.max(sortedData.value, (d) => d.turnover) || 1000,
    hasNextYearData
      ? d3.max(sortedNextYearData.value, (d) => d.turnover) || 1000
      : 0
  )

  const y = d3.scaleLinear().domain([0, maxTurnover]).nice().range([height, 0])

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

  const currentYearDataForLine = months.map((month) => ({
    month,
    turnover: currentYearMap.get(month) || 0
  }))

  const nextYearDataForLine = months.map((month) => ({
    month,
    turnover: nextYearMap.get(month) || 0
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
    .datum(currentYearDataForLine)
    .attr('fill', 'rgba(16, 185, 129, 0.2)')
    .attr('d', area)

  svg
    .append('path')
    .datum(currentYearDataForLine)
    .attr('fill', 'none')
    .attr('stroke', 'rgba(16, 185, 129, 1)')
    .attr('stroke-width', 2)
    .attr('d', line)

  svg
    .selectAll('circle.current')
    .data(currentYearDataForLine)
    .enter()
    .append('circle')
    .attr('class', 'current')
    .attr('cx', (d) => (x(d.month) || 0) + x.bandwidth() / 2)
    .attr('cy', (d) => y(d.turnover))
    .attr('r', 5)
    .attr('fill', 'rgba(16, 185, 129, 1)')
    .on('mouseover', function (event, d) {
      d3.select(this).attr('r', 7)
      tooltip
        .style('opacity', 1)
        .html(
          `<strong>${currentYear}</strong><br>Chiffre d'affaire: ${formatCurrency(d.turnover)}`
        )
        .style('left', event.pageX + 10 + 'px')
        .style('top', event.pageY - 20 + 'px')
    })
    .on('mouseout', function () {
      d3.select(this).attr('r', 5)
      tooltip.style('opacity', 0)
    })

  if (hasNextYearData) {
    svg
      .append('path')
      .datum(nextYearDataForLine)
      .attr('fill', 'rgba(147, 51, 234, 0.1)')
      .attr('d', area)

    svg
      .append('path')
      .datum(nextYearDataForLine)
      .attr('fill', 'none')
      .attr('stroke', 'rgba(147, 51, 234, 1)')
      .attr('stroke-width', 2)
      .attr('d', line)

    svg
      .selectAll('circle.next')
      .data(nextYearDataForLine)
      .enter()
      .append('circle')
      .attr('class', 'next')
      .attr('cx', (d) => (x(d.month) || 0) + x.bandwidth() / 2)
      .attr('cy', (d) => y(d.turnover))
      .attr('r', 5)
      .attr('fill', 'rgba(147, 51, 234, 1)')
      .on('mouseover', function (event, d) {
        d3.select(this).attr('r', 7)
        tooltip
          .style('opacity', 1)
          .html(
            `<strong>${nextYear}</strong><br>Chiffre d'affaire: ${formatCurrency(d.turnover)}`
          )
          .style('left', event.pageX + 10 + 'px')
          .style('top', event.pageY - 20 + 'px')
      })
      .on('mouseout', function () {
        d3.select(this).attr('r', 5)
        tooltip.style('opacity', 0)
      })

    const legend = svg
      .append('g')
      .attr('transform', `translate(${width - 150}, -25)`)

    legend
      .append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', 15)
      .attr('height', 15)
      .attr('fill', 'rgba(16, 185, 129, 0.7)')

    legend
      .append('text')
      .attr('x', 20)
      .attr('y', 12)
      .text(currentYear)
      .style('font-size', '12px')

    legend
      .append('rect')
      .attr('x', 70)
      .attr('y', 0)
      .attr('width', 15)
      .attr('height', 15)
      .attr('fill', 'rgba(147, 51, 234, 0.7)')

    legend
      .append('text')
      .attr('x', 90)
      .attr('y', 12)
      .text(nextYear)
      .style('font-size', '12px')
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
  () => [props.data, props.nextYearData],
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

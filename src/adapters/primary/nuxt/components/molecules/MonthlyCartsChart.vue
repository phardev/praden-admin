<template lang="pug">
div
  div(ref="chartContainer" class="chart-container")
</template>

<script lang="ts" setup>
import type { MonthlyValueVM } from '@adapters/primary/view-models/dashboard/get-dashboard/getDashboardVM'

const props = defineProps<{
  data: MonthlyValueVM[]
  previousYearData?: MonthlyValueVM[]
  valueLabel: string
  unit?: string
}>()

const isMounted = ref(false)
const chartContainer = ref<HTMLElement | null>(null)

const MONTHS = [
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
const CURRENT_FILL = 'rgba(59, 130, 246, 0.7)'
const CURRENT_HOVER = 'rgba(59, 130, 246, 0.9)'
const PREVIOUS_FILL = 'rgba(251, 146, 60, 0.7)'
const PREVIOUS_HOVER = 'rgba(251, 146, 60, 0.9)'

const monthOf = (month: string) => month.split('-')[1]
const yearOf = (data: MonthlyValueVM[]) =>
  data.length === 0 ? '' : data[0].month.split('-')[0]

const sorted = (data: MonthlyValueVM[] = []) =>
  [...data].sort((a, b) => a.month.localeCompare(b.month))

const formatValue = (value: number) =>
  `${value.toLocaleString('fr-FR')}${props.unit ?? ''}`

const createChart = async () => {
  if (!chartContainer.value || !isMounted.value || props.data.length === 0)
    return

  const d3Module = await import('d3')
  const d3 = d3Module.default || d3Module

  d3.select(chartContainer.value).selectAll('*').remove()

  const margin = { top: 40, right: 30, bottom: 60, left: 60 }
  const containerHeight = chartContainer.value.clientHeight || 400
  const width = chartContainer.value.clientWidth - margin.left - margin.right
  const height = containerHeight - margin.top - margin.bottom

  const svg = d3
    .select(chartContainer.value)
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`)

  const current = sorted(props.data)
  const previous = sorted(props.previousYearData)
  const hasPrevious = previous.length > 0
  const currentYear = yearOf(current)
  const previousYear = yearOf(previous)
  const currentByMonth = new Map(
    current.map((d) => [monthOf(d.month), d.value])
  )
  const previousByMonth = new Map(
    previous.map((d) => [monthOf(d.month), d.value])
  )

  const x0 = d3.scaleBand().domain(MONTHS).range([0, width]).padding(0.2)
  const x1 = d3
    .scaleBand()
    .domain(hasPrevious ? ['current', 'previous'] : ['current'])
    .range([0, x0.bandwidth()])
    .padding(0.05)
  const maxValue = Math.max(
    d3.max(current, (d) => d.value) || 0,
    hasPrevious ? d3.max(previous, (d) => d.value) || 0 : 0
  )
  const y = d3.scaleLinear().domain([0, maxValue]).nice().range([height, 0])

  svg
    .append('g')
    .attr('transform', `translate(0,${height})`)
    .call(d3.axisBottom(x0))
  svg.append('g').call(d3.axisLeft(y))
  svg
    .append('text')
    .attr('text-anchor', 'middle')
    .attr('transform', 'rotate(-90)')
    .attr('y', -margin.left + 15)
    .attr('x', -height / 2)
    .text(props.valueLabel)
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

  const drawBar = (
    month: string,
    series: 'current' | 'previous',
    value: number,
    year: string,
    fill: string,
    hover: string
  ) => {
    svg
      .append('rect')
      .attr('x', (x0(month) || 0) + (x1(series) || 0))
      .attr('y', y(value))
      .attr('width', x1.bandwidth())
      .attr('height', height - y(value))
      .attr('fill', fill)
      .on('mouseover', function (event) {
        d3.select(this).attr('fill', hover)
        tooltip
          .style('opacity', 1)
          .html(
            `<strong>${year}</strong><br>${props.valueLabel}: ${formatValue(value)}`
          )
          .style('left', `${event.pageX + 10}px`)
          .style('top', `${event.pageY - 20}px`)
      })
      .on('mouseout', function () {
        d3.select(this).attr('fill', fill)
        tooltip.style('opacity', 0)
      })
  }

  MONTHS.forEach((month) => {
    drawBar(
      month,
      'current',
      currentByMonth.get(month) || 0,
      currentYear,
      CURRENT_FILL,
      CURRENT_HOVER
    )
    if (hasPrevious) {
      drawBar(
        month,
        'previous',
        previousByMonth.get(month) || 0,
        previousYear,
        PREVIOUS_FILL,
        PREVIOUS_HOVER
      )
    }
  })

  if (hasPrevious) {
    const legend = svg
      .append('g')
      .attr('transform', `translate(${width - 150}, -25)`)
    legend
      .append('rect')
      .attr('width', 15)
      .attr('height', 15)
      .attr('fill', CURRENT_FILL)
    legend
      .append('text')
      .attr('x', 20)
      .attr('y', 12)
      .text(currentYear)
      .style('font-size', '12px')
    legend
      .append('rect')
      .attr('x', 70)
      .attr('width', 15)
      .attr('height', 15)
      .attr('fill', PREVIOUS_FILL)
    legend
      .append('text')
      .attr('x', 90)
      .attr('y', 12)
      .text(previousYear)
      .style('font-size', '12px')
  }
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
  import('d3').then((d3Module) => {
    const d3 = d3Module.default || d3Module
    d3.selectAll('body > .tooltip').remove()
  })
})

watch(
  () => [props.data, props.previousYearData],
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
</style>

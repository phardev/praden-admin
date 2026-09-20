<template lang="pug">
div(role="img" :aria-label="ariaLabel")
  div(ref="chartContainer" class="chart-container")
</template>

<script lang="ts" setup>
import type { OperatorStatsChartPointVM } from '@adapters/primary/view-models/staff/operator-statistics/getOperatorStatisticsVM'

const props = defineProps<{
  points: Array<OperatorStatsChartPointVM>
  ariaLabel: string
  valueLabel: string
}>()

const isMounted = ref(false)
const chartContainer = ref<HTMLElement | null>(null)

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

const createChart = async () => {
  if (!chartContainer.value || !isMounted.value || props.points.length === 0)
    return

  const points: Array<OperatorStatsChartPointVM> = props.points
  const d3Module = await import('d3')
  const d3 = d3Module.default || d3Module

  d3.select(chartContainer.value).selectAll('*').remove()

  const margin = { top: 24, right: 24, bottom: 48, left: 56 }
  const containerHeight = chartContainer.value.clientHeight || 320
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
    .scalePoint<string>()
    .domain(points.map((point) => point.day))
    .range([0, width])

  const maxValue =
    d3.max(points, (point: OperatorStatsChartPointVM) => point.value) || 0
  const y = d3.scaleLinear().domain([0, maxValue]).nice().range([height, 0])

  const labelByDay = new Map<string, string>(
    points.map((point) => [point.day, point.label])
  )
  const tickCount = Math.min(points.length, 10)
  const tickStep = Math.ceil(points.length / tickCount)
  const ticks = points
    .filter((_point, index) => index % tickStep === 0)
    .map((point) => point.day)

  svg
    .append('g')
    .attr('transform', `translate(0,${height})`)
    .call(
      d3
        .axisBottom(x)
        .tickValues(ticks)
        .tickFormat((day: string) => labelByDay.get(day) || '')
    )
    .selectAll('text')
    .style('text-anchor', 'middle')

  svg.append('g').call(d3.axisLeft(y).ticks(5))

  const line = d3
    .line<OperatorStatsChartPointVM>()
    .x((point) => x(point.day) || 0)
    .y((point) => y(point.value))

  const path = svg
    .append('path')
    .datum(points)
    .attr('fill', 'none')
    .attr('stroke', 'rgba(37, 99, 235, 1)')
    .attr('stroke-width', 2)
    .attr('d', line)

  if (!prefersReducedMotion()) {
    const totalLength = (path.node() as SVGPathElement).getTotalLength()
    path
      .attr('stroke-dasharray', `${totalLength} ${totalLength}`)
      .attr('stroke-dashoffset', totalLength)
      .transition()
      .duration(300)
      .attr('stroke-dashoffset', 0)
  }

  const tooltip = d3
    .select('body')
    .append('div')
    .attr('class', 'operator-chart-tooltip')
    .style('position', 'absolute')
    .style('z-index', '100')
    .style('background', 'rgba(255, 255, 255, 0.95)')
    .style('padding', '8px')
    .style('border-radius', '4px')
    .style('box-shadow', '0 2px 5px rgba(0, 0, 0, 0.2)')
    .style('pointer-events', 'none')
    .style('opacity', 0)

  svg
    .selectAll<SVGCircleElement, OperatorStatsChartPointVM>('circle')
    .data(points)
    .enter()
    .append('circle')
    .attr('cx', (point) => x(point.day) || 0)
    .attr('cy', (point) => y(point.value))
    .attr('r', 4)
    .attr('fill', 'rgba(37, 99, 235, 1)')
    .on('mouseover', (event: MouseEvent, point: OperatorStatsChartPointVM) => {
      tooltip
        .style('opacity', 1)
        .html(
          `<strong>${point.label}</strong><br>${point.value} ${props.valueLabel}`
        )
        .style('left', `${event.pageX + 10}px`)
        .style('top', `${event.pageY - 20}px`)
    })
    .on('mouseout', () => {
      tooltip.style('opacity', 0)
    })
}

const handleResize = () => {
  createChart()
}

const removeTooltips = () => {
  if (typeof window === 'undefined') return
  import('d3').then((d3Module) => {
    const d3 = d3Module.default || d3Module
    d3.selectAll('body > .operator-chart-tooltip').remove()
  })
}

onMounted(() => {
  isMounted.value = true
  createChart()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  removeTooltips()
})

watch(
  () => props.points,
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
</style>

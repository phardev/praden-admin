<template lang="pug">
div
  div(ref="chartContainer" class="chart-container")
</template>

<script lang="ts" setup>
interface OrderByDeliveryMethod {
  deliveryMethodUuid: string
  deliveryMethodName: string
  count: number
}

const props = defineProps<{
  data: OrderByDeliveryMethod[]
}>()

const isMounted = ref(false)
const chartContainer = ref<HTMLElement | null>(null)

const createChart = async () => {
  if (!chartContainer.value || !isMounted.value || props.data.length === 0)
    return

  const d3Module = await import('d3')
  const d3 = d3Module.default || d3Module

  d3.select(chartContainer.value).selectAll('*').remove()

  const margin = { top: 30, right: 200, bottom: 30, left: 30 }
  let containerHeight = chartContainer.value.clientHeight
  if (containerHeight === 0) {
    containerHeight = 400
  }

  const width = chartContainer.value.clientWidth - margin.left - margin.right
  const height = containerHeight - margin.top - margin.bottom - 30
  const radius = Math.min(width, height) / 2.2

  const svg = d3
    .select(chartContainer.value)
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr(
      'transform',
      `translate(${width / 2 + margin.left},${height / 2 + margin.top})`
    )

  const baseColors = [
    '#4285F4', // Blue
    '#F4B400', // Yellow/Orange
    '#0F9D58', // Green
    '#DB4437', // Red
    '#AA46BB', // Purple
    '#00ACC1', // Cyan
    '#FF7043', // Deep Orange
    '#9E9E9E', // Grey
    '#3949AB', // Indigo
    '#8D6E63' // Brown
  ]

  const assignColorsToMethods = () => {
    const methodColors = new Map()

    if (props.data.length <= baseColors.length) {
      const sortedMethods = [...props.data].sort((a, b) =>
        a.deliveryMethodUuid.localeCompare(b.deliveryMethodUuid)
      )

      sortedMethods.forEach((method, index) => {
        methodColors.set(method.deliveryMethodUuid, baseColors[index])
      })
    } else {
      props.data.forEach((method) => {
        const hashCode = method.deliveryMethodUuid
          .split('')
          .reduce((hash, char) => {
            return ((hash << 5) - hash + char.charCodeAt(0)) | 0
          }, 0)

        const colorIndex = Math.abs(hashCode) % baseColors.length
        methodColors.set(method.deliveryMethodUuid, baseColors[colorIndex])
      })
    }

    return methodColors
  }

  const methodColorMap = assignColorsToMethods()

  const color = (methodName) => {
    const method = props.data.find((d) => d.deliveryMethodName === methodName)
    return method
      ? methodColorMap.get(method.deliveryMethodUuid)
      : baseColors[0]
  }

  const pie = d3
    .pie<OrderByDeliveryMethod>()
    .sort(null)
    .value((d) => d.count)

  const arc = d3.arc().innerRadius(0).outerRadius(radius)

  const arcs = svg
    .selectAll('.arc')
    .data(pie(props.data))
    .enter()
    .append('g')
    .attr('class', 'arc')

  arcs
    .append('path')
    .attr('d', arc as any)
    .attr('fill', (d) => color(d.data.deliveryMethodName))
    .attr('stroke', 'white')
    .style('stroke-width', '2px')
    .style('opacity', 0.8)
    .on('mouseover', function (event, d) {
      d3.select(this).style('opacity', 1)

      const tooltipWidth = 200
      const tooltipHeight = 60
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
          `
          <strong>${d.data.deliveryMethodName}</strong><br>
          Nombre de commandes: ${d.data.count}<br>
          Pourcentage: ${(
            (d.data.count /
              props.data.reduce((sum, item) => sum + item.count, 0)) *
            100
          ).toFixed(1)}%
        `
        )
        .style('left', left + 'px')
        .style('top', top + 'px')
    })
    .on('mouseout', function () {
      d3.select(this).style('opacity', 0.7)
      tooltip.style('opacity', 0)
    })

  const labelArc = d3
    .arc()
    .innerRadius(radius * 0.6)
    .outerRadius(radius * 0.8)

  arcs
    .append('text')
    .attr('transform', (d) => `translate(${labelArc.centroid(d as any)})`)
    .attr('dy', '.35em')
    .style('text-anchor', 'middle')
    .style('font-size', '12px')
    .style('fill', '#fff')
    .style('pointer-events', 'none')
    .text((d) => {
      const percent = (
        (d.data.count / props.data.reduce((sum, item) => sum + item.count, 0)) *
        100
      ).toFixed(0)
      return percent > 5 ? `${percent}%` : ''
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

  const legendRectSize = 12
  const legendVerticalSpacing = 20

  const legendGroup = svg
    .append('g')
    .attr('class', 'legend-group')
    .attr('transform', `translate(${radius + 20}, ${-radius})`)

  const legend = legendGroup
    .selectAll('.legend')
    .data(pie(props.data))
    .enter()
    .append('g')
    .attr('class', 'legend')
    .attr('transform', (d, i) => `translate(0, ${i * legendVerticalSpacing})`)

  legend
    .append('rect')
    .attr('width', legendRectSize)
    .attr('height', legendRectSize)
    .style('fill', (d) => color(d.data.deliveryMethodName))
    .style('stroke', (d) => color(d.data.deliveryMethodName))

  legend
    .append('text')
    .attr('x', legendRectSize + 8)
    .attr('y', legendRectSize / 2)
    .text((d) => d.data.deliveryMethodName)
    .style('font-size', '12px')
    .style('fill', '#333')
    .style('dominant-baseline', 'middle')
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

.tooltip {
  position: absolute;
  padding: 8px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  pointer-events: none;
  font-size: 12px;
}
</style>

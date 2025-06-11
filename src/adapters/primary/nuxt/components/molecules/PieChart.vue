<template>
  <div ref="chartContainer" class="w-full h-full"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onUnmounted } from 'vue'
import * as d3 from 'd3'

interface DataItem {
  id: string
  name: string
  count: number
}

interface PieChartConfig {
  idField: string
  nameField: string
  countField: string
  topCount?: number
  otherLabel?: string
  innerRadius?: number
}

const props = defineProps<{
  data: any[]
  config: PieChartConfig
}>()

const chartContainer = ref<HTMLElement | null>(null)
let resizeObserver: ResizeObserver | null = null

const createChart = () => {
  if (!chartContainer.value || !props.data || props.data.length === 0) return

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

  // Normalize data to our internal format
  const normalizeData = (): DataItem[] => {
    return props.data.map((item) => ({
      id: item[props.config.idField],
      name: item[props.config.nameField],
      count: item[props.config.countField]
    }))
  }

  // Process data - group smaller items if needed
  const processData = (data: DataItem[]): DataItem[] => {
    if (!props.config.topCount) return data

    const sortedData = [...data].sort((a, b) => b.count - a.count)
    const topItems = sortedData.slice(0, props.config.topCount)
    const otherItems = sortedData.slice(props.config.topCount)

    let result = [...topItems]

    if (otherItems.length > 0) {
      const otherCount = otherItems.reduce((sum, item) => sum + item.count, 0)
      result.push({
        id: 'others',
        name: props.config.otherLabel || 'Autres',
        count: otherCount
      })
    }

    return result
  }

  const normalizedData = normalizeData()
  const processedData = processData(normalizedData)

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
    '#8D6E63', // Brown
    '#607D8B' // Blue Grey (for "Others")
  ]

  const assignColorsToItems = () => {
    const itemColors = new Map()

    if (processedData.length <= baseColors.length) {
      const sortedItems = [...processedData].sort((a, b) =>
        a.id.localeCompare(b.id)
      )

      sortedItems.forEach((item, index) => {
        // Special color for "Others" category
        if (item.id === 'others') {
          itemColors.set(item.id, '#607D8B')
        } else {
          itemColors.set(item.id, baseColors[index])
        }
      })
    } else {
      processedData.forEach((item) => {
        if (item.id === 'others') {
          itemColors.set(item.id, '#607D8B')
          return
        }

        const hashCode = item.id.split('').reduce((hash, char) => {
          return ((hash << 5) - hash + char.charCodeAt(0)) | 0
        }, 0)

        const colorIndex = Math.abs(hashCode) % (baseColors.length - 1)
        itemColors.set(item.id, baseColors[colorIndex])
      })
    }

    return itemColors
  }

  const itemColorMap = assignColorsToItems()

  const color = (itemName: string) => {
    const item = processedData.find((d) => d.name === itemName)
    return item ? itemColorMap.get(item.id) : baseColors[0]
  }

  const pie = d3
    .pie<DataItem>()
    .sort(null)
    .value((d) => d.count)

  const innerRadiusValue = props.config.innerRadius
    ? radius * props.config.innerRadius
    : 0
  const arc = d3.arc().innerRadius(innerRadiusValue).outerRadius(radius)

  const arcs = svg
    .selectAll('.arc')
    .data(pie(processedData))
    .enter()
    .append('g')
    .attr('class', 'arc')

  arcs
    .append('path')
    .attr('d', arc as any)
    .attr('fill', (d) => color(d.data.name))
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
          <strong>${d.data.name}</strong><br>
          Nombre de commandes: ${d.data.count}<br>
          Pourcentage: ${(
            (d.data.count /
              processedData.reduce((sum, item) => sum + item.count, 0)) *
            100
          ).toFixed(1)}%
        `
        )
        .style('left', left + 'px')
        .style('top', top + 'px')
    })
    .on('mouseout', function () {
      d3.select(this).style('opacity', 0.8)
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
        (d.data.count /
          processedData.reduce((sum, item) => sum + item.count, 0)) *
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
    .data(pie(processedData))
    .enter()
    .append('g')
    .attr('class', 'legend')
    .attr('transform', (d, i) => `translate(0, ${i * legendVerticalSpacing})`)

  legend
    .append('rect')
    .attr('width', legendRectSize)
    .attr('height', legendRectSize)
    .style('fill', (d) => color(d.data.name))
    .style('stroke', (d) => color(d.data.name))

  legend
    .append('text')
    .attr('x', legendRectSize + 8)
    .attr('y', legendRectSize / 2)
    .text((d) => {
      const totalCount = processedData.reduce(
        (sum, item) => sum + item.count,
        0
      )
      const percentage = ((d.data.count / totalCount) * 100).toFixed(1)
      return `${d.data.name} (${percentage}%)`
    })
    .style('font-size', '12px')
    .style('fill', '#333')
    .style('dominant-baseline', 'middle')
}

onMounted(() => {
  createChart()

  resizeObserver = new ResizeObserver(() => {
    createChart()
  })

  if (chartContainer.value) {
    resizeObserver.observe(chartContainer.value)
  }
})

onUnmounted(() => {
  if (resizeObserver && chartContainer.value) {
    resizeObserver.unobserve(chartContainer.value)
  }
})

watch(() => props.data, createChart, { deep: true })
watch(() => props.config, createChart, { deep: true })
</script>

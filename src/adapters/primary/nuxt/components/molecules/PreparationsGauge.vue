<template lang="pug">
.preparations-gauge.flex.flex-col.items-center.w-full.max-w-xl.mx-auto
  .gauge-svg-wrapper.relative.flex.items-center.justify-center
    svg(:width="size" :height="size/1.3" :viewBox="`0 0 ${size} ${size/1.3}`" class="block select-none")
      path(:d="arcPath(startAngle, endAngle)" :stroke="arcBg" :stroke-width="arcWidth" fill="none")
      path(v-if="percentage > 0" :d="arcPath(startAngle, startAngle + valueAngle)" :stroke="arcColor" :stroke-width="arcWidth" fill="none" stroke-linecap="round")
    .gauge-smiley.absolute(:style="smileyStyle")
      icon(:name="smileyIcon" :style="{ color: smileyColor, width: smileySize + 'px', height: smileySize + 'px' }")
  .gauge-label.mt-2.text-lg.font-semibold(v-if="label") {{ label }}
  .gauge-stats.flex.items-center.justify-center.gap-6.mt-3
    .gauge-stat.flex.items-center.gap-2
      icon(name="streamline:smiley-emoji-terrified" class="text-red-500" style="width: 1.5em; height: 1.5em;")
      span.font-medium {{ $t('preparations.gauge.alert') }}
      span.font-bold {{ alertCount }}
    .gauge-stat.flex.items-center.gap-2
      icon(name="streamline:mail-smiley-straight-face-chat-message-indifferent-smiley-emoji-face-poker" class="text-yellow-500" style="width: 1.5em; height: 1.5em;")
      span.font-medium {{ $t('preparations.gauge.warning') }}
      span.font-bold {{ warningCount }}
    .gauge-stat.flex.items-center.gap-2
      icon(name="streamline:mail-smiley-happy-face-chat-message-smiley-smile-emoji-face-satisfied" class="text-green-500" style="width: 1.5em; height: 1.5em;")
      span.font-medium {{ $t('preparations.gauge.good') }}
      span.font-bold {{ goodCount }}
</template>

<script setup lang="ts">
const props = defineProps<{
  status: 'good' | 'warning' | 'alert'
  percentage: number
  goodCount: number
  warningCount: number
  alertCount: number
  label?: string
}>()

const { status, percentage, label, goodCount, warningCount, alertCount } =
  toRefs(props)

const reloadKey = ref(0)
watch([status, percentage, goodCount, warningCount, alertCount, label], () => {
  reloadKey.value++
})

const size = computed(() => 220)
const arcWidth = 22
const center = computed(() => size.value / 2)
const radius = computed(() => size.value / 2 - arcWidth)

const arcColor = computed(() => {
  const key = (status.value || '').toString().toLowerCase() as
    | 'good'
    | 'warning'
    | 'alert'
  return (
    {
      good: '#22c55e', // green
      warning: '#facc15', // yellow
      alert: '#ef4444' // red
    }[key] || '#22c55e'
  )
})
const arcBg = computed(() => '#e5e7eb')

function arcPath(startDeg: number, endDeg: number) {
  const r = radius.value
  const cx = center.value
  const cy = center.value
  const start = polarToCartesian(cx, cy, r, endDeg)
  const end = polarToCartesian(cx, cy, r, startDeg)
  const largeArc = endDeg - startDeg > 180 ? 1 : 0
  return ['M', start.x, start.y, 'A', r, r, 0, largeArc, 0, end.x, end.y].join(
    ' '
  )
}
function polarToCartesian(cx: number, cy: number, r: number, angle: number) {
  const a = ((angle - 90) * Math.PI) / 180
  return {
    x: cx + r * Math.cos(a),
    y: cy + r * Math.sin(a)
  }
}
const startAngle = -120
const endAngle = 120
const valueAngle = computed(() => {
  const pct =
    typeof percentage.value === 'number' && !isNaN(percentage.value)
      ? percentage.value
      : 0
  return (endAngle - startAngle) * Math.max(0, Math.min(1, pct / 100))
})

const smileyIcons = {
  good: 'streamline:mail-smiley-happy-face-chat-message-smiley-smile-emoji-face-satisfied',
  warning:
    'streamline:mail-smiley-straight-face-chat-message-indifferent-smiley-emoji-face-poker',
  alert: 'streamline:smiley-emoji-terrified'
}
const smileyIcon = computed(
  () => smileyIcons[status.value.toLowerCase() as 'good' | 'warning' | 'alert']
)
const smileyColor = computed(() => arcColor.value)
const smileySize = computed(() => size.value * 0.22)
const smileyStyle = computed(() => ({
  left: '50%',
  top: '56%',
  transform: 'translate(-50%, -50%)'
}))
</script>

<style scoped>
.gauge-svg-wrapper {
  width: 100%;
  max-width: 340px;
  min-width: 200px;
  height: auto;
}

.smiley-icon {
  pointer-events: none;
  z-index: 10;
}
</style>

<style scoped>
.gauge-svg-wrapper {
  width: 100%;
  max-width: 340px;
  min-width: 200px;
  height: auto;
}
</style>

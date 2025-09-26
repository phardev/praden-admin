/**
 * Generates a consistent color from a UUID string using a hash function
 * @param uuid - The UUID string to generate a color from
 * @returns A color string compatible with NuxtUI badge colors
 */
export function generateColorFromUuid(uuid: string): string {
  // Available NuxtUI badge colors that look good
  const colors = [
    'primary',
    'blue',
    'green',
    'yellow',
    'red',
    'purple',
    'pink',
    'orange'
  ]

  // Simple hash function for UUID
  let hash = 0
  for (let i = 0; i < uuid.length; i++) {
    const char = uuid.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32-bit integer
  }

  // Get absolute value and map to color array
  const colorIndex = Math.abs(hash) % colors.length
  return colors[colorIndex]
}

/**
 * Generates a more subtle color from a UUID string using a hash function
 * @param uuid - The UUID string to generate a color from
 * @returns A subtle color string compatible with NuxtUI badge colors
 */
export function generateSubtleColorFromUuid(uuid: string): string {
  // More subtle colors that work well with variant="soft"
  const colors = ['gray', 'blue', 'green', 'indigo']

  // Simple hash function for UUID
  let hash = 0
  for (let i = 0; i < uuid.length; i++) {
    const char = uuid.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32-bit integer
  }

  // Get absolute value and map to color array
  const colorIndex = Math.abs(hash) % colors.length
  return colors[colorIndex]
}

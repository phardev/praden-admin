# Vue TypeScript Import Rules

## Type-Only Imports in Vue Files

When importing TypeScript interfaces or types in Vue `<script setup>` blocks, always use `import type`:

```typescript
// ✅ Correct - use import type for interfaces/types
import type { MyInterface } from '@/path/to/types'

// ❌ Wrong - regular import will cause runtime module errors
import { MyInterface } from '@/path/to/types'
```

## Why This Matters

- Type-only imports are erased at compile-time
- Regular imports create runtime module dependencies
- Vue/Vite will throw errors like "does not provide an export named 'X'" if you don't use `import type`

## Example

```vue
<script setup lang="ts">
import { computed } from 'vue'
import MyComponent from './MyComponent.vue'
import type { MyInterface } from '@/types'  // Type-only import

const props = defineProps<{
  data: MyInterface
}>()
</script>
```

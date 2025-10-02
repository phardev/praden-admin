# Praden Admin - Project Architecture Guide

## 📋 Project Overview

**Purpose**: E-commerce administration platform for pharmacy operations  
**Domains**: Products, Categories, Promotions, Orders, Customers, Staff  
**Architecture**: Clean Architecture with Nuxt 3 + TypeScript  
**Testing**: TDD with Vitest (Given/When/Then pattern)

---

## 🏗️ Architecture Layers

This project follows **Clean Architecture** principles with strict separation of concerns across four main layers:

```
┌─────────────────────────────────────────────────────────┐
│                    VIEW LAYER                            │
│  Components (Nuxt/Vue) - Display only                   │
│  ↓ calls usecases                                        │
│  ↓ reads from ViewModels                                │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                 PRESENTATION LAYER                       │
│  ViewModels (src/adapters/primary/view-models/)         │
│  ↓ reads from Store (Pinia)                             │
│  ↓ formats data for UI                                  │
│  ✗ NEVER calls gateways                                 │
│  ✗ NEVER uses Nuxt utils                                │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                    CORE LAYER                            │
│  Usecases (src/core/usecases/)                          │
│  ↓ calls gateways                                        │
│  ↓ writes to Store (Pinia)                              │
│  ✗ NEVER returns values                                 │
│  ─────────────────────────────────────────              │
│  Entities (src/core/entities/) - interfaces only        │
│  Gateways (src/core/gateways/) - interfaces only        │
│  Types (src/core/types/)                                │
│  Errors (src/core/errors/)                              │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                INFRASTRUCTURE LAYER                      │
│  Gateway Implementations (src/adapters/secondary/)      │
│  ↓ HTTP clients, repositories                           │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                   STATE LAYER (CORE)                     │
│  Store (src/store/) - Pinia stores                      │
│  ✗ NEVER calls gateways                                 │
│  ✗ Only accessed by usecases (write) and VMs (read)    │
└─────────────────────────────────────────────────────────┘
```

---

## 🔄 Data Flow Rules

### **CRITICAL: The One-Way Data Flow**

```
Component → Usecase → Gateway → Usecase → Store
    ↓                                        ↑
ViewModel ←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←┘
```

### **1. Components (Vue/Nuxt Files)**

**Location**: `src/adapters/primary/nuxt/components/` and `src/adapters/primary/nuxt/pages/`

**Allowed**:
- Call usecases to trigger actions
- Read data from ViewModels
- Display data to users
- Handle user interactions
- Use Nuxt/Vue composables (useI18n, useRouter, etc.)

**Forbidden**:
- ❌ Direct store access (useProductStore, useCategoryStore, etc.)
- ❌ Direct gateway calls
- ❌ Business logic implementation
- ❌ Data transformation logic

**Example**:
```vue
<script lang="ts" setup>
import { createCategory } from '@core/usecases/categories/category-creation/createCategory'
import { categoryFormCreateVM } from '@adapters/primary/view-models/categories/category-form/categoryFormCreateVM'
import { useCategoryGateway } from '../../gateways/categoryGateway'

// ✅ Call usecase
const handleSubmit = async () => {
  const vm = categoryFormCreateVM('category-form')
  await createCategory(vm.getDto(), useCategoryGateway(), useProductGateway())
}

// ✅ Read from ViewModel
const categoriesVM = computed(() => getCategoriesVM())
</script>
```

---

### **2. Usecases**

**Location**: `src/core/usecases/[domain]/[action]/`

**Structure**: Factory function pattern
```typescript
export const usecaseName = async (
  params: UsecaseParams,
  gateway: GatewayInterface
): Promise<void> => {
  // Implementation
}
```

**Allowed**:
- Call gateways (via dependency injection)
- Write to Pinia stores
- Orchestrate business logic
- Handle errors
- Call other usecases if needed

**Forbidden**:
- ❌ Return values (use `Promise<void>`)
- ❌ Read from ViewModels
- ❌ Use Nuxt utils
- ❌ Direct component interaction

**Critical Rule**: **Usecases MUST write results to store, NEVER return values**

**Example**:
```typescript
// ✅ CORRECT
export const createCategory = async (
  dto: CreateCategoryDTO,
  categoryGateway: CategoryGateway,
  productGateway: ProductGateway
): Promise<void> => {
  const categoryStore = useCategoryStore()
  try {
    categoryStore.startLoading()
    const created = await categoryGateway.create(dto)
    categoryStore.add(created)  // ✅ Write to store
    // ... more logic
  } finally {
    categoryStore.stopLoading()
  }
}

// ❌ WRONG - Do NOT return values
export const createCategory = async (
  dto: CreateCategoryDTO,
  categoryGateway: CategoryGateway
): Promise<Category> => {  // ❌ WRONG: returns value
  return await categoryGateway.create(dto)  // ❌ WRONG
}
```

---

### **3. ViewModels (VMs)**

**Location**: `src/adapters/primary/view-models/[domain]/[context]/`

**Structure**: Factory function or class that returns formatted data
```typescript
export const getDataVM = (): DataVM => {
  const store = useDataStore()
  return {
    items: store.items.map(transformItem),
    isLoading: store.isLoading
  }
}
```

**Allowed**:
- Read from Pinia stores
- Transform/format data for views
- Compute derived values
- Apply presentation logic
- Use pure JavaScript/TypeScript utilities

**Forbidden**:
- ❌ Call gateways
- ❌ Call usecases
- ❌ Write to stores
- ❌ Use Nuxt utils (useI18n, useRouter, etc.)
- ❌ Access $t() or other Nuxt composables
- ❌ Side effects of any kind

**Critical Rule**: **ViewModels are READ-ONLY from store, formatting data for presentation**

**Example**:
```typescript
// ✅ CORRECT
export const getCategoriesVM = (): CategoriesVM => {
  const categoryStore = useCategoryStore()
  
  return {
    items: categoryStore.items.map(category => ({
      uuid: category.uuid,
      displayName: category.name.toUpperCase(),
      hasImage: !!category.image
    })),
    isLoading: categoryStore.isLoading,
    count: categoryStore.items.length
  }
}

// ❌ WRONG - Do NOT call gateways
export const getCategoriesVM = async (): Promise<CategoriesVM> => {
  const data = await categoryGateway.list()  // ❌ WRONG
  return { items: data }
}

// ❌ WRONG - Do NOT use Nuxt utils
export const getCategoriesVM = (): CategoriesVM => {
  const { t } = useI18n()  // ❌ WRONG: Nuxt composable
  return { title: t('categories.title') }
}
```

---

### **4. Stores (Pinia)**

**Location**: `src/store/`

**Structure**: Pinia store with state, getters, actions
```typescript
export const useDataStore = defineStore('DataStore', {
  state: () => ({ items: [], isLoading: false }),
  getters: { ... },
  actions: { ... }
})
```

**Allowed**:
- Hold application state
- Provide getters for data access
- Provide actions to mutate state
- Be called by usecases (write operations)
- Be called by ViewModels (read operations)

**Forbidden**:
- ❌ Call gateways
- ❌ Make HTTP requests
- ❌ Complex business logic

**Critical Rule**: **Store is part of the CORE and accessed without dependency injection**

**Example**:
```typescript
// ✅ CORRECT
export const useCategoryStore = defineStore('CategoryStore', {
  state: () => ({
    items: [] as Array<Category>,
    isLoading: false
  }),
  getters: {
    getByUuid: (state) => (uuid: string) => {
      return state.items.find(c => c.uuid === uuid)
    }
  },
  actions: {
    list(categories: Array<Category>) {
      this.items = categories
    },
    add(category: Category) {
      this.items.push(category)
    }
  }
})
```

---

### **5. Gateways**

**Location**: 
- Interfaces: `src/core/gateways/`
- Implementations: `src/adapters/secondary/`
- Nuxt composables: `gateways/` (root level)

**Interface Structure**:
```typescript
export interface CategoryGateway {
  list(): Promise<Array<Category>>
  create(dto: CreateCategoryDTO): Promise<Category>
  edit(uuid: UUID, dto: EditCategoryDTO): Promise<Category>
  getByUuid(uuid: UUID): Promise<Category>
}
```

**Rules**:
- Define interfaces in `src/core/gateways/`
- Implement in `src/adapters/secondary/`
- Inject via parameters in usecases
- Use Nuxt composables in root `gateways/` directory for DI

---

### **6. Entities**

**Location**: `src/core/entities/`

**Rules**:
- **ALWAYS use interfaces, NEVER classes**
- Represent domain objects
- No methods, pure data structures

**Example**:
```typescript
// ✅ CORRECT
export interface Category {
  uuid: UUID
  name: string
  description: string
  parentUuid?: UUID
  image?: string
  miniature?: string
}

// ❌ WRONG - Do NOT use classes
export class Category {  // ❌ WRONG
  constructor(public name: string) {}
  
  getName() { return this.name }  // ❌ WRONG
}
```

---

## 🧪 Testing Principles

### **Test Structure: Given/When/Then**

All tests follow the Given/When/Then pattern with strict rules:

**Rules**:
1. **NEVER use mocks** - always use `InMemoryRepositories` or `FakeRepositories`
2. **One `expect` per test** - use `toStrictEqual()` for full-value assertions
3. **No partial assertions** - avoid `toHaveLength()` or property checks
4. **One test file per usecase or ViewModel**
5. **Test only usecases and ViewModels** - NOT classes or utilities

**Example**:
```typescript
describe('Create category', () => {
  let categoryStore: any
  let categoryGateway: InMemoryCategoryGateway
  
  beforeEach(() => {
    setActivePinia(createPinia())
    categoryStore = useCategoryStore()
    categoryGateway = new InMemoryCategoryGateway(new FakeUuidGenerator())
  })
  
  describe('Root category', () => {
    const categoryDTO: CreateCategoryDTO = {
      name: 'Created',
      description: 'The description',
      productsAdded: []
    }
    const expectedCategory: Category = {
      name: 'Created',
      description: 'The description',
      uuid: 'new-uuid'
    }
    
    beforeEach(async () => {
      // GIVEN - setup
      await createCategory(categoryDTO, categoryGateway, productGateway)
    })
    
    // WHEN/THEN - one assertion per test
    it('should save the category in the store', () => {
      expect(categoryStore.items).toStrictEqual([expectedCategory])
    })
  })
})
```

---

## 📦 Dependency Injection Rules

### **Implicit vs Explicit Dependencies**

**CRITICAL**: Implicit dependencies (globals, auto-injected) are **FORBIDDEN** except for stores.

### **Allowed Implicit Dependencies**:
- ✅ Pinia Stores - part of the core, accessed directly

### **Required Explicit Dependencies**:
- ❌ Gateways - MUST be injected as parameters
- ❌ Services - MUST be injected as parameters
- ❌ Utilities with side effects - MUST be injected

**Example**:
```typescript
// ✅ CORRECT - Store is implicit (part of core)
export const createCategory = async (
  dto: CreateCategoryDTO,
  categoryGateway: CategoryGateway  // ✅ Explicit injection
): Promise<void> => {
  const store = useCategoryStore()  // ✅ Implicit - allowed
  const created = await categoryGateway.create(dto)
  store.add(created)
}

// ❌ WRONG - Gateway should be explicit
export const createCategory = async (
  dto: CreateCategoryDTO
): Promise<void> => {
  const gateway = useCategoryGateway()  // ❌ Implicit gateway
  const created = await gateway.create(dto)
}
```

---

## 📁 File Organization

```
praden-admin/
├── src/
│   ├── core/                        # Core business logic
│   │   ├── entities/                # Domain interfaces
│   │   ├── gateways/                # Gateway interfaces
│   │   ├── usecases/                # Business logic
│   │   │   └── [domain]/
│   │   │       └── [action]/
│   │   │           ├── action.ts
│   │   │           └── action.spec.ts
│   │   ├── types/                   # Shared types
│   │   └── errors/                  # Custom errors
│   │
│   ├── adapters/
│   │   ├── primary/                 # Input adapters
│   │   │   ├── nuxt/
│   │   │   │   ├── components/
│   │   │   │   └── pages/
│   │   │   └── view-models/
│   │   │       └── [domain]/
│   │   │           └── [context]/
│   │   │               ├── getDataVM.ts
│   │   │               └── getDataVM.spec.ts
│   │   │
│   │   └── secondary/               # Output adapters
│   │       └── [domain]-gateways/
│   │           ├── InMemoryGateway.ts
│   │           └── HttpGateway.ts
│   │
│   ├── store/                       # Pinia stores (CORE)
│   └── utils/                       # Utilities
│
├── gateways/                        # DI composables
├── i18n/                            # Translations
└── middleware/                      # Nuxt middleware
```

---

## 🎨 Code Style Rules

### **TypeScript**
- **Avoid `any` at all costs**
- Use interfaces for all entity definitions
- Prefer `type` for unions and utilities
- No semicolons
- No inline comments

### **Vue Components**
- Use **Pug templates** instead of HTML
- Follow `stylelint-config-recommended-vue`
- Use NuxtUI and TailwindCSS
- Components only handle display logic

### **Imports**
- Group imports at the top of file
- Order: external → core → adapters → utils
- Use path aliases (`@core`, `@adapters`, `@store`, `@utils`)

### **Testing**
- Use Vitest for all tests
- Follow Given/When/Then pattern
- One `expect` per test
- Use `toStrictEqual()` for assertions
- Never use mocks - use stubs/fakes

---

## 🚨 Common Anti-Patterns to Avoid

### ❌ **Component accessing store directly**
```typescript
// WRONG
const categoryStore = useCategoryStore()
const items = categoryStore.items
```
```typescript
// CORRECT
const categoriesVM = computed(() => getCategoriesVM())
const items = categoriesVM.value.items
```

### ❌ **Usecase returning a value**
```typescript
// WRONG
export const createCategory = async (dto: CreateCategoryDTO): Promise<Category> => {
  return await gateway.create(dto)
}
```
```typescript
// CORRECT
export const createCategory = async (
  dto: CreateCategoryDTO,
  gateway: CategoryGateway
): Promise<void> => {
  const store = useCategoryStore()
  const created = await gateway.create(dto)
  store.add(created)  // Write to store instead
}
```

### ❌ **ViewModel calling gateway**
```typescript
// WRONG
export const getCategoriesVM = async (): Promise<VM> => {
  const data = await categoryGateway.list()
  return { items: data }
}
```
```typescript
// CORRECT
export const getCategoriesVM = (): VM => {
  const store = useCategoryStore()
  return { items: store.items }
}
```

### ❌ **ViewModel using Nuxt utils**
```typescript
// WRONG
export const getCategoriesVM = (): VM => {
  const { t } = useI18n()
  return { title: t('categories.title') }
}
```
```typescript
// CORRECT - translation in component
const { t } = useI18n()
const title = t('categories.title')
const vm = getCategoriesVM()
```

### ❌ **Store calling gateway**
```typescript
// WRONG
export const useCategoryStore = defineStore('CategoryStore', {
  actions: {
    async fetchCategories() {
      const data = await categoryGateway.list()
      this.items = data
    }
  }
})
```
```typescript
// CORRECT - usecase orchestrates
export const listCategories = async (gateway: CategoryGateway): Promise<void> => {
  const store = useCategoryStore()
  const data = await gateway.list()
  store.list(data)
}
```

---

## 🔑 Key Takeaways

1. **Data flows in ONE direction**: Component → Usecase → Gateway → Store → ViewModel → Component
2. **Usecases write to store, NEVER return values**
3. **ViewModels read from store, NEVER call gateways or use Nuxt utils**
4. **Components call usecases and read from ViewModels, NEVER access store directly**
5. **Store is part of CORE** - can be accessed implicitly
6. **All other dependencies MUST be explicit** (injected)
7. **Test with Given/When/Then, one expect per test, no mocks**
8. **Entities are interfaces, never classes**

---

## 📚 Quick Reference

| Layer | Reads From | Writes To | Calls | Returns |
|-------|-----------|-----------|-------|---------|
| **Component** | ViewModel | - | Usecase | void |
| **ViewModel** | Store | - | - | Formatted Data |
| **Usecase** | Store (optional) | Store | Gateway | void (Promise<void>) |
| **Store** | - | Self | - | State/Getters |
| **Gateway** | - | - | External APIs | Data |

---

## 🎯 When in Doubt...

**Ask yourself**:
1. Am I returning a value from a usecase? → ❌ Write to store instead
2. Am I calling a gateway from a VM? → ❌ Read from store instead
3. Am I accessing store from a component? → ❌ Use ViewModel instead
4. Am I using useI18n in a VM? → ❌ Move translation to component
5. Am I using mocks in tests? → ❌ Use InMemory/Fake implementations
6. Is my entity a class? → ❌ Use interface instead

**The Golden Rule**: If it feels like you're breaking the flow, you probably are. Stop and reconsider the architecture.

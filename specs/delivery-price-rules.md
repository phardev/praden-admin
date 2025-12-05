# Delivery Price Rules - Implementation Plan

## Overview

Feature to manage custom pricing rules for delivery methods. Rules are conditional based on order value and weight, with time-based activation and priority ordering. All rules are displayed on a single dedicated page for easier priority management.

**API Base URL**: `/admin/delivery-price-rules`
**Authorization**: Requires DELIVERIES resource permission

## Data Model

```typescript
import type { Timestamp } from '@core/entities/timestamp'

interface DeliveryPriceRule {
  uuid: string
  deliveryMethodUuid: string
  name: string
  price: number                   // in cents (500 = 5.00€)
  minOrderValue: number           // in cents (0 = no minimum)
  maxWeight: number               // in grams
  priority: number                // Lower = evaluated first
  startDate: Timestamp | null     // Unix timestamp ms
  endDate: Timestamp | null       // Unix timestamp ms
  isActive: boolean
  createdAt: Timestamp
  createdBy: string
  updatedAt: Timestamp
  updatedBy: string
}

type CreateDeliveryPriceRuleDTO = Omit<DeliveryPriceRule, 'uuid' | 'createdAt' | 'createdBy' | 'updatedAt' | 'updatedBy'>
type EditDeliveryPriceRuleDTO = Partial<CreateDeliveryPriceRuleDTO>
```

## File Structure

```
src/core/
├── entities/
│   └── deliveryPriceRule.ts
├── gateways/
│   └── deliveryPriceRuleGateway.ts
└── usecases/
    └── delivery-price-rules/
        ├── list/
        │   ├── listDeliveryPriceRules.ts
        │   └── listDeliveryPriceRules.spec.ts
        ├── create/
        │   ├── createDeliveryPriceRule.ts
        │   └── createDeliveryPriceRule.spec.ts
        ├── edit/
        │   ├── editDeliveryPriceRule.ts
        │   └── editDeliveryPriceRule.spec.ts
        ├── get/
        │   ├── getDeliveryPriceRule.ts
        │   └── getDeliveryPriceRule.spec.ts
        └── delete/
            ├── deleteDeliveryPriceRule.ts
            └── deleteDeliveryPriceRule.spec.ts

src/adapters/
├── primary/
│   ├── view-models/
│   │   └── delivery-price-rules/
│   │       ├── deliveryPriceRuleListVM.ts
│   │       ├── deliveryPriceRuleListVM.spec.ts
│   │       ├── deliveryPriceRuleFormCreateVM.ts
│   │       ├── deliveryPriceRuleFormCreateVM.spec.ts
│   │       ├── deliveryPriceRuleFormEditVM.ts
│   │       └── deliveryPriceRuleFormEditVM.spec.ts
│   └── nuxt/
│       ├── pages/
│       │   └── delivery-price-rules/
│       │       ├── index.vue          # List all rules
│       │       ├── new.vue            # Create form
│       │       └── edit/[uuid].vue    # Edit form
│       └── components/
│           └── organisms/
│               └── DeliveryPriceRuleForm.vue
└── secondary/
    └── delivery-price-rule-gateways/
        ├── InMemoryDeliveryPriceRuleGateway.ts
        └── RealDeliveryPriceRuleGateway.ts

src/store/
└── deliveryPriceRuleStore.ts

src/utils/testData/
└── deliveryPriceRules.ts

gateways/
└── deliveryPriceRuleGateway.ts

locales/
└── fr-FR.json (update)
```

---

## Phase 1: Entity & Gateway Interface

### 1.1 Entity

**File**: `src/core/entities/deliveryPriceRule.ts`

```typescript
import type { Timestamp } from '@core/entities/timestamp'

export interface DeliveryPriceRule {
  uuid: string
  deliveryMethodUuid: string
  name: string
  price: number
  minOrderValue: number
  maxWeight: number
  priority: number
  startDate: Timestamp | null
  endDate: Timestamp | null
  isActive: boolean
  createdAt: Timestamp
  createdBy: string
  updatedAt: Timestamp
  updatedBy: string
}

export type CreateDeliveryPriceRuleDTO = Omit<
  DeliveryPriceRule,
  'uuid' | 'createdAt' | 'createdBy' | 'updatedAt' | 'updatedBy'
>

export type EditDeliveryPriceRuleDTO = Partial<CreateDeliveryPriceRuleDTO>
```

### 1.2 Gateway Interface

**File**: `src/core/gateways/deliveryPriceRuleGateway.ts`

```typescript
import type { CreateDeliveryPriceRuleDTO, DeliveryPriceRule, EditDeliveryPriceRuleDTO } from '@core/entities/deliveryPriceRule'

export interface DeliveryPriceRuleGateway {
  list(): Promise<DeliveryPriceRule[]>
  listByDeliveryMethod(deliveryMethodUuid: string): Promise<DeliveryPriceRule[]>
  getByUuid(uuid: string): Promise<DeliveryPriceRule>
  create(rule: CreateDeliveryPriceRuleDTO): Promise<DeliveryPriceRule>
  edit(uuid: string, rule: EditDeliveryPriceRuleDTO): Promise<DeliveryPriceRule>
  delete(uuid: string): Promise<void>
}
```

---

## Phase 2: Store

**File**: `src/store/deliveryPriceRuleStore.ts`

```typescript
import { defineStore } from 'pinia'
import type { DeliveryPriceRule } from '@core/entities/deliveryPriceRule'

export const useDeliveryPriceRuleStore = defineStore('deliveryPriceRule', {
  state: () => ({
    items: [] as DeliveryPriceRule[],
    current: null as DeliveryPriceRule | null,
    isLoading: false,
  }),

  getters: {
    getByUuid: (state) => (uuid: string) =>
      state.items.find(rule => rule.uuid === uuid),

    getByDeliveryMethodUuid: (state) => (deliveryMethodUuid: string) =>
      state.items.filter(rule => rule.deliveryMethodUuid === deliveryMethodUuid),
  },

  actions: {
    list(rules: DeliveryPriceRule[]) {
      this.items = rules
    },
    add(rule: DeliveryPriceRule) {
      this.items.push(rule)
    },
    edit(updatedRule: DeliveryPriceRule) {
      const index = this.items.findIndex(r => r.uuid === updatedRule.uuid)
      if (index !== -1) this.items[index] = updatedRule
    },
    remove(uuid: string) {
      this.items = this.items.filter(r => r.uuid !== uuid)
    },
    setCurrent(rule: DeliveryPriceRule | null) {
      this.current = rule
    },
    startLoading() {
      this.isLoading = true
    },
    stopLoading() {
      this.isLoading = false
    },
  },
})
```

---

## Phase 3: InMemory Gateway

**File**: `src/adapters/secondary/delivery-price-rule-gateways/InMemoryDeliveryPriceRuleGateway.ts`

```typescript
import type { CreateDeliveryPriceRuleDTO, DeliveryPriceRule, EditDeliveryPriceRuleDTO } from '@core/entities/deliveryPriceRule'
import type { DeliveryPriceRuleGateway } from '@core/gateways/deliveryPriceRuleGateway'
import type { UuidProvider } from '@core/gateways/uuidProvider'
import type { DateProvider } from '@core/gateways/dateProvider'

export class InMemoryDeliveryPriceRuleGateway implements DeliveryPriceRuleGateway {
  private rules: DeliveryPriceRule[] = []
  private currentUserUuid = 'test-user-uuid'

  constructor(
    private uuidProvider: UuidProvider,
    private dateProvider: DateProvider
  ) {}

  feedWith(rules: DeliveryPriceRule[]): void {
    this.rules = [...rules]
  }

  setCurrentUser(uuid: string): void {
    this.currentUserUuid = uuid
  }

  async list(): Promise<DeliveryPriceRule[]> {
    return [...this.rules].sort((a, b) => a.priority - b.priority)
  }

  async listByDeliveryMethod(deliveryMethodUuid: string): Promise<DeliveryPriceRule[]> {
    return this.rules
      .filter(rule => rule.deliveryMethodUuid === deliveryMethodUuid)
      .sort((a, b) => a.priority - b.priority)
  }

  async getByUuid(uuid: string): Promise<DeliveryPriceRule> {
    const rule = this.rules.find(r => r.uuid === uuid)
    if (!rule) throw new Error('Delivery price rule not found')
    return rule
  }

  async create(dto: CreateDeliveryPriceRuleDTO): Promise<DeliveryPriceRule> {
    const now = this.dateProvider.now()
    const rule: DeliveryPriceRule = {
      uuid: this.uuidProvider.generate(),
      ...dto,
      createdAt: now,
      createdBy: this.currentUserUuid,
      updatedAt: now,
      updatedBy: this.currentUserUuid,
    }
    this.rules.push(rule)
    return rule
  }

  async edit(uuid: string, dto: EditDeliveryPriceRuleDTO): Promise<DeliveryPriceRule> {
    const index = this.rules.findIndex(r => r.uuid === uuid)
    if (index === -1) throw new Error('Delivery price rule not found')

    const now = this.dateProvider.now()
    this.rules[index] = {
      ...this.rules[index],
      ...dto,
      updatedAt: now,
      updatedBy: this.currentUserUuid,
    }
    return this.rules[index]
  }

  async delete(uuid: string): Promise<void> {
    const index = this.rules.findIndex(r => r.uuid === uuid)
    if (index === -1) throw new Error('Delivery price rule not found')
    this.rules.splice(index, 1)
  }
}
```

---

## Phase 4: Usecases (TDD)

### 4.1 List Usecase

**File**: `src/core/usecases/delivery-price-rules/list/listDeliveryPriceRules.ts`

```typescript
import type { DeliveryPriceRuleGateway } from '@core/gateways/deliveryPriceRuleGateway'
import { useDeliveryPriceRuleStore } from '@store/deliveryPriceRuleStore'

export const listDeliveryPriceRules = async (
  gateway: DeliveryPriceRuleGateway
): Promise<void> => {
  const store = useDeliveryPriceRuleStore()
  store.startLoading()
  const rules = await gateway.list()
  store.list(rules)
  store.stopLoading()
}
```

**Test scenarios** (`listDeliveryPriceRules.spec.ts`):
- should set isLoading to true during fetch
- should load all delivery price rules sorted by priority into store
- should set isLoading to false after fetch completes

### 4.2 Create Usecase

**File**: `src/core/usecases/delivery-price-rules/create/createDeliveryPriceRule.ts`

```typescript
import type { CreateDeliveryPriceRuleDTO } from '@core/entities/deliveryPriceRule'
import type { DeliveryPriceRuleGateway } from '@core/gateways/deliveryPriceRuleGateway'
import { useDeliveryPriceRuleStore } from '@store/deliveryPriceRuleStore'

export const createDeliveryPriceRule = async (
  dto: CreateDeliveryPriceRuleDTO,
  gateway: DeliveryPriceRuleGateway
): Promise<void> => {
  const created = await gateway.create(dto)
  const store = useDeliveryPriceRuleStore()
  store.add(created)
}
```

**Test scenarios** (`createDeliveryPriceRule.spec.ts`):
- should create rule with all required fields
- should create rule with date range
- should create inactive rule

### 4.3 Get Usecase

**File**: `src/core/usecases/delivery-price-rules/get/getDeliveryPriceRule.ts`

```typescript
import type { DeliveryPriceRuleGateway } from '@core/gateways/deliveryPriceRuleGateway'
import { useDeliveryPriceRuleStore } from '@store/deliveryPriceRuleStore'

export const getDeliveryPriceRule = async (
  uuid: string,
  gateway: DeliveryPriceRuleGateway
): Promise<void> => {
  const rule = await gateway.getByUuid(uuid)
  const store = useDeliveryPriceRuleStore()
  store.setCurrent(rule)
}
```

**Test scenarios** (`getDeliveryPriceRule.spec.ts`):
- should set current rule in store
- should throw error if rule not found

### 4.4 Edit Usecase

**File**: `src/core/usecases/delivery-price-rules/edit/editDeliveryPriceRule.ts`

```typescript
import type { EditDeliveryPriceRuleDTO } from '@core/entities/deliveryPriceRule'
import type { DeliveryPriceRuleGateway } from '@core/gateways/deliveryPriceRuleGateway'
import { useDeliveryPriceRuleStore } from '@store/deliveryPriceRuleStore'

export const editDeliveryPriceRule = async (
  uuid: string,
  dto: EditDeliveryPriceRuleDTO,
  gateway: DeliveryPriceRuleGateway
): Promise<void> => {
  const updated = await gateway.edit(uuid, dto)
  const store = useDeliveryPriceRuleStore()
  store.edit(updated)
}
```

**Test scenarios** (`editDeliveryPriceRule.spec.ts`):
- should edit rule name
- should edit rule price
- should toggle isActive status
- should edit date range
- should update priority

### 4.5 Delete Usecase

**File**: `src/core/usecases/delivery-price-rules/delete/deleteDeliveryPriceRule.ts`

```typescript
import type { DeliveryPriceRuleGateway } from '@core/gateways/deliveryPriceRuleGateway'
import { useDeliveryPriceRuleStore } from '@store/deliveryPriceRuleStore'

export const deleteDeliveryPriceRule = async (
  uuid: string,
  gateway: DeliveryPriceRuleGateway
): Promise<void> => {
  await gateway.delete(uuid)
  const store = useDeliveryPriceRuleStore()
  store.remove(uuid)
}
```

**Test scenarios** (`deleteDeliveryPriceRule.spec.ts`):
- should remove rule from store
- should throw error if rule not found

---

## Phase 5: Real Gateway

**File**: `src/adapters/secondary/delivery-price-rule-gateways/RealDeliveryPriceRuleGateway.ts`

```typescript
import type { CreateDeliveryPriceRuleDTO, DeliveryPriceRule, EditDeliveryPriceRuleDTO } from '@core/entities/deliveryPriceRule'
import type { DeliveryPriceRuleGateway } from '@core/gateways/deliveryPriceRuleGateway'

export class RealDeliveryPriceRuleGateway implements DeliveryPriceRuleGateway {
  constructor(private baseUrl: string) {}

  async list(): Promise<DeliveryPriceRule[]> {
    const response = await fetch(`${this.baseUrl}/admin/delivery-price-rules`, {
      method: 'GET',
      credentials: 'include',
    })
    const data = await response.json()
    return data.items
  }

  async listByDeliveryMethod(deliveryMethodUuid: string): Promise<DeliveryPriceRule[]> {
    const response = await fetch(
      `${this.baseUrl}/admin/delivery-price-rules?deliveryMethodUuid=${deliveryMethodUuid}`,
      { method: 'GET', credentials: 'include' }
    )
    const data = await response.json()
    return data.items
  }

  async getByUuid(uuid: string): Promise<DeliveryPriceRule> {
    const response = await fetch(`${this.baseUrl}/admin/delivery-price-rules/${uuid}`, {
      method: 'GET',
      credentials: 'include',
    })
    const data = await response.json()
    return data.item
  }

  async create(rule: CreateDeliveryPriceRuleDTO): Promise<DeliveryPriceRule> {
    const response = await fetch(`${this.baseUrl}/admin/delivery-price-rules`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(rule),
    })
    const data = await response.json()
    return data.item
  }

  async edit(uuid: string, rule: EditDeliveryPriceRuleDTO): Promise<DeliveryPriceRule> {
    const response = await fetch(`${this.baseUrl}/admin/delivery-price-rules/${uuid}`, {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(rule),
    })
    const data = await response.json()
    return data.item
  }

  async delete(uuid: string): Promise<void> {
    await fetch(`${this.baseUrl}/admin/delivery-price-rules/${uuid}`, {
      method: 'DELETE',
      credentials: 'include',
    })
  }
}
```

**Gateway Factory** (`gateways/deliveryPriceRuleGateway.ts`):

```typescript
import { RealDeliveryPriceRuleGateway } from '@adapters/secondary/delivery-price-rule-gateways/RealDeliveryPriceRuleGateway'

export const useDeliveryPriceRuleGateway = () => {
  const config = useRuntimeConfig()
  return new RealDeliveryPriceRuleGateway(config.public.BACKEND_URL)
}
```

---

## Phase 6: View Models (TDD)

### 6.1 List VM

**File**: `src/adapters/primary/view-models/delivery-price-rules/deliveryPriceRuleListVM.ts`

Features:
- Format price in euros (cents → €)
- Format weight in kg (grams → kg)
- Format date range
- Show delivery method name
- Sort by priority
- Filter by delivery method (optional)

**Test scenarios** (`deliveryPriceRuleListVM.spec.ts`):
- should return empty array when no rules
- should format price in euros
- should format weight in kg
- should format date range when dates present
- should return '-' for date range when no dates
- should return rules sorted by priority
- should include delivery method name

### 6.2 Create Form VM

**File**: `src/adapters/primary/view-models/delivery-price-rules/deliveryPriceRuleFormCreateVM.ts`

Features:
- Initialize with defaults (price: 0, minOrderValue: 0, maxWeight: 30000, priority: 0, isActive: true)
- Convert user-friendly inputs (€ → cents, kg → grams)
- Validate required fields
- Build CreateDTO

**Test scenarios** (`deliveryPriceRuleFormCreateVM.spec.ts`):
- should initialize with default values
- should update each field
- should return DTO for creation
- should indicate form is valid when required fields filled
- should indicate form is invalid when name is empty

### 6.3 Edit Form VM

**File**: `src/adapters/primary/view-models/delivery-price-rules/deliveryPriceRuleFormEditVM.ts`

Features:
- Initialize from existing rule
- Track changed fields only
- Build EditDTO with only changed fields

**Test scenarios** (`deliveryPriceRuleFormEditVM.spec.ts`):
- should initialize with existing rule values
- should return DTO with only changed fields
- should return empty DTO when no changes
- should track hasChanges correctly

---

## Phase 7: Pages

### 7.1 List Page

**File**: `src/adapters/primary/nuxt/pages/delivery-price-rules/index.vue`

Features:
- Table showing all rules (sorted by priority)
- Columns: Priority, Name, Delivery Method, Price, Min Order, Max Weight, Date Range, Status, Actions
- Filter by delivery method (dropdown)
- Create button → navigates to /delivery-price-rules/new
- Edit button → navigates to /delivery-price-rules/edit/[uuid]
- Delete button with confirmation
- Badge for active/inactive status

### 7.2 Create Page

**File**: `src/adapters/primary/nuxt/pages/delivery-price-rules/new.vue`

Features:
- Form with all fields
- Delivery method selector (dropdown)
- Price input in € (converted to cents)
- Weight input in kg (converted to grams)
- Date pickers for start/end
- Toggle for isActive
- Cancel → back to list
- Submit → create and redirect to list

### 7.3 Edit Page

**File**: `src/adapters/primary/nuxt/pages/delivery-price-rules/edit/[uuid].vue`

Features:
- Load rule on mount
- Pre-fill form with existing values
- Same fields as create
- Cancel → back to list
- Submit → edit and redirect to list

---

## Phase 8: Test Data

**File**: `src/utils/testData/deliveryPriceRules.ts`

```typescript
import type { DeliveryPriceRule } from '@core/entities/deliveryPriceRule'

export const freeShippingOver39: DeliveryPriceRule = {
  uuid: 'rule-free-shipping',
  deliveryMethodUuid: 'delivery-colissimo',
  name: 'Livraison gratuite dès 39€',
  price: 0,
  minOrderValue: 3900,
  maxWeight: 30000,
  priority: 1,
  startDate: null,
  endDate: null,
  isActive: true,
  createdAt: 1701600000000,
  createdBy: 'admin@example.com',
  updatedAt: 1701600000000,
  updatedBy: 'admin@example.com',
}

export const standardShipping: DeliveryPriceRule = {
  uuid: 'rule-standard',
  deliveryMethodUuid: 'delivery-colissimo',
  name: 'Livraison standard',
  price: 590,
  minOrderValue: 0,
  maxWeight: 30000,
  priority: 10,
  startDate: null,
  endDate: null,
  isActive: true,
  createdAt: 1701600000000,
  createdBy: 'admin@example.com',
  updatedAt: 1701600000000,
  updatedBy: 'admin@example.com',
}

export const christmasFreeShipping: DeliveryPriceRule = {
  uuid: 'rule-christmas',
  deliveryMethodUuid: 'delivery-colissimo',
  name: 'Livraison gratuite Noël',
  price: 0,
  minOrderValue: 0,
  maxWeight: 30000,
  priority: 0,
  startDate: 1703116800000,
  endDate: 1703980800000,
  isActive: true,
  createdAt: 1701600000000,
  createdBy: 'admin@example.com',
  updatedAt: 1701600000000,
  updatedBy: 'admin@example.com',
}
```

---

## Phase 9: i18n Keys

**Add to** `locales/fr-FR.json`:

```json
{
  "deliveryPriceRules": {
    "title": "Règles de prix de livraison",
    "create": "Créer une règle",
    "edit": "Modifier la règle",
    "confirmDelete": "Êtes-vous sûr de vouloir supprimer cette règle ?",
    "noRules": "Aucune règle de prix configurée",
    "fields": {
      "name": "Nom de la règle",
      "deliveryMethod": "Mode de livraison",
      "price": "Prix",
      "minOrderValue": "Commande minimum",
      "maxWeight": "Poids maximum",
      "priority": "Priorité",
      "priorityHelp": "Plus le numéro est bas, plus la priorité est haute",
      "dateRange": "Période de validité",
      "startDate": "Date de début",
      "endDate": "Date de fin",
      "isActive": "Règle active"
    },
    "form": {
      "title": {
        "create": "Nouvelle règle de prix",
        "edit": "Modifier la règle"
      },
      "priceUnit": "€",
      "weightUnit": "kg"
    }
  }
}
```

---

## TDD Implementation Order

1. **Entity & Gateway Interface** (no tests needed - type definitions)
2. **Store** (no tests needed - tested via usecases)
3. **InMemory Gateway** (no tests needed - tested via usecases)
4. **List Usecase** (TDD)
   - Test: isLoading true during fetch → Implement
   - Test: load rules sorted by priority → Implement
   - Test: isLoading false after fetch → Implement
5. **Create Usecase** (TDD)
   - Test: create with required fields → Implement
   - Test: create with date range → Implement
   - Test: create inactive → Implement
6. **Get Usecase** (TDD)
   - Test: set current in store → Implement
   - Test: throw if not found → Implement
7. **Edit Usecase** (TDD)
   - Test: edit name → Implement
   - Test: edit price → Implement
   - Test: toggle isActive → Implement
   - Test: edit dates → Implement
   - Test: update priority → Implement
8. **Delete Usecase** (TDD)
   - Test: remove from store → Implement
   - Test: throw if not found → Implement
9. **Real Gateway** (infrastructure - no TDD)
10. **Gateway Factory** (infrastructure - no TDD)
11. **List VM** (TDD)
12. **Create Form VM** (TDD)
13. **Edit Form VM** (TDD)
14. **Test Data**
15. **Pages** (Vue components - no TDD)
16. **i18n keys**
17. **Navigation link** (add to sidebar/menu)

---

## Testing Commands

```bash
# Run specific usecase tests
TZ=UTC pnpm test run src/core/usecases/delivery-price-rules/

# Run specific VM tests
TZ=UTC pnpm test run src/adapters/primary/view-models/delivery-price-rules/

# Run all delivery price rules tests
TZ=UTC pnpm test run delivery-price-rules

# Run all tests
TZ=UTC pnpm test run
```

---

## Critical Rules

1. **TDD**: Write test first → Red → Minimal code → Green → Refactor
2. **One expect per test**: Never combine assertions
3. **No mocks**: Use InMemory gateways only
4. **Usecases never return values**: They update stores
5. **Use TZ=UTC**: Always prefix test commands
6. **Pug templates**: No HTML in Vue files
7. **i18n**: No raw text in templates
8. **toStrictEqual**: Compare full objects in tests


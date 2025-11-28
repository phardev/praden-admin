# 📋 Specification: Promotion Code Statistics

## 🎯 Goal
Display statistics for promotion codes on the details page:
- **Usage count**: Total number of times the code was used
- **Total sales**: Sum of all order totals (with tax) using this code
- **Amount lost**: Total discount given across all orders
- **Email usages**: List of customer emails with their usage count (e.g., "test@test.com: 10 uses")

## 📐 Architecture Analysis

**Current State:**
- ✅ PromotionCode entity exists
- ✅ PromotionCodeStore with actions: `list()`, `setCurrent()`, `create()`, `edit()`, `delete()`
- ✅ InMemoryPromotionCodeGateway with CRUD operations
- ✅ `getPromotionCode` usecase exists
- ✅ Promotion code details page at `/promotion-codes/get/[code].vue`
- ❌ Missing: PromotionCodeStats entity
- ❌ Missing: `getStats()` method in PromotionCodeGateway
- ❌ Missing: `getPromotionCodeStats` usecase
- ❌ Missing: Stats in PromotionCodeStore
- ❌ Missing: ViewModel for stats display
- ❌ Missing: UI for stats display

**Key Decision:**
Backend calculates all statistics (SQL aggregations). Frontend only displays raw data from API.
No complex order calculations in frontend.

## 🧪 TDD Implementation Steps

### **PHASE 1: Core Layer (Entity + Gateway Interface + Usecase)**

#### 1.1 Create entity: `src/core/entities/promotionCodeStats.ts`
```typescript
export interface PromotionCodeStatsEmailUsage {
  email: string
  usageCount: number
}

export interface PromotionCodeStats {
  usageCount: number           // Total uses
  totalSales: number           // Sum of order totals in cents
  totalDiscountGiven: number   // Amount "lost" in cents
  emailUsages: Array<PromotionCodeStatsEmailUsage>
}
```

#### 1.2 Update `src/core/gateways/promotionCodeGateway.ts`
Add to interface:
```typescript
getStats(code: string): Promise<PromotionCodeStats>
```

#### 1.3 Create test file: `src/core/usecases/promotion-codes/get-promotion-code-stats/getPromotionCodeStats.spec.ts`
**Test scenarios:**
- ✅ Load stats for a promotion code
- ✅ Save stats in store
- ✅ Verify loading states (start/stop)
- ✅ Handle promotion code with no usage (zero stats)
- ✅ Handle promotion code with multiple email usages
- ❌ One expect per test, use `toStrictEqual()` for full objects

#### 1.4 Create usecase: `src/core/usecases/promotion-codes/get-promotion-code-stats/getPromotionCodeStats.ts`
```typescript
export const getPromotionCodeStats = async (
  code: string,
  promotionCodeGateway: PromotionCodeGateway
): Promise<void> => {
  const promotionCodeStore = usePromotionCodeStore()
  promotionCodeStore.startLoading()
  const stats = await promotionCodeGateway.getStats(code)
  promotionCodeStore.setStats(stats)
  promotionCodeStore.stopLoading()
}
```

### **PHASE 2: Infrastructure Layer**

#### 2.1 Update `src/store/promotionCodeStore.ts`
Add to state:
```typescript
stats: undefined as PromotionCodeStats | undefined
```

Add action:
```typescript
setStats(stats: PromotionCodeStats) {
  this.stats = JSON.parse(JSON.stringify(stats))
}
```

#### 2.2 Update `src/adapters/secondary/promotion-code-gateways/InMemoryPromotionCodeGateway.ts`
Add property:
```typescript
private stats: Map<string, PromotionCodeStats> = new Map()
```

Implement method:
```typescript
async getStats(code: string): Promise<PromotionCodeStats> {
  const stats = this.stats.get(code)
  if (!stats) {
    return {
      usageCount: 0,
      totalSales: 0,
      totalDiscountGiven: 0,
      emailUsages: []
    }
  }
  return Promise.resolve(JSON.parse(JSON.stringify(stats)))
}
```

Add to `feedWith()` or create `feedStatsFor()`:
```typescript
feedStatsFor(code: string, stats: PromotionCodeStats) {
  this.stats.set(code, stats)
}
```

#### 2.3 Create test data in `src/utils/testData/promotionCodeStats.ts`
```typescript
export const tenEuroFixedPromotionCodeStats: PromotionCodeStats = {
  usageCount: 25,
  totalSales: 125000,  // 1250.00€
  totalDiscountGiven: 12500,  // 125.00€
  emailUsages: [
    { email: 'test@test.com', usageCount: 10 },
    { email: 'another@email.com', usageCount: 15 }
  ]
}

export const newSitePromotionCodeStats: PromotionCodeStats = {
  usageCount: 0,
  totalSales: 0,
  totalDiscountGiven: 0,
  emailUsages: []
}
```

### **PHASE 3: Presentation Layer (ViewModel)**

#### 3.1 Create test: `src/adapters/primary/view-models/promotion-codes/promotion-code-stats/promotionCodeStatsVM.spec.ts`
Test scenarios:
- ✅ Display usage count
- ✅ Format total sales in euros (cents → euros with 2 decimals)
- ✅ Format discount given in euros (cents → euros with 2 decimals)
- ✅ Display email usages list with counts
- ✅ Handle empty stats (no usages)
- ✅ Return Field structure for consistency

#### 3.2 Create `src/adapters/primary/view-models/promotion-codes/promotion-code-stats/promotionCodeStatsVM.ts`
```typescript
export class PromotionCodeStatsVM {
  private promotionCodeStore: any

  constructor() {
    this.promotionCodeStore = usePromotionCodeStore()
  }

  getUsageCount(): Field<number> {
    return {
      value: this.promotionCodeStore.stats?.usageCount ?? 0,
      canEdit: false
    }
  }

  getTotalSales(): Field<string> {
    const cents = this.promotionCodeStore.stats?.totalSales ?? 0
    return {
      value: (cents / 100).toFixed(2) + ' €',
      canEdit: false
    }
  }

  getTotalDiscountGiven(): Field<string> {
    const cents = this.promotionCodeStore.stats?.totalDiscountGiven ?? 0
    return {
      value: (cents / 100).toFixed(2) + ' €',
      canEdit: false
    }
  }

  getEmailUsages(): Field<Array<PromotionCodeStatsEmailUsage>> {
    return {
      value: this.promotionCodeStore.stats?.emailUsages ?? [],
      canEdit: false
    }
  }
}

export const promotionCodeStatsVM = (): PromotionCodeStatsVM => {
  return new PromotionCodeStatsVM()
}
```

### **PHASE 4: View Layer (UI Components)**

#### 4.1 Update `src/adapters/primary/nuxt/pages/promotion-codes/get/[code].vue`
Add on mount:
```typescript
await getPromotionCodeStats(code, usePromotionCodeGateway())
const statsVM = promotionCodeStatsVM()
```

Add to template:
```pug
.stats-section
  h2.text-subtitle {{ $t('promotionCode.stats.title') }}
  .stats-grid
    .stat-item
      span.label {{ $t('promotionCode.stats.usageCount') }}
      span.value {{ statsVM.getUsageCount().value }}
    .stat-item
      span.label {{ $t('promotionCode.stats.totalSales') }}
      span.value {{ statsVM.getTotalSales().value }}
    .stat-item
      span.label {{ $t('promotionCode.stats.totalDiscountGiven') }}
      span.value {{ statsVM.getTotalDiscountGiven().value }}

  .email-usages(v-if="statsVM.getEmailUsages().value.length > 0")
    h3 {{ $t('promotionCode.stats.emailUsages') }}
    ul
      li(v-for="usage in statsVM.getEmailUsages().value" :key="usage.email")
        | {{ usage.email }}: {{ usage.usageCount }}
```

#### 4.2 Add i18n keys in `i18n/fr.json`
```json
{
  "promotionCode": {
    "stats": {
      "title": "Statistiques",
      "usageCount": "Nombre d'utilisations",
      "totalSales": "Ventes totales",
      "totalDiscountGiven": "Montant de réduction",
      "emailUsages": "Utilisations par email"
    }
  }
}
```

### **PHASE 5: Integration & Testing**

#### 5.1 Run all tests
```bash
TZ=UTC pnpm test run src/core/usecases/promotion-codes/get-promotion-code-stats/
TZ=UTC pnpm test run src/adapters/primary/view-models/promotion-codes/promotion-code-stats/
```

#### 5.2 Manual testing checklist
- [ ] Stats display correctly for promotion code with usage
- [ ] Stats show zeros for unused promotion code
- [ ] Email list displays with correct counts
- [ ] Currency formatting is correct (2 decimals + €)
- [ ] Loading states work properly
- [ ] Stats update when navigating between promotion codes

## 🔄 TDD Workflow Per File

For EACH file:
1. **Write test** → RED
2. **Run test** → verify it fails
3. **Write minimal code** → GREEN
4. **Run test** → verify it passes
5. **Refactor if needed**
6. **Run test again** → still GREEN
7. **Next test**

## 📝 Key Constraints

- ✅ NO comments in code
- ✅ ONE expect per test
- ✅ Use `toStrictEqual()` for objects
- ✅ NO mocks (InMemory pattern)
- ✅ Usecases return `Promise<void>`
- ✅ ViewModels read-only from store
- ✅ Inject gateways explicitly
- ✅ Extract functions instead of comments
- ✅ Backend handles ALL calculations (no order processing in frontend)
- ✅ Use raw test data (no complex logic in InMemory gateway)

## 📂 Files to Create/Modify

**Create (6 files):**
1. `src/core/entities/promotionCodeStats.ts`
2. `src/core/usecases/promotion-codes/get-promotion-code-stats/getPromotionCodeStats.spec.ts`
3. `src/core/usecases/promotion-codes/get-promotion-code-stats/getPromotionCodeStats.ts`
4. `src/adapters/primary/view-models/promotion-codes/promotion-code-stats/promotionCodeStatsVM.spec.ts`
5. `src/adapters/primary/view-models/promotion-codes/promotion-code-stats/promotionCodeStatsVM.ts`
6. `src/utils/testData/promotionCodeStats.ts`

**Modify (4 files):**
7. `src/core/gateways/promotionCodeGateway.ts` (add getStats method)
8. `src/store/promotionCodeStore.ts` (add stats state + setStats action)
9. `src/adapters/secondary/promotion-code-gateways/InMemoryPromotionCodeGateway.ts` (implement getStats + feedStatsFor)
10. `src/adapters/primary/nuxt/pages/promotion-codes/get/[code].vue` (add stats display)
11. `i18n/fr.json` (add translation keys)

## 📋 Test Data Examples

```typescript
// Promotion code with usage
const usedPromotionCodeStats: PromotionCodeStats = {
  usageCount: 25,
  totalSales: 125000,  // 1250.00€
  totalDiscountGiven: 12500,  // 125.00€ lost
  emailUsages: [
    { email: 'test@test.com', usageCount: 10 },
    { email: 'another@email.com', usageCount: 8 },
    { email: 'third@email.com', usageCount: 7 }
  ]
}

// Unused promotion code
const unusedPromotionCodeStats: PromotionCodeStats = {
  usageCount: 0,
  totalSales: 0,
  totalDiscountGiven: 0,
  emailUsages: []
}
```

## 🎨 UI Design Notes

Stats should be displayed in a clean grid layout:
- **Usage Count**: Simple number
- **Total Sales**: Currency formatted (e.g., "1250.00 €")
- **Amount Lost**: Currency formatted (e.g., "125.00 €")
- **Email Usages**: List with format "email: X" (e.g., "test@test.com: 10")

## 🚀 Future Enhancement (Not in this spec)

Later, implement real gateway:
```typescript
// In RealPromotionCodeGateway.ts
async getStats(code: string): Promise<PromotionCodeStats> {
  const res = await axiosWithBearer.get(`${this.baseUrl}/promotion-codes/${code}/stats`)
  return res.data
}
```

Backend will handle SQL aggregations to calculate these stats efficiently.

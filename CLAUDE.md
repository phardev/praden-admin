  Architecture & Structure

  - Hexagonal Architecture with strict separation: Core (domain logic) → Adapters (UI/infrastructure) → Infrastructure (wiring)
  - Core never imports from adapters/infrastructure - dependency flow is inward only
  - Path aliases: @core/, @adapters/, @store/, @utils/
  - Stores (Pinia) are at root level /store/, not in /src/

  Core Domain Organization

  - Business Context: Pharmacy e-commerce admin with order preparation workflow
  - Usecases follow pattern: /core/usecases/{domain}/{operation}/ with co-located .spec.ts tests
  - Entities use pharmacy-specific codes: cip7, cip13, ean13
  - Gateway pattern abstracts all external dependencies (API, date, UUID, email)
  - Never use Date.now() - always inject DateProvider gateway

  Frontend Architecture (Nuxt 3 + Vue 3)

  - Atomic Design: components organized as atoms → molecules → organisms
  - View Model Pattern: All UI logic in view models (/adapters/primary/view-models/), not components
  - Template Language: Pug exclusively (no HTML)
  - i18n: NEVER put raw text in templates - always use $t('key')
  - Components are global (auto-imported, no manual imports)
  - Custom components prefixed with Ft (FtButton, FtInput, etc.)

  Testing Requirements (Vitest)

  - ONE EXPECT PER TEST (absolute rule) - compare full objects with toStrictEqual()
  - NO MOCKS - use InMemory gateway pattern exclusively
  - Always prefix test commands with TZ=UTC for consistency
  - Use existing test data from @utils/testData/ when possible
  - Co-locate tests: every usecase and VM has .spec.ts in same directory

  Testing
  - `TZ=UTC pnpm test run <test-suite>` - Run specific test file or directory
  - `TZ=UTC pnpm test run` - Run all tests once
  - ⚠️ DO NOT use `pnpm test-once` (command does not exist)
  - ⚠️ DO NOT use `pnpm test` (this is watching mode)

  Code Style & Development Workflow

  - Package Manager: pnpm only (never npm/yarn)
  - No Comments: Extract functions instead of commenting code
  - Linting: Zero warnings tolerance (--max-warnings 0)
  - No semicolons, single quotes, Unix line endings (LF)
  - TypeScript strict mode enabled - all type errors must be resolved
  - Git hooks enforce linting (pre-commit) and tests (pre-push)

  TDD Methodology

  - Write test → Run test (red) → Minimal code → Run test (green) → Refactor → Verify green
  - Never write all code then all tests - incremental implementation only
  - Never use expect.any() - always use specific values

  Critical Development Rules

  - Check similar code and follow project conventions before coding
  - Each usecase/VM must have associated test file
  - Use gateway factories at root for dependency injection
  - Forms use view models with get(field) / set(field, value) pattern
  - Field structure: { value: any, canEdit: boolean } for permission control
  - Never mutate stores directly from components - use usecases
- Add to memory "A usecase NEVER returns a value"
- Add to memory that we must import type in vue file

## Frontend Responsibilities

### Display Logic Only
- Frontend is for DISPLAY logic only, not business logic
- Business rules (validation, cascades, calculations) belong in backend
- Frontend should call ONE endpoint, not loop calling endpoints

### Anti-Patterns to Avoid
- DON'T loop over items and call API for each (N+1 calls)
- DON'T implement business rules in Vue components or usecases
- DON'T calculate derived data that backend should provide

### Correct Pattern
```typescript
// BAD: Frontend looping
for (const category of categories) {
  await api.disableCategory(category.id)
}

// GOOD: Single backend call with batch/cascade
await api.disableCategoryWithChildren(parentCategoryId)
```
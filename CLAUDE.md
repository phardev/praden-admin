# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

### Development
- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm generate` - Generate static site

### Testing
- `pnpm test` - Run tests with Vitest
- `pnpm coverage` - Run tests with coverage report
- Use `TZ=UTC` prefix for consistent timezone in tests

### Code Quality
- `pnpm lint` - ESLint with TypeScript and Vue support
- `pnpm stylelint` - CSS/Vue style linting
- Both linting tools are configured with zero warnings tolerance
- Never put comments in code

## Architecture Overview

### Hexagonal Architecture
This project follows a strict hexagonal (ports and adapters) architecture pattern:

**Core Domain** (`src/core/`):
- `entities/` - Business entities (Order, Product, Customer, etc.)
- `usecases/` - Business logic organized by domain and operation
- `gateways/` - Abstract interfaces for external dependencies
- `errors/` - Domain-specific error classes

**Adapters** (`src/adapters/`):
- `primary/` - Input adapters (Nuxt components, view models, composables)
- `secondary/` - Output adapters (API gateways, storage implementations)

**Infrastructure**:
- `gateways/` - Real API gateway implementations
- `store/` - Pinia stores for state management

### Frontend Architecture
- **Framework**: Nuxt 3 with Vue 3 Composition API
- **UI**: Custom component system with atomic design (atoms/molecules/organisms)
- **State Management**: Pinia stores
- **Styling**: TailwindCSS with custom design tokens
- **Authentication**: Keycloak integration
- **Testing**: Vitest with @vue/test-utils

### Component Organization
Components follow atomic design in `src/adapters/primary/nuxt/components/`:
- `atoms/` - Basic UI elements (FtButton, FtInput, etc.)
- `molecules/` - Composed components (tables, charts, modals)
- `organisms/` - Complex page sections (forms, lists, menus)

### View Models Pattern
Business logic is separated into view models (`src/adapters/primary/view-models/`) that:
- Transform domain entities for UI consumption
- Handle form state and validation
- Coordinate between stores and components
- Each feature has dedicated view models (e.g., `getOrdersVM`, `productFormCreateVM`)

### Domain Features
Key business domains include:
- **Orders & Preparations** - Order management and pharmacy preparation workflow
- **Products** - Catalog management with categories and stock
- **Customers** - Customer management and authentication
- **Deliveries** - Shipping and delivery tracking
- **Promotions** - Discount codes and promotional campaigns
- **Dashboard** - Analytics and reporting

### Path Aliases
- `@core/` → `src/core/`
- `@adapters/` → `src/adapters/`
- `@store/` → `src/store/`
- `@utils/` → `src/utils/`

### Environment Configuration
Runtime config via `nuxt.config.ts` includes:
- `BACKEND_URL` - API backend endpoint
- `KEYCLOAK_*` - Authentication configuration
- `SEND_EMAIL_URL` - Email service endpoint

### Single File Tests
Each usecase and view model has co-located `.spec.ts` test files following the same directory structure for easy navigation.

### Development Principles
- A usecase should always have its associated test file
- A view model should always have its associated test file

### Localization
- You should never put raw text in vue file, use i18n

## Development Best Practices
- Find if there is examples in similar files before changing code
- Never use Date.now, inject @gateways/dateProvider.ts instead
- Never use expect.any

- Add empty line at end of file

- Always ensure that tests still pass

- Use const arrow functions instead of function
- NEVER put multiple expect in one test

- Use existing test data if possible. Otherwise, create them to reflect real data

- For conditional tailwind classes, use component's class property
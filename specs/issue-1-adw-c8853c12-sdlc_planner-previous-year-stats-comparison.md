# Feature: Display stats for previous year

## Metadata
issue_number: `1`
adw_id: `c8853c12`
issue_json: `{"number":1,"title":"Display stats for previous year","body":"feature\nIn dashboard, we actually display graphs for current year\nWe are approaching next year and i want to display both stats current year and previous year to easily compare\nThe current data should keep the same colors. The next year will have a different one."}`

## Feature Description
Add previous year statistics comparison to the pharmacy e-commerce dashboard. The dashboard currently displays graphs for the current year only. As we approach the next year, users need to view both current year and previous year statistics side-by-side with different colors to easily compare performance trends. Current year data maintains existing colors while previous year data uses distinct colors for clear visual differentiation.

## User Story
As a pharmacy administrator
I want to view current year and previous year statistics side-by-side on the dashboard
So that I can easily compare performance trends between years and make informed business decisions

## Problem Statement
The dashboard currently only displays statistics for the current year. As the year transitions, users lose visibility into previous year data, making year-over-year performance comparison difficult. This limits the ability to track growth, identify trends, and make data-driven decisions about inventory, promotions, and business strategies.

## Solution Statement
Extend the dashboard to fetch and display both current year and previous year statistics. The API will be called twice with date ranges for each year. Charts will be modified to display two datasets: current year with existing colors and previous year with distinct colors. All monthly chart components (Sales, Turnover, Canceled Turnover, Delivery Price) will support dual-year display with clear visual differentiation through color-coding.

## Relevant Files
Use these files to implement the feature:

- `src/core/entities/dashboard.ts` - Contains the Dashboard entity with MonthlySales interface that will need to be extended or duplicated to support two years of data
- `src/core/gateways/dashboardGateway.ts` - Gateway interface for fetching dashboard data, no changes needed as it already supports date range filtering
- `src/store/statsStore.ts` - Pinia store that holds dashboard state, needs to be extended to store both current and previous year data
- `src/adapters/primary/view-models/dashboard/get-dashboard/getDashboardVM.ts` - View model that transforms dashboard data, needs to separate current year and previous year data
- `src/adapters/primary/view-models/dashboard/get-dashboard/getDashboardVM.spec.ts` - Tests for the dashboard view model
- `src/adapters/primary/nuxt/composables/useDashboardData.ts` - Composable that fetches dashboard data, needs to fetch both years of data
- `src/adapters/primary/nuxt/pages/dashboard/index.vue` - Main dashboard page, needs to display year selection/toggle and show comparison data
- `src/adapters/primary/nuxt/components/molecules/MonthlySalesChart.vue` - Bar chart for monthly sales, needs to display two datasets with different colors
- `src/adapters/primary/nuxt/components/molecules/MonthlyTurnoverChart.vue` - Line chart for monthly turnover, needs to display two lines with different colors
- `src/adapters/primary/nuxt/components/molecules/MonthlyCanceledTurnoverChart.vue` - Line chart for canceled turnover, needs to display two lines with different colors
- `src/adapters/primary/nuxt/components/molecules/MonthlyDeliveryPriceChart.vue` - Line chart for delivery price, needs to display two lines with different colors
- `i18n/locales/fr.json` - French translations for dashboard, needs new keys for previous year labels
- `src/core/usecases/dashboard/get-dashboard/getDashboard.ts` - Use case for fetching dashboard data, may need adjustment for dual-year fetching
- `src/core/usecases/dashboard/get-dashboard/inMemoryDashboardGateway.ts` - Test implementation for dashboard gateway

### New Files
None - This feature extends existing functionality without requiring new files

## Implementation Plan

### Phase 1: Foundation
Extend the store and view model to support storing and retrieving two separate years of data. Modify the statsStore to hold both currentYearDashboard and previousYearDashboard. Update the getDashboardVM to expose both datasets separately for consumption by chart components.

### Phase 2: Core Implementation
Modify the useDashboardData composable to fetch data for both years by making two API calls with appropriate date ranges. Update all monthly chart components (MonthlySalesChart, MonthlyTurnoverChart, MonthlyCanceledTurnoverChart, MonthlyDeliveryPriceChart) to accept and render two datasets with different colors using D3.js.

### Phase 3: Integration
Update the dashboard page to display the comparison data and add internationalization keys for previous year labels. Ensure all filters apply to both years consistently. Test the complete flow end-to-end with different filter combinations.

## Step by Step Tasks
IMPORTANT: Execute every step in order, top to bottom.

### 1. Extend Store to Support Two Years of Data

- Update `src/store/statsStore.ts` to store both current and previous year dashboard data
- Add `currentYearDashboard` and `previousYearDashboard` properties to state
- Add `setCurrentYearDashboard` and `setPreviousYearDashboard` actions
- Maintain backward compatibility by keeping existing `dashboard` property (can point to currentYearDashboard)

### 2. Write Tests for View Model with Two Years

- Update `src/adapters/primary/view-models/dashboard/get-dashboard/getDashboardVM.spec.ts`
- Write test: should return empty data when no current or previous year data exists
- Write test: should return current year data only when previous year is not available
- Write test: should return both current and previous year data when both exist
- Write test: should correctly convert prices from cents to currency units for both years

### 3. Update View Model to Expose Two Years

- Modify `src/adapters/primary/view-models/dashboard/get-dashboard/getDashboardVM.ts`
- Change return type to expose both `currentYear` and `previousYear` monthly sales
- Update DashboardVM interface to include `currentYearMonthlySales` and `previousYearMonthlySales`
- Transform both datasets with price conversions from cents
- Run tests: `TZ=UTC pnpm test run getDashboardVM.spec.ts`

### 4. Write Tests for Dual-Year Data Fetching

- Update `src/core/usecases/dashboard/get-dashboard/getDashboard.ts` or create new test file
- Write test: should fetch current year data with correct date range (Jan 1 to Dec 31 of current year)
- Write test: should fetch previous year data with correct date range (Jan 1 to Dec 31 of previous year)
- Write test: should handle timezone correctly for both years
- Run tests: `TZ=UTC pnpm test run getDashboard.spec.ts`

### 5. Update Composable to Fetch Two Years

- Modify `src/adapters/primary/nuxt/composables/useDashboardData.ts`
- Add logic to determine current year and previous year date ranges
- Make two parallel API calls: one for current year, one for previous year
- Store results using `setCurrentYearDashboard` and `setPreviousYearDashboard`
- Handle loading states correctly for both requests
- Use `Promise.all` to fetch both years in parallel for performance

### 6. Add i18n Keys for Previous Year

- Update `i18n/locales/fr.json` in the dashboard section
- Add keys: `previousYear`, `currentYear`, `comparison`, `yearOverYear`
- Add color legend keys: `currentYearData`, `previousYearData`

### 7. Write Tests for MonthlySalesChart with Two Datasets

- Create test file for MonthlySalesChart if it doesn't exist
- Write test: should render single dataset when only current year provided
- Write test: should render two bar groups when both years provided
- Write test: should use correct colors for current year (existing blue) and previous year (new color)
- Write test: should handle empty previous year data gracefully

### 8. Update MonthlySalesChart Component

- Modify `src/adapters/primary/nuxt/components/molecules/MonthlySalesChart.vue`
- Accept two data props: `currentYearData` and `previousYearData`
- Update D3 chart to render grouped bars: current year in blue (rgba(59, 130, 246)), previous year in gray (rgba(156, 163, 175))
- Add legend to chart showing color coding
- Update tooltip to show year information
- Adjust x-axis to accommodate grouped bars
- Run tests to verify chart rendering

### 9. Update MonthlyTurnoverChart Component

- Modify `src/adapters/primary/nuxt/components/molecules/MonthlyTurnoverChart.vue`
- Accept two data props: `currentYearData` and `previousYearData`
- Render two lines: current year in green (rgba(16, 185, 129)) as existing, previous year in blue-gray (rgba(100, 116, 139))
- Add legend showing both years
- Update tooltip to differentiate between years
- Ensure both lines and areas are visible with appropriate opacity

### 10. Update MonthlyCanceledTurnoverChart Component

- Modify `src/adapters/primary/nuxt/components/molecules/MonthlyCanceledTurnoverChart.vue`
- Accept two data props: `currentYearData` and `previousYearData`
- Render two lines: current year in red (rgba(239, 68, 68)) as existing, previous year in orange (rgba(251, 146, 60))
- Add legend showing both years
- Update tooltip to differentiate between years

### 11. Update MonthlyDeliveryPriceChart Component

- Modify `src/adapters/primary/nuxt/components/molecules/MonthlyDeliveryPriceChart.vue`
- Accept two data props: `currentYearData` and `previousYearData`
- Render two lines: current year in indigo (rgba(79, 70, 229)) as existing, previous year in purple (rgba(168, 85, 247))
- Add legend showing both years
- Update tooltip to differentiate between years

### 12. Update Dashboard Page with Two Years Data

- Modify `src/adapters/primary/nuxt/pages/dashboard/index.vue`
- Update chart component calls to pass both `currentYearData` and `previousYearData`
- Add visual indicator showing data for two years (e.g., header with current/previous year labels)
- Ensure filters apply to both years consistently
- Update loading states to wait for both years to load

### 13. Run All Tests and Validation

- Execute validation commands listed below to ensure zero regressions
- Fix any failing tests
- Verify all TypeScript compilation errors are resolved
- Ensure all charts display correctly with both years of data

## Testing Strategy

### Unit Tests

- **Store Tests**: Verify that statsStore correctly stores and retrieves current and previous year data independently
- **View Model Tests**: Ensure getDashboardVM correctly transforms and exposes both years of data with proper price conversions
- **Use Case Tests**: Verify getDashboard use case correctly orchestrates fetching data for both years with accurate date ranges
- **Chart Component Tests**: Test each chart component renders correctly with single year data (backward compatibility) and dual year data

### Edge Cases

- No previous year data available (first year of operation) - should display only current year
- No current year data available - should display only previous year if available
- Empty months in dataset (no sales in certain months) - charts should handle gaps gracefully
- Filters applied - both years should respect the same filter settings
- Timezone handling - ensure date ranges for both years use correct timezone boundaries
- Leap year handling - ensure February data is displayed correctly for leap years vs non-leap years
- Mid-year deployment - system should handle partial year data for current year
- Very different scales between years - charts should use appropriate y-axis scaling
- Browser resize - both datasets should re-render correctly on window resize

## Acceptance Criteria

- Dashboard displays monthly statistics for both current year and previous year side-by-side
- Current year data maintains existing colors (blue for sales, green for turnover, red for canceled, indigo for delivery)
- Previous year data uses distinct colors that are easily distinguishable (gray, blue-gray, orange, purple)
- All four monthly chart components (Sales, Turnover, Canceled Turnover, Delivery Price) support dual-year display
- Charts include legend clearly identifying current year vs previous year data
- Tooltips show which year the data point represents
- Date range filters apply consistently to both years (if filtering by category/laboratory, both years respect those filters)
- Performance is acceptable - fetching two years of data does not significantly slow down the dashboard
- Empty previous year data (e.g., first year of operation) is handled gracefully - only current year is shown
- All existing tests pass with zero regressions
- New tests achieve 100% coverage of new functionality
- TypeScript compilation succeeds with zero errors
- Internationalization keys are added for French language support

## Validation Commands
Execute every command to validate the feature works correctly with zero regressions.

- `TZ=UTC pnpm test run src/store/statsStore` - Verify store tests pass
- `TZ=UTC pnpm test run getDashboardVM.spec.ts` - Verify view model tests pass
- `TZ=UTC pnpm test run getDashboard` - Verify use case tests pass
- `TZ=UTC pnpm test run` - Run all tests to validate feature works with zero regressions
- `pnpm lint --max-warnings 0` - Verify zero linting warnings
- `pnpm build` - Run build to validate no compilation errors
- Manual testing: Navigate to `/dashboard` and verify both current and previous year data display correctly in all charts
- Manual testing: Apply various filters (category, laboratory, date range) and verify both years update accordingly
- Manual testing: Resize browser window and verify charts re-render correctly for both years

## Notes

### Color Scheme Design

The color scheme follows accessibility principles with high contrast ratios:
- **Current Year** (maintains existing colors for consistency):
  - Sales: Blue `rgba(59, 130, 246)` - Primary data visualization color
  - Turnover: Green `rgba(16, 185, 129)` - Represents positive revenue
  - Canceled: Red `rgba(239, 68, 68)` - Represents negative/loss
  - Delivery: Indigo `rgba(79, 70, 229)` - Distinct from other metrics

- **Previous Year** (new colors, visually related but distinct):
  - Sales: Gray `rgba(156, 163, 175)` - Neutral, less prominent than current
  - Turnover: Blue-Gray `rgba(100, 116, 139)` - Cooler than current green
  - Canceled: Orange `rgba(251, 146, 60)` - Related to red but distinct
  - Delivery: Purple `rgba(168, 85, 247)` - Related to indigo but distinct

### API Considerations

The existing DashboardParams already supports `startDate` and `endDate` filtering, so no backend changes are required. The implementation will:
1. Calculate current year range: Jan 1 YYYY to Dec 31 YYYY
2. Calculate previous year range: Jan 1 (YYYY-1) to Dec 31 (YYYY-1)
3. Make two API calls with these ranges
4. Merge results in the view model for chart consumption

### Performance Optimization

Fetching two years of data doubles the API load. Optimizations:
- Use `Promise.all` to fetch both years in parallel
- Consider caching previous year data since it won't change
- Monitor API response times and optimize backend queries if needed
- Consider lazy-loading previous year data (load current year first, then previous year)

### Future Enhancements

Potential improvements for future iterations:
- Add year selector dropdown to compare any two years (not just current vs previous)
- Add percentage change indicators between years
- Add toggle to show/hide previous year data
- Add export functionality for year-over-year comparison reports
- Add quarterly and semi-annual comparison views
- Add benchmark lines showing targets or industry averages

# Kakeibo Monorepo Migration - Detailed TODO

> **Status**: 🔄 In Progress - Phase 3B  
> **Last Updated**: December 20, 2024  
> **Goal**: Migrate all features from `kakeibo` to `kakeibo-v2` monorepo with proper separation of concerns
> 
> ⚠️ **IMPORTANT**: Update this file after EVERY completed task:
> 1. Mark the checkbox as [x]
> 2. Update the progress count (e.g., 0/9 → 1/9)
> 3. Update the "Last Updated" date above
> 4. See [INSTRUCTIONS.md](./INSTRUCTIONS.md) for detailed workflow

---

## 📊 Progress Overview

### **Shared Code (Platform-Agnostic)**

- [x] Phase 1: Core Foundation - `packages/core/` (35/35) ✅
- [x] Phase 2: Business Logic Services - `packages/core/src/services/` (8/8) ✅

### **Web Platform Only** 🌐
- [x] Phase 3A: Web Database - `apps/web/src/services/db/` (6/6) ✅
- [ ] Phase 3B: Web UI Components - `apps/web/src/components/` (15/24)
- [ ] Phase 3C: Web Pages & Features - `apps/web/src/pages/` (0/13)

### **Native Platform Only** 📱
- [ ] Phase 4A: Native Database - `apps/native/src/services/db/` (0/6)
- [ ] Phase 4B: Native UI Components - `apps/native/src/components/` (0/14)
- [ ] Phase 4C: Native Screens & Features - `apps/native/src/screens/` (0/11)

### **Quality & Deployment** ✅
- [ ] Phase 5: Testing & Quality Assurance (0/15)
- [ ] Phase 6: Documentation & CI/CD (0/9)

**Total Tasks**: 51/141 completed

---

## ✅ Feature Parity Checklist (Kakeibo v1)

### **Core Data Models**
- [ ] Transaction types: `expense`, `income`, `transfer`, `goal-contribution`, `goal-withdrawal`
- [ ] Categories: 24 expense + 8 income default categories
- [ ] Subcategories support (optional)
- [ ] Multi-category budgets
- [ ] Account types: bank, credit, cash, investment, wallet
- [ ] Goal types: savings, debt
- [ ] User settings with all preferences

### **Transaction Features**
- [ ] Add/Edit/Delete transactions
- [ ] Category and subcategory selection
- [ ] Account selection
- [ ] Date picker with native input
- [ ] Transfer between accounts (with `toAccountId`)
- [ ] Tags support (array of strings)
- [ ] "Essential" checkbox (needs vs wants tracking)
- [ ] Transaction description
- [ ] Amount with proper +/- handling
- [ ] Location tracking (optional - exists but unused in v1)
- [ ] Receipt attachment (optional - exists but unused in v1)
- [ ] Recurring transactions (optional - partially implemented in v1)
- [ ] Automatic account balance updates on add/edit/delete

### **Budget Features**
- [ ] Multi-category budgets (select multiple categories per budget)
- [ ] Budget periods: weekly, monthly, yearly
- [ ] Alert thresholds: configurable (default: 50%, 80%, 100%)
- [ ] Rollover unused amounts to next period
- [ ] Budget progress calculation
- [ ] Projected spending based on daily average
- [ ] Days remaining in period
- [ ] Active/inactive state toggle
- [ ] Budget name (user-defined)
- [ ] Start date and optional end date
- [ ] Cached `spent` field for performance

### **Goal Features**
- [ ] Goal types: savings and debt
- [ ] Target amount and current amount
- [ ] Optional deadline
- [ ] Optional linked account
- [ ] Color and icon customization
- [ ] Goal status: active, completed, cancelled
- [ ] Contribution modal
- [ ] Withdrawal support
- [ ] Progress percentage calculation
- [ ] Days until deadline
- [ ] Required monthly contribution calculation
- [ ] On-track status indicator

### **Dashboard Features**
- [ ] Hero balance card (credit card style)
- [ ] Account picker dropdown (All Accounts + individual accounts)
- [ ] Balance visibility toggle (eye icon)
- [ ] Monthly stats cards: Income, Expenses, Savings, Savings Rate
- [ ] Recent transactions (last 5)
- [ ] Top spending categories (top 4 with progress bars)
- [ ] Budgets at risk (≥70% spent)
- [ ] Active goals display (top 2)
- [ ] Quick action buttons (Add Income/Expense/Transfer)
- [ ] Financial month calculations (custom start day support)

### **Analytics Page Features**
- [ ] Spending by category chart (pie/bar)
- [ ] Income vs expense trends
- [ ] Monthly comparisons
- [ ] Budget utilization visualization
- [ ] Time period filters
- [ ] Category filtering
- [ ] Charts using Recharts library

### **Accounts Page Features**
- [ ] Account list with balances
- [ ] Account type badges
- [ ] Add/Edit/Delete accounts
- [ ] Account color and icon customization
- [ ] Active/inactive account toggle
- [ ] Net worth calculation (assets - liabilities)
- [ ] Account stats (total assets, total liabilities)

### **Transactions Page Features**
- [ ] Transaction list (reverse chronological)
- [ ] Transaction cards with category icons
- [ ] Filter by type (expense/income/transfer)
- [ ] Filter by category
- [ ] Filter by account
- [ ] Filter by date range
- [ ] Search by description
- [ ] Edit transaction (opens modal with pre-filled data)
- [ ] Delete transaction (with confirmation modal)
- [ ] 3-dot menu on each card

### **Budgets Page Features**
- [ ] Budget cards with progress bars
- [ ] Multi-category icon display
- [ ] Alert indicators (warning/danger states)
- [ ] Add/Edit/Delete budgets
- [ ] Budget status toggle (active/inactive)
- [ ] Days remaining display
- [ ] Projected spending display
- [ ] Budget at-risk highlighting

### **Goals Page Features**
- [ ] Goal cards with progress bars
- [ ] Goal status badges
- [ ] Add/Edit/Delete goals
- [ ] Contribute to goal modal
- [ ] Withdraw from goal
- [ ] Progress percentage
- [ ] Remaining amount
- [ ] Days until deadline
- [ ] Required monthly contribution
- [ ] On-track indicator
- [ ] Complete/Cancel goal actions

### **Settings Page Features**
- [ ] Currency selection (USD, EUR, GBP, JPY, INR, etc.)
- [ ] Theme toggle (light/dark/system)
- [ ] Date format selection
- [ ] Language selection
- [ ] Financial month start day (1-31)
- [ ] Notification preferences:
  - [ ] Budget alerts
  - [ ] Bill reminders
  - [ ] Weekly reports
  - [ ] Unusual spending alerts
- [ ] Export data (JSON backup)
- [ ] Import data (JSON restore)
- [ ] Clear all data option
- [ ] About/version info

### **Welcome Page Features**
- [ ] First-time user onboarding
- [ ] App introduction
- [ ] Feature highlights
- [ ] Get started button
- [ ] Set `hasSeenWelcome` flag in localStorage
- [ ] Redirect logic on dashboard

### **Authentication Features**
- [ ] Guest mode by default (no sign-in required)
- [ ] OAuth providers:
  - [ ] Google Sign-In (implemented)
  - [ ] Apple Sign-In (planned - provider exists)
  - [ ] GitHub Sign-In (planned - provider exists)
- [ ] Guest to authenticated data migration
- [ ] Store guest ID before OAuth redirect
- [ ] Auto-migrate data after sign-in
- [ ] User profile display (avatar, name, email)
- [ ] Sign out with option to keep local data
- [ ] Session persistence
- [ ] Supabase integration

### **Data Management Features**
- [ ] IndexedDB database (Dexie) for web
- [ ] SQLite database (OP-SQLite) for native
- [ ] Export entire database to JSON
- [ ] Import database from JSON
- [ ] User ID remapping on import
- [ ] Category ID normalization (backward compatibility)
- [ ] Backup includes settings
- [ ] Restore settings from backup
- [ ] Clear database function
- [ ] Database migrations support

### **UI Components (Web)**
- [ ] Button (8 variants: primary, secondary, danger, success, warning, ghost, outline, link)
- [ ] Input (with error states)
- [ ] Modal (with animations, escape/overlay close)
- [ ] Select (Radix UI based)
- [ ] Card component
- [ ] Badge component
- [ ] Checkbox (Radix UI based)
- [ ] ProgressBar
- [ ] CategoryIcon (70+ Lucide icons)
- [ ] CategorySelect
- [ ] TieredCategorySelect
- [ ] MultiCategorySelect (for budgets)
- [ ] SubcategorySelect
- [ ] Toast notifications
- [ ] AppShell layout
- [ ] Navbar (desktop)
- [ ] Sidebar (desktop, collapsible)
- [ ] BottomNav (mobile)
- [ ] FloatingActionButton (mobile)

### **UI Components (Native)**
- [ ] Button (React Native Pressable with same variants)
- [ ] Input (TextInput wrapper)
- [ ] Modal (React Native Modal with animations)
- [ ] Card component
- [ ] Badge component
- [ ] Checkbox
- [ ] ProgressBar
- [ ] CategoryIcon (React Native compatible)
- [ ] Select (Picker or bottom sheet)
- [ ] Tab Navigator (bottom tabs)
- [ ] Stack Navigator

### **Styling & Design System**
- [ ] Tailwind v4 configuration
- [ ] Custom color palette:
  - [ ] Primary: #5B6EF5 (purple-blue)
  - [ ] Success: #10b981 (emerald)
  - [ ] Danger: #f43f5e (rose)
  - [ ] Warning: #f59e0b (amber)
  - [ ] Surface: dark greys (50-950)
- [ ] Custom fonts:
  - [ ] Sans: "Plus Jakarta Sans"
  - [ ] Mono: "JetBrains Mono" (for amounts)
- [ ] Squircle design (iOS-style rounded corners)
- [ ] Glass morphism effects
- [ ] Gradient backgrounds
- [ ] Dark theme (default)
- [ ] Mobile-first responsive design
- [ ] Safe area handling
- [ ] Custom scrollbar styles

### **PWA Features (Web Only)**
- [ ] Service worker with workbox
- [ ] App manifest (icons, theme, shortcuts)
- [ ] Install prompt
- [ ] Update notification
- [ ] Offline functionality
- [ ] Cache strategies for assets
- [ ] App shortcuts (Quick add transaction)
- [ ] Maskable icons support

### **Native-Specific Features**
- [ ] Biometric authentication (Face ID/Touch ID)
- [ ] Secure storage (Keychain/Keystore)
- [ ] Local notifications (budget alerts)
- [ ] Push notifications (planned)
- [ ] Native navigation (React Navigation)
- [ ] Splash screen
- [ ] App icons for iOS/Android
- [ ] Deep linking support

### **Performance Features**
- [ ] Lazy loading for routes
- [ ] Memoization for expensive calculations
- [ ] Virtual scrolling for long lists (optional)
- [ ] IndexedDB compound indexes
- [ ] SQLite indexes for queries
- [ ] Debounced search inputs
- [ ] Optimistic UI updates

### **Developer Experience**
- [ ] TypeScript strict mode
- [ ] Biome linting
- [ ] Prettier formatting
- [ ] Lefthook git hooks
- [ ] Commitlint
- [ ] Changesets for versioning
- [ ] Turbo for monorepo builds
- [ ] Hot reload (Vite for web, Metro for native)

### **Testing**
- [ ] Unit tests for utilities
- [ ] Unit tests for calculations
- [ ] Integration tests for database adapters
- [ ] Component tests (Testing Library)
- [ ] E2E tests (Playwright for web)
- [ ] Test coverage ≥80% for core package

---

## 🔧 SHARED CODE - Platform-Agnostic

> ⚠️ **IMPORTANT**: Code in `packages/core/` must work on BOTH web and native
> - No browser-specific APIs (no `window`, `document`, `localStorage`)
> - No React Native-specific APIs
> - Only pure TypeScript/JavaScript
> - Use interfaces and types that both platforms can implement

---

## 🎯 Phase 1: Core Foundation Setup
**Location**: `packages/core/`
**Purpose**: Platform-agnostic types, utilities, and constants

### 1.1 Type System Migration (9/9) ✅

- [x] Copy `src/types/account.ts` → `packages/core/src/types/account.ts`
- [x] Copy `src/types/transaction.ts` → `packages/core/src/types/transaction.ts`
- [x] Copy `src/types/category.ts` → `packages/core/src/types/category.ts`
- [x] Copy `src/types/budget.ts` → `packages/core/src/types/budget.ts`
- [x] Copy `src/types/goal.ts` → `packages/core/src/types/goal.ts`
- [x] Copy `src/types/user.ts` → `packages/core/src/types/user.ts`
- [x] Copy `src/types/auth.ts` → `packages/core/src/types/auth.ts` (removed Supabase dependency)
- [x] Copy `src/types/subcategory.ts` → `packages/core/src/types/subcategory.ts`
- [x] Create `packages/core/src/types/index.ts` barrel export

### 1.2 Constants & Defaults (5/5) ✅
- [x] Create `packages/core/src/constants/categories.ts`
  - [x] Export `defaultExpenseCategories` (24 categories)
  - [x] Export `defaultIncomeCategories` (8 categories)
- [x] Create `packages/core/src/constants/currencies.ts`
  - [x] Currency symbols mapping
  - [x] Currency codes list
- [x] Create `packages/core/src/constants/defaults.ts`
  - [x] `defaultUserSettings`
  - [x] `DEFAULT_ALERT_THRESHOLDS`
  - [x] Default colors, icons
- [x] Create `packages/core/src/constants/icons.ts`
  - [x] Icon name mappings (70+ icons)
- [x] Create `packages/core/src/constants/index.ts` barrel export

### 1.3 Validation Schemas (6/6) ✅

- [x] Create `packages/core/src/schemas/transaction.schema.ts`
  - [x] `createTransactionSchema`
  - [x] `updateTransactionSchema`
  - [x] `transactionFiltersSchema`
- [x] Create `packages/core/src/schemas/budget.schema.ts`
  - [x] `createBudgetSchema`
  - [x] `updateBudgetSchema`
- [x] Create `packages/core/src/schemas/account.schema.ts`
- [x] Create `packages/core/src/schemas/goal.schema.ts`
- [x] Create `packages/core/src/schemas/category.schema.ts`
- [x] Create `packages/core/src/schemas/index.ts` barrel export

### 1.4 Utility Functions (10/10) ✅

- [x] Copy & adapt `src/utils/date.ts` → `packages/core/src/utils/date.ts`
  - [x] `financialMonthStartDate()`
  - [x] `financialMonthEndDate()`
  - [x] Date manipulation utilities
- [x] Copy & adapt `src/utils/formatters.ts` → `packages/core/src/utils/formatters.ts`
  - [x] `formatCurrency()`
  - [x] `formatRelativeDate()`
  - [x] `formatFinancialMonthRange()`
- [x] Create `packages/core/src/utils/calculations.ts`
  - [x] Budget percentage calculations
  - [x] Goal progress calculations
  - [x] Savings rate calculations
- [x] Create `packages/core/src/utils/generators.ts`
  - [x] `generateId()` function
  - [x] UUID generation utilities
- [x] Copy `src/utils/cn.ts` → `packages/core/src/utils/cn.ts`
- [x] Create `packages/core/src/utils/validators.ts`
  - [x] Custom Zod validators
  - [x] Business rule validators
- [x] Copy `src/utils/toast.ts` → `packages/core/src/utils/toast.ts` (interface only)
- [x] Create `packages/core/src/utils/index.ts` barrel export

### 1.5 Database Abstraction Layer (7/7) ✅
- [x] Create `packages/core/src/services/database/types.ts`
  - [x] `TransactionFilters` interface
  - [x] `BudgetFilters` interface
  - [x] `QueryOptions` interface
  - [x] `ExportData` interface
- [x] Create `packages/core/src/services/database/IDatabaseAdapter.ts`
  - [x] Define `IDatabaseAdapter` interface
  - [x] Transaction CRUD methods
  - [x] Category CRUD methods
  - [x] Account CRUD methods
  - [x] Budget CRUD methods
  - [x] Goal CRUD methods
  - [x] Backup/restore methods
- [x] Create `packages/core/src/services/database/operations.ts`
  - [x] Complex business operations using adapter
  - [x] `updateAccountBalances()`
  - [x] `migrateCategories()`
- [x] Create `packages/core/src/services/database/migrations.ts`
  - [x] Category ID normalization
  - [x] User ID remapping logic
- [x] Create `packages/core/src/services/database/index.ts` barrel export
- [x] Add detailed JSDoc comments to all methods
- [x] Add TypeScript strict mode validation

---

## 🧠 Phase 2: Business Logic Services ✅
**Location**: `packages/core/src/services/`
**Purpose**: Platform-agnostic business logic (calculations, formatters)

### 2.1 Calculation Services (3/3) ✅
- [x] Create `packages/core/src/services/calculations/budgetProgress.ts`
  - [x] Migrated logic from `useBudgets.ts`
  - [x] `calculateBudgetProgress()` - pure function (156 lines)
  - [x] `calculateActiveAlerts()` - pure function
  - [x] `calculateProjectedSpending()` - pure function
- [x] Create `packages/core/src/services/calculations/goalProgress.ts`
  - [x] `calculateGoalProgress()` - pure function (105 lines)
  - [x] `calculateRequiredMonthlyContribution()` - pure function
- [x] Create `packages/core/src/services/calculations/statistics.ts`
  - [x] `calculateMonthlyStats()` - pure function (286 lines)
  - [x] `calculateSpendingByCategory()` - pure function
  - [x] `calculateNetWorth()` - pure function
- [x] Create `packages/core/src/services/calculations/index.ts` barrel export

### 2.2 Auth Services (3/3) ✅
- [x] Create `packages/core/src/services/auth/authService.ts`
  - [x] `createGuestUser()` - platform-agnostic (165 lines)
  - [x] `convertSupabaseUser()` - platform-agnostic
  - [x] All auth helper functions implemented
- [x] Create `packages/core/src/services/auth/migration.ts`
  - [x] `detectBackupUserId()` - platform-agnostic
  - [x] User ID remapping logic
- [x] Create `packages/core/src/services/auth/index.ts` barrel export

### 2.3 Formatter Services (2/2) ✅
- [x] Formatters already exist in `packages/core/src/utils/formatters.ts`
  - [x] `formatCurrency()` - works on both platforms
  - [x] `formatRelativeDate()` - uses date-fns
  - [x] `formatFinancialMonthRange()` - platform-agnostic

---

## 🌐 WEB PLATFORM ONLY

> ⚠️ **IMPORTANT**: Code in `apps/web/` is web-specific
> - Can use browser APIs (`window`, `document`, `localStorage`)
> - Can use Dexie (IndexedDB)
> - Can use Radix UI
> - Can use TanStack Router
> - Must implement `IDatabaseAdapter` interface from core

---

## 🗄️ Phase 3A: Web Database Implementation ✅
**Location**: `apps/web/src/services/db/`
**Purpose**: IndexedDB (Dexie) implementation for web

### 3A.1 Web Database (Dexie) (6/6) ✅
- [x] Copy `src/services/db/index.ts` → `apps/web/src/services/db/index.ts`
  - [x] Dexie schema definition (41 lines)
  - [x] Database initialization with all tables
  - [x] Compound indexes for efficient queries
- [x] Create `apps/web/src/services/db/DexieAdapter.ts`
  - [x] Implements `IDatabaseAdapter` interface (774 lines)
  - [x] All transaction methods (CRUD, filters, balance updates)
  - [x] All category methods (including defaults)
  - [x] All account methods (with balance tracking)
  - [x] All budget methods (multi-category support)
  - [x] All goal methods (savings & debt types)
  - [x] Backup/restore functionality
- [x] Updated all imports to use `@kakeibo/core` types
- [x] Atomic transactions for balance updates
- [x] Build passing (6 acceptable complexity warnings)

---

## 🎨 Phase 3B: Web UI Components
**Location**: `apps/web/src/components/`
**Purpose**: React components using Radix UI + Tailwind CSS

### 3B.1 Web Base Components (10/14)
- [x] Copy `src/components/ui/Button/` → `apps/web/src/components/ui/Button/`
  - [x] ⚠️ Uses browser events (`onClick`)
  - [x] Updated to use `@kakeibo/core` utilities (cn, tv)
  - [x] Installed lucide-react for Loader2 icon
- [x] Copy `src/components/ui/Input/` → `apps/web/src/components/ui/Input/`
  - [x] ⚠️ Uses browser inputs (labels, aria attributes)
  - [x] Updated to use `@kakeibo/core` utilities (cn)
- [x] Copy `src/components/ui/Modal/` → `apps/web/src/components/ui/Modal/`
  - [x] ⚠️ Uses Radix UI Dialog (web-only)
  - [x] Installed @radix-ui/react-dialog
- [x] Copy `src/components/ui/Card/` → `apps/web/src/components/ui/Card/`
  - [x] Updated to use `@kakeibo/core` utilities (cn)
- [x] Copy `src/components/ui/Badge/` → `apps/web/src/components/ui/Badge/`
  - [x] Updated to use `@kakeibo/core` utilities (cn)
- [x] Copy `src/components/ui/ProgressBar/` → `apps/web/src/components/ui/ProgressBar/`
  - [x] Updated to use `@kakeibo/core` utilities (cn)
- [x] Copy `src/components/ui/Select/` → `apps/web/src/components/ui/Select/`
  - [x] ⚠️ Uses Radix UI Select (web-only)
  - [x] Installed @radix-ui/react-select
- [x] Copy `src/components/ui/Checkbox/` → `apps/web/src/components/ui/Checkbox/`
  - [x] ⚠️ Uses Radix UI Checkbox (web-only)
  - [x] Installed @radix-ui/react-checkbox
  - [x] Updated to use `@kakeibo/core` utilities (cn, tv)
- [x] Copy `src/components/ui/CategoryIcon/` → `apps/web/src/components/ui/CategoryIcon/`
  - [x] All 70+ Lucide icons mapped
- [ ] Copy `src/components/ui/CategorySelect/` → `apps/web/src/components/ui/CategorySelect/`
  - [ ] ⚠️ Complex component with subcategory support (defer to later)
- [ ] Copy `src/components/ui/TieredCategorySelect/` → `apps/web/src/components/ui/TieredCategorySelect/`
  - [ ] ⚠️ Complex component (defer to later)
- [ ] Copy `src/components/ui/MultiCategorySelect/` → `apps/web/src/components/ui/MultiCategorySelect/`
  - [ ] ⚠️ Complex component (defer to later)
- [ ] Copy `src/components/ui/SubcategorySelect/` → `apps/web/src/components/ui/SubcategorySelect/`
  - [ ] ⚠️ Complex component (defer to later)
- [ ] Copy `src/components/ui/Toast/` → `apps/web/src/components/ui/Toast/`
  - [ ] ⚠️ Needs toast system (defer to later)
- [x] Create `apps/web/src/components/ui/index.ts` barrel export

### 3B.2 Web Layout Components (5/5) ✅
- [x] Copy `src/components/layout/AppShell/` → `apps/web/src/components/layout/AppShell/`
  - [x] ⚠️ Web-specific layout (desktop/mobile responsive)
  - [x] Removed framer-motion dependencies (used CSS transitions)
  - [x] Placeholder TODOs for store integration
- [x] Copy `src/components/layout/Navbar/` → `apps/web/src/components/layout/Navbar/`
  - [x] Updated to use Button component from ui/
  - [x] Placeholder TODOs for theme and sidebar toggles
- [x] Copy `src/components/layout/Sidebar/` → `apps/web/src/components/layout/Sidebar/`
  - [x] ⚠️ Desktop only (media queries)
  - [x] Removed framer-motion (used CSS transitions)
- [x] Copy `src/components/layout/BottomNav/` → `apps/web/src/components/layout/BottomNav/`
  - [x] ⚠️ Mobile only (media queries)
  - [x] Removed framer-motion (used CSS transitions)
- [x] Copy `src/components/layout/FloatingActionButton/` → `apps/web/src/components/layout/FloatingActionButton/`
  - [x] Removed framer-motion (used CSS transitions with active:scale)
- [x] Create `apps/web/src/components/layout/index.ts` barrel export

### 3B.3 Web Feature Components (0/5)
- [ ] Copy `src/components/features/transactions/` → `apps/web/src/components/features/transactions/`
  - [ ] TransactionCard.tsx
  - [ ] AddTransactionModal.tsx
- [ ] Copy `src/components/features/budgets/` → `apps/web/src/components/features/budgets/`
  - [ ] AddBudgetModal.tsx
- [ ] Copy `src/components/features/goals/` → `apps/web/src/components/features/goals/`
  - [ ] AddGoalModal.tsx
  - [ ] ContributeGoalModal.tsx
- [ ] Copy `src/components/features/accounts/` → `apps/web/src/components/features/accounts/`
  - [ ] AddAccountModal.tsx
- [ ] Update all imports to use `@kakeibo/core` types

---

## 📄 Phase 3C: Web Pages & Features
**Location**: `apps/web/src/pages/` and `apps/web/src/`
**Purpose**: Web pages, routing, auth, and PWA

### 3C.1 Web Pages (0/8)
- [ ] Copy `src/pages/Dashboard/` → `apps/web/src/pages/Dashboard/`
  - [ ] Update to use DexieAdapter
  - [ ] Update to use core hooks
- [ ] Copy `src/pages/Transactions/` → `apps/web/src/pages/Transactions/`
- [ ] Copy `src/pages/Budgets/` → `apps/web/src/pages/Budgets/`
- [ ] Copy `src/pages/Analytics/` → `apps/web/src/pages/Analytics/`
  - [ ] ⚠️ Uses Recharts (web-only)
- [ ] Copy `src/pages/Goals/` → `apps/web/src/pages/Goals/`
- [ ] Copy `src/pages/Accounts/` → `apps/web/src/pages/Accounts/`
- [ ] Copy `src/pages/Settings/` → `apps/web/src/pages/Settings/`
- [ ] Copy `src/pages/Welcome/` → `apps/web/src/pages/Welcome/`

### 3C.2 Web Routing (0/1)
- [ ] Copy `src/router/index.ts` → `apps/web/src/router/index.ts`
  - [ ] ⚠️ Uses TanStack Router (web-only)

### 3C.3 Web Auth (0/1)
- [ ] Copy `src/services/auth/` → `apps/web/src/services/auth/`
  - [ ] ⚠️ Supabase web SDK (different from React Native)
  - [ ] Keep OAuth providers (Google, Apple, GitHub)
  - [ ] Update to use core auth service

### 3C.4 Web Hooks (0/1)
- [ ] Create `apps/web/src/hooks/useAuth.ts`
  - [ ] Web-specific wrapper around core auth
  - [ ] Uses Supabase web SDK

### 3C.5 Web Styles & PWA (0/2)
- [ ] Copy `src/index.css` → `apps/web/src/styles/index.css`
  - [ ] ⚠️ Web-specific Tailwind config
  - [ ] CSS custom properties for theming
- [ ] Setup PWA
  - [ ] Copy manifest and icons
  - [ ] Configure vite-plugin-pwa
  - [ ] ⚠️ Service workers (web-only)

---

## 📱 NATIVE PLATFORM ONLY

> ⚠️ **IMPORTANT**: Code in `apps/native/` is React Native-specific
> - Can use React Native APIs (`Pressable`, `View`, `Text`, etc.)
> - Can use OP-SQLite (React Native SQLite)
> - Can use React Navigation
> - Must implement same `IDatabaseAdapter` interface from core
> - **DO NOT** import anything from `apps/web/`

---

## 🗄️ Phase 4A: Native Database Implementation
**Location**: `apps/native/src/services/db/`
**Purpose**: SQLite (OP-SQLite) implementation for React Native

### 4A.1 Native Database (OP-SQLite) (0/6)
- [ ] Install OP-SQLite dependencies
  - [ ] `@op-engineering/op-sqlite`
- [ ] Create `apps/native/src/services/db/schema.ts`
  - [ ] Define SQL schema (users, accounts, categories, transactions, budgets, goals)
  - [ ] Create tables with indexes for performance
  - [ ] Add migration support
- [ ] Create `apps/native/src/services/db/queries.ts`
  - [ ] Transaction queries (INSERT, UPDATE, DELETE, SELECT)
  - [ ] Category queries
  - [ ] Account queries with balance updates
  - [ ] Budget queries
  - [ ] Goal queries
- [ ] Create `apps/native/src/services/db/OpSqliteAdapter.ts`
  - [ ] Implement `IDatabaseAdapter` interface
  - [ ] Implement all CRUD methods using SQL
  - [ ] Handle atomic transactions for balance updates
- [ ] Create `apps/native/src/services/db/index.ts`
  - [ ] ⚠️ Initialize OP-SQLite database
  - [ ] Create OpSqliteAdapter instance
- [ ] Test database initialization and queries

---

## 🎨 Phase 4B: Native UI Components
**Location**: `apps/native/src/components/`
**Purpose**: React Native components using NativeWind + React Native primitives

### 4B.1 Native Base Components (0/10)
- [ ] Create `apps/native/src/components/ui/Button/Button.tsx`
  - [ ] Use React Native Pressable
  - [ ] Implement ButtonProps from core
  - [ ] Apply NativeWind styles
- [ ] Create `apps/native/src/components/ui/Input/Input.tsx`
- [ ] Create `apps/native/src/components/ui/Modal/Modal.tsx`
  - [ ] Use React Native Modal
  - [ ] Animated transitions
- [ ] Create `apps/native/src/components/ui/Card/Card.tsx`
- [ ] Create `apps/native/src/components/ui/Badge/Badge.tsx`
- [ ] Create `apps/native/src/components/ui/Checkbox/Checkbox.tsx`
- [ ] Create `apps/native/src/components/ui/ProgressBar/ProgressBar.tsx`
- [ ] Create `apps/native/src/components/ui/CategoryIcon/CategoryIcon.tsx`
  - [ ] Map Lucide icons to React Native icons
- [ ] Create `apps/native/src/components/ui/Select/Select.tsx`
  - [ ] Use React Native Picker or custom bottom sheet
- [ ] Create barrel export `apps/native/src/components/ui/index.ts`

### 4B.2 Native Feature Components (0/4)
- [ ] Create `apps/native/src/components/features/transactions/TransactionCard.tsx`
- [ ] Create `apps/native/src/components/features/transactions/AddTransactionModal.tsx`
- [ ] Create `apps/native/src/components/features/budgets/AddBudgetModal.tsx`
- [ ] Create `apps/native/src/components/features/goals/AddGoalModal.tsx`
  - [ ] ⚠️ All use React Native Modal, not web portal

---

## 📱 Phase 4C: Native Screens & Features
**Location**: `apps/native/src/screens/` and `apps/native/src/`
**Purpose**: React Native screens, navigation, and platform services

### 4C.1 Native Screens (0/8)
- [ ] Create `apps/native/src/screens/DashboardScreen/`
  - [ ] Adapt web Dashboard logic
  - [ ] Use native components
- [ ] Create `apps/native/src/screens/TransactionsScreen/`
- [ ] Create `apps/native/src/screens/BudgetsScreen/`
- [ ] Create `apps/native/src/screens/AnalyticsScreen/`
- [ ] Create `apps/native/src/screens/GoalsScreen/`
- [ ] Create `apps/native/src/screens/AccountsScreen/`
- [ ] Create `apps/native/src/screens/SettingsScreen/`
- [ ] Create `apps/native/src/screens/WelcomeScreen/`
  - [ ] ⚠️ All screens use OpSqliteAdapter, not DexieAdapter

### 4C.2 Native Navigation (0/3)
- [ ] Setup React Navigation
  - [ ] Install dependencies
  - [ ] Create navigation types
- [ ] Create `apps/native/src/navigation/TabNavigator.tsx`
  - [ ] Bottom tabs for main screens
- [ ] Create `apps/native/src/navigation/RootNavigator.tsx`
  - [ ] ⚠️ React Navigation (not TanStack Router)

### 4C.3 Native-Specific Services (0/3)
- [ ] Create `apps/native/src/services/storage/SecureStorage.ts`
  - [ ] Use Keychain (iOS) / Keystore (Android)
- [ ] Create `apps/native/src/services/auth/nativeAuth.ts`
  - [ ] OAuth flow for mobile
- [ ] Create `apps/native/src/services/notifications/local.ts`
  - [ ] ⚠️ Use React Native notification APIs

### 4C.4 Native Hooks (0/1)
- [ ] Create `apps/native/src/hooks/useAuth.ts`
  - [ ] Native-specific auth wrapper
  - [ ] ⚠️ Uses Supabase React Native SDK (different from web)

---

## ✅ QUALITY & DEPLOYMENT

---

## 🧪 Phase 5: Testing & Quality Assurance

### 5.1 Core Package Tests (0/6)
- [ ] Setup Vitest for `@kakeibo/core`
- [ ] Write unit tests for utility functions
  - [ ] `date.ts` tests
  - [ ] `formatters.ts` tests
  - [ ] `calculations.ts` tests
- [ ] Write unit tests for business logic services
  - [ ] Budget progress calculations
  - [ ] Goal progress calculations
- [ ] Write tests for Zod schemas
- [ ] Achieve 80%+ test coverage for core

### 5.2 Web Platform Tests (0/4)
- [ ] Write integration tests for DexieAdapter
  - [ ] CRUD operations
  - [ ] Atomic transactions
  - [ ] Backup/restore
- [ ] Write component tests for UI components
- [ ] Write E2E tests with Playwright
  - [ ] User flows (add transaction, create budget)
- [ ] Test PWA functionality

### 5.3 Native Platform Tests (0/3)
- [ ] Write integration tests for OpSqliteAdapter
  - [ ] Test CRUD operations
  - [ ] Test SQL transactions
  - [ ] Test concurrent operations
- [ ] Write component tests with React Native Testing Library
- [ ] Test on both iOS and Android

### 5.4 Code Quality (0/2)
- [ ] Setup Biome linting rules
- [ ] Setup TypeScript strict mode in all packages

---

## 🚀 Deployment & Documentation

### 6.1 Documentation (0/5)
- [ ] Write README.md for monorepo root
- [ ] Write README.md for `@kakeibo/core`
- [ ] Write README.md for `@kakeibo/web`
- [ ] Write README.md for `@kakeibo/native`
- [ ] Create API documentation for core services

### 6.2 CI/CD (0/4)
- [ ] Setup GitHub Actions for CI
  - [ ] Run tests on PR
  - [ ] Run linting
  - [ ] Type checking
- [ ] Setup automatic versioning with Changesets
- [ ] Setup web deployment (Vercel/Netlify)
- [ ] Setup native builds (EAS Build)

---

## 📝 Notes & Best Practices

### ⚠️ CRITICAL: Platform Separation Rules

**NEVER DO THIS:**
```typescript
// ❌ WRONG - Importing web code into native
import { DexieAdapter } from '../../../web/src/services/db';

// ❌ WRONG - Importing native code into web
import { OpSqliteAdapter } from '../../../native/src/services/db';

// ❌ WRONG - Using browser APIs in core
export const saveToLocalStorage = (key: string, value: any) => {
  localStorage.setItem(key, JSON.stringify(value)); // ❌ Won't work on native!
};

// ❌ WRONG - Using React Native APIs in core
import { Platform } from 'react-native'; // ❌ Won't work on web!
```

**ALWAYS DO THIS:**
```typescript
// ✅ CORRECT - Core defines interface
// packages/core/src/services/database/IDatabaseAdapter.ts
export interface IDatabaseAdapter {
  getTransactions(): Promise<Transaction[]>;
}

// ✅ CORRECT - Web implements
// apps/web/src/services/db/DexieAdapter.ts
export class DexieAdapter implements IDatabaseAdapter {
  // Web-specific implementation using Dexie
}

// ✅ CORRECT - Native implements
// apps/native/src/services/db/OpSqliteAdapter.ts
export class OpSqliteAdapter implements IDatabaseAdapter {
  // Native-specific implementation using OP-SQLite
}

// ✅ CORRECT - Pure functions in core
// packages/core/src/utils/calculations.ts
export const calculateBudgetProgress = (budget: Budget, spent: number) => {
  return (spent / budget.amount) * 100; // Pure math, works everywhere
};
```

### Import Strategy by Location

**In `packages/core/`:**
```typescript
// ✅ Import from same package
import { Transaction } from '../types/transaction';
import { calculateBudgetProgress } from '../services/calculations';

// ❌ NEVER import from apps
import { DexieAdapter } from '../../../apps/web/src/services/db'; // ❌ NO!
```

**In `apps/web/`:**
```typescript
// ✅ Import core package
import { Transaction, Budget, IDatabaseAdapter } from '@kakeibo/core';

// ✅ Import web components
import { Button, Modal } from '@/components/ui';

// ❌ NEVER import from native
import { OpSqliteAdapter } from '../../../native/src/services/db'; // ❌ NO!
```

**In `apps/native/`:**
```typescript
// ✅ Import core package
import { Transaction, Budget, IDatabaseAdapter } from '@kakeibo/core';

// ✅ Import native components
import { Button, Modal } from '@/components/ui';

// ❌ NEVER import from web
import { DexieAdapter } from '../../../web/src/services/db'; // ❌ NO!
```

### Database Adapter Usage
```typescript
// In components/pages
const adapter = useDatabaseAdapter(); // Platform provides this
const transactions = await adapter.getTransactions(filters);
```

### Component Props
```typescript
// Core defines the contract
import type { ButtonProps } from '@kakeibo/core';

// Platform implements
export const Button: React.FC<ButtonProps> = ({ ... }) => { ... };
```

---

## 🎯 Success Criteria

- [ ] All features from original kakeibo working in web
- [ ] All features working in React Native
- [ ] 80%+ test coverage in core package
- [ ] Zero TypeScript errors in strict mode
- [ ] All Biome linting rules passing
- [ ] Web app deployable as PWA
- [ ] Native app buildable for iOS & Android
- [ ] Data syncs correctly between guest and authenticated users
- [ ] Backup/restore works across platforms

---

**🏁 Ready to begin? Start with Phase 1.1: Type System Migration**

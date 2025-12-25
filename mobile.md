# Native Platform (React Native) - Complete Feature Checklist

**Target**: Feature parity with web platform  
**Approach**: Maximize code reuse from `@kakeibo/core` (~70% shared logic)  
**Last Updated**: December 25, 2024

---

## 📊 Progress Overview

**Total Tasks**: 135/176 completed (76.7%)

### Phases
- [x] Phase 4A: Database Layer (25/25) ✅ COMPLETE (Dec 20, 2024)
- [x] Phase 4B: Core UI Components (45/45) ✅ COMPLETE (Dec 25, 2024)
- [x] Phase 4C: Feature Components (35/35) ✅ COMPLETE (Dec 24, 2024)
- [x] Phase 4D: State Management & Hooks (12/12) ✅ COMPLETE (Dec 25, 2024)
  - ✅ Pure calculated balance implementation (native only)
  - ✅ All hooks improved with Zustand invalidation, toasts, return values
  - ✅ MMKV storage integration fixed (v4 API)
- [x] Phase 4E: Navigation & Routing (10/10) ✅ COMPLETE (Dec 24, 2024)
- [ ] Phase 4F: Screens Implementation (8/42) 🔴 IN PROGRESS
- [ ] Phase 4G: Advanced Features (0/24) 🟡 MEDIUM PRIORITY

---

## 🏗️ Development Principles (Prerequisites)

Before writing any code, every implementation MUST follow these core principles:

### 1. **Highly Modular Code**
- Each component/service does ONE thing well
- Small, focused files (ideally <200 lines, wherever possible)
- Easy to understand, test, and replace
- Clear boundaries between modules

### 2. **Maintainability**
- Self-documenting code with clear naming
- Consistent patterns across the codebase
- Easy to debug and extend
- Well-structured with logical organization

### 3. **DRY Principle (Don't Repeat Yourself)**
- Extract common logic into utilities/hooks
- Reuse components via composition
- Share code from `@kakeibo/core` whenever possible
- Single source of truth for business logic

### 4. **Separation of Concerns**
- **Data Layer** (SQLiteAdapter): Database operations only
- **Business Logic** (`@kakeibo/core`): Calculations, validation, formatting
- **UI Layer** (Components): Presentation and user interaction only
- **State Management** (Zustand): Global state coordination
- **Navigation**: Routing and screen transitions

### 5. **Scalable Architecture**
- Future-proof: Easy to add new features
- Performance-conscious: Optimized for mobile devices
- Testable: Unit tests, integration tests, E2E tests
- Platform-aware: iOS/Android differences handled gracefully

### Implementation Checklist (Every File)
- [ ] Does this follow a pattern we've established?
- [ ] Can this logic be reused from `@kakeibo/core`?
- [ ] Is this component composable and reusable?
- [ ] Is the file size reasonable (<200 lines)?
- [ ] Are concerns properly separated (UI vs logic)?
- [ ] Will this be easy to test?
- [ ] Is the naming clear and consistent?

**Example**:
```typescript
// ❌ BAD: Logic mixed with UI, not reusable
const BudgetCard = ({ budgetId }) => {
  const budget = db.budgets.get(budgetId);
  const spent = db.transactions.where({ budgetId }).sum('amount');
  const progress = (spent / budget.amount) * 100;
  return <View><Text>{progress}%</Text></View>;
};

// ✅ GOOD: Separation of concerns, reusable
// In @kakeibo/core/services/calculations/budgetCalculations.ts
export const calculateBudgetProgress = (budget: Budget, transactions: Transaction[]) => {
  // Pure function, testable, platform-agnostic
};

// In apps/native/src/components/features/budgets/BudgetCard.tsx
const BudgetCard = ({ budget, transactions }) => {
  const { progress } = calculateBudgetProgress(budget, transactions); // Reuse core logic
  return <BudgetCardView progress={progress} budget={budget} />; // UI only
};
```

---

## ✅ Phase 4A: Database Layer (SQLite) - COMPLETE (Dec 20, 2024)

> **Status**: All database operations fully implemented with OP-SQLite!  
> **Location**: `apps/native/src/services/db/`  
> **Adapter**: SQLiteAdapter (1594 lines) implements all IDatabaseAdapter methods

### 4A.1 Dependencies & Setup (6/6) ✅
- [x] Install OP-SQLite: `@op-engineering/op-sqlite` v15.1.14

### 4A.7 Pure Calculated Balance (Dec 25, 2024) ✅
**Architecture Decision**: Moved from incremental balance updates to pure calculated balances

**Benefits**:
- ✅ Self-healing (recalculated on every query)
- ✅ Crash-safe (no partial updates)
- ✅ Full audit trail (all transactions preserved)
- ✅ No accumulated errors from bugs
- ✅ Simplified transaction operations

**Implementation**:
- [x] Added `initialBalance` field to Account type and schema
- [x] Created `calculateAccountBalance()` utility in @kakeibo/core
- [x] Updated SQLiteAdapter:
  - [x] Removed `updateAccountBalance()` method
  - [x] Removed `applyTransactionBalance()` helper
  - [x] Removed `revertTransactionBalance()` helper
  - [x] All transaction operations only modify transactions table
  - [x] `getAccounts`/`getAccount` calculate balances on-the-fly
  - [x] `createAccount`/`updateAccount` use initialBalance field
- [x] Simplified `deleteGoal` - just deletes transactions (balance auto-corrects)
- [x] Added `balance-adjustment` transaction type for manual corrections

**Formula**:
```typescript
balance = initialBalance + sum(transactions)
```

**Status**: ✅ Native only (web deferred until mobile complete)
- [x] Install async-storage for metadata: `@react-native-async-storage/async-storage`
- [x] Create `apps/native/src/services/db/` directory structure
- [x] Create `schema.ts` with SQL table definitions (6 tables: users, accounts, categories, transactions, budgets, goals)
- [x] Create `migrations.ts` with version management system
- [x] Create database initialization utility in `index.ts`

### 4A.2 Core Database Setup (4/4) ✅
- [x] Implement database connection singleton pattern
- [x] Create `executeQuery()` helper for SQL queries
- [x] Create `executeTransaction()` wrapper for atomic operations
- [x] Add database error handling with retry logic (exponential backoff)

### 4A.3 SQLiteAdapter - User Operations (2/2) ✅
**Reference**: `apps/web/src/services/db/DexieAdapter.ts` lines 61-97
- [x] Implement `getUser(userId: string): Promise<User | undefined>`
- [x] Implement `createUser(user: User): Promise<User>`, `updateUser()`, `deleteUser()` with cascade deletes

### 4A.4 SQLiteAdapter - Account Operations (3/3) ✅
**Reference**: `apps/web/src/services/db/DexieAdapter.ts` lines 99-217
**Reuse from core**: Account type definitions, filter interfaces
- [x] Implement `getAccounts(userId, filters?)` with filter support (type, isArchived)
- [x] Implement `getAccount(id)`, `createAccount()`, `updateAccount()`, `deleteAccount()`
- [x] Implement balance update helpers (private methods `applyTransactionBalance`, `revertTransactionBalance`)

### 4A.5 SQLiteAdapter - Category Operations (3/3) ✅
**Reference**: `apps/web/src/services/db/DexieAdapter.ts` lines 219-398
**Reuse from core**: `defaultExpenseCategories`, `defaultIncomeCategories` from `@kakeibo/core/constants`
- [x] Implement `getCategories(userId, filters?)` with support for type, parentId, isDefault filters
- [x] Implement `createCategory()` with order assignment logic
- [x] Implement default category initialization (52 expense + 18 income categories)

### 4A.6 SQLiteAdapter - Transaction Operations (4/4) ✅
**Reference**: `apps/web/src/services/db/DexieAdapter.ts` lines 400-687
**Critical**: Type conversions (amount: string → number, date: string → Date)
- [x] Implement `getTransactions(userId, filters?, options?)` with comprehensive filters:
  - Type filter (expense, income, transfer, goal-contribution, goal-withdrawal)
  - Category/subcategory filters
  - Account filter (accountId or toAccountId)
  - Date range filter (startDate, endDate)
  - Goal filter
  - isEssential filter
- [x] Implement sorting & pagination (sortBy, sortOrder, limit, offset)
- [x] Implement `createTransaction()` with atomic balance updates
- [x] Implement `updateTransaction()` and `deleteTransaction()` with balance reversion

### 4A.7 SQLiteAdapter - Budget Operations (2/2) ✅
**Reference**: `apps/web/src/services/db/DexieAdapter.ts` lines 689-845
**Key feature**: Multi-category support (`categoryIds: string[]`)
- [x] Implement `getBudgets(userId, filters?)` with categoryId matching (check if categoryId in categoryIds array)
- [x] Implement `createBudget()`, `updateBudget()`, `deleteBudget()` with multi-category handling

### 4A.8 SQLiteAdapter - Goal Operations (3/3) ✅
**Reference**: `apps/web/src/services/db/DexieAdapter.ts` lines 847-1038
**Status mapping**: `isArchived: boolean → status: 'active' | 'completed' | 'cancelled'`
- [x] Implement `getGoals(userId, filters?)` with type, status, isArchived filters
- [x] Implement `createGoal()`, `updateGoal()`, `deleteGoal()`
- [x] Implement `contributeToGoal()` and `withdrawFromGoal()` with transaction creation

### 4A.9 Import/Export Operations (4/4) ✅
**Reference**: `apps/web/src/services/db/DexieAdapter.ts` lines 1040-1146
**Reuse from core**: `cleanExportData`, `detectBackupUserId`, `remapUserId`, `normalizeCategoryIdsInRecord`, `generateMigrationReport` from `@kakeibo/core/services/database/migrations`
- [x] Implement `exportDatabase(userId): Promise<ExportData>` - export all user data to JSON
- [x] Implement `importDatabase(data: ExportData, targetUserId?: string)` with:
  - User ID remapping (support importing from different user)
  - Category ID normalization (v1 compatibility: remove "exp-" and "inc-" prefixes)
  - Settings migration
  - Date conversion handling
- [x] Add import validation with user-friendly error messages
- [x] Test cross-platform compatibility (import web backup on mobile, vice versa)

**Total Phase 4A**: 25/25 tasks ✅

---

## ✅ Phase 4B: Core UI Components - COMPLETE (Dec 22, 2024)

> **Status**: All 14 base UI components implemented!  
> **Styling**: UniWind 1.2.2 (Tailwind for React Native)  
> **Design System**: Dark elegant theme matching web (colors from `@kakeibo/core/styles`)  
> **NO third-party UI libraries**: Pure React Native primitives only

### Completed Components (14/14) ✅

#### 4B.1 Button Component (5/5) ✅
**Location**: `apps/native/src/components/ui/Button.tsx`
- [x] Base Button with Pressable (not TouchableOpacity)
- [x] 6 variants: primary, secondary, danger, success, ghost, outline
- [x] 3 sizes: sm, md, lg
- [x] Loading state with ActivityIndicator
- [x] Disabled state with 50% opacity
- [x] Active press feedback

#### 4B.2 Input Component (4/4) ✅
**Location**: `apps/native/src/components/ui/Input.tsx`
- [x] Base Input with TextInput
- [x] Label, error message, helper text slots (using tv() slots)
- [x] Error state styling (red border)
- [x] Disabled state with opacity

#### 4B.3 Card Component (3/3) ✅
**Location**: `apps/native/src/components/ui/Card.tsx`
- [x] Card with View/Pressable wrapper
- [x] 3 variants: default, elevated, outlined
- [x] 4 padding sizes: none, sm, md, lg
- [x] Pressable variant for clickable cards

#### 4B.4 Badge Component (2/2) ✅
**Location**: `apps/native/src/components/ui/Badge.tsx`
- [x] Badge with View + Text
- [x] 5 variants: primary, success, danger, warning, neutral
- [x] 3 sizes: sm, md, lg

#### 4B.5 ProgressBar Component (2/2) ✅
**Location**: `apps/native/src/components/ui/ProgressBar.tsx`
- [x] ProgressBar with nested Views
- [x] 4 colors: primary, success, warning, danger
- [x] 3 sizes: sm, md, lg
- [x] Optional percentage display

#### 4B.6 Checkbox Component (2/2) ✅
**Location**: `apps/native/src/components/ui/Checkbox.tsx`
- [x] Checkbox with Pressable + View
- [x] Check icon from lucide-react-native
- [x] Label support

#### 4B.7 Modal Component (4/4) ✅
**Location**: `apps/native/src/components/ui/Modal.tsx`
- [x] Modal with React Native Modal
- [x] Pressable backdrop for dismiss
- [x] Custom header with close button (X icon)
- [x] ScrollView content area
- [x] Optional footer slot

#### 4B.8 CategoryIcon Component (3/3) ✅
**Location**: `apps/native/src/components/ui/CategoryIcon.tsx`
- [x] Dynamic icon rendering based on icon name
- [x] 70+ Lucide icons mapped (shopping-cart, utensils, car, home, etc.)
- [x] Color and size props (sm, md, lg)
- [x] Fallback to Tag icon

#### 4B.9 Select Component (3/3) ✅
**Location**: `apps/native/src/components/ui/Select.tsx`
- [x] Bottom sheet pattern using Modal
- [x] Pressable trigger with ChevronDown icon
- [x] ScrollView list of options with Check icon for selected
- [x] Label, error, placeholder support

#### 4B.10 DatePicker Component (3/3) ✅
**Location**: `apps/native/src/components/ui/DatePicker.tsx`
- [x] Platform-specific behavior (iOS modal, Android native)
- [x] @react-native-community/datetimepicker integration
- [x] Calendar icon trigger
- [x] Confirm button for iOS

#### 4B.11 Chip Component (3/3) ✅
**Location**: `apps/native/src/components/ui/Chip.tsx`
- [x] Pill-shaped chips with rounded-full borders
- [x] 5 variants: primary, success, danger, warning, neutral
- [x] 3 sizes: sm, md, lg
- [x] Optional close button (X icon) with onClose callback
- [x] Pressable support with onPress callback

#### 4B.12 SkeletonLoader Component (2/2) ✅
**Location**: `apps/native/src/components/ui/SkeletonLoader.tsx`
- [x] Shimmer animation using Animated API
- [x] 3 variants: text, card, list
- [x] Opacity animation loop (0.3 to 0.7)

#### 4B.13 Toast System (4/4) ✅
**Location**: `apps/native/src/components/ui/Toast/`
- [x] toast.ts - ToastManager with pub/sub pattern
- [x] Toast.tsx - Individual toast with slide animation and auto-dismiss
- [x] ToastContainer.tsx - Renders all active toasts at top with safe area
- [x] Pill-shaped minimal design matching web (borderRadius: 999, dark bg, colored icon circles)

#### 4B.14 EmptyState Component (2/2) ✅
**Location**: `apps/native/src/components/common/EmptyState.tsx`
- [x] Icon, title, description layout
- [x] Optional action button
- [x] Centered with rounded icon background

#### 4B.15 ComponentShowcase (1/1) ✅
**Location**: `apps/native/src/screens/ComponentShowcase.tsx`
- [x] Demo screen for all UI components
- [x] Interactive examples with state
- [x] Toast triggers for each variant
- [x] Skeleton loader toggle
- [x] Empty state toggle

### Key Implementation Achievements
- ✅ **Removed HeroUI Native completely** - All components use pure React Native primitives
- ✅ **UniWind 1.2.2** for Tailwind-like styling with `className` prop
- ✅ **tailwind-variants (tv())** for variant management (same pattern as web)
- ✅ **Dark theme** colors from @kakeibo/core/styles
- ✅ **lucide-react-native 0.562.0** for 70+ category icons
- ✅ **@react-native-community/datetimepicker 8.5.1** for date picker
- ✅ **react-native-safe-area-context** for SafeAreaView (non-deprecated)
- ✅ **All components fully typed** with TypeScript interfaces
- ✅ **Consistent API** with web components (same prop names, same variants)

---

## ✅ Phase 4C: Feature Components - COMPLETE (Dec 24, 2024)

> **Status**: All feature components implemented with modular sub-component architecture!  
> **Pattern**: Each card component broken into reusable sub-components (Icon, Header, Menu, etc.)  
> **Styling**: UniWind + tailwind-variants for consistent theming

### 4C.1 TransactionCard Component (6/6) ✅
**Location**: `apps/native/src/components/features/transactions/`
- [x] `TransactionCard.tsx`: Main composition component
- [x] `TransactionIcon.tsx`: Icon rendering (goal/transfer/category)
- [x] `TransactionInfo.tsx`: Description, category, essential badge
- [x] `TransactionAmount.tsx`: Amount with color, prefix, date
- [x] `TransactionMenu.tsx`: Edit/delete dropdown menu
- [x] Supports all 5 transaction types with compact variant

### 4C.2 AccountCard Component (5/5) ✅
**Location**: `apps/native/src/components/features/accounts/`
- [x] `AccountCard.tsx`: Main composition component
- [x] `AccountIcon.tsx`: Type-based icon rendering
- [x] `AccountHeader.tsx`: Name and type badge
- [x] `AccountBalance.tsx`: Formatted balance with color coding
- [x] `AccountMenu.tsx`: Edit/delete dropdown menu

### 4C.3 BudgetCard Component (6/6) ✅
**Location**: `apps/native/src/components/features/budgets/`
- [x] `BudgetCard.tsx`: Main composition component
- [x] `BudgetIcon.tsx`: Category icon or multi-category indicator
- [x] `BudgetHeader.tsx`: Name and period display
- [x] `BudgetProgress.tsx`: Progress bar with spent/total amounts
- [x] `BudgetCategoryChips.tsx`: Category chips for multi-category budgets
- [x] `BudgetMenu.tsx`: Edit/delete dropdown menu

### 4C.4 GoalCard Component (7/7) ✅
**Location**: `apps/native/src/components/features/goals/`
- [x] `GoalCard.tsx`: Main composition component
- [x] `GoalIcon.tsx`: Goal icon with type badge (Savings/Debt)
- [x] `GoalHeader.tsx`: Name and target amount
- [x] `GoalProgress.tsx`: Circular progress indicator
- [x] `GoalFooter.tsx`: Current amount and deadline
- [x] `GoalActions.tsx`: Contribute/Withdraw buttons
- [x] `GoalMenu.tsx`: Edit/delete dropdown menu

### 4C.5 Settings Components (6/6) ✅
**Location**: `apps/native/src/components/settings/`
- [x] `ProfileSection.tsx`: User profile with avatar and auth status
- [x] `NetWorthCard.tsx`: Total assets summary card
- [x] `ThemeSelector.tsx`: Light/Dark/System theme toggle
- [x] `SettingsList.tsx`: Reusable settings list container
- [x] `SectionHeader.tsx`: Settings section headers
- [x] `Icon.tsx`: Common icon wrapper component

### 4C.6 Common Components (5/5) ✅
**Location**: `apps/native/src/components/common/`
- [x] `EmptyState.tsx`: Empty state with icon, title, description
- [x] `Icon.tsx`: Reusable Lucide icon wrapper (43+ icons including PieChart, Target)
- [x] `SafeView.tsx`: SafeAreaAwareView pattern for consistent safe area handling - Dec 25, 2024

### Key Implementation Achievements
- ✅ **Modular Architecture**: Each feature card broken into 4-7 sub-components
- ✅ **Separation of Concerns**: Icon, Header, Content, Menu, Actions separated
- ✅ **Reusability**: Sub-components can be used independently
- ✅ **Consistency**: All cards follow same compositional pattern
- ✅ **Type Safety**: Full TypeScript coverage with proper interfaces
- ✅ **Styling**: UniWind + tv() variants for consistent theming
- ✅ **Menu Pattern**: All cards have 3-dot menu with edit/delete (using @gorhom/bottom-sheet)

**Total Phase 4C**: 35/35 tasks ✅

---

## ✅ Phase 4D: State Management & Hooks - COMPLETE (Dec 25, 2024)

> **Status**: All hooks enhanced with consistent patterns!  
> **Pattern**: Zustand invalidation + toast notifications + return entities + stable deps  
> **Storage**: MMKV v4 API for app state persistence

### 4D.1 Zustand Invalidation Pattern (6/6) ✅
**Location**: All entity hooks
- [x] `useTransactionInvalidation` - version counter for reactive updates
- [x] `useGoalInvalidation` - triggers goal queries to refetch
- [x] `useCategoryInvalidation` - invalidates category queries
- [x] `useBudgetInvalidation` - invalidates budget queries
- [x] `useAccountInvalidation` - invalidates account queries
- [x] Pattern: `const invalidate = () => set(s => ({ version: s.version + 1 }))`

### 4D.2 Hook Improvements (All Complete) ✅

#### useTransactions + useTransactionActions (Dec 25, 2024)
- [x] Zustand invalidation store integration
- [x] Toast notifications (create/update/delete)
- [x] Return Transaction entities from mutations
- [x] Stable dependencies with useRef
- [x] Reactive updates (version counter)

#### useGoals (Dec 25, 2024)
- [x] Zustand invalidation store integration
- [x] Toast notifications (CRUD + contribute/withdraw)
- [x] Return Goal entities from mutations
- [x] Stable dependencies
- [x] useGoalProgress hook for progress calculations

#### useCategories (Dec 25, 2024)
- [x] Zustand invalidation store integration
- [x] Toast notifications (create/update/delete)
- [x] Return Category entities from mutations
- [x] Stable dependencies (useRef for db)
- [x] Reactive updates

#### useBudgets (Dec 25, 2024)
- [x] Zustand invalidation store integration
- [x] Toast notifications (create/update/delete)
- [x] Return Budget entities from mutations
- [x] Stable dependencies
- [x] Reactive updates

#### useAccounts (Dec 25, 2024)
- [x] Zustand invalidation store integration
- [x] Toast notifications (create/update/delete)
- [x] Return Account entities from mutations
- [x] Stable dependencies
- [x] Reactive updates
- [x] Works seamlessly with pure calculated balances

#### useAuth (Dec 25, 2024)
- [x] Full implementation (not simplified)
- [x] Migration support with attemptMigration callback
- [x] MMKV storage for pending migration tracking
- [x] Toast notifications for all operations
- [x] useEffect initialization (same structure as web)
- [x] OAuth structure ready for Supabase implementation
- [x] Uses correct MMKV v4 API methods

### 4D.3 MMKV Storage Integration (Dec 25, 2024) ✅
**Location**: `apps/native/src/store/storage.ts`

**Fixed API Usage** (v4.1.0):
- [x] Import: `import { createMMKV } from 'react-native-mmkv'`
- [x] Instance: `createMMKV({ id: 'kakeibo-app-storage' })` (not `new MMKV()`)
- [x] Methods: `getString()`, `set()`, `remove()` (not `delete()`)
- [x] Type: `PersistStorage<T>` for Zustand compatibility
- [x] No JSON.parse/stringify (persist middleware handles it)

**Integration Points**:
- [x] `appStore.ts`: Uses `createMMKVStorage()` for persistence
- [x] `useAuth.ts`: Uses `mmkv` instance for migration tracking
- [x] All Zustand stores with persistence support

**Verified**: ✅ Against official documentation (github.com/mrousavy/react-native-mmkv)

### Key Achievements
- ✅ **Consistent Pattern**: All entity hooks follow same architecture
- ✅ **User Feedback**: Toast notifications on all mutations
- ✅ **Type Safety**: Return typed entities, not void
- ✅ **Performance**: Stable dependencies prevent unnecessary re-renders
- ✅ **Reactivity**: Zustand invalidation triggers automatic refetches
- ✅ **Persistence**: MMKV properly integrated for app state
- ✅ **No Simplification**: Full implementations maintained per user directive

> **Status**: All hooks implemented with MMKV persistence!  
> **Store**: Zustand with MMKV (faster than AsyncStorage)  
> **Pattern**: Separate query and mutation hooks for clean separation of concerns

### 4D.1 App Store Setup (4/4) ✅
**Reference**: `apps/web/src/store/appStore.ts` (185 lines)
**Location**: `apps/native/src/store/appStore.ts`
- [x] Install Zustand: `zustand` v5.0.9
- [x] Create AppState interface (currentUser, settings, UI state, modal states)
- [x] Implement store with persist middleware (use MMKV storage)
- [x] Export store hook: `useAppStore()` + selector hooks

### 4D.2 Custom Hooks - Database Operations (5/5) ✅
**Reference**: `apps/web/src/hooks/` (8 hook files)
**Pattern**: Separate query hooks (data) from action hooks (mutations)
- [x] Create `useTransactions()` + `useTransactionActions()` hooks
- [x] Create `useAccounts()` + `useAccountActions()` hooks
- [x] Create `useBudgets()` + `useBudgetActions()` hooks
- [x] Create `useGoals()` + `useGoalActions()` hooks
- [x] Create `useCategories()` + `useCategoryActions()` hooks

### 4D.3 Auth Hook (2/2) ✅
**Reference**: `apps/web/src/hooks/useAuth.ts` (complete Supabase integration)
**Location**: `apps/native/src/hooks/useAuth.ts`
**Reuse**: `createGuestUser()` from `@kakeibo/core/services/auth`
- [x] Port `useAuth()` hook with guest mode (Google OAuth marked TODO)
- [x] Implement guest mode (startAsGuest) - migration marked TODO

### 4D.4 Utility Hooks (1/1) ✅
**Reference**: `apps/web/src/hooks/useCurrency.ts`
**Location**: `apps/native/src/hooks/useCurrency.ts`
**Reuse**: `formatCurrency()` from `@kakeibo/core/utils/formatters`
- [x] Create `useCurrency()` hook (returns formatCurrency function and current currency symbol)

**Total Phase 4D**: 12/12 tasks ✅

---

## ✅ Phase 4E: Navigation & Routing - COMPLETE (Dec 24, 2024)

> **Library**: Navigation Router (navigation-react-native 9.35.0)  
> **Pattern**: StateNavigator with TabBar + NavigationStack per tab  
> **Note**: Using Navigation Router instead of React Navigation for better declarative routing

### 4E.1 Navigation Setup (5/5) ✅
**Dependencies**: `navigation`, `navigation-react`, `navigation-react-native`
- [x] Installed navigation-react-native 9.35.0
- [x] Installed react-native-gesture-handler 2.28.0
- [x] Installed react-native-reanimated 4.2.1
- [x] Installed react-native-screens 4.16.0
- [x] Set up TypeScript types in `navigation/types.ts`

### 4E.2 Tab Navigator (5/5) ✅
**Location**: `apps/native/src/navigation/MainNavigator.tsx`
- [x] Created TabBar with 5 tabs (Hub, Track, Analytics, Subs, More)
- [x] Added custom tab bar icons (PNG assets in `assets/navigation/`)
- [x] Styled tab bar (dark theme #040404, blue selection #3b82f6)
- [x] Each tab has own StateNavigator instance (useStateNavigator hook)
- [x] Each tab has NavigationStack with smooth transitions
- [x] Subs tab kept as placeholder for future subscription tracking - Dec 25, 2024
- [x] Budget & Goals screens moved to More tab stack - Dec 25, 2024

### 4E.3 State Navigator Configuration (3/3) ✅
**Location**: `apps/native/src/navigation/stateNavigator.ts`
- [x] Created main StateNavigator with route definitions
- [x] Configured routes: welcome, tabs, hub, transactions, analytics, plan, more
- [x] Set up route tracking with trackCrumbTrail for back navigation

### 4E.4 Navigation Features (2/2) ✅
- [x] Smooth transitions with alpha and scale animations (300ms duration)
- [x] Dark background colors (#0a0a0a) with underlay (#030303)

**Key Implementation Details:**
- ✅ **Architecture**: Main navigator → Tabs scene → TabBar (5 tabs) → Per-tab navigators → Per-tab NavigationStacks
- ✅ **Pattern**: Each tab gets its own StateNavigator instance for isolated navigation
- ✅ **Subs Tab**: Placeholder only (PlanScreen "Coming Soon") - full feature deferred
- ✅ **Budgets/Goals**: Accessible from More screen Quick Access, navigate to screens in More tab stack
- ✅ **Transitions**: Smooth crumb/unmount animations with alpha and scale effects
- ✅ **Tab Icons**: Custom PNG icons matching dark theme
- ✅ **Type Safety**: Full TypeScript support with navigation types

**Total Phase 4E**: 10/10 tasks ✅

---

## 🔴 Phase 4F: Screens Implementation - IN PROGRESS

> **Reference**: All web pages in `apps/web/src/pages/`  
> **Status**: All screen files created, need full implementation with real data  
> **Current**: Basic layouts in place, need to connect to database and state management

### 4F.1 Hub Screen (2/12) 🔴
**Location**: `apps/native/src/screens/HubScreen.tsx`
**Status**: Basic layout created, needs full implementation
- [x] Screen file created with basic structure
- [x] Placeholder content in place
- [ ] Connect to database adapter for real data
- [ ] Create hero balance card (credit card style)
- [ ] Add account picker dropdown
- [ ] Add balance visibility toggle (eye icon)
- [ ] Create monthly stats section (Income, Expenses, Savings)
- [ ] Create top spending by category section
- [ ] Create budgets at risk section (≥70% spent)
- [ ] Create active goals section
- [ ] Create accounts section
- [ ] Create recent transactions section
- [ ] Add pull-to-refresh functionality

### 4F.2 Transactions Screen (2/10) 🔴
**Location**: `apps/native/src/screens/TransactionsScreen.tsx`
**Status**: Basic layout created, needs full implementation
- [x] Screen file created with basic structure
- [x] Placeholder content in place
- [ ] Connect to database adapter for transactions
- [ ] Create transaction list with FlatList (using TransactionCard)
- [ ] Add type filter chips (All, Expense, Income, Transfer)
- [ ] Add category filter (bottom sheet)
- [ ] Add account filter (bottom sheet)
- [ ] Add date range filter
- [ ] Add search by description (debounced)
- [ ] Implement edit/delete transaction
- [ ] Add pull-to-refresh and pagination

### 4F.3 Budgets Screen (2/9) 🔴
**Location**: `apps/native/src/screens/BudgetsScreen.tsx`
**Status**: Basic layout created, accessible from More > Quick Access > Budgets
**Navigation**: More tab → Quick Access → Budgets button → BudgetsScreen
- [x] Screen file created with basic structure
- [x] Placeholder content in place
- [ ] Connect to database adapter for budgets
- [ ] Create monthly overview card (total budget, total spent)
- [ ] Add overall progress bar (color-coded)
- [ ] Create budget list with FlatList (using BudgetCard)
- [ ] Show days remaining in month
- [ ] Add daily average spending insight
- [ ] Implement edit/delete budget
- [ ] Add empty state with create budget CTA

### 4F.4 Analytics Screen (2/8) 🔴
**Location**: `apps/native/src/screens/AnalyticsScreen.tsx`
**Status**: Basic layout created, needs charts implementation
- [x] Screen file created with basic structure
- [x] Placeholder content in place
- [ ] Install react-native-chart-kit or victory-native
- [ ] Connect to database for analytics data
- [ ] Create time range selector (7D, 1M, 3M, 6M)
- [ ] Create spending trend chart (line chart)
- [ ] Create category breakdown chart (donut chart)
- [ ] Add subcategory drill-down
- [ ] Add empty states for no data

### 4F.5 Goals Screen (2/7) 🔴
**Location**: `apps/native/src/screens/GoalsScreen.tsx`  
**Status**: Basic layout created, accessible from More > Quick Access > Goals
**Navigation**: More tab → Quick Access → Goals button → GoalsScreen
- [x] Screen file created with basic structure
- [x] Accessible from More screen Quick Access - Dec 25, 2024
- [ ] Connect to database for goals data
- [ ] Create overview card (total saved, total target)
- [ ] Create goals list with FlatList (using GoalCard)
- [ ] Implement contribute/withdraw functionality
- [ ] Implement edit/delete goal
- [ ] Add empty state with create goal CTA

### 4F.6 Accounts Screen (2/6) 🔴
**Location**: `apps/native/src/screens/AccountsScreen.tsx`  
**Status**: Basic layout created, accessible from More > Quick Access > Accounts
**Navigation**: More tab → Quick Access → Accounts button → AccountsScreen
- [x] Screen file created with basic structure
- [x] Accessible from More screen Quick Access - Dec 25, 2024
- [ ] Connect to database for accounts data
- [ ] Create net worth overview card
- [ ] Create account list with FlatList (using AccountCard)
- [ ] Implement edit/delete account
- [ ] Add empty state with create account CTA

### 4F.7 Subscription Screen (Subs Tab - Placeholder) (1/1) ✅
**Location**: `apps/native/src/screens/PlanScreen.tsx`
**Status**: Placeholder "Coming Soon" UI - Full implementation deferred
**Documentation**: See `SUBSCRIPTION_TRACKING_FEATURE.md` for complete implementation plan
- [x] Placeholder UI with feature preview cards - Dec 25, 2024
- ⏸️ **DEFERRED**: Full subscription tracking implementation (list, stats, reminders, auto-transactions)

### 4F.8 More/Settings Screen (7/10) 🔴
**Location**: `apps/native/src/screens/MoreScreen.tsx`
**Status**: Enhanced with Pro card, Budget/Goals in Quick Access, semantic icons
- [x] Screen file created with basic structure
- [x] Settings sections created (ProfileSection, NetWorthCard, ThemeSelector, etc.)
- [x] ProMembershipCard with Tick icons - Dec 25, 2024
- [x] Budget & Goals added to Quick Access section - Dec 25, 2024
- [x] Icon updates (Bell, Trash, Info, Heart, Tag, CalendarDays, FileText, Help) - Dec 25, 2024
- [x] SafeView integration for safe area handling - Dec 25, 2024
- [x] Navigation renamed: "Plan" → "Subs" (Subscription tab) - Dec 25, 2024
- [ ] Connect to auth for profile data
- [ ] Add currency selector
- [ ] Add date format preference

### 4F.9 Welcome Screen (2/8) 🔴
**Location**: `apps/native/src/screens/WelcomeScreen.tsx`
**Status**: Basic file created, needs full onboarding implementation
- [x] Screen file created with basic structure
- [ ] Connect to auth system
- [ ] Create onboarding slides (3-4 slides explaining features)
- [ ] Add slide indicators (dots at bottom)
- [ ] Add "Sign in with Google" button (Supabase OAuth)
- [ ] Add "Continue as Guest" button
- [ ] Add swipe gesture to navigate slides
- [ ] Navigate to Hub after auth

### 4F.10 Component Showcase Screen (1/1) ✅
**Location**: `apps/native/src/screens/ComponentShowcase.tsx`
- [x] Screen with all UI components for testing
- [x] Accessible from More/Settings screen for development

**Total Phase 4F**: 8/42 tasks

---

## 🟡 Phase 4G: Advanced Features - MEDIUM PRIORITY
---

## 🟡 Phase 4G: Advanced Features - MEDIUM PRIORITY

### 4G.1 Supabase OAuth (0/5) ⚠️ HIGH PRIORITY
**Library**: `@supabase/supabase-js` + `@supabase/auth-helpers-react-native`
- [ ] Install Supabase React Native SDK
- [ ] Implement OAuth flow (Google, Apple) with Linking/WebBrowser API
- [ ] Handle session persistence and refresh
- [ ] Convert Supabase user to AuthUser type
- [ ] Trigger migration when authenticated user signs in

### 4G.2 Biometric Authentication (0/3)
**Library**: `react-native-biometrics`
- [ ] Install `react-native-biometrics`
- [ ] Add Face ID/Touch ID prompt on app launch (optional, user preference)
- [ ] Store biometric preference in AsyncStorage

### 4G.3 Local Push Notifications (0/3)
**Library**: `@react-native-community/push-notification-ios` + `react-native-push-notification`
- [ ] Install notification libraries
- [ ] Implement budget alert notifications (when budget ≥90% spent)
- [ ] Implement bill reminder notifications (configurable in settings)

### 4G.4 Camera Integration (0/2)
**Library**: `react-native-camera` or `react-native-image-picker`
**Feature**: Receipt capture for transactions
- [ ] Install camera library
- [ ] Add camera button in AddTransactionModal (capture receipt, store as base64 or file path)

### 4G.5 Haptic Feedback (0/1)
**Built-in**: `react-native-haptic-feedback`
- [ ] Add haptic feedback on button presses, swipe actions, delete confirmations

### 4G.6 Share Functionality (0/2)
**Built-in**: React Native Share API
- [ ] Add "Share" button in export functionality (share JSON backup file)
- [ ] Add share analytics report as PDF (future)

### 4G.7 Dark Mode with System Preference (0/2)
**Built-in**: `useColorScheme` hook
- [ ] Detect system theme preference on launch
- [ ] Update theme when system preference changes (listen to Appearance events)

### 4G.8 Offline-First with Background Sync (0/3)
**Library**: `@react-native-community/netinfo`
- [ ] Install NetInfo for network status detection
- [ ] Show offline banner when no network
- [ ] Queue mutations when offline, sync when back online (use AsyncStorage queue)

### 4G.9 Pull-to-Refresh (0/1)
**Built-in**: FlatList `refreshControl` prop
- [ ] Add pull-to-refresh on all list screens (already planned in screen tasks above)

### 4G.10 Swipe Actions on List Items (0/2)
**Library**: `react-native-swipeable-item` or custom
- [ ] Add swipe-to-edit on TransactionCard (swipe right → Edit)
- [ ] Add swipe-to-delete on TransactionCard (swipe left → Delete with confirmation)

**Total Phase 4G**: 0/24 tasks (Added Supabase OAuth - 5 tasks)

---

## 🎯 Code Reuse Strategy

### ✅ Shared from `@kakeibo/core` (~70%)

**Types & Schemas**:
- All entity types (Account, Transaction, Category, Budget, Goal, User)
- All Zod schemas (validation rules)
- All TypeScript interfaces

**Business Logic**:
- Budget calculations (progress, spending rate, alerts) ✅
- Goal calculations (progress, contributions, projections) ✅
- Stats calculations (income, expenses, savings, trends) ✅
- Date utilities (financial month, date ranges) ✅
- Currency formatting ✅
- Auth logic (guest mode, OAuth, data migration) ✅

**Constants**:
- Default categories (52 expense + 18 income) ✅
- Currency list ✅
- Date format options ✅
- Color tokens (design system) ✅

### ❌ Platform-Specific (~30%)

**Database**:
- SQLiteAdapter (instead of DexieAdapter)
- OP-SQLite queries (instead of Dexie queries)
- SQL table definitions

**UI Components**:
- React Native components (View, Text, TouchableOpacity, FlatList)
- Native animations (Animated API or Reanimated)
- Platform-specific styling (UniWind)

**Navigation**:
- React Navigation (instead of TanStack Router)
- Tab navigator, Stack navigator
- Native gestures

**Libraries**:
- Charts: react-native-chart-kit (instead of Recharts)
- Forms: react-hook-form (same as web ✅)
- Icons: lucide-react-native (same as web ✅)
- Date picker: @react-native-community/datetimepicker (instead of HTML input)

---

## 📱 Platform Considerations

### iOS
- Safe area handling (notch, home indicator) - use `react-native-safe-area-context`
- Navigation bar styling (match iOS design guidelines)
- Haptic feedback (use `react-native-haptic-feedback`)
- Face ID authentication (use `react-native-biometrics`)

### Android
- Material Design patterns (use Paper components if needed)
- Back button handling (navigate back in stack)
- Fingerprint authentication (use `react-native-biometrics`)
- System navigation bar (handle edge-to-edge layout)

### Performance
- FlatList for long lists (virtualization) ✅
- React.memo for expensive components ✅
- useCallback for event handlers ✅
- Lazy loading for screens (React Navigation lazy loading)
- Optimize re-renders (React DevTools Profiler)

---

## 🚀 Development Workflow

### Setup
```bash
# Install dependencies (from monorepo root)
yarn install

# iOS setup (macOS only)
cd apps/native/ios && pod install && cd -

# Build core package first (required)
yarn build:core

# Start Metro bundler
yarn dev:native
```

### Development
```bash
# Terminal 1: Metro bundler
yarn dev:native

# Terminal 2: Run on Android
yarn android

# Terminal 2: Run on iOS (macOS only)
yarn ios

# Hot reload on save (Metro fast refresh)
```

### Debugging
- React Native Debugger (for Redux/Zustand state)
- Flipper (for network requests, database inspection)
- React DevTools (component tree)
- Console logs (LogBox)

---

## 📝 Testing Strategy

### Unit Tests
- Database adapter methods (SQLite CRUD) - use Jest with in-memory SQLite
- Component rendering - use React Native Testing Library
- Hook tests - use `@testing-library/react-hooks`

### Integration Tests
- Transaction flow (create → update balance)
- Budget progress calculations
- Goal contribution logic

### E2E Tests (Detox)
- Install Detox: `yarn workspace @kakeibo/native add -D detox`
- Critical user flows (add transaction, create budget, view dashboard)
- Authentication flow (guest mode, OAuth)
- Data import/export

---

## 🎨 Design System Alignment

> **Source**: All color tokens from `@kakeibo/core/styles/colors.ts`

### Colors (Match Web)
```typescript
// Primary - Purple Blue
--color-primary-500: #5B6EF5

// Success/Income - Emerald Green
--color-success-500: #10b981

// Danger/Expense - Rose
--color-danger-500: #f43f5e

// Warning - Amber
--color-warning-500: #f59e0b

// Surface (Dark Greys)
--color-surface-50: #f8f9fa (lightest)
--color-surface-800: #1e1e2e (card background)
--color-surface-950: #0a0a0f (darkest)
```

### Typography
- **Headings**: 24px (h1), 20px (h2), 18px (h3), 16px (h4)
- **Body**: 14px (base), 13px (small)
- **Caption**: 12px (muted text)
- **Font Family**: System default
  - iOS: SF Pro Display / SF Pro Text
  - Android: Roboto

### Spacing Scale
```typescript
// Base unit: 4px
const spacing = {
  0.5: 2,   // 2px
  1: 4,     // 4px
  1.5: 6,   // 6px
  2: 8,     // 8px
  3: 12,    // 12px
  4: 16,    // 16px
  6: 24,    // 24px
  8: 32,    // 32px
  12: 48,   // 48px
  16: 64,   // 64px
  20: 80,   // 80px
  24: 96,   // 96px
}
```

### Border Radius
- **Small**: 8px (badges, chips)
- **Medium**: 12px (buttons, inputs)
- **Large**: 16px (cards)
- **XLarge**: 20px (modals, hero cards)

### Shadow (iOS only, elevation on Android)
```typescript
// iOS shadows
shadow-sm: { shadowRadius: 2, shadowOpacity: 0.1 }
shadow-md: { shadowRadius: 4, shadowOpacity: 0.15 }
shadow-lg: { shadowRadius: 8, shadowOpacity: 0.2 }

// Android elevation
elevation: 2, 4, 8
```

---

## 🔗 Dependencies

### Already Installed ✅
- `react-native`: 0.83.1 ✅
- `react`: 19.2.0 ✅
- `zustand`: 5.0.9 ✅ (state management)
- `react-native-safe-area-context`: 5.6.2 ✅
- `@kakeibo/core`: workspace:* ✅
- `navigation`: 6.3.1 ✅
- `navigation-react`: 4.15.0 ✅
- `navigation-react-native`: 9.35.0 ✅
- `lucide-react-native`: 0.562.0 ✅
- `@react-native-community/datetimepicker`: 8.5.1 ✅
- `react-native-gesture-handler`: 2.28.0 ✅
- `react-native-reanimated`: 4.2.1 ✅
- `react-native-screens`: 4.16.0 ✅
- `react-native-svg`: 15.15.1 ✅
- `@gorhom/bottom-sheet`: ^5 ✅
- `react-native-fast-squircle`: 1.0.14 ✅
- `react-native-mmkv`: 4.1.0 ✅
- `react-native-worklets`: 0.7.1 ✅
- `uniwind`: 1.2.2 ✅
- `tailwind-variants`: 3.2.2 ✅
- `tailwindcss`: 4.1.18 ✅
- `@op-engineering/op-sqlite`: 15.1.14 ✅

### Phase 4C (Forms) - To Install
```bash
yarn workspace @kakeibo/native add react-hook-form @hookform/resolvers
```

### Phase 4F (Analytics Charts) - To Install
```bash
yarn workspace @kakeibo/native add react-native-chart-kit react-native-svg
# OR
yarn workspace @kakeibo/native add victory-native
```

### Phase 4G (Advanced) - To Install Later
```bash
# Biometrics
yarn workspace @kakeibo/native add react-native-biometrics

# Notifications
yarn workspace @kakeibo/native add @react-native-community/push-notification-ios react-native-push-notification

# Camera
yarn workspace @kakeibo/native add react-native-image-picker

# Network status
yarn workspace @kakeibo/native add @react-native-community/netinfo

# Haptics
yarn workspace @kakeibo/native add react-native-haptic-feedback

# Swipeable items
yarn workspace @kakeibo/native add react-native-swipeable-item
```

---

## 📅 Estimated Timeline

**Phase 4A (Database)**: 4-5 days ⏱️  
**Phase 4B (Core UI)**: 5-6 days ⏱️  
**Phase 4C (Feature Components)**: 4-5 days ⏱️  
**Phase 4D (State & Hooks)**: 2-3 days ⏱️  
**Phase 4E (Navigation)**: 2-3 days ⏱️  
**Phase 4F (Screens)**: 12-14 days ⏱️  
**Phase 4G (Advanced Features)**: 6-8 days ⏱️

**Total**: ~5-6 weeks to feature parity with web 🎯

---

## ✅ Success Criteria

Mobile app achieves feature parity with web when:

1. ✅ All screens match web functionality
2. ✅ SQLite adapter passes same tests as Dexie adapter
3. ✅ All calculations produce identical results (core logic reused)
4. ✅ Import/export works cross-platform (web ↔ mobile)
5. ✅ Auth state syncs via Supabase (Google OAuth)
6. ✅ UI matches design system (dark elegant theme)
7. ✅ Performance: 60fps animations, <100ms interactions
8. ✅ Works offline (local-first architecture)
9. ✅ iOS and Android builds working
10. ✅ All E2E tests passing (Detox)

---

## 🎯 Next Steps - Start Here! 🚀

### Immediate Actions (Week 1)

**Day 1-2: Database Foundation**
1. Install OP-SQLite and AsyncStorage
2. Create database schema (6 tables)
3. Implement database connection and helpers

**Day 3-4: User & Account Operations**
4. Implement User CRUD in SQLiteAdapter
5. Implement Account CRUD with balance tracking
6. Test database operations in isolation

**Day 5: Category & Transaction Operations**
7. Implement Category CRUD with defaults
8. Start Transaction CRUD implementation

### Week 2: Complete Database + Start UI

**Day 6-7: Finish Database Layer**
9. Complete Transaction operations with filters
10. Implement Budget and Goal operations
11. Implement Import/Export with v1 compatibility
12. Write database integration tests

**Day 8-10: Core UI Components**
13. Implement Button, Input, Card, Badge components
14. Implement ProgressBar, Checkbox, Modal components
15. Set up UniWind styling system

### Week 3-4: Feature Components + State

Continue with Phase 4C, 4D, 4E...

---

## 📚 Reference Documents

- **Architecture**: `/kakeibo-v2/.github/copilot-instructions.md`
- **Web Implementation**: `/kakeibo-v2/web.md`
- **Progress Tracking**: `/kakeibo-v2/PROGRESS.md`
- **Detailed Roadmap**: `/kakeibo-v2/TODO.md`
- **v1 Reference** (for UI patterns only): `/kakeibo/.github/copilot-instructions.md`

---

## 💡 Development Tips

### Code Organization
- Keep files small (<200 lines where possible)
- One component per file
- Separate logic from UI (hooks vs components)
- Use barrel exports (index.ts files)

### Performance
- Use `React.memo()` for list items (TransactionCard, BudgetCard, etc.)
- Use `useCallback()` for event handlers passed to children
- Use `useMemo()` for expensive calculations
- Optimize FlatList with `getItemLayout` for fixed-height items

### Debugging
- Use `console.log` for quick debugging (React Native Debugger)
- Use Flipper for network and database inspection
- Use React DevTools for component tree
- Use Hermes for better performance (enable in android/app/build.gradle)

### Testing
- Write tests as you build (TDD approach)
- Test database operations first (foundation)
- Test components in isolation (React Native Testing Library)
- Test user flows with Detox (E2E)

---

**Let's build an amazing mobile app! 🚀📱**

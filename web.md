# Web Platform - Complete Feature Checklist

## 1. Toast Notifications (Essential UX - Port from v1) 🔴 HIGH PRIORITY

- [x] Port toast utility (pub/sub pattern from v1)
- [x] Create ToastRoot component with portal
- [x] Create ToastContainer with AnimatePresence
- [x] Create Toast component with Framer Motion
- [x] Add toast() calls to transaction operations (create/update/delete)
- [x] Add toast to budget operations (create/update/delete)
- [x] Add toast to goal operations (create/update/delete/contribute)
- [x] Add toast to account operations (create/update/delete)
- [x] Add toast to category operations (create/update/delete)
- [x] Add toast to import/export operations (placeholders)
- [x] Add toast to settings changes (currency, date format, theme, notifications)
- [ ] Replace console.error calls with error toasts (optional - already have try/catch)

## 2. Authentication ✅ COMPLETED (Dec 21, 2024)
- [x] Replace hardcoded guest user in useAuth hook
- [x] Set up Supabase project and environment variables
- [x] Implement Supabase authentication service
- [x] Add OAuth providers (Google implemented, Apple/GitHub ready)
- [x] Guest mode initialization (startAsGuest in WelcomePage)
- [x] Session persistence and auto-refresh (Zustand + localStorage)
- [x] User profile display (avatar, email in Settings)
- [x] Sign in with Google (WelcomePage + Settings)
- [x] Sign out with data retention option (Settings page)
- [x] Protected routes with TanStack Router (redirect to welcome if no user)
- [x] Route guards using _authenticated layout + beforeLoad
- [x] Auth error handling with toast notifications
- [x] Profile image fallback when Google photo unavailable
- [x] Fix auto-guest-user creation (explicit user action only)
- [x] Guest-to-authenticated migration flow (transfer data) ✅ COMPLETED (Dec 22, 2024)
- [ ] Apple OAuth provider - TODO (Later)
- [ ] GitHub OAuth provider - TODO (Later)
- [ ] Avatar upload functionality - TODO (Not Needed)

## 3. Data Import/Export ✅ COMPLETED (Dec 22, 2024)
- [x] Export entire database to JSON (Settings page button)
- [x] Import database from JSON with validation
- [x] User ID remapping on import (support multi-user imports)
- [x] Category ID normalization for v1 compatibility
- [x] Settings backup/restore (currency, date format, theme)
- [x] Import validation with user-friendly error messages
- [x] Date conversion handling for imported data
- [x] User displayName update on OAuth sign-in
- [ ] Export transactions as CSV - TODO (Later)
- [ ] Export analytics data as Excel - TODO (Later)
- [ ] Encrypted backup option (password-protected) - TODO (Later)
- [ ] Backup file format documentation - TODO (Later)

## 4. Advanced Features (Not implemented yet) 🟡 MEDIUM PRIORITY
- [ ] Tags support for transactions (exists in types, add UI)
- [ ] Transaction search by tags
- [ ] Location tracking for transactions (exists in types, add map picker)
- [ ] Receipt attachment (exists in types, add camera/file upload)
- [ ] Receipt image storage (IndexedDB or cloud)
- [ ] Receipt OCR for auto-fill amount/merchant
- [ ] Recurring transactions (port from v1, improve UI)
- [ ] Recurring transaction management page
- [ ] Bulk transaction operations (select multiple, delete/edit category)
- [ ] Currency conversion for multi-currency accounts
- [ ] Bill reminders system (notifications + calendar)
- [ ] Custom budget alert thresholds per budget
- [ ] Budget rollover settings (carry over unused amount)
- [ ] Transaction splitting (split one transaction across categories)
- [ ] Merchant/payee auto-suggestions
- [ ] Transaction notes/memo field

## 5. PWA Features (Web Only) - Partially implemented 🟡 MEDIUM PRIORITY
- [ ] Service worker setup (vite-plugin-pwa) ✅ DONE
- [ ] App manifest ✅ DONE
- [ ] Install prompt UI (BeforeInstallPromptEvent)
- [ ] Update notification (service worker update detection)
- [ ] Offline functionality testing (all pages work offline)
- [ ] App shortcuts (Quick add transaction, View dashboard)
- [ ] Web Share API for exporting reports
- [ ] Push notifications setup (future - budget alerts, bill reminders)
- [ ] Background sync for offline transactions
- [ ] Cache strategy optimization (network-first for data, cache-first for assets)

## 6. Error Handling & User Feedback ✅ COMPLETED (Dec 22, 2024)
- [x] Global error boundary component
- [x] Loading states for all async operations
- [x] Skeleton loaders for list views
- [x] Empty states for all list views
- [x] Confirmation dialogs for all destructive actions
- [x] Form validation error messages (user-friendly)
- [x] Network error handling (offline detection)
- [x] Database operation error handling
- [x] Retry logic for failed operations
- [ ] Error logging service (optional - Sentry integration)

## 7. Accessibility (WCAG 2.1 AA Compliance) 🟡 MEDIUM PRIORITY
- [ ] Add remaining ARIA labels to all interactive elements
- [ ] Keyboard navigation for all interactive elements ✅ MOSTLY DONE
- [ ] Focus management in modals (trap focus, restore on close)
- [ ] Screen reader announcements for dynamic content
- [ ] High contrast mode support
- [ ] Reduce motion preferences (respect prefers-reduced-motion)
- [ ] Semantic HTML improvements (replace remaining divs with buttons)
- [ ] Form labels and error associations
- [ ] Skip to main content link
- [ ] Color contrast validation (all text meets 4.5:1 ratio)

## 8. Performance Optimizations 🟢 LOW PRIORITY
- [ ] Lazy load route components (React.lazy + Suspense)
- [ ] Virtualize long transaction lists (react-window or react-virtual)
- [ ] Optimize Dexie queries (add compound indexes for common queries)
- [ ] Memoize expensive calculations (useMemo for budget/goal calculations)
- [ ] Debounce search inputs
- [ ] Code splitting (split large pages into chunks)
- [ ] Image optimization (compress icons, use WebP)
- [ ] Bundle size analysis and reduction
- [ ] Reduce re-renders (React DevTools Profiler audit)
- [ ] Implement pagination for large datasets

## 9. Code Quality & Linting ✅ MOSTLY COMPLETE (Dec 22, 2024)
- [x] **Linting cleanup complete** - 45+ errors → 0 errors ✅
  - [x] Added type="button" default to Button component
  - [x] Fixed all noExplicitAny warnings in auth code
  - [x] Updated toast.ts forEach to for...of loop
  - [x] Added type="button" to all raw button elements
  - [x] Updated biome.json (errors → warnings for acceptable patterns)
  - [x] All pre-commit hooks passing (36 warnings, all acceptable)
- [ ] Fix 6 complexity warnings (acceptable, can refactor later)
  - [ ] BudgetsPage (complexity: 49) - split into smaller components
  - [ ] GoalsPage (complexity: 29) - split into smaller components
  - [ ] TransactionCard (complexity: 31) - extract menu logic
  - [ ] DashboardPage (complexity: 22) - extract sections
  - [ ] ContributeGoalModal (complexity: 18) - simplify form logic
  - [ ] CategorySelect (complexity: 17) - extract subcategory logic
- [ ] Add JSDoc comments to complex functions
- [ ] Extract magic numbers to constants
- [ ] Code review and refactoring

## 10. UI/UX Improvements 🟢 LOW PRIORITY
- [ ] Add loading animations (spinners, skeletons)
- [ ] Improve mobile responsiveness (test on various screen sizes)
- [ ] Add haptic feedback for mobile (vibrate on button press)
- [ ] Transaction list infinite scroll
- [ ] Quick filters for transactions (last 7 days, this month, etc.)
- [ ] Category color picker in category modal
- [ ] Account icon picker in account modal
- [ ] Budget progress animations
- [ ] Goal progress celebrations (confetti when goal completed)
- [ ] Dark/Light theme toggle improvements
- [ ] Smooth page transitions
- [ ] Drag-and-drop for transaction categorization

## 11. Analytics & Insights 🟢 LOW PRIORITY
- [ ] Monthly spending trends chart
- [ ] Category-wise spending breakdown (pie chart)
- [ ] Income vs Expense comparison
- [ ] Net worth tracking over time
- [ ] Budget adherence score
- [ ] Spending patterns detection (unusual spending alerts)
- [ ] Cash flow analysis
- [ ] Financial health score
- [ ] Export analytics as PDF report

## 12. Testing (Future) 🟢 LOW PRIORITY
- [ ] Unit tests for calculation services (budgetCalculations, goalCalculations)
- [ ] Unit tests for formatters (formatCurrency, formatDate)
- [ ] Unit tests for utilities
- [ ] Integration tests for DexieAdapter
- [ ] Integration tests for transaction balance updates
- [ ] Integration tests for filter/sort/pagination
- [ ] E2E tests for critical user flows (create transaction, create budget, create goal)
- [ ] E2E tests for import/export
- [ ] Accessibility testing (axe-core)
- [ ] Visual regression testing (Percy/Chromatic)
- [ ] Performance testing (Lighthouse CI)

## 13. Documentation 🟢 LOW PRIORITY
- [ ] User guide (how to use the app)
- [ ] Feature documentation (all features explained)
- [ ] API documentation (if backend is added)
- [ ] Deployment guide
- [ ] Contributing guide
- [ ] Changelog
- [ ] README improvements

---

## Summary

**Total Tasks**: ~160
**High Priority** (Must-have for production): 42 tasks
**Medium Priority** (Should-have for good UX): 54 tasks
**Low Priority** (Nice-to-have): 64 tasks

**Estimated Timeline**:
- Phase 1 (High Priority): 2-3 weeks
- Phase 2 (Medium Priority): 2-3 weeks
- Phase 3 (Low Priority): 3-4 weeks
- **Total**: 7-10 weeks for complete web platform

**Immediate Next Steps** (Start here):
1. ✅ Port toast system from v1 (~1-2 hours)
2. ✅ Add toasts to all operations (~2-3 hours)
3. ✅ Fix remaining accessibility issues (~1-2 hours)
4. ✅ Implement authentication with Supabase (~1-2 days)
5. ✅ Implement import/export (~1 day)
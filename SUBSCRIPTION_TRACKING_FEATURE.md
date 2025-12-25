# Subscription Tracking Feature - Product Design Document

**Status:** Proposed  
**Version:** 1.0  
**Last Updated:** December 25, 2025  
**Owner:** Product & Engineering

---

## 🎯 Feature Overview

A comprehensive subscription management system that allows users to track recurring payments for services (Netflix, Spotify, gym memberships, etc.), monitor upcoming payments, and analyze subscription spending patterns.

### Key Benefits
- **Financial Visibility**: See total monthly/yearly subscription costs at a glance
- **Payment Awareness**: Never miss or forget about upcoming subscription charges
- **Cost Optimization**: Identify unused subscriptions and track cancellation savings
- **Budget Integration**: Subscriptions automatically count toward category budgets
- **Automation**: Optional auto-creation of transactions on billing dates

---

## 📊 Data Model & Schema

### Subscription Entity

```typescript
interface Subscription {
  // Identity
  id: string;                    // Prefixed ID: sub-abc123
  userId: string;                // Owner
  
  // Basic Information
  name: string;                  // "Netflix", "Spotify Premium", "Planet Fitness"
  description?: string;          // Optional notes
  icon?: string;                 // Icon identifier or emoji
  color?: string;                // Brand color (#E50914 for Netflix, #1DB954 for Spotify)
  
  // Billing Details
  amount: number;                // Subscription cost
  currency: string;              // Inherited from user settings (USD, EUR, etc.)
  billingCycle: 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  nextBillingDate: Date;         // When the next payment is due
  startDate: Date;               // When subscription started
  endDate?: Date;                // For cancelled subscriptions
  
  // Integration with Existing Entities
  categoryId: string;            // Link to Categories (Entertainment, Software, Utilities)
  accountId: string;             // Which account pays for this subscription
  
  // Status & Settings
  status: 'active' | 'paused' | 'cancelled';
  autoCreateTransaction: boolean; // Auto-generate transactions on billing date
  reminderDays?: number;         // Days before billing to send reminder (3, 7, etc.)
  
  // Metadata
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Schema Additions

**New Zod Schemas:**
```typescript
// packages/core/src/schemas/subscription.schema.ts
export const createSubscriptionSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  amount: z.string().min(1, 'Amount is required'),
  billingCycle: z.enum(['weekly', 'monthly', 'quarterly', 'yearly']),
  nextBillingDate: z.string().min(1, 'Next billing date is required'),
  startDate: z.string().min(1, 'Start date is required'),
  categoryId: z.string().min(1, 'Category is required'),
  accountId: z.string().min(1, 'Account is required'),
  icon: z.string().optional(),
  color: z.string().optional(),
  autoCreateTransaction: z.boolean().default(true),
  reminderDays: z.number().optional(),
  notes: z.string().optional(),
});

export const updateSubscriptionSchema = createSubscriptionSchema.partial();
```

**Transaction Entity Update:**
```typescript
// Add to existing Transaction interface
interface Transaction {
  // ... existing fields
  subscriptionId?: string;  // Link to subscription (if auto-generated or manually linked)
}
```

---

## 🔗 Integration Points

### 1. **With Transactions**

#### Auto-Transaction Creation (Recommended)
- When `autoCreateTransaction === true`, system auto-generates expense on billing date
- Transaction fields:
  - `type: 'expense'`
  - `amount`: Subscription amount
  - `categoryId`: Subscription's category
  - `accountId`: Subscription's account
  - `subscriptionId`: Link to subscription
  - `description`: "Netflix subscription"
  - `date`: nextBillingDate

#### Manual Transaction Linking
- Users can link existing transactions to subscriptions
- Useful for matching imported bank transactions
- Prevents duplicate entries

### 2. **With Categories**

**Leverage Existing System:**
- Use existing category hierarchy
- Suggested default categories:
  - **Subscriptions** (parent)
    - Entertainment (Netflix, Spotify, Disney+)
    - Software (Adobe, Microsoft 365, GitHub)
    - Utilities (Internet, Phone)
    - Health & Fitness (Gym, Meditation apps)
    - News & Media (NYTimes, Medium)

**Benefits:**
- Works seamlessly with existing budget system
- Users can filter by "Subscriptions" OR "Entertainment"
- Flexible organization

### 3. **With Budgets**

**Impact on Budget Tracking:**
- Subscriptions count toward category budgets
- Show "fixed vs variable" spending breakdown:
  - Fixed: Subscription-based expenses
  - Variable: One-time expenses
- Special "Subscription Budget" option:
  - Dedicated budget for all subscription spending
  - Alert when adding new subscriptions would exceed budget

### 4. **With Accounts**

**Account Integration:**
- Each subscription linked to payment account
- Consider subscription costs in:
  - Account balance projections
  - Upcoming debits forecast
  - Monthly account summaries

### 5. **With Goals**

**New Goal Types:**
- "Reduce subscriptions by $X/month"
- "Eliminate unused subscriptions"
- Track cancellation savings as progress

---

## 🎨 User Interface Design

### Plan Screen Layout

```
┌─────────────────────────────────────────────┐
│  📊 Subscription Overview                   │
│  ┌─────────────────────────────────────┐   │
│  │  💰 Monthly Cost:      $147.43      │   │
│  │  📅 Yearly Cost:       $1,769.16    │   │
│  │  ✅ Active:            12           │   │
│  │  ⏰ Next 7 days:       3 payments   │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  🔔 Upcoming Payments (Next 30 days)       │
│  ┌─────────────────────────────────────┐   │
│  │  🎬 Netflix              Dec 28     │   │
│  │  $15.99/month                       │   │
│  │  [View] [Mark Paid]                 │   │
│  ├─────────────────────────────────────┤   │
│  │  🎵 Spotify Premium      Jan 2      │   │
│  │  $9.99/month                        │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  📋 Active Subscriptions                    │
│  [Monthly] [Yearly] [All] 🔍              │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │  💪 Planet Fitness                  │   │
│  │  $10.00/month • Next: Jan 15        │   │
│  │  Health & Fitness                   │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  ⏸️  Paused Subscriptions                  │
│  ❌ Cancelled (Last 6 months)              │
│                                             │
│  [+ Add Subscription]                       │
└─────────────────────────────────────────────┘
```

### Subscription Detail View

```
┌─────────────────────────────────────────────┐
│  ← Netflix                      [⋮]         │
│  🎬                                         │
│                                             │
│  $15.99/month                               │
│  Next billing: Dec 28, 2025                 │
│                                             │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│                                             │
│  📊 Details                                 │
│  Category:        Entertainment            │
│  Account:         Chase Checking           │
│  Started:         Jan 15, 2023             │
│  Billing Cycle:   Monthly                  │
│                                             │
│  🔔 Reminders                               │
│  Notify 3 days before billing              │
│  Auto-create transaction: ✅               │
│                                             │
│  📅 Upcoming Payments                       │
│  Dec 28, 2025                               │
│  Jan 28, 2026                               │
│  Feb 28, 2026                               │
│  ... [Show more]                            │
│                                             │
│  💳 Payment History (Last 6 months)        │
│  ┌─────────────────────────────────────┐   │
│  │  Nov 28  $15.99  Paid              │   │
│  │  Oct 28  $15.99  Paid              │   │
│  │  Sep 28  $15.99  Paid              │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  [Edit] [Pause] [Cancel] [Delete]          │
└─────────────────────────────────────────────┘
```

---

## 🚀 Feature Development Roadmap

### Phase 1: MVP (Foundation)
**Timeline:** 2-3 weeks  
**Goal:** Basic subscription tracking with manual management

#### Deliverables:
✅ **Schema & Types** (`@kakeibo/core`)
- Subscription entity definition
- Zod validation schemas
- TypeScript type exports

✅ **Database Layer** (DexieAdapter + SQLiteAdapter)
- Subscription table schema
- CRUD operations
- Basic filters (status, billing cycle)

✅ **Basic UI Components**
- SubscriptionCard component
- SubscriptionStatsCard (overview metrics)
- Add/Edit Subscription forms

✅ **Plan Screen - List View**
- Stats card (monthly/yearly totals, active count)
- Active subscriptions list
- Paused/Cancelled sections
- Simple filters

✅ **Manual Transaction Linking**
- Link existing transactions to subscriptions
- Unlink transactions
- Show linked transactions in detail view

#### User Stories:
- As a user, I can add a subscription with name, amount, and billing cycle
- As a user, I can see my total monthly subscription costs
- As a user, I can edit or cancel subscriptions
- As a user, I can link my subscription to existing transactions

---

### Phase 2: Automation & Insights
**Timeline:** 2-3 weeks  
**Goal:** Auto-transaction creation and proactive notifications

#### Deliverables:
✅ **Auto-Transaction Generation**
- Background scheduler (check daily)
- Auto-create transactions on billing dates
- Update nextBillingDate after creation
- Configurable per subscription

✅ **Upcoming Payments**
- UpcomingPaymentsCard component
- Calendar view option
- Notification center integration

✅ **Reminder System**
- Configurable reminder days (3, 7, 14 days)
- Push notifications
- In-app notification center

✅ **Analytics Dashboard**
- Spending trends (month-over-month)
- Category breakdown (Entertainment vs Software)
- Cost comparison (Monthly vs Yearly savings)
- Subscription growth chart

#### User Stories:
- As a user, I receive reminders 3 days before subscription charges
- As a user, my subscriptions automatically create transactions
- As a user, I can see upcoming payments for the next 30 days
- As a user, I can view subscription spending trends

---

### Phase 3: Advanced Features
**Timeline:** 3-4 weeks  
**Goal:** Enhanced UX and optimization tools

#### Deliverables:
✅ **Service Icon Library**
- Pre-built icons for popular services (Netflix, Spotify, etc.)
- Brand colors for 50+ services
- Custom icon upload

✅ **Smart Duplicate Detection**
- Detect potential duplicates when adding
- Suggest merging similar subscriptions
- Alert on suspicious duplicate charges

✅ **Cancellation Tracking**
- "Cancelled subscriptions" view
- Savings calculator ("Saved $X since cancelling")
- Reactivation tracking

✅ **Price Change Alerts**
- Detect when subscription amount changes
- Alert user to price increases
- Track historical pricing

✅ **Shared Subscriptions** (Family Plans)
- Split subscription costs
- Track who owes what
- Settlement reminders

✅ **Trial Tracking**
- Free trial end date
- Convert trial to paid subscription
- Cancel before trial ends reminder

#### User Stories:
- As a user, I get alerted when Netflix raises their price
- As a user, I can track how much I've saved by cancelling Hulu
- As a user, I can split my Spotify Family plan among 4 people
- As a user, I'm reminded to cancel free trials before they charge

---

## � Database Integration & Architecture

### Database Structure Overview

**Current Database Structure (Existing):**
```
User
  ├── Accounts (balance tracking)
  ├── Categories (hierarchical)
  ├── Transactions (expense/income/transfer)
  ├── Budgets (multi-category)
  └── Goals (savings/debt)
```

**With Subscriptions Added:**
```
User
  ├── Accounts
  ├── Categories
  ├── Transactions
  │   └── subscriptionId? (NEW optional field)
  ├── Budgets
  ├── Goals
  └── Subscriptions (NEW table)
      ├── References → Category (foreign key)
      ├── References → Account (foreign key)
      └── Auto-generates → Transactions
```

### Subscription Table Schema

**Dexie (IndexedDB for Web):**
```typescript
this.version(2).stores({
  // ... existing tables
  subscriptions: 'id, userId, status, nextBillingDate, categoryId, accountId, [userId+status], [userId+nextBillingDate]',
});
```

**OP-SQLite (Native):**
```sql
CREATE TABLE subscriptions (
  id TEXT PRIMARY KEY,           -- sub-abc123
  userId TEXT NOT NULL,
  
  -- Basic info
  name TEXT NOT NULL,
  description TEXT,
  amount REAL NOT NULL,
  currency TEXT NOT NULL,
  billingCycle TEXT NOT NULL,    -- 'weekly', 'monthly', 'quarterly', 'yearly'
  
  -- Dates
  nextBillingDate TEXT NOT NULL,
  startDate TEXT NOT NULL,
  endDate TEXT,                  -- For cancelled subscriptions
  
  -- Foreign keys to existing tables
  categoryId TEXT NOT NULL,      -- Links to categories table
  accountId TEXT NOT NULL,       -- Links to accounts table
  
  -- Settings
  status TEXT NOT NULL,          -- 'active', 'paused', 'cancelled'
  autoCreateTransaction INTEGER DEFAULT 1,
  reminderDays INTEGER,
  
  -- Metadata
  icon TEXT,
  color TEXT,
  notes TEXT,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL,
  
  FOREIGN KEY (userId) REFERENCES users(id),
  FOREIGN KEY (categoryId) REFERENCES categories(id) ON DELETE RESTRICT,
  FOREIGN KEY (accountId) REFERENCES accounts(id) ON DELETE RESTRICT
);

-- Indexes for performance
CREATE INDEX idx_subs_userId ON subscriptions(userId);
CREATE INDEX idx_subs_status ON subscriptions(status);
CREATE INDEX idx_subs_nextBilling ON subscriptions(nextBillingDate);
```

### Transaction Table Update

**Add ONE optional field to existing Transaction entity:**
```typescript
interface Transaction {
  // ... all existing fields (id, userId, amount, date, type, etc.)
  
  subscriptionId?: string;  // NEW: Links transaction to subscription
}

// Dexie index update
transactions: 'id, userId, accountId, categoryId, subscriptionId, type, date, [userId+date], [userId+categoryId], [userId+subscriptionId]'
```

---

## 🔄 Data Flow & Integration

### Flow 1: Create Subscription

```
User Input → Validation → Create Subscription → Link to Existing Entities

1. User fills form:
   {
     name: "Netflix",
     amount: 15.99,
     billingCycle: "monthly",
     nextBillingDate: "2025-12-28",
     categoryId: "cat-abc123",        // EXISTING category
     accountId: "acc-xyz789"          // EXISTING account
   }

2. System validates:
   - Category exists? ✓
   - Account exists? ✓
   - User owns both? ✓

3. Create subscription:
   INSERT INTO subscriptions VALUES (
     id: 'sub-netflix123',
     userId: 'user-123',
     categoryId: 'cat-abc123',       -- Foreign key
     accountId: 'acc-xyz789',        -- Foreign key
     ...
   )

4. No transaction created yet (waits for billing date)
```

### Flow 2: Auto-Transaction Creation (Daily Background Job)

```
Scheduler → Check Due Subscriptions → Create Transactions → Update Balances

DAILY at 00:00:
1. Query subscriptions:
   SELECT * FROM subscriptions
   WHERE status = 'active'
     AND autoCreateTransaction = 1
     AND nextBillingDate = TODAY

2. For each subscription found:
   
   a. Create transaction:
      INSERT INTO transactions (
        id: 'tr-auto123',
        userId: subscription.userId,
        type: 'expense',
        amount: subscription.amount,
        categoryId: subscription.categoryId,    -- Same category as subscription
        accountId: subscription.accountId,      -- Same account
        subscriptionId: subscription.id,        -- Link back to subscription
        date: TODAY,
        description: "Netflix subscription"
      )
   
   b. Update account balance:
      UPDATE accounts
      SET balance = balance - subscription.amount
      WHERE id = subscription.accountId
   
   c. Update subscription's next billing date:
      UPDATE subscriptions
      SET nextBillingDate = calculateNext(nextBillingDate, billingCycle),
          updatedAt = NOW()
      WHERE id = subscription.id
   
   d. Send notification:
      "Netflix charged $15.99 from Chase Checking"

3. Transaction now appears in:
   - TransactionsScreen (filtered by date/category)
   - Account balance (decreased)
   - Budget tracking (counts toward category budget)
```

### Flow 3: Budget Integration

```
Existing Budget Logic + Subscription Awareness

When user views budget for "Entertainment" category:

1. Get budget:
   budget = {
     categoryIds: ['cat-entertainment'],
     amount: 100,
     period: 'monthly'
   }

2. Calculate spending (EXISTING query, works automatically):
   SELECT SUM(amount) FROM transactions
   WHERE userId = 'user-123'
     AND categoryId IN budget.categoryIds
     AND date BETWEEN startOfMonth AND endOfMonth
     AND type = 'expense'
   
   Result: $45.99 total
   - $15.99 Netflix (subscriptionId: 'sub-netflix')
   - $9.99 Spotify (subscriptionId: 'sub-spotify')
   - $20.01 Other expenses (subscriptionId: null)

3. NEW: Show breakdown:
   Total: $45.99 / $100.00
   └── Fixed (Subscriptions): $25.98
   └── Variable (One-time): $20.01

4. Query for breakdown:
   Fixed = SELECT SUM(amount) WHERE subscriptionId IS NOT NULL
   Variable = SELECT SUM(amount) WHERE subscriptionId IS NULL
```

### Flow 4: Manual Transaction Linking

```
User Links Existing Transaction → Update Transaction

Scenario: User's bank auto-creates transaction, wants to link to subscription

1. User has transaction:
   {
     id: 'tr-bank123',
     amount: 15.99,
     description: "NETFLIX.COM",
     subscriptionId: null          -- Not linked yet
   }

2. User taps "Link to subscription" → Selects Netflix

3. Update transaction:
   UPDATE transactions
   SET subscriptionId = 'sub-netflix123',
       updatedAt = NOW()
   WHERE id = 'tr-bank123'

4. Optionally update subscription:
   UPDATE subscriptions
   SET nextBillingDate = calculateNext(transaction.date, billingCycle)
   WHERE id = 'sub-netflix123'
```

---

## 🔍 Query Examples

### Get All Subscriptions with Details

```typescript
// DexieAdapter method
async getSubscriptionsWithDetails(userId: string): Promise<SubscriptionDetail[]> {
  const subscriptions = await db.subscriptions
    .where('userId')
    .equals(userId)
    .toArray();
  
  // Join with categories and accounts (in-memory)
  const details = await Promise.all(
    subscriptions.map(async (sub) => {
      const category = await db.categories.get(sub.categoryId);
      const account = await db.accounts.get(sub.accountId);
      
      return {
        ...sub,
        categoryName: category?.name,
        accountName: account?.name,
      };
    })
  );
  
  return details;
}
```

### Get Upcoming Payments

```typescript
async getUpcomingPayments(userId: string, days: number = 30): Promise<Subscription[]> {
  const today = new Date();
  const futureDate = new Date();
  futureDate.setDate(today.getDate() + days);
  
  return db.subscriptions
    .where('[userId+nextBillingDate]')
    .between(
      [userId, today.toISOString()],
      [userId, futureDate.toISOString()]
    )
    .and(sub => sub.status === 'active')
    .sortBy('nextBillingDate');
}
```

### Get Subscription Transaction History

```typescript
async getSubscriptionTransactions(subscriptionId: string): Promise<Transaction[]> {
  return db.transactions
    .where('subscriptionId')
    .equals(subscriptionId)
    .reverse()
    .sortBy('date');
}
```

### Calculate Total Monthly Cost

```typescript
async getSubscriptionStats(userId: string) {
  const subscriptions = await db.subscriptions
    .where('userId')
    .equals(userId)
    .and(s => s.status === 'active')
    .toArray();
  
  const totalMonthly = subscriptions.reduce((sum, sub) => {
    return sum + toMonthlyCost(sub.amount, sub.billingCycle);
  }, 0);
  
  return {
    totalMonthly,
    totalYearly: totalMonthly * 12,
    activeCount: subscriptions.length,
  };
}

function toMonthlyCost(amount: number, cycle: BillingCycle): number {
  const multipliers = {
    weekly: 52 / 12,
    monthly: 1,
    quarterly: 1 / 3,
    yearly: 1 / 12,
  };
  return amount * multipliers[cycle];
}
```

---

## 🔐 Data Integrity & Constraints

### Foreign Key Constraints

```sql
-- Category deletion protection
ALTER TABLE subscriptions
ADD CONSTRAINT fk_category
FOREIGN KEY (categoryId) REFERENCES categories(id)
ON DELETE RESTRICT;  -- Can't delete category if used by subscriptions

-- Account deletion protection
ALTER TABLE subscriptions
ADD CONSTRAINT fk_account
FOREIGN KEY (accountId) REFERENCES accounts(id)
ON DELETE RESTRICT;  -- Can't delete account if used by subscriptions

-- Solution: User must reassign subscriptions first
```

### Cascade Behavior

```typescript
// When user deletes subscription
async deleteSubscription(id: string): Promise<void> {
  const subscription = await db.subscriptions.get(id);
  if (!subscription) throw new Error('Not found');
  
  await db.transaction('rw', [db.subscriptions, db.transactions], async () => {
    // Option 1: Keep historical transactions, just unlink
    await db.transactions
      .where('subscriptionId')
      .equals(id)
      .modify({ subscriptionId: undefined });
    
    // Option 2: Delete all linked transactions (destructive)
    // await db.transactions.where('subscriptionId').equals(id).delete();
    
    // Delete subscription
    await db.subscriptions.delete(id);
  });
}
```

---

## 📊 Impact on Existing Features

### 1. Transaction List
**Existing:** Show all transactions  
**NEW:** Add subscription indicator badge

```typescript
<TransactionCard
  transaction={transaction}
  showSubscriptionBadge={!!transaction.subscriptionId}  // NEW
  subscriptionName={transaction.subscription?.name}     // NEW
/>
```

### 2. Budget Tracking
**Existing:** Calculate total spending  
**NEW:** Show fixed vs variable breakdown

```typescript
const spending = calculateSpending(transactions);
const fixedSpending = transactions
  .filter(t => t.subscriptionId)
  .reduce((sum, t) => sum + t.amount, 0);

const variableSpending = spending - fixedSpending;

// Display:
// Total: $145.99 / $200.00
// ├── Fixed (Subscriptions): $45.99
// └── Variable (One-time): $100.00
```

### 3. Account Balance
**Existing:** Current balance  
**NEW:** Projected balance (upcoming charges)

```typescript
const upcomingCharges = await getUpcomingPayments(userId, 30);
const totalUpcoming = upcomingCharges.reduce((sum, s) => sum + s.amount, 0);
const projectedBalance = account.balance - totalUpcoming;

// Display:
// Current: $1,500.00
// Upcoming (30 days): -$145.99
// Projected: $1,354.01
```

### 4. Analytics Screen
**NEW:** Subscription spending analysis

```typescript
const subscriptionTransactions = transactions.filter(t => t.subscriptionId);
const oneTimeTransactions = transactions.filter(t => !t.subscriptionId);

const subscriptionPercentage = 
  (sumTransactions(subscriptionTransactions) / sumTransactions(transactions)) * 100;

// Display: "35% of your spending is subscriptions"
```

---

## 🚀 Migration Strategy

### Phase 1: Add Subscription Table (No Breaking Changes)

```typescript
// apps/web/src/services/db/dexie.ts
this.version(2).stores({
  // ... existing tables unchanged
  subscriptions: 'id, userId, status, nextBillingDate, categoryId, accountId',
});
```

### Phase 2: Add subscriptionId to Transactions (Optional Field)

```typescript
// apps/web/src/services/db/dexie.ts
this.version(2).stores({
  transactions: 'id, userId, accountId, categoryId, subscriptionId, type, date, [userId+date]',
  // subscriptionId is optional, existing data unaffected
});
```

### Phase 3: Implement Adapter Methods

```typescript
// Existing methods still work
await adapter.getTransactions(userId);  // Works exactly as before

// New methods added
await adapter.getSubscriptions(userId);
await adapter.createSubscription(userId, data);
```

### Backward Compatibility

**Key Principle:** All existing features work exactly as before

- Existing transactions: `subscriptionId = undefined` (treated as one-time)
- Existing queries: Ignore `subscriptionId` field if not needed
- Existing screens: No changes required (but can enhance)
- Database migration: Adds tables/fields, never removes

---

## ✅ Integration Summary

**How Subscriptions Integrate with Existing System:**

1. **Minimal Changes:** Only ONE optional field added to Transaction entity
2. **Foreign Keys:** Subscriptions reference existing Categories & Accounts
3. **Auto-Transactions:** Background job creates normal transactions (visible everywhere)
4. **Budget Compatibility:** Subscription transactions count toward budgets automatically
5. **No Breaking Changes:** All existing features continue working
6. **Additive Only:** Can be fully removed without data loss

**Data Flow Diagram:**
```
User Creates Subscription
    ↓
Subscription Entity (with categoryId, accountId)
    ↓
Background Scheduler (daily check)
    ↓
Auto-Create Transaction (normal expense transaction)
    ↓
Update Account Balance
    ↓
Transaction appears in:
    - TransactionsScreen ✓
    - Budget calculations ✓
    - Analytics charts ✓
    - Account summaries ✓
```

**The Key Insight:**
Subscriptions are just a **smart way to create regular transactions**. They integrate seamlessly because they:
- Use existing entities (categories, accounts)
- Create standard transactions that all existing features already handle
- Add optional metadata (`subscriptionId`) for enhanced features
- Never break existing functionality

---

## �🔧 Technical Implementation

### Database Schema

**Dexie (Web):**
```typescript
// apps/web/src/services/db/dexie.ts
subscriptions: 'id, userId, status, nextBillingDate, categoryId, accountId, [userId+status], [userId+nextBillingDate]'
```

**OP-SQLite (Native):**
```sql
CREATE TABLE subscriptions (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  amount REAL NOT NULL,
  currency TEXT NOT NULL,
  billingCycle TEXT NOT NULL,
  nextBillingDate TEXT NOT NULL,
  startDate TEXT NOT NULL,
  endDate TEXT,
  categoryId TEXT NOT NULL,
  accountId TEXT NOT NULL,
  status TEXT NOT NULL,
  autoCreateTransaction INTEGER NOT NULL DEFAULT 1,
  reminderDays INTEGER,
  icon TEXT,
  color TEXT,
  notes TEXT,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL,
  FOREIGN KEY (userId) REFERENCES users(id),
  FOREIGN KEY (categoryId) REFERENCES categories(id),
  FOREIGN KEY (accountId) REFERENCES accounts(id)
);

CREATE INDEX idx_subscriptions_userId ON subscriptions(userId);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_nextBillingDate ON subscriptions(nextBillingDate);
```

### IDatabaseAdapter Methods

```typescript
interface IDatabaseAdapter {
  // ... existing methods
  
  // Subscription CRUD
  getSubscriptions(userId: string, filters?: SubscriptionFilters): Promise<Subscription[]>;
  getSubscription(id: string): Promise<Subscription | undefined>;
  createSubscription(userId: string, input: CreateSubscriptionInput): Promise<Subscription>;
  updateSubscription(id: string, updates: UpdateSubscriptionInput): Promise<Subscription>;
  deleteSubscription(id: string): Promise<void>;
  
  // Analytics & Stats
  getSubscriptionStats(userId: string): Promise<{
    totalMonthly: number;
    totalYearly: number;
    activeCount: number;
    pausedCount: number;
    cancelledCount: number;
  }>;
  
  getUpcomingPayments(userId: string, days: number): Promise<Subscription[]>;
  
  getSubscriptionsByCategory(userId: string, categoryId: string): Promise<Subscription[]>;
  
  // Transaction Integration
  createSubscriptionTransaction(subscriptionId: string): Promise<Transaction>;
  linkTransactionToSubscription(transactionId: string, subscriptionId: string): Promise<void>;
  unlinkTransactionFromSubscription(transactionId: string): Promise<void>;
  getSubscriptionTransactions(subscriptionId: string): Promise<Transaction[]>;
}
```

### Helper Utilities

```typescript
// packages/core/src/services/subscriptions/

// Calculate next billing date
export function calculateNextBillingDate(
  currentDate: Date,
  billingCycle: BillingCycle
): Date {
  const next = new Date(currentDate);
  switch (billingCycle) {
    case 'weekly': next.setDate(next.getDate() + 7); break;
    case 'monthly': next.setMonth(next.getMonth() + 1); break;
    case 'quarterly': next.setMonth(next.getMonth() + 3); break;
    case 'yearly': next.setFullYear(next.getFullYear() + 1); break;
  }
  return next;
}

// Convert billing cycle to monthly cost
export function toMonthlyCost(amount: number, cycle: BillingCycle): number {
  switch (cycle) {
    case 'weekly': return amount * 52 / 12;
    case 'monthly': return amount;
    case 'quarterly': return amount / 3;
    case 'yearly': return amount / 12;
  }
}

// Calculate total costs
export function calculateSubscriptionCosts(subscriptions: Subscription[]) {
  const active = subscriptions.filter(s => s.status === 'active');
  
  const totalMonthly = active.reduce(
    (sum, sub) => sum + toMonthlyCost(sub.amount, sub.billingCycle),
    0
  );
  
  return {
    totalMonthly,
    totalYearly: totalMonthly * 12,
    activeCount: active.length,
  };
}
```

---

## 🎭 User Flows

### 1. Add New Subscription

```
User Journey:
1. Navigate to Plan Screen
2. Tap "Add Subscription" button
3. Fill out form:
   - Name: "Netflix"
   - Amount: $15.99
   - Billing Cycle: Monthly
   - Next Billing Date: Dec 28, 2025
   - Category: Entertainment (dropdown)
   - Account: Chase Checking (dropdown)
   - Optional: Icon, Color, Reminder settings
4. Tap "Save"
5. System:
   - Validates input
   - Creates subscription with sub-abc123 ID
   - Calculates future billing dates
   - Returns to list view with new subscription
6. Success message: "Netflix subscription added"
```

### 2. Auto-Create Transaction (Background)

```
System Flow (runs daily):
1. Background scheduler checks current date
2. Query subscriptions where:
   - status = 'active'
   - autoCreateTransaction = true
   - nextBillingDate = today
3. For each matching subscription:
   a. Create transaction:
      - type: expense
      - amount: subscription.amount
      - categoryId: subscription.categoryId
      - accountId: subscription.accountId
      - subscriptionId: subscription.id
      - date: today
      - description: "{name} subscription"
   b. Update account balance (deduct amount)
   c. Update subscription.nextBillingDate (add billing cycle)
   d. Send notification: "Netflix charged $15.99"
4. Log completion
```

### 3. Manage Subscription

```
User Journey:
1. Tap on subscription card
2. View detail screen with:
   - Full details
   - Next 6 billing dates
   - Payment history (linked transactions)
3. User actions:
   - [Edit]: Modify amount, cycle, category, etc.
   - [Pause]: Set status to 'paused', stop auto-transactions
   - [Cancel]: Set status to 'cancelled', set endDate, confirm
   - [Delete]: Permanent removal (confirm warning)
```

---

## 📱 Component Architecture

### New Components

```typescript
// apps/native/src/components/subscription/

1. SubscriptionCard.tsx
   - Props: subscription, onPress, showNextBilling
   - Displays: Icon, Name, Amount, Next billing date
   - Actions: Tap to view details

2. SubscriptionStatsCard.tsx
   - Props: totalMonthly, totalYearly, activeCount, upcomingCount
   - Displays: Key metrics in card format
   - Design: Dark card with purple accents

3. UpcomingPaymentsCard.tsx
   - Props: subscriptions (next 30 days)
   - Displays: List of upcoming payments
   - Actions: Mark as paid, view details

4. SubscriptionDetailView.tsx
   - Props: subscriptionId
   - Displays: Full details, upcoming dates, history
   - Actions: Edit, Pause, Cancel, Delete

5. BillingCycleSelector.tsx
   - Props: selected, onChange
   - Options: Weekly, Monthly, Quarterly, Yearly
   - Design: Segmented control or dropdown

6. SubscriptionForm.tsx
   - Props: mode (create/edit), initialData, onSubmit
   - Fields: All subscription properties
   - Validation: Zod schema validation

7. SubscriptionIconPicker.tsx (Phase 3)
   - Props: selected, onChange
   - Library: 50+ popular service icons
   - Custom upload option
```

---

## 🔔 Notification System

### Reminder Notifications

**Trigger:** `reminderDays` before `nextBillingDate`

```typescript
{
  title: "Subscription Reminder",
  body: "Netflix ($15.99) will charge in 3 days",
  data: {
    type: 'subscription_reminder',
    subscriptionId: 'sub-abc123',
    action: 'view_details'
  }
}
```

**Auto-Transaction Notification**

**Trigger:** After auto-creating transaction

```typescript
{
  title: "Subscription Charged",
  body: "Netflix charged $15.99 from Chase Checking",
  data: {
    type: 'subscription_charged',
    subscriptionId: 'sub-abc123',
    transactionId: 'tr-xyz789',
    action: 'view_transaction'
  }
}
```

---

## 🎯 Success Metrics

### Key Performance Indicators (KPIs)

1. **Adoption Rate**
   - % of users who add ≥1 subscription
   - Target: 60% within 3 months

2. **Active Usage**
   - Average subscriptions per user
   - Target: 5-7 subscriptions

3. **Auto-Transaction Adoption**
   - % of subscriptions with auto-create enabled
   - Target: 80%

4. **Cost Awareness**
   - Users who reduce spending after seeing totals
   - Track cancellations within 7 days of first view

5. **Engagement**
   - Weekly active users viewing Plan screen
   - Target: 40% weekly engagement

---

## 🚧 Known Limitations & Future Considerations

### Phase 1 Limitations
- No automatic bank transaction detection (require manual linking)
- No shared subscription support
- Basic analytics only (no trend analysis)
- No service icon library (user-provided only)

### Future Enhancements
- **AI/ML Features:**
  - Auto-detect subscriptions from transaction descriptions
  - Suggest subscriptions to cancel based on usage patterns
  - Predict future subscription costs
  
- **Advanced Analytics:**
  - Comparison with similar users (anonymized)
  - Industry benchmarks
  - ROI calculator (cost vs usage)

- **Integration:**
  - Import subscriptions from bank statements (OCR)
  - Connect to subscription management services (Truebill API)
  - Calendar integration (Google Calendar, Apple Calendar)

- **Social Features:**
  - Share subscription deals
  - Split subscriptions with friends
  - Group discounts tracking

---

## 📝 Open Questions

1. **Auto-Transaction Timing:**
   - Should transactions be created at midnight? User's timezone?
   - What happens if user changes billing date manually?

2. **Duplicate Handling:**
   - How aggressive should duplicate detection be?
   - Auto-merge vs suggest merge?

3. **Historical Data:**
   - Should we backfill historical transactions when linking?
   - How far back?

4. **Billing Cycle Edge Cases:**
   - What about subscriptions that bill "every 2 months"?
   - Support for custom intervals?

5. **Multi-Currency:**
   - Handle subscriptions in different currencies?
   - Convert to user's primary currency?

---

## 🎨 Design Guidelines

### Visual Design
- **Card Style:** Dark background (#141416) with subtle borders
- **Icons:** Circular backgrounds with service brand colors
- **Typography:** Clear hierarchy (bold names, muted metadata)
- **Status Colors:**
  - Active: Green (#10b981)
  - Paused: Amber (#f59e0b)
  - Cancelled: Red (#ef4444)

### Interaction Patterns
- **Swipe Actions:** Left swipe for Edit/Delete, Right swipe for Pause
- **Long Press:** Quick actions menu
- **Pull to Refresh:** Update subscription list
- **Empty States:** Friendly illustrations with CTAs

### Accessibility
- **VoiceOver Support:** All cards and actions labeled
- **High Contrast:** Ensure AA compliance
- **Font Scaling:** Support Dynamic Type
- **Color Blindness:** Don't rely on color alone for status

---

## 📚 Resources & References

### Similar Apps
- Truebill/Rocket Money
- Bobby (subscription tracker)
- Mint (subscription detection)

### Technical References
- React Native push notifications
- Background task scheduling
- Dexie compound indexes
- Recurring date calculations

---

## ✅ Next Steps

### Immediate Actions (This Sprint)
1. ✅ Review and approve this design document
2. ✅ Create Subscription entity schema in `@kakeibo/core`
3. ✅ Implement Zod validation schemas
4. ✅ Add database migrations (Dexie + SQLite)
5. ✅ Build SubscriptionCard and SubscriptionStatsCard components

### Week 1-2 Goals
- Complete MVP database layer
- Build basic Plan Screen UI
- Implement Add/Edit subscription flows
- Manual transaction linking

### Month 1 Goal
- Ship Phase 1 (MVP) to production
- Gather user feedback
- Prioritize Phase 2 features based on usage

---

**Document Version History:**
- v1.0 (Dec 25, 2025): Initial design document created
